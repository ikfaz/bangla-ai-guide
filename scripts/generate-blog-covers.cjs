#!/usr/bin/env node
/*
 * Generate editorial SVG + PNG cover images (1200x630) for every blog post.
 *
 * Uses the clean, text-free vector still-life illustrations from
 * /assets/editorial/<topic>.svg (via scripts/lib/editorial-art.cjs) framed
 * seamlessly at 1200x630 so OpenGraph, Twitter Cards, Google News, and Schema
 * images match the site's editorial illustration system with zero broken
 * Bangla font shaping.
 */

const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const sharp = require('sharp');
const {
  BLOG,
  SITE,
  listBlogArticles,
  isRedirectStub,
  countLine,
  pngSize,
} = require('./lib/site-policy.cjs');
const { artFor } = require('./lib/editorial-art.cjs');

const EDITORIAL_DIR = path.resolve(__dirname, '..', 'assets', 'editorial');
const MAX_COVER_BYTES = 150 * 1024;

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function extractTitle(html) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (!m) return null;
  return m[1].trim().replace(/\s+/g, ' ');
}

function buildSvg(title, slug) {
  const { topic } = artFor(slug, title);
  const srcPath = path.join(EDITORIAL_DIR, `${topic}.svg`);
  const raw = fs.readFileSync(srcPath, 'utf8');
  return raw
    .replace(
      /\bwidth="1000"\s+height="440"\s+viewBox="0 0 500 220"/,
      'width="1200" height="630" viewBox="0 -21.25 500 262.5"',
    )
    .replace(
      /<title id="title">[\s\S]*?<\/title>/,
      `<title id="title">${escapeXml(title)}</title>`,
    )
    .replace(
      /<rect x="0" y="0" width="500" height="220"/g,
      '<rect x="0" y="-25" width="500" height="270"',
    );
}

function writeIfChanged(file, data) {
  const next = Buffer.isBuffer(data) ? data : Buffer.from(data);
  if (fs.existsSync(file) && fs.readFileSync(file).equals(next)) return false;
  fs.writeFileSync(file, next);
  return true;
}

function rasterizeSvg(svg) {
  const renderer = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    font: {
      loadSystemFonts: false,
    },
  });
  return renderer.render().asPng();
}

async function compressPng(png, fit) {
  const attempts = [
    { colors: 128, quality: 80 },
    { colors: 64, quality: 65 },
    { colors: 32, quality: 50 },
  ];
  let last = png;
  for (const attempt of attempts) {
    last = await sharp(png)
      .resize(1200, 630, { fit })
      .png({
        compressionLevel: 9,
        palette: true,
        quality: attempt.quality,
        colors: attempt.colors,
        effort: 10,
      })
      .toBuffer();
    if (last.length <= MAX_COVER_BYTES) return last;
  }
  return last;
}

function upsertMeta(html, kind, key, content) {
  const tagRe = new RegExp(`<meta\\b[^>]*\\b${kind}\\s*=\\s*(["'])${key}\\1[^>]*>`, 'i');
  const tag = `<meta ${kind}="${key}" content="${content}">`;
  if (tagRe.test(html)) {
    return html.replace(tagRe, (full) => {
      if (/\bcontent\s*=/.test(full)) {
        return full.replace(/\bcontent\s*=\s*(["'])[\s\S]*?\1/, `content="${content}"`);
      }
      return full.replace(/\s*\/?>$/, ` content="${content}">`);
    });
  }
  if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, `  ${tag}\n</head>`);
  return html;
}

function updateMeta(html, coverUrl) {
  let next = upsertMeta(html, 'property', 'og:image', coverUrl);
  next = upsertMeta(next, 'name', 'twitter:image', coverUrl);
  next = upsertMeta(next, 'property', 'og:image:type', 'image/png');
  if (!/property=["']og:image:width["']/i.test(next)) {
    next = upsertMeta(next, 'property', 'og:image:width', '1200');
  }
  if (!/property=["']og:image:height["']/i.test(next)) {
    next = upsertMeta(next, 'property', 'og:image:height', '630');
  }
  next = next.replace(/\bsrc=(["'])cover\.webp\1/g, 'src=$1cover.png$1');
  return next;
}

async function run() {
  if (!fs.existsSync(BLOG)) {
    console.error('blog/ directory not found');
    process.exit(1);
  }

  let writtenSvg = 0;
  let writtenPng = 0;
  let updatedHtml = 0;
  let skippedRedirect = 0;
  let skippedNoTitle = 0;
  const topicPngCache = new Map();

  for (const article of listBlogArticles()) {
    const dir = path.dirname(article.file);
    const html = fs.readFileSync(article.file, 'utf8');
    if (isRedirectStub(html)) { skippedRedirect += 1; continue; }
    const title = extractTitle(html);
    if (!title) { skippedNoTitle += 1; continue; }

    const pngPath = path.join(dir, 'cover.png');
    const webp = path.join(dir, 'cover.webp');
    const existing = fs.existsSync(pngPath) ? fs.readFileSync(pngPath) : null;
    const existingOk = existing
      && existing.length <= MAX_COVER_BYTES
      && (() => { const size = pngSize(existing); return size && size.width === 1200 && size.height === 630; })();

    if (!existingOk && fs.existsSync(webp)) {
      const png = await compressPng(fs.readFileSync(webp), 'cover');
      if (writeIfChanged(pngPath, png)) writtenPng += 1;
    } else if (!existingOk) {
      const { topic } = artFor(article.slug, title);
      const svg = buildSvg(title, article.slug);
      if (writeIfChanged(path.join(dir, 'cover.svg'), svg)) writtenSvg += 1;
      let png = topicPngCache.get(topic);
      if (!png) {
        png = await compressPng(rasterizeSvg(svg), 'fill');
        topicPngCache.set(topic, png);
      }
      if (writeIfChanged(pngPath, png)) writtenPng += 1;
    }

    const next = updateMeta(html, `${SITE}/blog/${article.slug}/cover.png`);
    if (next !== html) {
      fs.writeFileSync(article.file, next);
      updatedHtml += 1;
    }
  }

  console.log(`Covers: wrote ${writtenPng} PNG files, refreshed ${writtenSvg} SVG files`);
  console.log(`Meta:   updated ${updatedHtml} HTML pages`);
  if (skippedRedirect) console.log(`Skipped (redirect stub): ${skippedRedirect}`);
  if (skippedNoTitle) console.log(`Skipped (no <title>):    ${skippedNoTitle}`);
  countLine('png_covers_written', writtenPng);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

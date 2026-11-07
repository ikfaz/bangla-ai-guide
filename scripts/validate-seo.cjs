#!/usr/bin/env node
// Fail the build when a blog article drifts from the mechanical SEO rules.

const fs = require('fs');
const path = require('path');
const {
  ROOT,
  SITE,
  BLOG,
  ORG_NAME,
  ORG_URL,
  REDIRECT_BLOG_SLUGS,
  listBlogArticles,
  isRedirectStub,
  tryParseJson,
  visibleText,
  questionCore,
  isNewsletterQuestion,
  pngSize,
  BLOCKED_AUTHOR,
} = require('./lib/site-policy.cjs');

const SCRIPT_RE = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
const MAX_COVER = 150 * 1024;

function collectTypes(node, out) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    node.forEach((item) => collectTypes(item, out));
    return;
  }
  const raw = node['@type'];
  const types = Array.isArray(raw) ? raw : raw ? [raw] : [];
  types.forEach((t) => out.push(t));
  if (node['@graph']) collectTypes(node['@graph'], out);
}

function articleNodes(json) {
  const nodes = [];
  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    const types = Array.isArray(node['@type']) ? node['@type'] : node['@type'] ? [node['@type']] : [];
    if (types.includes('Article') || types.includes('BlogPosting') || types.includes('NewsArticle')) {
      nodes.push(node);
    }
    if (node['@graph']) visit(node['@graph']);
  };
  visit(json);
  return nodes;
}

function faqQuestions(json) {
  const questions = [];
  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (node['@type'] === 'FAQPage' && Array.isArray(node.mainEntity)) {
      for (const q of node.mainEntity) {
        if (q && q.name) questions.push(String(q.name));
      }
    }
    if (node['@graph']) visit(node['@graph']);
  };
  visit(json);
  return questions;
}

function run() {
  const errors = [];
  const recentHeroSources = new Map();
  let articles = 0;
  for (const article of listBlogArticles()) {
    const buf = fs.readFileSync(article.file);
    const html = buf.toString('utf8');
    if (isRedirectStub(html)) continue;
    articles += 1;
    const where = article.slug;

    if (buf.includes(0)) errors.push(`${where}: NUL byte`);
    const closeAt = html.lastIndexOf('</html>');
    if (closeAt === -1) errors.push(`${where}: missing </html>`);
    else if (html.slice(closeAt + '</html>'.length).trim()) errors.push(`${where}: junk after </html>`);
    if (BLOCKED_AUTHOR.test(html)) errors.push(`${where}: personal author name`);
    if (/github\.com\/ikfaz/i.test(html)) errors.push(`${where}: personal profile URL`);
    if (/"@type"\s*:\s*"Person"/.test(html)) errors.push(`${where}: Person schema`);

    if (!/property=["']og:image["'][^>]*content=["'][^"']+cover\.png["']/i.test(html)
      && !/content=["'][^"']+cover\.png["'][^>]*property=["']og:image["']/i.test(html)) {
      errors.push(`${where}: og:image is not cover.png`);
    }
    if (/og:image["'][^>]*\.svg|content=["'][^"']+\.svg["'][^>]*og:image/i.test(html)) {
      errors.push(`${where}: svg og:image`);
    }
    if (!/og:image:type["'][^>]*content=["']image\/png["']/i.test(html)
      && !/content=["']image\/png["'][^>]*og:image:type/i.test(html)) {
      errors.push(`${where}: og:image:type is not image/png`);
    }
    if (/<figure\b[^>]*\bclass=["'][^"']*\bav-hero\b/i.test(html)) {
      errors.push(`${where}: duplicate inline figure.av-hero banner (use /assets/editorial/ in .article-hero only)`);
    }

    const coverPath = path.join(BLOG, article.slug, 'cover.png');
    if (!fs.existsSync(coverPath)) {
      errors.push(`${where}: missing cover.png`);
    } else {
      const cover = fs.readFileSync(coverPath);
      const size = pngSize(cover);
      if (!size || size.width !== 1200 || size.height !== 630) {
        errors.push(`${where}: cover.png is ${size ? `${size.width}x${size.height}` : 'not a png'}`);
      }
      if (cover.length > MAX_COVER) errors.push(`${where}: cover.png is ${cover.length} bytes`);
    }

    const blocks = [];
    let faqPages = 0;
    let sawBreadcrumb = false;
    let match;
    const re = new RegExp(SCRIPT_RE.source, 'gi');
    while ((match = re.exec(html)) !== null) {
      const parsed = tryParseJson(match[1]);
      if (parsed === undefined) {
        errors.push(`${where}: JSON-LD does not parse`);
        continue;
      }
      blocks.push(parsed);
      const types = [];
      collectTypes(parsed, types);
      faqPages += types.filter((t) => t === 'FAQPage').length;
      if (types.includes('BreadcrumbList')) sawBreadcrumb = true;
      for (const question of faqQuestions(parsed)) {
        if (isNewsletterQuestion(question)) errors.push(`${where}: newsletter FAQ question`);
        const core = questionCore(question);
        if (core && !visibleText(html).includes(core)) {
          errors.push(`${where}: FAQ question not visible (${core.slice(0, 48)})`);
        }
      }
    }
    if (faqPages > 1) errors.push(`${where}: ${faqPages} FAQPage blocks`);
    if (!sawBreadcrumb) errors.push(`${where}: missing BreadcrumbList`);

    const articlesLd = blocks.flatMap(articleNodes);
    if (!articlesLd.length) errors.push(`${where}: missing Article schema`);
    for (const node of articlesLd) {
      if (node.datePublished == null) errors.push(`${where}: Article missing datePublished`);
      if (node.dateModified == null) errors.push(`${where}: Article missing dateModified`);
      if (node.inLanguage !== 'bn-BD') errors.push(`${where}: Article inLanguage is not bn-BD`);
      const imageUrl = node.image && (node.image.url || node.image);
      if (!imageUrl || !String(imageUrl).endsWith('/cover.png')) errors.push(`${where}: Article image is not cover.png`);
      if (!node.image || node.image.width !== 1200 || node.image.height !== 630) {
        errors.push(`${where}: Article image dimensions`);
      }
      if (!node.author || node.author['@type'] !== 'Organization' || node.author.name !== ORG_NAME || node.author.url !== ORG_URL) {
        errors.push(`${where}: Article author is not the organization`);
      }
      if (!node.publisher || node.publisher['@type'] !== 'Organization' || node.publisher.name !== ORG_NAME) {
        errors.push(`${where}: Article publisher is not the organization`);
      }
      const modified = String(node.dateModified || '').slice(0, 10);
      if (modified && !html.includes(`datetime="${modified}"`)) {
        errors.push(`${where}: visible date does not match dateModified ${modified}`);
      }
      const published = String(node.datePublished || '').slice(0, 10);
      if (published >= '2026-11-06') {
        const heroSrc = (html.match(/<figure class="article-hero">\s*<img[^>]*src="([^"]+)"/i) || [])[1];
        if (!heroSrc) {
          errors.push(`${where}: missing .article-hero img src`);
        } else if (recentHeroSources.has(heroSrc)) {
          errors.push(`${where}: reuses hero illustration ${heroSrc} (already used by ${recentHeroSources.get(heroSrc)}; create a dedicated scene in scripts/generate-editorial-art.cjs)`);
        } else {
          recentHeroSources.set(heroSrc, where);
        }
      }
    }
  }

  const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  for (const slug of REDIRECT_BLOG_SLUGS) {
    if (sitemap.includes(`/blog/${slug}/`)) errors.push(`sitemap still lists /blog/${slug}/`);
  }
  const lastmods = new Map();
  for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)) {
    lastmods.set(match[1], match[2]);
  }
  for (const article of listBlogArticles()) {
    if (REDIRECT_BLOG_SLUGS.has(article.slug)) continue;
    const html = fs.readFileSync(article.file, 'utf8');
    if (isRedirectStub(html)) continue;
    const modified = (html.match(/"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})"/) || [])[1];
    const loc = `${SITE}/blog/${article.slug}/`;
    if (!modified) errors.push(`${article.slug}: no dateModified for sitemap`);
    else if (lastmods.get(loc) !== modified) {
      errors.push(`${article.slug}: sitemap lastmod ${lastmods.get(loc) || 'missing'} != ${modified}`);
    }
  }

  const htaccess = fs.readFileSync(path.join(ROOT, '.htaccess'), 'utf8');
  if (!/X-Forwarded-Proto/.test(htaccess)) errors.push('htaccess missing X-Forwarded-Proto');
  if (!/ENV:HTTPS/.test(htaccess)) errors.push('htaccess missing ENV:HTTPS');
  if (!/blog\/ai-tools-for-video-editing/.test(htaccess)) errors.push('htaccess missing video redirect');
  if (!/ai-diye-taka-income-2026-bangladesh-deep-draft/.test(htaccess)) errors.push('htaccess missing draft redirect');
  if (fs.existsSync(path.join(BLOG, 'ai-diye-taka-income-2026-bangladesh-deep-draft'))) {
    errors.push('draft folder is still on disk');
  }

  if (errors.length) {
    console.error(`SEO validation failed (${errors.length} on ${articles} articles):`);
    errors.slice(0, 80).forEach((err) => console.error(`  ${err}`));
    if (errors.length > 80) console.error(`  … ${errors.length - 80} more`);
    process.exit(1);
  }
  console.log(`SEO validation passed for ${articles} articles`);
}

run();

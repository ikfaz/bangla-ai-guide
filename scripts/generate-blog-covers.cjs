#!/usr/bin/env node
/*
 * Generate branded SVG cover images for every blog post.
 *
 * - Walks blog/*\/index.html (skips mojibake/redirect-stub folders)
 * - Extracts the article title from <title>
 * - Writes a 1200x630 branded SVG to blog/<slug>/cover.svg
 * - Updates og:image, twitter:image, and Article schema "image" to point at the cover
 * - Idempotent: re-running regenerates SVG and re-syncs meta
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BLOG = path.join(ROOT, 'blog');
const SITE = 'https://banglaaiguide.com';

// --- helpers -------------------------------------------------------------

function hasNonAscii(s) { return /[^\x00-\x7F]/.test(s); }

function isRedirectStub(html) { return /http-equiv="refresh"/i.test(html); }

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

// Approx visual-width per char. Bangla glyphs are wider visually than Latin,
// so chars-per-line is the same metric for both — works fine in practice.
function wrap(text, maxCharsPerLine) {
  const words = text.split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? cur + ' ' + w : w;
    if (next.length > maxCharsPerLine && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function categoryFor(slug, title) {
  const t = (slug + ' ' + title).toLowerCase();
  if (/\bvs\b|comparison|konti-bhalo|tulna/.test(t)) return { label: 'COMPARISON', color: '#7C3AED' };
  if (/ssc|hsc|bcs|ielts|university|admission|student|porashona|shikkharthi|exam|prostuti/.test(t)) return { label: 'EDUCATION', color: '#0EA5E9' };
  if (/income|taka|freelanc|earning/.test(t)) return { label: 'INCOME', color: '#10B981' };
  if (/business|ecommerce|restaurant|rmg|real-estate|travel|accounting|law|doctor|medical|krishi|farmer|garments|dse|stock/.test(t)) return { label: 'BUSINESS', color: '#F59E0B' };
  if (/tutorial|guide|kivabe|sompurno|bebohar/.test(t)) return { label: 'TUTORIAL', color: '#16A34A' };
  return { label: 'GUIDE', color: '#16A34A' };
}

function pickLayout(title) {
  const len = title.length;
  // Tuned for 1200x630 with the layout below
  if (len < 35) return { fontSize: 78, charsPerLine: 18, maxLines: 2 };
  if (len < 55) return { fontSize: 66, charsPerLine: 22, maxLines: 3 };
  if (len < 80) return { fontSize: 56, charsPerLine: 26, maxLines: 4 };
  if (len < 110) return { fontSize: 48, charsPerLine: 30, maxLines: 4 };
  return { fontSize: 42, charsPerLine: 34, maxLines: 5 };
}

// --- SVG builder ---------------------------------------------------------

function buildSvg(title, slug) {
  const cat = categoryFor(slug, title);
  const { fontSize, charsPerLine, maxLines } = pickLayout(title);
  let lines = wrap(title, charsPerLine);
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    // soft-truncate last line with ellipsis
    lines[lines.length - 1] = lines[lines.length - 1].replace(/[\s ]+\S*$/, '') + '…';
  }

  // Vertical block centering
  const lineHeight = Math.round(fontSize * 1.22);
  const blockHeight = lines.length * lineHeight;
  const blockTop = Math.round((630 - blockHeight) / 2) + Math.round(fontSize * 0.82) - 30;

  const tspans = lines.map((ln, i) =>
    `<tspan x="100" y="${blockTop + i * lineHeight}">${escapeXml(ln)}</tspan>`
  ).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${escapeXml(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F0FDF9"/>
      <stop offset="55%" stop-color="#FAFBFC"/>
      <stop offset="100%" stop-color="#FFFFFF"/>
    </linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#16A34A"/>
      <stop offset="100%" stop-color="#22C55E"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.15" r="0.7">
      <stop offset="0%" stop-color="#22C55E" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#22C55E" stop-opacity="0"/>
    </radialGradient>
    <style>
      <![CDATA[
      @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@600;700;800&family=Syne:wght@700;800&display=swap');
      .title { font-family: 'Hind Siliguri', 'Noto Sans Bengali', 'SolaimanLipi', sans-serif; font-weight: 800; fill: #0F172A; }
      .badge { font-family: 'Syne', 'Hind Siliguri', sans-serif; font-weight: 800; letter-spacing: 2px; fill: #FFFFFF; }
      .brand { font-family: 'Syne', 'Hind Siliguri', sans-serif; font-weight: 700; fill: #475569; }
      .brand-strong { font-family: 'Hind Siliguri', 'Noto Sans Bengali', sans-serif; font-weight: 700; fill: #0F172A; }
      .url { font-family: 'Syne', sans-serif; font-weight: 600; fill: #16A34A; letter-spacing: 1px; }
      ]]>
    </style>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- Left accent bar -->
  <rect x="0" y="0" width="12" height="630" fill="url(#bar)"/>

  <!-- Decorative dots top-right -->
  <g fill="#16A34A" opacity="0.18">
    <circle cx="1130" cy="60" r="6"/>
    <circle cx="1100" cy="60" r="4"/>
    <circle cx="1070" cy="60" r="3"/>
    <circle cx="1130" cy="90" r="3"/>
    <circle cx="1100" cy="90" r="2"/>
  </g>

  <!-- Category badge -->
  <g transform="translate(100, 80)">
    <rect x="0" y="0" rx="18" ry="18" width="${String(cat.label).length * 12 + 36}" height="36" fill="${cat.color}"/>
    <text x="${(String(cat.label).length * 12 + 36) / 2}" y="24" font-size="15" text-anchor="middle" class="badge">${cat.label}</text>
  </g>

  <!-- Title -->
  <text class="title" font-size="${fontSize}">${tspans}</text>

  <!-- Bottom divider -->
  <line x1="100" y1="540" x2="1100" y2="540" stroke="#E2E8F0" stroke-width="2"/>

  <!-- Brand block -->
  <g transform="translate(100, 565)">
    <!-- Logo mark -->
    <circle cx="22" cy="22" r="22" fill="url(#bar)"/>
    <text x="22" y="30" font-size="24" text-anchor="middle" font-family="Syne, sans-serif" font-weight="800" fill="#FFFFFF">B</text>
    <!-- Wordmark -->
    <text x="60" y="20" font-size="20" class="brand-strong">বাংলা AI গাইড</text>
    <text x="60" y="42" font-size="14" class="brand">BANGLADESH&apos;S AI TOOLS DIRECTORY</text>
  </g>

  <!-- URL bottom-right -->
  <text x="1100" y="595" font-size="16" text-anchor="end" class="url">banglaaiguide.com</text>
</svg>`;
}

// --- meta tag updater ----------------------------------------------------

function updateMeta(html, coverUrl) {
  let changed = false;
  const replace = (re, replacement) => {
    if (re.test(html)) {
      const before = html;
      html = html.replace(re, replacement);
      if (html !== before) changed = true;
    }
  };

  // og:image
  replace(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image" content="${coverUrl}">`
  );
  // twitter:image
  replace(
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:image" content="${coverUrl}">`
  );
  // Article schema "image" — replace the first JSON-LD image: line that points to the default
  replace(
    /"image"\s*:\s*"https:\/\/banglaaiguide\.com\/web-app-manifest-512x512\.png"/,
    `"image": "${coverUrl}"`
  );

  // Add og:image:width / height after og:image (only if not already there)
  if (!/og:image:width/i.test(html) && /<meta\s+property="og:image"/i.test(html)) {
    html = html.replace(
      /(<meta\s+property="og:image"[^>]*>)/i,
      `$1\n    <meta property="og:image:width" content="1200">\n    <meta property="og:image:height" content="630">\n    <meta property="og:image:type" content="image/svg+xml">`
    );
    changed = true;
  }

  return { html, changed };
}

// --- main ----------------------------------------------------------------

function run() {
  if (!fs.existsSync(BLOG)) {
    console.error('blog/ directory not found');
    process.exit(1);
  }

  let writtenSvg = 0;
  let updatedHtml = 0;
  let skippedMojibake = 0;
  let skippedRedirect = 0;
  let skippedNoTitle = 0;

  for (const entry of fs.readdirSync(BLOG, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (hasNonAscii(entry.name)) { skippedMojibake++; continue; }

    const dir = path.join(BLOG, entry.name);
    const indexFile = path.join(dir, 'index.html');
    if (!fs.existsSync(indexFile)) continue;

    let html = fs.readFileSync(indexFile, 'utf8');
    if (isRedirectStub(html)) { skippedRedirect++; continue; }

    const title = extractTitle(html);
    if (!title) { skippedNoTitle++; continue; }

    // Write SVG
    const svg = buildSvg(title, entry.name);
    const svgFile = path.join(dir, 'cover.svg');
    fs.writeFileSync(svgFile, svg, 'utf8');
    writtenSvg++;

    // Update meta
    const coverUrl = `${SITE}/blog/${entry.name}/cover.svg`;
    const result = updateMeta(html, coverUrl);
    if (result.changed) {
      fs.writeFileSync(indexFile, result.html, 'utf8');
      updatedHtml++;
    }
  }

  console.log(`Covers: wrote ${writtenSvg} SVG files`);
  console.log(`Meta:   updated ${updatedHtml} HTML pages`);
  if (skippedMojibake) console.log(`Skipped (mojibake folder): ${skippedMojibake}`);
  if (skippedRedirect) console.log(`Skipped (redirect stub):   ${skippedRedirect}`);
  if (skippedNoTitle)  console.log(`Skipped (no <title>):      ${skippedNoTitle}`);
}

run();

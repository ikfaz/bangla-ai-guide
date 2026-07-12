#!/usr/bin/env node
/*
 * Generate branded SVG cover images for every blog post.
 *
 * v2: visually rich design with per-category color palette + illustration.
 *
 * - Walks blog/<slug>/index.html (skips mojibake/redirect stubs)
 * - Extracts title from <title>
 * - Renders a 1200x630 SVG with: vibrant gradient, decorative shapes,
 *   large category-specific illustration on the right, title on the left,
 *   brand block at the bottom
 * - Saves to blog/<slug>/cover.svg
 * - Updates og:image, twitter:image, Article schema image to point at cover
 * - Idempotent
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BLOG = path.join(ROOT, 'blog');
const SITE = 'https://banglaaiguide.com';

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

function wrap(text, max) {
  const words = text.split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? cur + ' ' + w : w;
    if (next.length > max && cur) { lines.push(cur); cur = w; }
    else { cur = next; }
  }
  if (cur) lines.push(cur);
  return lines;
}

const PALETTES = {
  COMPARISON: { from: '#7C3AED', to: '#A855F7', accent: '#F472B6', label: 'COMPARISON' },
  EDUCATION:  { from: '#0EA5E9', to: '#38BDF8', accent: '#FBBF24', label: 'EDUCATION' },
  INCOME:     { from: '#059669', to: '#10B981', accent: '#FBBF24', label: 'INCOME' },
  BUSINESS:   { from: '#F59E0B', to: '#FB923C', accent: '#FB7185', label: 'BUSINESS' },
  CONTENT:    { from: '#EC4899', to: '#F472B6', accent: '#FBBF24', label: 'CONTENT' },
  MEDIA:      { from: '#EF4444', to: '#F97316', accent: '#FACC15', label: 'MEDIA' },
  CODING:     { from: '#1E40AF', to: '#3B82F6', accent: '#06B6D4', label: 'CODING' },
  AI_TOOL:    { from: '#6366F1', to: '#A78BFA', accent: '#22D3EE', label: 'AI TOOL' },
  ACCESS:     { from: '#0891B2', to: '#22D3EE', accent: '#A3E635', label: 'ACCESS' },
  TUTORIAL:   { from: '#16A34A', to: '#22C55E', accent: '#FBBF24', label: 'TUTORIAL' },
  GUIDE:      { from: '#16A34A', to: '#22C55E', accent: '#FBBF24', label: 'GUIDE' },
};

function categoryFor(slug, title) {
  const t = (slug + ' ' + (title || '')).toLowerCase();
  if (/\bvs\b|comparison|konti-bhalo|tulna/.test(t)) return 'COMPARISON';
  if (/ssc|hsc|bcs|ielts|university|admission|student|porashona|shikkharthi|teacher|exam|prostuti/.test(t)) return 'EDUCATION';
  if (/income|taka|freelanc|earning/.test(t)) return 'INCOME';
  if (/business|ecommerce|restaurant|rmg|real-estate|travel|accounting|law|doctor|medical|krishi|farmer|garments|dse|stock|brand|personal-brand/.test(t)) return 'BUSINESS';
  if (/prompt|content|blog|seo|likha|writing/.test(t)) return 'CONTENT';
  if (/video|image|photo|voice|tts|avatar|music|thumbnail|design|logo|presentation/.test(t)) return 'MEDIA';
  if (/coding|developer|cursor|copilot|codeium|windsurf|claude-code|warp|website|excel|data/.test(t)) return 'CODING';
  if (/chatgpt|claude|gemini|deepseek|perplexity|grok|notebooklm|manus|jasper|writesonic|rytr/.test(t)) return 'AI_TOOL';
  if (/vpn|payment|bkash|price|pricing/.test(t)) return 'ACCESS';
  if (/tutorial|kivabe|bebohar/.test(t)) return 'TUTORIAL';
  return 'GUIDE';
}

// Illustration drawn within a 360x360 box at origin (0,0)
function illustrationFor(cat) {
  switch (cat) {
    case 'COMPARISON':
      return `
    <g>
      <rect x="20" y="60" width="140" height="180" rx="14" fill="#FFFFFF" opacity="0.22"/>
      <rect x="200" y="60" width="140" height="180" rx="14" fill="#FFFFFF" opacity="0.34"/>
      <text x="90" y="170" font-size="80" font-family="Syne,sans-serif" font-weight="800" text-anchor="middle" fill="#FFFFFF" opacity="0.95">A</text>
      <text x="270" y="170" font-size="80" font-family="Syne,sans-serif" font-weight="800" text-anchor="middle" fill="#FFFFFF" opacity="0.95">B</text>
      <circle cx="180" cy="150" r="38" fill="#FFFFFF"/>
      <text x="180" y="164" font-size="28" font-family="Syne,sans-serif" font-weight="800" text-anchor="middle" fill="#7C3AED">VS</text>
    </g>`;
    case 'EDUCATION':
      return `
    <g>
      <path d="M 60 160 L 180 110 L 300 160 L 180 210 Z" fill="#FFFFFF" opacity="0.92"/>
      <path d="M 100 175 L 100 220 Q 180 260 260 220 L 260 175" fill="#FFFFFF" opacity="0.65"/>
      <line x1="300" y1="160" x2="320" y2="240" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
      <circle cx="320" cy="245" r="10" fill="#FBBF24"/>
      <rect x="80" y="270" width="200" height="40" rx="6" fill="#FFFFFF" opacity="0.55"/>
      <line x1="180" y1="270" x2="180" y2="310" stroke="#0EA5E9" stroke-width="3"/>
    </g>`;
    case 'INCOME':
      return `
    <g>
      <ellipse cx="120" cy="280" rx="80" ry="22" fill="#FBBF24" opacity="0.95"/>
      <rect x="40" y="240" width="160" height="40" fill="#FBBF24"/>
      <ellipse cx="120" cy="240" rx="80" ry="22" fill="#FCD34D"/>
      <ellipse cx="120" cy="210" rx="80" ry="22" fill="#FBBF24" opacity="0.95"/>
      <rect x="40" y="170" width="160" height="40" fill="#FBBF24"/>
      <ellipse cx="120" cy="170" rx="80" ry="22" fill="#FCD34D"/>
      <text x="120" y="183" font-size="36" font-family="Syne,sans-serif" font-weight="800" text-anchor="middle" fill="#92400E">৳</text>
      <path d="M 230 240 L 270 180 L 310 220 L 330 120" stroke="#FFFFFF" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 318 100 L 340 116 L 318 132 Z" fill="#FFFFFF"/>
    </g>`;
    case 'BUSINESS':
      return `
    <g>
      <rect x="30" y="200" width="50" height="120" rx="6" fill="#FFFFFF" opacity="0.75"/>
      <rect x="100" y="160" width="50" height="160" rx="6" fill="#FFFFFF" opacity="0.88"/>
      <rect x="170" y="100" width="50" height="220" rx="6" fill="#FFFFFF"/>
      <rect x="240" y="60" width="50" height="260" rx="6" fill="#FB7185"/>
      <path d="M 55 195 Q 130 100 195 95 T 265 65" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-dasharray="6,5"/>
      <circle cx="55" cy="195" r="7" fill="#FFFFFF"/>
      <circle cx="265" cy="65" r="9" fill="#FB7185" stroke="#FFFFFF" stroke-width="3"/>
    </g>`;
    case 'CONTENT':
      return `
    <g>
      <rect x="60" y="60" width="220" height="260" rx="10" fill="#FFFFFF" opacity="0.95"/>
      <line x1="90" y1="110" x2="240" y2="110" stroke="#EC4899" stroke-width="5" stroke-linecap="round"/>
      <line x1="90" y1="150" x2="220" y2="150" stroke="#EC4899" stroke-width="3" opacity="0.7" stroke-linecap="round"/>
      <line x1="90" y1="180" x2="240" y2="180" stroke="#EC4899" stroke-width="3" opacity="0.7" stroke-linecap="round"/>
      <line x1="90" y1="210" x2="200" y2="210" stroke="#EC4899" stroke-width="3" opacity="0.7" stroke-linecap="round"/>
      <line x1="90" y1="240" x2="230" y2="240" stroke="#EC4899" stroke-width="3" opacity="0.7" stroke-linecap="round"/>
      <g transform="translate(245,200) rotate(35)">
        <rect x="0" y="0" width="80" height="16" rx="3" fill="#FBBF24"/>
        <polygon points="80,0 102,8 80,16" fill="#1F2937"/>
        <rect x="-22" y="0" width="22" height="16" rx="3" fill="#EC4899"/>
      </g>
    </g>`;
    case 'MEDIA':
      return `
    <g>
      <rect x="40" y="80" width="280" height="180" rx="14" fill="#FFFFFF"/>
      <rect x="40" y="80" width="280" height="180" rx="14" fill="none" stroke="#FACC15" stroke-width="5"/>
      <circle cx="180" cy="170" r="50" fill="#EF4444"/>
      <polygon points="164,144 164,196 212,170" fill="#FFFFFF"/>
      <path d="M 70 290 Q 90 280 110 290 Q 130 300 150 290" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M 200 290 Q 220 280 240 290 Q 260 300 280 290" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>`;
    case 'CODING':
      return `
    <g>
      <text x="180" y="240" font-size="200" font-family="'Courier New',monospace" font-weight="800" text-anchor="middle" fill="#FFFFFF">&lt;/&gt;</text>
      <circle cx="60" cy="80" r="8" fill="#06B6D4"/>
      <circle cx="84" cy="80" r="8" fill="#FBBF24"/>
      <circle cx="108" cy="80" r="8" fill="#FFFFFF" opacity="0.6"/>
    </g>`;
    case 'AI_TOOL':
      return `
    <g>
      <circle cx="180" cy="180" r="90" fill="#FFFFFF" opacity="0.20"/>
      <circle cx="180" cy="180" r="58" fill="#FFFFFF" opacity="0.35"/>
      <line x1="100" y1="100" x2="180" y2="180" stroke="#FFFFFF" stroke-width="3" opacity="0.7"/>
      <line x1="260" y1="100" x2="180" y2="180" stroke="#FFFFFF" stroke-width="3" opacity="0.7"/>
      <line x1="100" y1="260" x2="180" y2="180" stroke="#FFFFFF" stroke-width="3" opacity="0.7"/>
      <line x1="260" y1="260" x2="180" y2="180" stroke="#FFFFFF" stroke-width="3" opacity="0.7"/>
      <circle cx="100" cy="100" r="14" fill="#FBBF24"/>
      <circle cx="260" cy="100" r="14" fill="#22D3EE"/>
      <circle cx="100" cy="260" r="14" fill="#22D3EE"/>
      <circle cx="260" cy="260" r="14" fill="#FBBF24"/>
      <circle cx="180" cy="180" r="26" fill="#FFFFFF"/>
      <text x="180" y="190" font-size="22" font-family="Syne,sans-serif" font-weight="800" text-anchor="middle" fill="#6366F1">AI</text>
    </g>`;
    case 'ACCESS':
      return `
    <g>
      <circle cx="160" cy="170" r="92" fill="#FFFFFF" opacity="0.28"/>
      <circle cx="160" cy="170" r="92" fill="none" stroke="#FFFFFF" stroke-width="4"/>
      <ellipse cx="160" cy="170" rx="42" ry="92" fill="none" stroke="#FFFFFF" stroke-width="3"/>
      <line x1="68" y1="170" x2="252" y2="170" stroke="#FFFFFF" stroke-width="3"/>
      <line x1="160" y1="78" x2="160" y2="262" stroke="#FFFFFF" stroke-width="3"/>
      <circle cx="280" cy="270" r="38" fill="#A3E635"/>
      <path d="M 262 270 L 274 282 L 296 258" stroke="#FFFFFF" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`;
    case 'TUTORIAL':
      return `
    <g>
      <circle cx="180" cy="150" r="72" fill="#FBBF24"/>
      <circle cx="180" cy="150" r="50" fill="#FACC15"/>
      <rect x="155" y="215" width="50" height="14" rx="3" fill="#FFFFFF"/>
      <rect x="160" y="234" width="40" height="10" rx="2" fill="#FFFFFF" opacity="0.7"/>
      <rect x="166" y="248" width="28" height="8" rx="2" fill="#FFFFFF" opacity="0.5"/>
      <g stroke="#FBBF24" stroke-width="7" stroke-linecap="round">
        <line x1="180" y1="40" x2="180" y2="60"/>
        <line x1="90" y1="150" x2="70" y2="150"/>
        <line x1="290" y1="150" x2="270" y2="150"/>
        <line x1="110" y1="80" x2="95" y2="65"/>
        <line x1="250" y1="80" x2="265" y2="65"/>
      </g>
    </g>`;
    default:
      return `
    <g>
      <path d="M 40 100 L 180 130 L 320 100 L 320 280 L 180 310 L 40 280 Z" fill="#FFFFFF" opacity="0.25"/>
      <path d="M 180 130 L 180 310" stroke="#FFFFFF" stroke-width="4"/>
      <path d="M 40 100 L 180 130 L 180 310 L 40 280 Z" fill="#FFFFFF" opacity="0.55"/>
      <line x1="65" y1="150" x2="155" y2="170" stroke="#16A34A" stroke-width="3" opacity="0.6"/>
      <line x1="65" y1="175" x2="155" y2="195" stroke="#16A34A" stroke-width="3" opacity="0.45"/>
      <line x1="65" y1="200" x2="140" y2="218" stroke="#16A34A" stroke-width="3" opacity="0.45"/>
      <line x1="205" y1="170" x2="295" y2="150" stroke="#16A34A" stroke-width="3" opacity="0.6"/>
      <line x1="205" y1="195" x2="295" y2="175" stroke="#16A34A" stroke-width="3" opacity="0.45"/>
      <line x1="205" y1="218" x2="280" y2="200" stroke="#16A34A" stroke-width="3" opacity="0.45"/>
    </g>`;
  }
}

function pickLayout(title) {
  const len = title.length;
  if (len < 35) return { fontSize: 64, charsPerLine: 16, maxLines: 2 };
  if (len < 55) return { fontSize: 54, charsPerLine: 19, maxLines: 3 };
  if (len < 80) return { fontSize: 46, charsPerLine: 22, maxLines: 4 };
  if (len < 110) return { fontSize: 40, charsPerLine: 26, maxLines: 4 };
  return { fontSize: 34, charsPerLine: 30, maxLines: 5 };
}

function buildSvg(title, slug) {
  const cat = categoryFor(slug, title);
  const palette = PALETTES[cat];
  const { fontSize, charsPerLine, maxLines } = pickLayout(title);

  let lines = wrap(title, charsPerLine);
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    lines[lines.length - 1] = lines[lines.length - 1].replace(/[\s ]+\S*$/, '') + '…';
  }

  const lineHeight = Math.round(fontSize * 1.22);
  const blockHeight = lines.length * lineHeight;
  const blockTop = Math.round((630 - blockHeight) / 2) + Math.round(fontSize * 0.82) - 30;

  const tspans = lines.map((ln, i) =>
    `<tspan x="70" y="${blockTop + i * lineHeight}">${escapeXml(ln)}</tspan>`
  ).join('');

  const illustration = illustrationFor(cat);
  const badgeWidth = String(palette.label).length * 11 + 36;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${escapeXml(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.from}"/>
      <stop offset="100%" stop-color="${palette.to}"/>
    </linearGradient>
    <radialGradient id="glow1" cx="0.9" cy="0.15" r="0.55">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.05" cy="0.95" r="0.55">
      <stop offset="0%" stop-color="${palette.accent}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="${palette.accent}" stop-opacity="0"/>
    </radialGradient>
    <style>
      <![CDATA[
      @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@600;700;800&family=Syne:wght@700;800&display=swap');
      .title { font-family: 'Hind Siliguri', 'Noto Sans Bengali', 'SolaimanLipi', sans-serif; font-weight: 800; fill: #FFFFFF; }
      .badge { font-family: 'Syne', 'Hind Siliguri', sans-serif; font-weight: 800; letter-spacing: 2px; fill: ${palette.from}; }
      .brand { font-family: 'Syne', 'Hind Siliguri', sans-serif; font-weight: 700; fill: #FFFFFF; opacity: 0.85; letter-spacing: 1px; }
      .brand-main { font-family: 'Hind Siliguri', 'Noto Sans Bengali', sans-serif; font-weight: 700; fill: #FFFFFF; }
      .url { font-family: 'Syne', sans-serif; font-weight: 600; fill: #FFFFFF; opacity: 0.8; letter-spacing: 1px; }
      ]]>
    </style>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <circle cx="1080" cy="80" r="200" fill="#FFFFFF" opacity="0.06"/>
  <circle cx="1140" cy="540" r="240" fill="#FFFFFF" opacity="0.05"/>
  <circle cx="50" cy="600" r="140" fill="${palette.accent}" opacity="0.12"/>

  <g fill="#FFFFFF" opacity="0.22">
    <circle cx="900" cy="55" r="3"/>
    <circle cx="930" cy="55" r="3"/>
    <circle cx="960" cy="55" r="3"/>
    <circle cx="900" cy="85" r="2"/>
    <circle cx="930" cy="85" r="2"/>
    <circle cx="900" cy="115" r="2"/>
  </g>

  <g transform="translate(760, 135)">
    ${illustration}
  </g>

  <g transform="translate(70, 70)">
    <rect x="0" y="0" rx="20" ry="20" width="${badgeWidth}" height="40" fill="#FFFFFF"/>
    <text x="${badgeWidth / 2}" y="27" font-size="14" text-anchor="middle" class="badge">${palette.label}</text>
  </g>

  <text class="title" font-size="${fontSize}">${tspans}</text>

  <circle cx="70" cy="555" r="4" fill="${palette.accent}"/>
  <circle cx="86" cy="555" r="4" fill="#FFFFFF" opacity="0.6"/>
  <circle cx="102" cy="555" r="4" fill="#FFFFFF" opacity="0.3"/>

  <g transform="translate(70, 575)">
    <text x="0" y="0" font-size="22" class="brand-main">বাংলা AI গাইড</text>
    <text x="0" y="22" font-size="13" class="brand">BANGLADESH&apos;S AI TOOLS DIRECTORY</text>
  </g>

  <text x="1130" y="595" font-size="16" text-anchor="end" class="url">banglaaiguide.com</text>
</svg>`;
}

function updateMeta(html, coverUrl, coverType = 'image/svg+xml') {
  let changed = false;
  const replace = (re, replacement) => {
    if (re.test(html)) {
      const before = html;
      html = html.replace(re, replacement);
      if (html !== before) changed = true;
    }
  };

  replace(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image" content="${coverUrl}">`
  );
  replace(
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:image" content="${coverUrl}">`
  );
  replace(
    /"image"\s*:\s*"https:\/\/banglaaiguide\.com\/[^"]*\.(png|svg|webp|jpe?g)"/,
    `"image": "${coverUrl}"`
  );
  replace(
    /("image"\s*:\s*\{[^{}]*"url"\s*:\s*)"https:\/\/banglaaiguide\.com\/[^"]+"/,
    `$1"${coverUrl}"`
  );
  replace(
    /<meta\s+property="og:image:type"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image:type" content="${coverType}">`
  );

  if (!/og:image:type/i.test(html) && /<meta\s+property="og:image"/i.test(html)) {
    html = html.replace(
      /(<meta\s+property="og:image"[^>]*>)/i,
      `$1\n    <meta property="og:image:type" content="${coverType}">`
    );
    changed = true;
  }

  if (!/og:image:width/i.test(html) && /<meta\s+property="og:image"/i.test(html)) {
    html = html.replace(
      /(<meta\s+property="og:image"[^>]*>)/i,
      `$1\n    <meta property="og:image:width" content="1200">\n    <meta property="og:image:height" content="630">`
    );
    changed = true;
  }

  return { html, changed };
}

function run() {
  if (!fs.existsSync(BLOG)) {
    console.error('blog/ directory not found');
    process.exit(1);
  }

  let writtenSvg = 0, updatedHtml = 0, skippedMojibake = 0, skippedRedirect = 0, skippedNoTitle = 0;

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

    const preferredRaster = [
      ['cover.webp', 'image/webp'],
      ['cover.png', 'image/png'],
      ['cover.jpg', 'image/jpeg'],
      ['cover.jpeg', 'image/jpeg'],
    ].find(([file]) => fs.existsSync(path.join(dir, file)));

    let coverFile = 'cover.svg';
    let coverType = 'image/svg+xml';
    if (preferredRaster) {
      [coverFile, coverType] = preferredRaster;
    } else {
      const svg = buildSvg(title, entry.name);
      fs.writeFileSync(path.join(dir, coverFile), svg, 'utf8');
      writtenSvg++;
    }

    const coverUrl = `${SITE}/blog/${entry.name}/${coverFile}`;
    const result = updateMeta(html, coverUrl, coverType);
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

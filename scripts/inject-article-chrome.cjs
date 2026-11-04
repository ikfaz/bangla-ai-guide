#!/usr/bin/env node
/*
 * Idempotent magazine chrome for blog posts only.
 * Inserts a cover hero, category/date/reading-time chips, and an H2 table of
 * contents. Does not rewrite article wording. Skips tool pages, compare pages,
 * and pillar pages because it only walks blog/<slug>/index.html.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BLOG = path.join(ROOT, 'blog');

const COVERS = [
  ['cover.png', 'image/png'],
  ['cover.webp', 'image/webp'],
  ['cover.jpg', 'image/jpeg'],
  ['cover.jpeg', 'image/jpeg'],
  ['cover.svg', 'image/svg+xml'],
];

function hasNonAscii(s) { return /[^\x00-\x7F]/.test(s); }
function isRedirectStub(html) { return /http-equiv="refresh"/i.test(html); }

function stripTags(s) {
  return String(s || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function bnDigits(n) {
  return String(n).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
}

function categoryLabel(slug, title) {
  const t = (slug + ' ' + (title || '')).toLowerCase();
  if (/\bvs\b|comparison|konti-bhalo|tulna/.test(t)) return 'তুলনা';
  if (/ssc|hsc|bcs|ielts|university|admission|student|porashona|shikkharthi|teacher|exam|prostuti/.test(t)) return 'শিক্ষা';
  if (/income|taka|freelanc|earning/.test(t)) return 'আয়';
  if (/business|ecommerce|restaurant|rmg|real-estate|travel|accounting|law|doctor|medical|krishi|farmer|garments|dse|stock|brand/.test(t)) return 'ব্যবসা';
  if (/prompt|content|blog|seo|likha|writing/.test(t)) return 'কন্টেন্ট';
  if (/video|image|photo|voice|tts|avatar|music|thumbnail|design|logo|presentation/.test(t)) return 'মিডিয়া';
  if (/coding|developer|cursor|copilot|codeium|windsurf|claude-code|warp|website|excel|data/.test(t)) return 'কোডিং';
  if (/chatgpt|claude|gemini|deepseek|perplexity|grok|notebooklm|manus|jasper|writesonic|rytr/.test(t)) return 'এআই টুল';
  if (/vpn|payment|bkash|price|pricing/.test(t)) return 'অ্যাক্সেস';
  return 'গাইড';
}

function slugify(text, keepMarks) {
  const re = keepMarks ? /[^\p{L}\p{M}\p{N}]+/gu : /[^\p{L}\p{N}]+/gu;
  let id = text.toLowerCase().replace(re, '-').replace(/^-+|-+$/g, '').slice(0, 72);
  return id || 'section';
}

function headingId(text, used) {
  const id = slugify(text, true);
  let candidate = id;
  let n = 2;
  while (used.has(candidate)) candidate = id + '-' + (n++);
  used.add(candidate);
  return candidate;
}

function isLegacyAutoId(id, text) {
  const base = slugify(text, false);
  if (id === base) return true;
  const suffix = id.match(/^(.*)-(\d+)$/);
  return !!(suffix && suffix[1] === base);
}

function extractDate(html) {
  const time = html.match(/<time\b[^>]*datetime="[^"]+"[^>]*>([^<]+)<\/time>/i);
  if (time && time[1].trim()) return time[1].trim();
  const published = html.match(/"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})"/);
  return published ? published[1] : '';
}

function readingSource(articleHtml) {
  return articleHtml
    .replace(/<!-- ARTICLE-META:START -->[\s\S]*?<!-- ARTICLE-META:END -->/g, '')
    .replace(/<!-- ARTICLE-TOC:START -->[\s\S]*?<!-- ARTICLE-TOC:END -->/g, '')
    .replace(/<!-- ARTICLE-HERO:START -->[\s\S]*?<!-- ARTICLE-HERO:END -->/g, '');
}

function readingMinutes(articleHtml) {
  const text = stripTags(readingSource(articleHtml));
  const words = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.round(words / 180));
}

function coverFor(dir) {
  return COVERS.find(([file]) => fs.existsSync(path.join(dir, file))) || null;
}

function replaceSentinel(html, start, end, block) {
  const re = new RegExp(start + '[\\s\\S]*?' + end);
  if (!re.test(html)) return null;
  return html.replace(re, block);
}

function matchingDivEnd(html, start) {
  const tagRe = /<\/?div\b[^>]*>/gi;
  let depth = 0;
  let match;
  tagRe.lastIndex = start;
  while ((match = tagRe.exec(html))) {
    const tag = match[0];
    if (/^<\//.test(tag)) {
      depth -= 1;
      if (depth === 0) return match.index + tag.length;
    } else if (!/\/>$/.test(tag)) {
      depth += 1;
    }
  }
  return -1;
}

function articleSlice(html) {
  const h1 = html.search(/<h1\b/i);
  if (h1 < 0) return null;
  const divRe = /<div\b[^>]*class="([^"]*)"[^>]*>/gi;
  let match;
  while ((match = divRe.exec(html))) {
    if (match.index > h1) break;
    const cls = match[1];
    if (!/\bcontainer\b/.test(cls)) continue;
    if (/\bnavbar-inner\b|\bfooter-inner\b|\bpillar-links\b/.test(cls)) continue;
    const end = matchingDivEnd(html, match.index);
    if (end > h1) return { start: match.index, end, kind: 'div' };
  }
  const artRe = /<article\b[^>]*>/gi;
  while ((match = artRe.exec(html))) {
    if (match.index > h1) break;
    const end = html.indexOf('</article>', match.index);
    if (end > h1) return { start: match.index, end: end + '</article>'.length, kind: 'article' };
  }
  return null;
}

function wrapBareArticle(html) {
  if (articleSlice(html)) return html;
  const h1 = html.search(/<h1\b/i);
  if (h1 < 0) return html;
  const markers = ['<!-- RELATED-POSTS:START -->', '<!-- PILLAR-LINKS:START -->', '<footer'];
  let end = html.length;
  for (const marker of markers) {
    const at = html.indexOf(marker, h1);
    if (at > -1 && at < end) end = at;
  }
  const inner = html.slice(h1, end).replace(/\s+$/, '');
  const wrapped = `<article class="article-sheet">\n${inner}\n</article>\n`;
  return html.slice(0, h1) + wrapped + html.slice(end);
}

function ensureSheetClass(articleHtml) {
  if (!/^<div\b/i.test(articleHtml)) return articleHtml;
  return articleHtml.replace(/^<div\b([^>]*)>/i, (full, attrs) => {
    if (/\barticle-sheet\b/.test(attrs)) return full;
    if (/class="/i.test(attrs)) {
      return `<div${attrs.replace(/class="/i, 'class="article-sheet ')}>`;
    }
    return `<div class="article-sheet"${attrs}>`;
  });
}

function addHeadingIds(articleHtml) {
  const used = new Set();
  const headings = [];
  const next = articleHtml.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (full, attrs, inner) => {
    const text = stripTags(inner);
    if (!text) return full;
    const existing = String(attrs).match(/\sid="([^"]+)"/i);
    let id;
    if (existing && !isLegacyAutoId(existing[1], text)) {
      id = existing[1];
      used.add(id);
    } else {
      id = headingId(text, used);
    }
    headings.push({ id, text });
    if (existing && existing[1] === id) return full;
    if (existing) {
      return `<h2${attrs.replace(/\sid="[^"]+"/i, ` id="${id}"`)}>${inner}</h2>`;
    }
    return `<h2${attrs} id="${id}">${inner}</h2>`;
  });
  return { html: next, headings };
}

function metaBlock(articleHtml, slug, title) {
  const chips = [`<span class="article-chip">${escapeHtml(categoryLabel(slug, title))}</span>`];
  const date = extractDate(articleHtml);
  if (date) chips.push(`<span class="article-chip">${escapeHtml(date)}</span>`);
  const minutes = readingMinutes(articleHtml);
  chips.push(`<span class="article-chip">${bnDigits(minutes)} মিনিট পড়া</span>`);
  return `<!-- ARTICLE-META:START -->\n<p class="article-kicker">${chips.join('')}</p>\n<!-- ARTICLE-META:END -->`;
}

function heroBlock(slug, title, coverFile) {
  const src = `/blog/${slug}/${coverFile}`;
  return `<!-- ARTICLE-HERO:START -->\n<figure class="article-hero">\n  <img src="${src}" width="1200" height="630" alt="${escapeHtml(title)}" decoding="async" fetchpriority="high">\n  <figcaption>${escapeHtml(title)}</figcaption>\n</figure>\n<!-- ARTICLE-HERO:END -->`;
}

function tocBlock(headings) {
  if (headings.length < 2) return '';
  const items = headings.map(h => `    <li class="toc-item"><a href="#${escapeHtml(h.id)}">${escapeHtml(h.text)}</a></li>`).join('\n');
  return `<!-- ARTICLE-TOC:START -->\n<nav class="article-toc" aria-label="সূচিপত্র">\n  <input class="article-toc-toggle" type="checkbox" id="article-toc-toggle">\n  <label class="article-toc-label" for="article-toc-toggle">সূচিপত্র</label>\n  <ol class="toc-list">\n${items}\n  </ol>\n</nav>\n<!-- ARTICLE-TOC:END -->`;
}

function insertBeforeH1(articleHtml, block) {
  return articleHtml.replace(/<h1\b/i, block + '\n<h1');
}

function anchorAfterTitle(articleHtml) {
  const authorEnd = articleHtml.indexOf('<!-- AUTHOR-BLOCK:END -->');
  const h1End = articleHtml.search(/<\/h1>/i);
  let at = null;
  if (authorEnd > -1 && (h1End < 0 || authorEnd > h1End)) {
    at = authorEnd + '<!-- AUTHOR-BLOCK:END -->'.length;
  } else {
    const byline = articleHtml.match(/<\/h1>\s*<p class="byline">[\s\S]*?<\/p>/i);
    if (byline && byline.index != null) at = byline.index + byline[0].length;
    else if (h1End >= 0) at = articleHtml.indexOf('>', h1End) + 1;
  }
  if (at == null) return null;
  const headerClose = articleHtml.indexOf('</header>', at);
  const nestedArticle = articleHtml.indexOf('<article', at);
  if (headerClose > -1 && nestedArticle > headerClose && headerClose - at < 900) {
    return headerClose + '</header>'.length;
  }
  return at;
}

function insertAt(html, at, block) {
  return html.slice(0, at) + '\n' + block + html.slice(at);
}

const CONSENT_TAG = '<script src="/js/consent.js?v=2026-10-26-trust" defer></script>';
const ANALYTICS_TAG = '<script src="/js/analytics.js?v=2026-10-26-trust" defer></script>';

function scriptTags(html, fileName) {
  const re = new RegExp(
    `<script\\b[^>]*\\bsrc=["']/js/${fileName}(?:\\?[^"']*)?["'][^>]*>\\s*</script>`,
    'gi',
  );
  const tags = [];
  let match;
  while ((match = re.exec(html))) {
    tags.push({ index: match.index, end: match.index + match[0].length });
  }
  return tags;
}

// Same GA4 loader as root pages: consent.js must come first, then analytics.js.
// analytics.js only requests gtag after the visitor accepts analytics consent.
function ensureAnalytics(html) {
  const consent = scriptTags(html, 'consent\\.js');
  const analytics = scriptTags(html, 'analytics\\.js');
  if (
    consent.length === 1 &&
    analytics.length === 1 &&
    consent[0].index < analytics[0].index
  ) {
    return html;
  }
  const removable = [...consent, ...analytics].sort((a, b) => b.index - a.index);
  let next = html;
  for (const tag of removable) {
    next = next.slice(0, tag.index) + next.slice(tag.end);
  }
  if (!/<\/head>/i.test(next)) return html;
  return next.replace(
    /<\/head>/i,
    `  ${CONSENT_TAG}\n  ${ANALYTICS_TAG}\n</head>`,
  );
}

function ensureHeadAssets(html) {
  let next = html;
  if (!/blog-premium\.css/.test(next) && !/article-magazine\.css/.test(next)) {
    next = next.replace(/<\/head>/i, '  <link rel="stylesheet" href="/css/article-magazine.css">\n</head>');
  }
  if (!/article-chrome\.js/.test(next)) {
    next = next.replace(/<\/head>/i, '  <script src="/js/article-chrome.js" defer></script>\n</head>');
  }
  return ensureAnalytics(next);
}

function processFile(file, slug) {
  const original = fs.readFileSync(file, 'utf8');
  if (isRedirectStub(original)) return false;
  let html = wrapBareArticle(original);
  const slice = articleSlice(html);
  const title = slice
    ? stripTags((html.slice(slice.start, slice.end).match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '')
    : '';
  if (!slice || !title) {
    const next = ensureHeadAssets(original);
    if (next === original) return false;
    fs.writeFileSync(file, next);
    return true;
  }

  let article = ensureSheetClass(html.slice(slice.start, slice.end));

  const headed = addHeadingIds(article);
  article = headed.html;
  const headings = headed.headings;

  const meta = metaBlock(article, slug, title);
  const replacedMeta = replaceSentinel(article, '<!-- ARTICLE-META:START -->', '<!-- ARTICLE-META:END -->', meta);
  article = replacedMeta || insertBeforeH1(article, meta);

  const cover = coverFor(path.dirname(file));
  if (cover) {
    const hero = heroBlock(slug, title, cover[0]);
    const replacedHero = replaceSentinel(article, '<!-- ARTICLE-HERO:START -->', '<!-- ARTICLE-HERO:END -->', hero);
    if (replacedHero) {
      article = replacedHero;
    } else {
      const anchor = anchorAfterTitle(article);
      if (anchor != null) article = insertAt(article, anchor, hero);
    }
  }

  const toc = tocBlock(headings);
  if (toc) {
    const replacedToc = replaceSentinel(article, '<!-- ARTICLE-TOC:START -->', '<!-- ARTICLE-TOC:END -->', toc);
    if (replacedToc) {
      article = replacedToc;
    } else {
      const heroEnd = article.indexOf('<!-- ARTICLE-HERO:END -->');
      if (heroEnd > -1) {
        article = insertAt(article, heroEnd + '<!-- ARTICLE-HERO:END -->'.length, toc);
      } else {
        const anchor = anchorAfterTitle(article);
        if (anchor != null) article = insertAt(article, anchor, toc);
      }
    }
  }

  let next = html.slice(0, slice.start) + article + html.slice(slice.end);
  next = ensureHeadAssets(next);
  if (next === original) return false;
  fs.writeFileSync(file, next);
  return true;
}

function run() {
  if (!fs.existsSync(BLOG)) {
    console.error('blog/ not found');
    process.exit(1);
  }
  let updated = 0;
  let scanned = 0;
  for (const entry of fs.readdirSync(BLOG, { withFileTypes: true })) {
    if (!entry.isDirectory() || hasNonAscii(entry.name)) continue;
    const file = path.join(BLOG, entry.name, 'index.html');
    if (!fs.existsSync(file)) continue;
    scanned++;
    if (processFile(file, entry.name)) updated++;
  }
  console.log(`Article chrome: scanned ${scanned}, updated ${updated}`);
  const missing = [];
  for (const entry of fs.readdirSync(BLOG, { withFileTypes: true })) {
    if (!entry.isDirectory() || hasNonAscii(entry.name)) continue;
    const file = path.join(BLOG, entry.name, 'index.html');
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, 'utf8');
    if (isRedirectStub(html)) continue;
    const consent = scriptTags(html, 'consent\\.js');
    const analytics = scriptTags(html, 'analytics\\.js');
    if (!(consent.length === 1 && analytics.length === 1 && consent[0].index < analytics[0].index)) {
      missing.push(entry.name);
    }
  }
  if (missing.length) {
    console.error(`Analytics missing or duplicated on ${missing.length} articles: ${missing.slice(0, 8).join(', ')}`);
    process.exit(1);
  }
}

run();

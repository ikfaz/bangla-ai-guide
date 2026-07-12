#!/usr/bin/env node
/*
 * Auto-regenerate the cards in blog/index.html from filesystem.
 *
 * - Scans every blog/<slug>/index.html (skips mojibake + redirect stubs)
 * - Extracts title, description, datePublished, slug
 * - Sorts newest-first by datePublished
 * - Renders fresh <article class="blog-card"> entries that use cover.svg
 *   as the visible card image
 * - Replaces both the HTML card list and the JS blogArticles[] array
 *   between sentinel markers (added on first run via anchor-based replace)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BLOG = path.join(ROOT, 'blog');
const LISTING = path.join(BLOG, 'index.html');

// --- extractors ----------------------------------------------------------

function hasNonAscii(s) { return /[^\x00-\x7F]/.test(s); }
function isRedirectStub(html) { return /http-equiv="refresh"/i.test(html); }

function extractTag(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = html.match(re);
  return m ? m[1].trim().replace(/\s+/g, ' ') : null;
}

function extractMeta(html, name) {
  const re = new RegExp(`<meta[^>]+(?:name|property)="${name}"[^>]+content="([^"]+)"`, 'i');
  const m = html.match(re);
  return m ? m[1] : null;
}

function extractDatePublished(html) {
  const m = html.match(/"datePublished"\s*:\s*"([^"]+)"/);
  return m ? m[1] : null;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeJs(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

// --- category mapping (matches existing taxonomy) ------------------------

function categoryFor(slug, title) {
  const t = (slug + ' ' + (title || '')).toLowerCase();
  if (/\bvs\b|comparison|konti-bhalo|tulna/.test(t)) return 'তুলনা';
  if (/ssc|hsc|bcs|ielts|university|admission|student|porashona|shikkharthi|teacher|exam|prostuti/.test(t)) return 'শিক্ষা';
  if (/income|taka|freelanc|earning/.test(t)) return 'আয়';
  if (/business|ecommerce|restaurant|rmg|real-estate|travel|accounting|law|doctor|medical|krishi|farmer|garments|dse|stock|brand|personal-brand/.test(t)) return 'ব্যবসা';
  if (/prompt|content|blog|seo|likha|writing/.test(t)) return 'কন্টেন্ট';
  if (/video|image|photo|voice|tts|avatar|music|thumbnail|design|logo|presentation/.test(t)) return 'মিডিয়া';
  if (/coding|developer|cursor|copilot|codeium|windsurf|claude-code|warp|website|excel|data/.test(t)) return 'কোডিং';
  if (/chatgpt|claude|gemini|deepseek|perplexity|grok|notebooklm|manus/.test(t)) return 'AI টুল';
  if (/vpn|payment|bkash|price|pricing/.test(t)) return 'অ্যাক্সেস';
  return 'গাইড';
}

// --- bangla numeral formatter --------------------------------------------

function toBnDate(isoDate) {
  // 2026-05-26 → ২০২৬-০৫-২৬
  if (!isoDate) return '';
  const en2bn = { '0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯' };
  return isoDate.slice(0, 10).replace(/[0-9]/g, d => en2bn[d] || d);
}

// --- main scan -----------------------------------------------------------

function collectArticles() {
  const articles = [];
  for (const entry of fs.readdirSync(BLOG, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (hasNonAscii(entry.name)) continue;

    const file = path.join(BLOG, entry.name, 'index.html');
    if (!fs.existsSync(file)) continue;

    const html = fs.readFileSync(file, 'utf8');
    if (isRedirectStub(html)) continue;

    const title = extractTag(html, 'title');
    if (!title) continue;

    const description = extractMeta(html, 'description') || '';
    const date = extractDatePublished(html) || '2026-03-11';
    const slug = entry.name;
    const cover = ['cover.webp', 'cover.png', 'cover.jpg', 'cover.jpeg', 'cover.svg']
      .find(name => fs.existsSync(path.join(BLOG, slug, name))) || null;

    articles.push({
      slug,
      title,
      description: description.length > 140 ? description.slice(0, 137) + '…' : description,
      date,
      category: categoryFor(slug, title),
      cover,
    });
  }
  // newest first
  articles.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return articles;
}

// --- card renderer -------------------------------------------------------

function renderCardHtml(a) {
  const headerStyle = a.cover
    ? `background-image: linear-gradient(135deg, rgba(5,150,105,.55), rgba(16,185,129,.25)), url('/blog/${a.slug}/${a.cover}'); background-size: cover; background-position: center; height: 140px;`
    : '';
  const headerInline = a.cover ? ` style="${headerStyle}"` : '';

  return `            <article class="blog-card" data-category="${escapeHtml(a.category)}">
                <div class="blog-card-header"${headerInline}><div><div class="blog-card-category">${escapeHtml(a.category)}</div></div></div>
                <div class="blog-card-content">
                    <h3 class="blog-card-title">${escapeHtml(a.title)}</h3>
                    <p class="blog-card-description">${escapeHtml(a.description)}</p>
                    <div class="blog-card-footer"><span class="blog-card-date">${toBnDate(a.date)}</span><a href="/blog/${a.slug}/" class="blog-card-link">পড়ুন →</a></div>
                </div>
            </article>`;
}

function renderJsArray(articles) {
  const items = articles.map(a => `            {
                title: "${escapeJs(a.title)}",
                description: "${escapeJs(a.description)}",
                url: "${escapeJs(a.slug)}/",
                date: "${toBnDate(a.date)}",
                category: "${escapeJs(a.category)}",
                cover: ${a.cover ? `"${escapeJs(a.slug)}/${escapeJs(a.cover)}"` : 'null'}
            }`).join(',\n');
  return `        const blogArticles = [
${items}
        ];`;
}

// --- HTML surgery --------------------------------------------------------

function replaceBetween(html, startMarker, endMarker, replacement) {
  // If markers already exist, replace between them
  const startIdx = html.indexOf(startMarker);
  const endIdx = html.indexOf(endMarker);
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    return html.slice(0, startIdx + startMarker.length)
      + '\n' + replacement + '\n            '
      + html.slice(endIdx);
  }
  return null;
}

function replaceCardSection(html, cardsHtml) {
  // First try sentinel-based replace
  const withSentinels = replaceBetween(
    html,
    '<!-- BLOG-LISTING:START -->',
    '<!-- BLOG-LISTING:END -->',
    cardsHtml
  );
  if (withSentinels) return withSentinels;

  // Anchor-based: replace contents of <div class="blog-grid" id="blogGrid"> ... </div>
  const re = /(<div class="blog-grid" id="blogGrid">)([\s\S]*?)(\n\s*<\/div>\s*<\/main>)/;
  if (!re.test(html)) {
    throw new Error('Could not locate blog-grid section in blog/index.html');
  }
  return html.replace(re,
    `$1\n            <!-- BLOG-LISTING:START -->\n${cardsHtml}\n            <!-- BLOG-LISTING:END -->$3`
  );
}

function replaceJsArray(html, jsBlock) {
  // Sentinel attempt
  const withSentinels = replaceBetween(
    html,
    '// BLOG-ARTICLES:START',
    '// BLOG-ARTICLES:END',
    jsBlock.replace(/^\s*const blogArticles =/, '        const blogArticles =')
  );
  if (withSentinels) return withSentinels;

  // Anchor: replace existing const blogArticles = [ ... ];
  const re = /const blogArticles\s*=\s*\[[\s\S]*?\];/;
  if (!re.test(html)) {
    throw new Error('Could not locate blogArticles array in blog/index.html');
  }
  return html.replace(re,
    `// BLOG-ARTICLES:START\n${jsBlock.replace(/^\s+/, '')}\n        // BLOG-ARTICLES:END`
  );
}

// --- run -----------------------------------------------------------------

function run() {
  const articles = collectArticles();
  console.log(`Collected ${articles.length} articles from filesystem`);

  const jsBlock = renderJsArray(articles);

  let html = fs.readFileSync(LISTING, 'utf8');

  // The live blog page renders cards dynamically from blogArticles[] —
  // we only need to keep that array in sync. If a static .blog-grid card
  // section exists, also regenerate it (legacy support).
  const hasStaticCards = /<article class="blog-card"/i.test(html);
  if (hasStaticCards) {
    const cardsHtml = articles.map(renderCardHtml).join('\n');
    html = replaceCardSection(html, cardsHtml);
  }

  html = replaceJsArray(html, jsBlock);
  fs.writeFileSync(LISTING, html, 'utf8');

  console.log(`Updated blog/index.html: ${articles.length} articles in blogArticles[]${hasStaticCards ? ' + static cards' : ''}`);
}

run();

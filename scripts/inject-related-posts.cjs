#!/usr/bin/env node
/*
 * Auto-inject a "Related guides" section into every blog post.
 *
 * - Scans blog/<slug>/index.html
 * - Extracts title, keywords meta, slug tokens for each
 * - For each post, picks 4 most-related other posts by:
 *     (a) shared category (via slug heuristics)
 *     (b) keyword token overlap (Jaccard-ish)
 * - Injects/updates a styled block between sentinels
 *     <!-- RELATED-POSTS:START --> ... <!-- RELATED-POSTS:END -->
 *   placed right after the article's closing </ul> for the
 *   "প্রাসঙ্গিক টুলস" section, or before pillar-links if not found.
 * - Idempotent — re-running replaces the block.
 *
 * Massive internal-linking + dwell-time + SEO boost.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BLOG = path.join(ROOT, 'blog');

// --- helpers -------------------------------------------------------------

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
  return m ? m[1] : '';
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Token extraction — split on non-word chars, drop tiny + stop words
const STOP_WORDS = new Set([
  'and', 'or', 'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'as', 'by', 'this', 'that', 'it', 'its', 'how', 'what', 'when', 'why', 'who', 'which',
  'guide', 'bangla', 'bangladesh', 'banglay', 'sompurno', 'kivabe', 'jonno', 'diye', 'ai', 'tool', 'tools',
  'best', 'top', 'new', 'use', 'using', 'tutorial', 'review', 'vs', '2026', '2025',
]);

function tokenize(s) {
  if (!s) return [];
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9ঀ-৿\s-]+/g, ' ')
    .split(/[\s-]+/)
    .filter(t => t && t.length > 2 && !STOP_WORDS.has(t));
}

function categoryFor(slug, title) {
  const t = (slug + ' ' + (title || '')).toLowerCase();
  if (/\bvs\b|comparison|konti-bhalo|tulna/.test(t)) return 'COMPARISON';
  if (/ssc|hsc|bcs|ielts|university|admission|student|porashona|shikkharthi|teacher|exam|prostuti/.test(t)) return 'EDUCATION';
  if (/income|taka|freelanc|earning/.test(t)) return 'INCOME';
  if (/business|ecommerce|restaurant|rmg|real-estate|travel|accounting|law|doctor|medical|krishi|farmer|garments|dse|stock|brand/.test(t)) return 'BUSINESS';
  if (/prompt|content|blog|seo|likha|writing/.test(t)) return 'CONTENT';
  if (/video|image|photo|voice|tts|avatar|music|thumbnail|design|logo|presentation/.test(t)) return 'MEDIA';
  if (/coding|developer|cursor|copilot|codeium|windsurf|claude-code|warp|website|excel|data/.test(t)) return 'CODING';
  if (/chatgpt|claude|gemini|deepseek|perplexity|grok|notebooklm|manus|jasper|writesonic|rytr/.test(t)) return 'AI_TOOL';
  if (/vpn|payment|bkash|price|pricing/.test(t)) return 'ACCESS';
  return 'GUIDE';
}

// --- scan all articles ---------------------------------------------------

function collect() {
  const articles = [];
  for (const entry of fs.readdirSync(BLOG, { withFileTypes: true })) {
    if (!entry.isDirectory() || hasNonAscii(entry.name)) continue;
    const file = path.join(BLOG, entry.name, 'index.html');
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, 'utf8');
    if (isRedirectStub(html)) continue;
    const title = extractTag(html, 'title');
    if (!title) continue;
    const description = extractMeta(html, 'description');
    const keywords = extractMeta(html, 'keywords');
    const category = categoryFor(entry.name, title);
    const tokens = new Set([
      ...tokenize(entry.name),
      ...tokenize(title),
      ...tokenize(keywords),
    ]);
    articles.push({
      slug: entry.name, title, description, category,
      tokens,
      file,
      cover: ['cover.webp', 'cover.png', 'cover.jpg', 'cover.jpeg', 'cover.svg']
        .find(name => fs.existsSync(path.join(BLOG, entry.name, name))) || null,
    });
  }
  return articles;
}

// --- scoring -------------------------------------------------------------

function score(a, b) {
  if (a.slug === b.slug) return -1;
  let s = 0;
  if (a.category === b.category) s += 5;
  // token overlap count
  let overlap = 0;
  for (const t of a.tokens) if (b.tokens.has(t)) overlap++;
  s += overlap * 1.5;
  return s;
}

function pickRelated(target, all, n = 4) {
  return all
    .map(a => ({ a, s: score(target, a) }))
    .filter(x => x.s > 0)
    .sort((x, y) => y.s - x.s)
    .slice(0, n)
    .map(x => x.a);
}

// --- render block --------------------------------------------------------

function renderBlock(related) {
  const cards = related.map(r => `      <a href="/blog/${r.slug}/" class="rp-card">
        <div class="rp-cover" style="background-image: linear-gradient(135deg, rgba(5,150,105,.55), rgba(16,185,129,.25)), url('/blog/${r.slug}/${r.cover || 'cover.svg'}');"></div>
        <div class="rp-body">
          <h4 class="rp-title">${escapeHtml(r.title)}</h4>
          <span class="rp-link">পড়ুন →</span>
        </div>
      </a>`).join('\n');

  return `<!-- RELATED-POSTS:START -->
<section class="related-posts" aria-label="সম্পর্কিত গাইড">
  <style>
    .related-posts { max-width: 1100px; margin: 56px auto; padding: 0 20px; font-family: 'Hind Siliguri', sans-serif; }
    .related-posts h3 { font-family: 'Syne', 'Hind Siliguri', sans-serif; font-size: 28px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.02em; color: #0F172A; }
    .related-posts .rp-sub { color: #64748B; margin: 0 0 28px; font-size: 15px; }
    .related-posts .rp-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; }
    .related-posts .rp-card { display: flex; flex-direction: column; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 18px; overflow: hidden; text-decoration: none; color: inherit; transition: all .25s ease; }
    .related-posts .rp-card:hover { transform: translateY(-4px); border-color: #16A34A; box-shadow: 0 16px 36px rgba(15,23,42,.12); }
    .related-posts .rp-cover { height: 110px; background-size: cover; background-position: center; }
    .related-posts .rp-body { padding: 16px 18px 18px; flex: 1; display: flex; flex-direction: column; }
    .related-posts .rp-title { font-size: 15px; font-weight: 700; line-height: 1.4; margin: 0 0 12px; color: #0F172A; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    .related-posts .rp-link { margin-top: auto; color: #16A34A; font-size: 13px; font-weight: 600; }
  </style>
  <h3>সম্পর্কিত গাইড</h3>
  <p class="rp-sub">এই বিষয়ে আরও পড়ুন:</p>
  <div class="rp-grid">
${cards}
  </div>
</section>
<!-- RELATED-POSTS:END -->`;
}

// --- injection -----------------------------------------------------------

function injectBlock(html, block) {
  // Replace existing block if sentinels present
  if (/<!-- RELATED-POSTS:START -->/.test(html)) {
    return html.replace(
      /<!-- RELATED-POSTS:START -->[\s\S]*?<!-- RELATED-POSTS:END -->/,
      block
    );
  }
  // Otherwise insert before PILLAR-LINKS:START if present (so order is: article body, related posts, pillar links, footer)
  if (/<!-- PILLAR-LINKS:START -->/.test(html)) {
    return html.replace(
      /(<!-- PILLAR-LINKS:START -->)/,
      `${block}\n\n    $1`
    );
  }
  // Else insert before <footer
  if (/<footer/i.test(html)) {
    return html.replace(/(<footer)/i, `${block}\n\n$1`);
  }
  // Else append before </body>
  return html.replace(/<\/body>/i, `${block}\n</body>`);
}

// --- main ----------------------------------------------------------------

function run() {
  const articles = collect();
  console.log(`Scanned ${articles.length} articles`);

  let updated = 0;
  for (const a of articles) {
    const related = pickRelated(a, articles, 4);
    if (related.length < 2) continue; // need at least 2 to inject
    const block = renderBlock(related);
    let html = fs.readFileSync(a.file, 'utf8');
    const next = injectBlock(html, block);
    if (next !== html) {
      fs.writeFileSync(a.file, next, 'utf8');
      updated++;
    }
  }
  console.log(`Related-posts: injected/updated in ${updated} articles`);
}

run();

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
const { REDIRECT_BLOG_SLUGS } = require('./lib/site-policy.cjs');

const { blogArt } = require('./lib/blog-art.cjs');
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
    if (REDIRECT_BLOG_SLUGS.has(entry.name)) continue;
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
      art: blogArt(entry.name, title),
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
        <img class="rp-cover" src="${escapeHtml(r.art.src)}" width="${r.art.width || 1200}" height="${r.art.height || 630}" alt="${escapeHtml(r.art.alt)}" decoding="async" loading="lazy">
        <div class="rp-body">
          <h4 class="rp-title">${escapeHtml(r.title)}</h4>
          <span class="rp-link">পড়ুন →</span>
        </div>
      </a>`).join('\n');

  return `<!-- RELATED-POSTS:START -->
<section class="related-posts" aria-label="সম্পর্কিত গাইড">
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
  // Keep hand-picked destinations, while updating their old background posters.
  if (!/<!-- RELATED-POSTS:START -->/.test(html) && /class="related-posts"/.test(html)) {
    return html.replace(/<section class="related-posts"[^>]*>[\s\S]*?<\/section>/i, section =>
      section.replace(/\s*<style>[\s\S]*?<\/style>/i, '').replace(
        /(<a href="\/blog\/([^"/]+)\/" class="rp-card">\s*)(?:<div class="rp-cover"[^>]*><\/div>|<img class="rp-cover"[^>]*>)/g,
        (_, link, slug) => {
          const art = blogArt(slug, '');
          return link + `<img class="rp-cover" src="${escapeHtml(art.src)}" width="${art.width || 1200}" height="${art.height || 630}" alt="${escapeHtml(art.alt)}" decoding="async" loading="lazy">`;
        }
      )
    );
  }
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

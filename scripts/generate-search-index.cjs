#!/usr/bin/env node
/*
 * Build /search-index.json — site-wide search index.
 *
 * Indexes:
 *   - All blog posts (blog/<slug>/index.html)
 *   - All root tool/SEO pages (top-level dirs with index.html, skipping infra)
 *   - Reads tool data from js/tools-data.js for tool descriptions
 *
 * Output schema per record:
 *   { t: title, u: url, d: description, k: kind ('tool'|'blog'|'page'), c: category }
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BLOG = path.join(ROOT, 'blog');
const OUT = path.join(ROOT, 'search-index.json');

const SKIP_ROOT_DIRS = new Set([
  '.git', '.github', 'node_modules', 'css', 'js', 'scripts', 'blog',
  'submit', 'privacy', 'terms', 'contact', 'about', 'disclaimer',
]);

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

function truncate(s, n) {
  if (!s) return '';
  return s.length <= n ? s : s.slice(0, n - 1).trim() + '…';
}

function categoryFor(slug, title) {
  const t = (slug + ' ' + (title || '')).toLowerCase();
  if (/\bvs\b|comparison|konti-bhalo|tulna/.test(t)) return 'তুলনা';
  if (/ssc|hsc|bcs|ielts|university|admission|student|porashona|shikkharthi|teacher|exam|prostuti/.test(t)) return 'শিক্ষা';
  if (/income|taka|freelanc|earning/.test(t)) return 'আয়';
  if (/business|ecommerce|restaurant|rmg|real-estate|travel|accounting|law|doctor|medical|krishi|farmer|garments|dse|stock|brand/.test(t)) return 'ব্যবসা';
  if (/prompt|content|blog|seo|likha|writing/.test(t)) return 'কন্টেন্ট';
  if (/video|image|photo|voice|tts|avatar|music|thumbnail|design|logo|presentation/.test(t)) return 'মিডিয়া';
  if (/coding|developer|cursor|copilot|codeium|windsurf|claude-code|warp|website|excel|data/.test(t)) return 'কোডিং';
  if (/chatgpt|claude|gemini|deepseek|perplexity|grok|notebooklm|manus|jasper|writesonic|rytr/.test(t)) return 'AI টুল';
  if (/vpn|payment|bkash|price|pricing/.test(t)) return 'অ্যাক্সেস';
  return 'গাইড';
}

// --- collect blog posts --------------------------------------------------

function collectBlogPosts() {
  const out = [];
  for (const entry of fs.readdirSync(BLOG, { withFileTypes: true })) {
    if (!entry.isDirectory() || hasNonAscii(entry.name)) continue;
    const file = path.join(BLOG, entry.name, 'index.html');
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, 'utf8');
    if (isRedirectStub(html)) continue;
    const title = extractTag(html, 'title');
    if (!title) continue;
    out.push({
      t: title,
      u: `/blog/${entry.name}/`,
      d: truncate(extractMeta(html, 'description'), 160),
      k: 'blog',
      c: categoryFor(entry.name, title),
    });
  }
  return out;
}

// --- collect root pages (tools + SEO) ------------------------------------

function collectRootPages() {
  const out = [];
  for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory() || hasNonAscii(entry.name)) continue;
    if (SKIP_ROOT_DIRS.has(entry.name)) continue;
    const file = path.join(ROOT, entry.name, 'index.html');
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, 'utf8');
    if (isRedirectStub(html)) continue;
    const title = extractTag(html, 'title');
    if (!title) continue;
    const kind = looksLikeTool(entry.name) ? 'tool' : 'page';
    out.push({
      t: title,
      u: `/${entry.name}/`,
      d: truncate(extractMeta(html, 'description'), 160),
      k: kind,
      c: categoryFor(entry.name, title),
    });
  }
  return out;
}

function looksLikeTool(name) {
  // Single-word or two-word tool names (no hyphens to long slugs)
  // Heuristic: short slug, no "bangladesh" / "guide" / "bangla" in name
  if (name.length > 30) return false;
  if (/bangladesh|guide|bangla|free|kena|chara|pricing|2025|2026/.test(name)) return false;
  return true;
}

// --- run -----------------------------------------------------------------

function run() {
  const blog = collectBlogPosts();
  const root = collectRootPages();
  const all = [...blog, ...root].sort((a, b) => a.t.localeCompare(b.t));
  // Minify JSON (no whitespace) for fast load
  fs.writeFileSync(OUT, JSON.stringify({ v: 1, n: all.length, items: all }), 'utf8');
  console.log(`Search index: wrote ${all.length} items (${blog.length} blog + ${root.length} pages) → search-index.json`);
}

run();

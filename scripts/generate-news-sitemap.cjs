#!/usr/bin/env node
// Generate /news-sitemap.xml with original publication dates for Google News.
// Follows the official Google News Sitemap 0.9 specification:
// https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap
//
//   node scripts/generate-news-sitemap.cjs

const fs = require("fs");
const path = require("path");
const {
  ROOT,
  BLOG,
  SITE,
  ORG_NAME,
  REDIRECT_BLOG_SLUGS,
  isRedirectStub,
} = require("./lib/site-policy.cjs");

const NEWS_SITEMAP_PATH = path.join(ROOT, "news-sitemap.xml");
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

function hasNonAscii(s) {
  return /[^\x00-\x7F]/.test(s);
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// News dates must be explicit original publication dates, never edit/git dates.
// Date-only metadata stays date-only; UTC midnight is used only for age filtering.
function parseDate(value) {
  if (typeof value !== 'string') return null;
  const raw = value.trim();
  const match = raw.match(/^(\d{4}-\d{2}-\d{2})(?:T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d))?$/);
  if (!match) return null;
  const day = Date.parse(match[1] + 'T00:00:00Z');
  if (!Number.isFinite(day) || new Date(day).toISOString().slice(0, 10) !== match[1]) return null;
  const ms = Date.parse(raw.length === 10 ? raw + 'T00:00:00Z' : raw);
  return Number.isFinite(ms) ? { value: raw, ms } : null;
}

function articleMetadata(html) {
  for (const script of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    let data;
    try { data = JSON.parse(script[1]); } catch { continue; }
    const nodes = Array.isArray(data) ? [...data] : [data];
    while (nodes.length) {
      const node = nodes.shift();
      if (!node || typeof node !== 'object') continue;
      if (Array.isArray(node['@graph'])) nodes.push(...node['@graph']);
      const types = [].concat(node['@type'] || []);
      if (types.some(type => ['Article', 'NewsArticle', 'BlogPosting'].includes(type))) return node;
    }
  }
  return null;
}

function collectNewsArticles({ now = new Date(), blogDir = BLOG } = {}) {
  const nowMs = new Date(now).getTime();
  if (!Number.isFinite(nowMs)) throw new Error('Invalid news sitemap reference time');
  if (!fs.existsSync(blogDir)) return [];
  const recent = [];
  for (const entry of fs.readdirSync(blogDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || hasNonAscii(entry.name) || REDIRECT_BLOG_SLUGS.has(entry.name)) continue;
    const indexPath = path.join(blogDir, entry.name, 'index.html');
    if (!fs.existsSync(indexPath)) continue;
    const html = fs.readFileSync(indexPath, 'utf8');
    if (isRedirectStub(html)) continue;
    const metadata = articleMetadata(html);
    const published = parseDate(metadata?.datePublished);
    if (!published || published.ms > nowMs || nowMs - published.ms >= TWO_DAYS_MS) continue;
    // Fail closed on missing original title/date rather than inventing news metadata.
    if (typeof metadata.headline !== 'string' || !metadata.headline.trim()) continue;
    const modified = parseDate(metadata.dateModified);
    recent.push({
      slug: entry.name,
      headline: metadata.headline.trim(),
      published: published.value,
      publishedMs: published.ms,
      modified: modified && modified.ms >= published.ms && modified.ms <= nowMs ? modified.value : published.value,
      hasCover: fs.existsSync(path.join(blogDir, entry.name, 'cover.png')),
    });
  }
  recent.sort((a, b) => b.publishedMs - a.publishedMs || a.slug.localeCompare(b.slug));
  return recent.slice(0, 1000);
}

function buildNewsSitemap(articles) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"',
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
  ];

  for (const article of articles) {
    const loc = `${SITE}/blog/${article.slug}/`;
    lines.push("  <url>");
    lines.push(`    <loc>${escapeXml(loc)}</loc>`);
    lines.push(`    <lastmod>${escapeXml(article.modified)}</lastmod>`);
    lines.push("    <news:news>");
    lines.push("      <news:publication>");
    lines.push(`        <news:name>${escapeXml(ORG_NAME)}</news:name>`);
    lines.push("        <news:language>bn</news:language>");
    lines.push("      </news:publication>");
    lines.push(`      <news:publication_date>${escapeXml(article.published)}</news:publication_date>`);
    lines.push(`      <news:title>${escapeXml(article.headline)}</news:title>`);
    lines.push("    </news:news>");
    if (article.hasCover) {
      lines.push("    <image:image>");
      lines.push(`      <image:loc>${escapeXml(`${SITE}/blog/${article.slug}/cover.png`)}</image:loc>`);
      lines.push(`      <image:title>${escapeXml(article.headline)}</image:title>`);
      lines.push("    </image:image>");
    }
    lines.push("  </url>");
  }

  lines.push("</urlset>");
  return lines.join("\n") + "\n";
}

if (require.main === module) {
  const articles = collectNewsArticles();
  const xml = buildNewsSitemap(articles);
  fs.writeFileSync(NEWS_SITEMAP_PATH, xml, "utf8");
  console.log(`Wrote news-sitemap.xml with ${articles.length} recent news/guide articles`);
}

module.exports = { collectNewsArticles, buildNewsSitemap };

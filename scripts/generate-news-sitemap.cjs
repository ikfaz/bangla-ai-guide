#!/usr/bin/env node
// Generate /news-sitemap.xml for Google News & Google Discover crawlers.
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
  readArticleDates,
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

function cleanHeadline(html, fallback) {
  const ldMatch = html.match(/"headline"\s*:\s*"([^"]+)"/i);
  if (ldMatch && ldMatch[1]) {
    return ldMatch[1].replace(/\\"/g, '"').trim();
  }
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match && h1Match[1]) {
    return h1Match[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  }
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }
  return fallback;
}

function collectNewsArticles() {
  if (!fs.existsSync(BLOG)) return [];
  const all = [];
  for (const entry of fs.readdirSync(BLOG, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (hasNonAscii(entry.name)) continue;
    if (REDIRECT_BLOG_SLUGS.has(entry.name)) continue;
    const indexPath = path.join(BLOG, entry.name, "index.html");
    if (!fs.existsSync(indexPath)) continue;
    const html = fs.readFileSync(indexPath, "utf8");
    if (isRedirectStub(html)) continue;

    const dates = readArticleDates(html, indexPath);
    const headline = cleanHeadline(html, entry.name);
    const freshDate = dates.modified >= dates.published ? dates.modified : dates.published;
    const hasCover = fs.existsSync(path.join(BLOG, entry.name, "cover.png"));

    all.push({
      slug: entry.name,
      headline,
      published: dates.published,
      modified: dates.modified,
      freshDate,
      freshMs: Date.parse(`${freshDate}T00:00:00Z`) || 0,
      hasCover,
    });
  }

  all.sort((a, b) => {
    if (b.freshDate !== a.freshDate) return b.freshDate.localeCompare(a.freshDate);
    if (b.published !== a.published) return b.published.localeCompare(a.published);
    return a.slug.localeCompare(b.slug);
  });

  if (!all.length) return [];

  // Reference anchor is the newest article date in the repository so builds are deterministic
  const anchorMs = all[0].freshMs;
  const recent = all.filter((item) => anchorMs - item.freshMs <= TWO_DAYS_MS);
  return recent.length >= 1 ? recent.slice(0, 1000) : all.slice(0, 15);
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
    const pubIso = `${article.freshDate}T09:00:00+06:00`;
    lines.push("  <url>");
    lines.push(`    <loc>${escapeXml(loc)}</loc>`);
    lines.push(`    <lastmod>${escapeXml(article.modified)}</lastmod>`);
    lines.push("    <news:news>");
    lines.push("      <news:publication>");
    lines.push(`        <news:name>${escapeXml(ORG_NAME)}</news:name>`);
    lines.push("        <news:language>bn</news:language>");
    lines.push("      </news:publication>");
    lines.push(`      <news:publication_date>${escapeXml(pubIso)}</news:publication_date>`);
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

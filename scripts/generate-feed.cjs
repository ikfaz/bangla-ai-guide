#!/usr/bin/env node
// Generate /feed.xml RSS feed for blog posts. Discovery, distribution, and
// another path for crawlers to find blog content.
//
//   node scripts/generate-feed.cjs

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BLOG = path.join(ROOT, "blog");
const SITE = "https://banglaaiguide.com";

function hasNonAscii(s) {
  return /[^\x00-\x7F]/.test(s);
}

function readField(html, regex) {
  const m = html.match(regex);
  return m ? m[1] : "";
}

function isRedirectStub(html) {
  return /http-equiv="refresh"/i.test(html);
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function collectPosts() {
  if (!fs.existsSync(BLOG)) return [];
  const posts = [];
  for (const entry of fs.readdirSync(BLOG, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (hasNonAscii(entry.name)) continue;
    const indexPath = path.join(BLOG, entry.name, "index.html");
    if (!fs.existsSync(indexPath)) continue;
    const html = fs.readFileSync(indexPath, "utf8");
    if (isRedirectStub(html)) continue;

    const title = readField(html, /<title>([^<]+)<\/title>/i);
    const description = readField(
      html,
      /<meta name="description" content="([^"]+)"/i,
    );
    const datePublished =
      readField(html, /"datePublished"\s*:\s*"([^"]+)"/i) ||
      fs.statSync(indexPath).mtime.toISOString().slice(0, 10);

    posts.push({
      slug: entry.name,
      title: title || entry.name,
      description: description || "",
      pubDate: new Date(datePublished).toUTCString(),
      sortKey: datePublished,
    });
  }
  return posts.sort((a, b) => (b.sortKey < a.sortKey ? -1 : 1));
}

function buildFeed(posts, buildDate = new Date()) {
  const now = buildDate.toUTCString();
  const items = posts
    .map((p) => {
      const url = `${SITE}/blog/${p.slug}/`;
      return `  <item>
    <title>${escapeXml(p.title)}</title>
    <link>${escapeXml(url)}</link>
    <guid isPermaLink="true">${escapeXml(url)}</guid>
    <pubDate>${escapeXml(p.pubDate)}</pubDate>
    <description>${escapeXml(p.description)}</description>
  </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>বাংলা AI গাইড — ব্লগ</title>
  <link>${SITE}/</link>
  <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
  <description>বাংলাদেশের জন্য AI টুলস গাইড, রিভিউ ও টিউটোরিয়াল।</description>
  <language>bn-BD</language>
  <lastBuildDate>${now}</lastBuildDate>
${items}
</channel>
</rss>
`;
}

function writeFeed(filePath, posts, buildDate = new Date()) {
  const xml = buildFeed(posts, buildDate);
  const previous = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
  const dateTag = /<lastBuildDate>([^<]*)<\/lastBuildDate>/;
  const previousDate = previous.match(dateTag)?.[1];
  // Preserve the last meaningful feed update, not the time of an unrelated build.
  // Normalize checkout line endings only; changes to any other metadata or item
  // still produce a new feed. Invalid/missing dates are repaired on the next run.
  const withoutBuildDate = (value) => value.replace(/\r\n/g, "\n").replace(dateTag, "");
  if (previousDate && Number.isFinite(Date.parse(previousDate)) &&
      withoutBuildDate(previous) === withoutBuildDate(xml)) {
    return false;
  }
  fs.writeFileSync(filePath, xml, "utf8");
  return true;
}

if (require.main === module) {
  const posts = collectPosts();
  const changed = writeFeed(path.join(ROOT, "feed.xml"), posts);
  console.log(`${changed ? "Wrote" : "Unchanged"} feed.xml with ${posts.length} blog posts`);
}

module.exports = { buildFeed, writeFeed };

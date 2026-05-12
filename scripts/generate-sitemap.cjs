#!/usr/bin/env node
// Auto-generate sitemap.xml from the filesystem so newly added pages are
// always declared to search engines. Run before each deploy.
//
//   node scripts/generate-sitemap.cjs

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SITE_URL = "https://banglaaiguide.com";

// Top-level dirs that are not user-facing pages
const EXCLUDED_DIRS = new Set([
  ".git",
  "css",
  "js",
  "scripts",
  "node_modules",
]);

// Priority rules — pillar pages and money pages get higher priority
const PRIORITY_RULES = [
  { match: (slug) => slug === "", priority: "1.0", changefreq: "daily" },
  {
    match: (slug) =>
      [
        "bangla-ai-guide",
        "ai-tools-bangladesh-bengali",
        "free-ai-tools-2026-bangladesh",
        "bkash-diye-ai-tools-kena-jay",
        "vpn-chara-ai-tools-bangladesh",
        "ai-tools-bdt-price-2026-bangladesh",
        "chatgpt-bangladesh-theke-bebohar",
      ].includes(slug),
    priority: "0.9",
    changefreq: "weekly",
  },
  {
    match: (slug) => slug.startsWith("blog/"),
    priority: "0.6",
    changefreq: "monthly",
  },
  {
    match: (slug) =>
      ["privacy", "terms", "disclaimer", "contact", "submit", "about"].includes(
        slug,
      ),
    priority: "0.3",
    changefreq: "yearly",
  },
];

const DEFAULT_RULE = { priority: "0.7", changefreq: "weekly" };

// Skip slugs we don't want crawled
const EXCLUDED_SLUGS = new Set([
  "404",
  "tool-detail",
  "tools", // legacy redirect folder
]);

function hasNonAscii(name) {
  return /[^\x00-\x7F]/.test(name);
}

function isHtmlPage(dir) {
  return fs.existsSync(path.join(dir, "index.html"));
}

function collectPages() {
  const pages = [];

  // Homepage
  pages.push("");

  // Root-level dirs
  for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (EXCLUDED_DIRS.has(entry.name)) continue;
    if (EXCLUDED_SLUGS.has(entry.name)) continue;
    if (hasNonAscii(entry.name)) continue; // skip mojibake folders
    if (entry.name.startsWith(".")) continue;
    if (entry.name === "blog") continue; // handled below
    if (isHtmlPage(path.join(ROOT, entry.name))) {
      pages.push(entry.name);
    }
  }

  // Blog posts
  const blogDir = path.join(ROOT, "blog");
  if (fs.existsSync(blogDir)) {
    pages.push("blog");
    for (const entry of fs.readdirSync(blogDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (hasNonAscii(entry.name)) continue;
      if (isHtmlPage(path.join(blogDir, entry.name))) {
        pages.push(`blog/${entry.name}`);
      }
    }
  }

  return pages;
}

function ruleFor(slug) {
  for (const rule of PRIORITY_RULES) {
    if (rule.match(slug)) return rule;
  }
  return DEFAULT_RULE;
}

function lastModFor(slug) {
  const target = slug === "" ? "index.html" : path.join(slug, "index.html");
  try {
    const stat = fs.statSync(path.join(ROOT, target));
    return stat.mtime.toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function buildSitemap(pages) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (const slug of pages.sort()) {
    const rule = ruleFor(slug);
    const loc = slug === "" ? `${SITE_URL}/` : `${SITE_URL}/${slug}/`;
    lines.push("  <url>");
    lines.push(`    <loc>${loc}</loc>`);
    lines.push(`    <lastmod>${lastModFor(slug)}</lastmod>`);
    lines.push(`    <changefreq>${rule.changefreq}</changefreq>`);
    lines.push(`    <priority>${rule.priority}</priority>`);
    lines.push("  </url>");
  }
  lines.push("</urlset>");
  return lines.join("\n") + "\n";
}

const pages = collectPages();
const xml = buildSitemap(pages);
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml, "utf8");
console.log(`Wrote sitemap.xml with ${pages.length} URLs`);

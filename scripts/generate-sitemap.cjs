#!/usr/bin/env node
// Auto-generate sitemap.xml from the filesystem so newly added pages are
// always declared to search engines. Run before each deploy.
//
//   node scripts/generate-sitemap.cjs

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const SITE_URL = "https://banglaaiguide.com";
const SITEMAP_PATH = path.join(ROOT, "sitemap.xml");

// Preserve truthful lastmod dates for unchanged pages. Filesystem mtimes are
// unreliable in CI and fresh clones because checkout makes every file appear
// newly modified. Only paths reported by git as changed receive today's date.
function existingLastMods() {
  const dates = new Map();
  if (!fs.existsSync(SITEMAP_PATH)) return dates;
  const xml = fs.readFileSync(SITEMAP_PATH, "utf8");
  const entry = /<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g;
  for (const match of xml.matchAll(entry)) dates.set(match[1], match[2]);
  return dates;
}

function parseChangedPaths(output) {
  const fields = output.toString("utf8").split("\0");
  const paths = new Set();
  for (let index = 0; index < fields.length; index += 1) {
    const record = fields[index];
    if (!record) continue;
    const status = record.slice(0, 2);
    const currentPath = record.slice(3).replace(/\\/g, "/");
    if (currentPath) paths.add(currentPath);
    // With porcelain -z, rename/copy records store the other path in the
    // following NUL-delimited field. Track both sides for truthful lastmod.
    if (/[RC]/.test(status)) {
      const otherPath = fields[index + 1];
      if (otherPath) paths.add(otherPath.replace(/\\/g, "/"));
      index += 1;
    }
  }
  return paths;
}

function changedPaths() {
  try {
    const output = execFileSync("git", ["status", "--porcelain=v1", "-z", "--untracked-files=all"], {
      cwd: ROOT,
      encoding: "buffer",
    });
    return parseChangedPaths(output);
  } catch {
    return new Set();
  }
}

function gitLastMods() {
  const dates = new Map();
  try {
    const output = execFileSync(
      "git",
      ["log", "--format=@@DATE:%cs", "--name-only", "--no-renames", "--"],
      { cwd: ROOT, encoding: "utf8" },
    );
    let currentDate = null;
    for (const line of output.split(/\r?\n/)) {
      if (line.startsWith("@@DATE:")) {
        currentDate = line.slice(7);
      } else if (currentDate && line) {
        const normalizedPath = line.replace(/\\/g, "/");
        if (!dates.has(normalizedPath)) dates.set(normalizedPath, currentDate);
      }
    }
  } catch {
    // Existing sitemap dates remain the fallback outside a Git checkout.
  }
  return dates;
}

const PREVIOUS_LASTMOD = existingLastMods();
const CHANGED_PATHS = changedPaths();
const GIT_LASTMOD = gitLastMods();

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

  // Comparison subpages (compare/<a-vs-b>/)
  const compareDir = path.join(ROOT, "compare");
  if (fs.existsSync(compareDir)) {
    for (const entry of fs.readdirSync(compareDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (hasNonAscii(entry.name)) continue;
      if (isHtmlPage(path.join(compareDir, entry.name))) {
        pages.push(`compare/${entry.name}`);
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

function todayIso() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Athens",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function lastModFor(slug) {
  const target = slug === "" ? "index.html" : path.join(slug, "index.html");
  const normalizedTarget = target.replace(/\\/g, "/");
  const loc = slug === "" ? `${SITE_URL}/` : `${SITE_URL}/${slug}/`;
  if (CHANGED_PATHS.has(normalizedTarget)) return todayIso();
  return GIT_LASTMOD.get(normalizedTarget) || PREVIOUS_LASTMOD.get(loc) || todayIso();
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

if (require.main === module) {
  const pages = collectPages();
  const xml = buildSitemap(pages);
  fs.writeFileSync(SITEMAP_PATH, xml, "utf8");
  console.log(`Wrote sitemap.xml with ${pages.length} URLs`);
}

module.exports = { parseChangedPaths };

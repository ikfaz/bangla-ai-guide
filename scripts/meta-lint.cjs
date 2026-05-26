#!/usr/bin/env node
// Walk every index.html and patch missing canonical, og:image, og:url,
// twitter:image. Skips redirect stubs.
//
//   node scripts/meta-lint.cjs

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SITE = "https://banglaaiguide.com";
const DEFAULT_IMAGE = `${SITE}/web-app-manifest-512x512.png`;

function hasNonAscii(s) {
  return /[^\x00-\x7F]/.test(s);
}

function isRedirectStub(html) {
  return /http-equiv="refresh"/i.test(html);
}

function walkPages() {
  const pages = [];

  // root index.html
  pages.push({ file: path.join(ROOT, "index.html"), url: `${SITE}/` });

  for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (hasNonAscii(entry.name)) continue;
    if ([".git", ".github", "css", "js", "scripts", "node_modules"].includes(entry.name)) continue;
    if (entry.name === "blog") continue;
    const file = path.join(ROOT, entry.name, "index.html");
    if (fs.existsSync(file)) pages.push({ file, url: `${SITE}/${entry.name}/` });
  }

  const blogDir = path.join(ROOT, "blog");
  if (fs.existsSync(blogDir)) {
    for (const entry of fs.readdirSync(blogDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (hasNonAscii(entry.name)) continue;
      const file = path.join(blogDir, entry.name, "index.html");
      if (fs.existsSync(file))
        pages.push({ file, url: `${SITE}/blog/${entry.name}/` });
    }
  }

  return pages;
}

function ensureTag(html, tagRegex, tagToInsert) {
  if (tagRegex.test(html)) return { html, changed: false };
  // Insert into <head>, just before </head>
  if (!/<\/head>/i.test(html)) return { html, changed: false };
  return {
    html: html.replace(/<\/head>/i, `  ${tagToInsert}\n</head>`),
    changed: true,
  };
}

function patchPage(file, url) {
  let html = fs.readFileSync(file, "utf8");
  if (isRedirectStub(html)) return { changed: false };
  if (!/<head[\s>]/i.test(html)) return { changed: false };

  let changed = false;
  let updated;

  updated = ensureTag(
    html,
    /<link[^>]+rel="canonical"/i,
    `<link rel="canonical" href="${url}">`,
  );
  html = updated.html;
  changed = changed || updated.changed;

  updated = ensureTag(
    html,
    /<meta[^>]+property="og:url"/i,
    `<meta property="og:url" content="${url}">`,
  );
  html = updated.html;
  changed = changed || updated.changed;

  updated = ensureTag(
    html,
    /<meta[^>]+property="og:image"/i,
    `<meta property="og:image" content="${DEFAULT_IMAGE}">`,
  );
  html = updated.html;
  changed = changed || updated.changed;

  updated = ensureTag(
    html,
    /<meta[^>]+name="twitter:image"/i,
    `<meta name="twitter:image" content="${DEFAULT_IMAGE}">`,
  );
  html = updated.html;
  changed = changed || updated.changed;

  updated = ensureTag(
    html,
    /<meta[^>]+name="twitter:card"/i,
    `<meta name="twitter:card" content="summary_large_image">`,
  );
  html = updated.html;
  changed = changed || updated.changed;

  if (changed) fs.writeFileSync(file, html, "utf8");
  return { changed };
}

function run() {
  let touched = 0;
  for (const { file, url } of walkPages()) {
    const { changed } = patchPage(file, url);
    if (changed) touched += 1;
  }
  console.log(`Meta-lint: patched ${touched} pages`);
}

run();

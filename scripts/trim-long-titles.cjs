#!/usr/bin/env node
/*
 * Trim <title> values that exceed 65 chars (SERP truncation threshold).
 * Strategy:
 *   1. If title ends with " | বাংলা AI গাইড" suffix, drop it.
 *   2. If still >65, drop trailing year markers ("২০২৬", "(২০২৬)").
 *   3. If still >65, drop dangling "— …বাংলা গাইড" / "— সম্পূর্ণ গাইড" tail.
 *
 * Propagates the new value to og:title and twitter:title so the trio stays
 * in sync. Leaves H1, JSON-LD headline, RSS feed entries untouched —
 * those are content, not search snippet.
 *
 * Idempotent. Reads both attribute orders.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BLOG = path.join(ROOT, 'blog');
const MAX = 65;
const SUFFIX = ' | বাংলা AI গাইড';

function getTitleVal(html) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (!m) return null;
  return m[1].replace(/\s+/g, ' ').trim();
}

function trimTitle(t) {
  let s = t;
  // Conservative: only drop the site-name suffix " | বাংলা AI গাইড".
  // Keep all descriptive content — over-trimming via em-dash matching loses
  // valuable keywords (e.g. "HeyGen বাংলা গাইড — AI Avatar দিয়ে ভিডিও তৈরির
  // সম্পূর্ণ টিউটোরিয়াল" should NOT collapse to "HeyGen বাংলা গাইড").
  if (s.endsWith(SUFFIX)) {
    s = s.slice(0, -SUFFIX.length).trim();
  }
  return s;
}

function escapeForRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function patchAttr(html, oldVal, newVal, attrTags) {
  let out = html;
  for (const t of attrTags) {
    // match attr value in either order
    const reA = new RegExp(`(<meta\\s+(?:name|property)="${t}"\\s+content=")${escapeForRegex(oldVal)}(")`, 'g');
    const reB = new RegExp(`(<meta\\s+content=")${escapeForRegex(oldVal)}("\\s+(?:name|property)="${t}")`, 'g');
    out = out.replace(reA, `$1${newVal}$2`).replace(reB, `$1${newVal}$2`);
  }
  return out;
}

function run() {
  const dirs = fs.readdirSync(BLOG, { withFileTypes: true })
    .filter(e => e.isDirectory() && !/[^\x00-\x7F]/.test(e.name));
  let patched = 0, skipped = 0;
  for (const e of dirs) {
    const f = path.join(BLOG, e.name, 'index.html');
    if (!fs.existsSync(f)) continue;
    let html = fs.readFileSync(f, 'utf8');
    const title = getTitleVal(html);
    if (!title || title.length <= MAX) { skipped++; continue; }
    const next = trimTitle(title);
    if (next === title) { skipped++; continue; }
    // Replace <title> body
    html = html.replace(/(<title>)[\s\S]*?(<\/title>)/i, `$1${next}$2`);
    // Replace og:title + twitter:title only when they exactly matched the old title
    html = patchAttr(html, title, next, ['og:title', 'twitter:title']);
    fs.writeFileSync(f, html, 'utf8');
    console.log(`${e.name}: ${title.length} -> ${next.length}  |  ${next}`);
    patched++;
  }
  console.log(`Patched: ${patched}, Skipped: ${skipped}`);
}

run();

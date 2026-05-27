#!/usr/bin/env node
/*
 * Trim meta descriptions that exceed 165 chars (SERP truncation threshold).
 * Replaces og:description and twitter:description with the same trimmed value.
 *
 * Idempotent. Reads description from either attribute order
 *   <meta name="description" content="...">
 *   <meta content="..." name="description">
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BLOG = path.join(ROOT, 'blog');
const MAX = 165;

function getDescVal(html) {
  let m = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
  if (m) return m[1];
  m = html.match(/<meta\s+content="([^"]+)"\s+name="description"/i);
  if (m) return m[1];
  return null;
}

function trim(desc) {
  let d = desc.replace(/\s+/g, ' ').trim();
  if (d.length <= MAX) return d;
  let cut = d.slice(0, MAX);
  const lastStop = Math.max(cut.lastIndexOf('।'), cut.lastIndexOf('. '));
  if (lastStop > 100) return d.slice(0, lastStop + 1).trim();
  const lastSpace = cut.lastIndexOf(' ');
  if (lastSpace > 100) return d.slice(0, lastSpace).trim() + '…';
  return cut.trim() + '…';
}

function escapeForRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function run() {
  const dirs = fs.readdirSync(BLOG, { withFileTypes: true })
    .filter(e => e.isDirectory() && !/[^\x00-\x7F]/.test(e.name));
  let patched = 0, skipped = 0;
  for (const e of dirs) {
    const f = path.join(BLOG, e.name, 'index.html');
    if (!fs.existsSync(f)) continue;
    let html = fs.readFileSync(f, 'utf8');
    const desc = getDescVal(html);
    if (!desc || desc.length <= MAX) { skipped++; continue; }
    const next = trim(desc);
    if (next === desc) { skipped++; continue; }
    // Replace globally (also fixes og:description, twitter:description)
    const re = new RegExp(escapeForRegex(desc), 'g');
    const updated = html.replace(re, next);
    fs.writeFileSync(f, updated, 'utf8');
    console.log(`${e.name}: ${desc.length} -> ${next.length}`);
    patched++;
  }
  console.log(`Patched: ${patched}, Skipped: ${skipped}`);
}

run();

#!/usr/bin/env node
// Repair blog JSON-LD blocks that JSON.parse rejects.
// Valid blocks are left byte-for-byte alone so the build stays idempotent.

const fs = require('fs');
const { listBlogArticles, repairJsonText, tryParseJson, countLine } = require('./lib/site-policy.cjs');

const SCRIPT_RE = /<script\b([^>]*\btype=["']application\/ld\+json["'][^>]*)>([\s\S]*?)<\/script>/gi;

function repairHtml(html) {
  let repaired = 0;
  const next = html.replace(SCRIPT_RE, (full, attrs, body) => {
    if (tryParseJson(body) !== undefined) return full;
    const fixed = repairJsonText(body);
    if (tryParseJson(fixed) === undefined) {
      console.error('JSON-LD still invalid after repair');
      return full;
    }
    repaired += 1;
    return `<script${attrs}>${fixed}</script>`;
  });
  return { html: next, repaired };
}

function run() {
  let files = 0;
  let blocks = 0;
  for (const article of listBlogArticles()) {
    const html = fs.readFileSync(article.file, 'utf8');
    const result = repairHtml(html);
    blocks += result.repaired;
    if (result.html !== html) {
      fs.writeFileSync(article.file, result.html);
      files += 1;
    }
  }
  console.log(`JSON-LD repair: ${blocks} blocks in ${files} files`);
  countLine('jsonld_repaired', blocks);
}

run();

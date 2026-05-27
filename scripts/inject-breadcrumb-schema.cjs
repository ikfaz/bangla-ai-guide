#!/usr/bin/env node
/*
 * Inject Schema.org BreadcrumbList JSON-LD on every blog article that
 * doesn't already have one. Format matches the existing breadcrumbs the
 * build pipeline emits, so this is purely fill-in-the-gaps coverage.
 *
 *   Home (/) > Blog (/blog/) > Article (/blog/<slug>/)
 *
 * Idempotent — skips articles that already contain "BreadcrumbList".
 * Inserts between sentinels so a future build can rewrite cleanly.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BLOG = path.join(ROOT, 'blog');
const SITE = 'https://banglaaiguide.com';

function hasNonAscii(s) { return /[^\x00-\x7F]/.test(s); }
function isRedirectStub(h) { return /http-equiv="refresh"/i.test(h); }

function getTitle(html) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (!m) return null;
  return m[1].replace(/\s+/g, ' ').trim();
}

function buildBreadcrumb(slug, title) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'বাংলা AI গাইড', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'ব্লগ', item: `${SITE}/blog/` },
      { '@type': 'ListItem', position: 3, name: title, item: `${SITE}/blog/${slug}/` },
    ],
  };
  return `<!-- BREADCRUMB-SCHEMA:START -->
<script type="application/ld+json" data-injected-by="inject-breadcrumb-schema">${JSON.stringify(json)}</script>
<!-- BREADCRUMB-SCHEMA:END -->`;
}

function inject(html, block) {
  if (/<!-- BREADCRUMB-SCHEMA:START -->/.test(html)) {
    return html.replace(/<!-- BREADCRUMB-SCHEMA:START -->[\s\S]*?<!-- BREADCRUMB-SCHEMA:END -->/, block);
  }
  return html.replace(/<\/head>/i, `  ${block}\n</head>`);
}

function run() {
  const dirs = fs.readdirSync(BLOG, { withFileTypes: true })
    .filter(e => e.isDirectory() && !hasNonAscii(e.name));
  let scanned = 0, alreadyHas = 0, injected = 0, errors = 0;
  for (const e of dirs) {
    const f = path.join(BLOG, e.name, 'index.html');
    if (!fs.existsSync(f)) continue;
    scanned++;
    try {
      const html = fs.readFileSync(f, 'utf8');
      if (isRedirectStub(html)) continue;
      if (/BreadcrumbList/.test(html)) { alreadyHas++; continue; }
      const title = getTitle(html);
      if (!title) continue;
      const block = buildBreadcrumb(e.name, title);
      fs.writeFileSync(f, inject(html, block), 'utf8');
      injected++;
    } catch (err) {
      errors++;
      console.error(`! ${e.name}: ${err.message}`);
    }
  }
  console.log(`Scanned:           ${scanned}`);
  console.log(`Already had it:    ${alreadyHas}`);
  console.log(`Injected:          ${injected}`);
  if (errors) console.log(`Errors:            ${errors}`);
}

run();

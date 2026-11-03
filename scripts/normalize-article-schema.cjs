#!/usr/bin/env node
// Give every blog article one valid Article node:
// Organization author + publisher, cover.png, bn-BD, real dates.
// Headline and other prose fields are left as they are.

const fs = require('fs');
const {
  SITE,
  listBlogArticles,
  isRedirectStub,
  tryParseJson,
  readArticleDates,
  orgAuthor,
  orgPublisher,
  coverImage,
  countLine,
} = require('./lib/site-policy.cjs');

const SCRIPT_RE = /<script\b([^>]*\btype=["']application\/ld\+json["'][^>]*)>([\s\S]*?)<\/script>/gi;

function typesOf(node) {
  if (!node || typeof node !== 'object') return [];
  const raw = node['@type'];
  return Array.isArray(raw) ? raw : raw ? [raw] : [];
}

function isArticleType(node) {
  return typesOf(node).some((t) => t === 'Article' || t === 'BlogPosting' || t === 'NewsArticle');
}

function applyArticle(node, slug, dates) {
  node.author = orgAuthor();
  node.publisher = orgPublisher();
  node.image = coverImage(slug);
  node.inLanguage = 'bn-BD';
  node.datePublished = dates.published;
  node.dateModified = dates.modified;
  if (!node.mainEntityOfPage) {
    node.mainEntityOfPage = `${SITE}/blog/${slug}/`;
  }
  return node;
}

function headlineFrom(html) {
  const title = (html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '';
  return title.replace(/\s+/g, ' ').trim();
}

function freshArticle(html, slug, dates) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: headlineFrom(html),
    author: orgAuthor(),
    publisher: orgPublisher(),
    image: coverImage(slug),
    datePublished: dates.published,
    dateModified: dates.modified,
    inLanguage: 'bn-BD',
    mainEntityOfPage: `${SITE}/blog/${slug}/`,
  };
}

function normalizeHtml(html, slug, file) {
  const dates = readArticleDates(html, file);
  let found = 0;
  const next = html.replace(SCRIPT_RE, (full, attrs, body) => {
    const parsed = tryParseJson(body);
    if (parsed === undefined) return full;
    let touched = false;
    if (isArticleType(parsed)) {
      applyArticle(parsed, slug, dates);
      touched = true;
      found += 1;
    } else if (parsed && Array.isArray(parsed['@graph'])) {
      for (const node of parsed['@graph']) {
        if (isArticleType(node)) {
          applyArticle(node, slug, dates);
          touched = true;
          found += 1;
        }
      }
    }
    if (!touched) return full;
    const encoded = JSON.stringify(parsed);
    if (encoded === body.trim()) return full;
    return `<script${attrs}>${encoded}</script>`;
  });

  if (found > 0) return next;

  const block = `<script type="application/ld+json">${JSON.stringify(freshArticle(html, slug, dates))}</script>`;
  if (!/<\/head>/i.test(next)) return next;
  return next.replace(/<\/head>/i, `  ${block}\n</head>`);
}

function run() {
  let updated = 0;
  let scanned = 0;
  for (const article of listBlogArticles()) {
    const html = fs.readFileSync(article.file, 'utf8');
    if (isRedirectStub(html)) continue;
    scanned += 1;
    const next = normalizeHtml(html, article.slug, article.file);
    if (next !== html) {
      fs.writeFileSync(article.file, next);
      updated += 1;
    }
  }
  console.log(`Article schema: scanned ${scanned}, updated ${updated}`);
  countLine('article_schema_updated', updated);
}

run();

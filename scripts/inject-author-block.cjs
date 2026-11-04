#!/usr/bin/env node
/*
 * Editorial byline for every blog article.
 *
 * The author is always the organization বাংলা AI গাইড. This script must not
 * emit a personal name, a Person entity, or a profile URL. Organization mode
 * is the only mode.
 *
 * Pages that already shipped with data-author-mode="editorial" and no
 * AUTHOR-BLOCK (the magazine layout) keep their own byline. Every other
 * article gets the organization card between AUTHOR-BLOCK sentinels.
 */

const fs = require('fs');
const {
  ORG_NAME,
  ORG_URL,
  listBlogArticles,
  isRedirectStub,
  readArticleDates,
  toBnDate,
  countLine,
} = require('./lib/site-policy.cjs');

function renderAuthorBlock(dates) {
  return `<!-- AUTHOR-BLOCK:START -->
<section class="author-block" itemscope itemtype="https://schema.org/Organization" aria-label="প্রকাশক">
  <style>
    .author-block { max-width: 820px; margin: 24px auto 40px; padding: 18px 22px; display: flex; gap: 16px; align-items: center; background: linear-gradient(135deg, #F0FDF4 0%, #FAFBFC 100%); border: 1px solid #E2E8F0; border-radius: 16px; font-family: 'Hind Siliguri', sans-serif; }
    .author-block .avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #16A34A 0%, #22C55E 100%); display: grid; place-items: center; color: white; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px; flex-shrink: 0; box-shadow: 0 8px 20px rgba(34,197,94,0.25); }
    .author-block .meta { flex: 1; min-width: 0; }
    .author-block .top { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; margin-bottom: 4px; }
    .author-block .name { font-weight: 700; color: #0F172A; font-size: 16px; }
    .author-block .name a { color: inherit; text-decoration: none; }
    .author-block .name a:hover { color: #16A34A; }
    .author-block .role { font-size: 12px; color: #475569; background: rgba(34,197,94,0.1); padding: 2px 10px; border-radius: 9999px; border: 1px solid rgba(34,197,94,0.2); }
    .author-block .bio { font-size: 13.5px; color: #475569; line-height: 1.6; margin: 0; }
    .author-block .dates { font-size: 12px; color: #64748B; margin-top: 6px; }
    .author-block .dates time { font-weight: 600; color: #475569; }
    @media (max-width: 600px) {
      .author-block { padding: 14px 16px; gap: 12px; }
      .author-block .avatar { width: 48px; height: 48px; font-size: 18px; }
      .author-block .name { font-size: 15px; }
      .author-block .bio { font-size: 13px; }
    }
  </style>
  <div class="avatar" aria-hidden="true">বাং</div>
  <div class="meta">
    <div class="top">
      <span class="name" itemprop="name"><a href="${ORG_URL}" itemprop="url">${ORG_NAME}</a></span>
      <span class="role">সম্পাদকীয়</span>
    </div>
    <p class="bio" itemprop="description">${ORG_NAME}ের সম্পাদকীয় দল বাংলাদেশি পাঠকদের জন্য AI টুলস যাচাই করে সাজায়।</p>
    <p class="dates">প্রকাশিত: <time itemprop="datePublished" datetime="${dates.published}">${toBnDate(dates.published)}</time>
      · সর্বশেষ আপডেট: <time itemprop="dateModified" datetime="${dates.modified}">${toBnDate(dates.modified)}</time></p>
  </div>
</section>
<!-- AUTHOR-BLOCK:END -->`;
}

function injectAuthorBlock(html, block) {
  if (/<!-- AUTHOR-BLOCK:START -->/.test(html)) {
    return html.replace(/<!-- AUTHOR-BLOCK:START -->[\s\S]*?<!-- AUTHOR-BLOCK:END -->/, block);
  }
  if (/<h1[\s>][\s\S]*?<\/h1>/i.test(html)) {
    return html.replace(/(<h1[\s>][\s\S]*?<\/h1>)/i, `$1\n        ${block}`);
  }
  return html;
}

function setEditorialMode(html) {
  if (/data-author-mode\s*=/.test(html)) {
    return html.replace(/data-author-mode\s*=\s*["'][^"']*["']/, 'data-author-mode="editorial"');
  }
  return html.replace(/<body\b/, '<body data-author-mode="editorial"');
}

function setMetaAuthor(html) {
  return html.replace(/<meta\b[^>]*\bname=(["'])author\1[^>]*>/i, (tag) => {
    if (!/\bcontent=/.test(tag)) return tag;
    return tag.replace(/\bcontent=(["'])[\s\S]*?\1/, `content="${ORG_NAME}"`);
  });
}

function scrubPersonalAuthor(html) {
  let next = html.replace(/[ \t]*<!-- PERSON-SCHEMA:START -->[\s\S]*?<!-- PERSON-SCHEMA:END -->\s*/g, '');
  next = next.replace(/https?:\/\/github\.com\/ikfaz\/?/gi, ORG_URL);
  next = next.replace(/আমি\s*\(\s*ইকফাজ\s*\)/g, ORG_NAME);
  next = next.replace(/লেখক:\s*ইকফাজ/g, `প্রকাশক: ${ORG_NAME}`);
  next = next.replace(/ইকফাজ/g, ORG_NAME);
  next = next.replace(/Ikfaz/g, ORG_NAME);
  next = next.replace(/ikfaz/gi, ORG_NAME);
  next = next.replace(
    /(<div class="avatar"[^>]*>)ই(<\/div>)/g,
    '$1বাং$2',
  );
  next = next.replace(
    /(<a\b[^>]*\bhref=(["']))(?:https:\/\/banglaaiguide\.com)?\/about\/?\2([^>]*>\s*বাংলা AI গাইড\s*<\/a>)/g,
    `$1${ORG_URL}$2$3`,
  );
  return next;
}

function run() {
  let scanned = 0;
  let updated = 0;
  let switched = 0;
  for (const article of listBlogArticles()) {
    let html = fs.readFileSync(article.file, 'utf8');
    if (isRedirectStub(html)) continue;
    scanned += 1;
    const hadPerson = /"@type"\s*:\s*"Person"/.test(html) || /ইকফাজ|Ikfaz|ikfaz/.test(html);
    const preserveLayout = html.includes('data-author-mode="editorial"')
      && !html.includes('<!-- AUTHOR-BLOCK:START -->');

    let next = scrubPersonalAuthor(html);
    next = setMetaAuthor(next);
    next = setEditorialMode(next);
    if (!preserveLayout) {
      const dates = readArticleDates(next, article.file);
      next = injectAuthorBlock(next, renderAuthorBlock(dates));
    }
    if (next !== html) {
      fs.writeFileSync(article.file, next);
      updated += 1;
      if (hadPerson) switched += 1;
    }
  }
  console.log(`Author block: scanned ${scanned}, updated ${updated}, organization switches ${switched}`);
  countLine('authors_switched', switched);
}

run();

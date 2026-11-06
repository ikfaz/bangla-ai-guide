#!/usr/bin/env node
// Publish the complete blog archive as linked HTML; the browser only filters it.
const fs = require('node:fs');
const path = require('node:path');
const { listBlogArticles, isRedirectStub, REDIRECT_BLOG_SLUGS, toBnDate } = require('./lib/site-policy.cjs');
const { blogArt } = require('./lib/blog-art.cjs');
const ROOT = path.resolve(__dirname, '..');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const plain = s => String(s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g,"'").trim();
const articles = [];
for (const {file, slug} of listBlogArticles()) {
  const html = fs.readFileSync(file,'utf8');
  if (isRedirectStub(html) || REDIRECT_BLOG_SLUGS.has(slug)) continue;
  const title = plain(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || html.match(/<title>(.*?)<\/title>/i)?.[1]);
  if (!title) continue;
  const description = plain(html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i)?.[1]);
  const date = html.match(/"datePublished"\s*:\s*"(\d{4}-\d\d-\d\d)/)?.[1] || '';
  const category = plain(html.match(/<span class="article-chip">([^<]+)</)?.[1]) || 'গাইড';
  articles.push({slug, title, description, date, category, art: blogArt(slug,title)});
}
articles.sort((a,b) => b.date.localeCompare(a.date) || (a.slug < b.slug ? -1 : 1));
if (!articles.length) throw new Error('Cannot render an empty archive');
const link = a => '/blog/' + a.slug + '/';
const image = (a, mode) => '<img src="' + esc(a.art.src) + '" alt="' + esc(a.art.alt) + '" width="' + (a.art.width || 1200) + '" height="' + (a.art.height || 630) + '" decoding="async" ' + (mode === 'lead' ? 'fetchpriority="high"' : 'loading="lazy"') + '>';
const num = n => n.toLocaleString('bn-BD');

function card(a) {
  return '<article class="blog-card" data-category="' + esc(a.category) + '"><a class="library-card-link" href="' + link(a) + '">' +
    '<div class="library-card-image">' + image(a) + '</div><div class="library-card-copy"><span class="library-category">' + esc(a.category) + '</span>' +
    '<h3>' + esc(a.title) + '</h3><p>' + esc(a.description) + '</p><div class="library-card-foot"><time datetime="' + esc(a.date) + '">' + esc(toBnDate(a.date)) + '</time><span>পড়ুন ↗</span></div></div></a></article>';
}
const lead = articles[0];
const cats = [...new Set(articles.map(a=>a.category))];
const library = `<main class="guide-library" id="main-content">
  <div class="library-mast">
    <div class="library-intro">
      <span class="library-label"><span aria-hidden="true">✳</span> বাংলা AI গাইডের পাঠাগার</span>
      <h1>বাংলায় শিখুন,<br><em>কাজে লাগান।</em></h1>
      <p>ছবি তৈরি, পড়াশোনা, লেখালেখি কিংবা কাজের গতি বাড়ানো—আপনার দরকারি AI গাইডটি খুঁজে নিন।</p>
      <a class="library-browse" href="#archive">সব গাইড দেখুন <span aria-hidden="true">↓</span></a>
    </div>
    <a class="library-feature" href="${link(lead)}">
      <div class="library-feature-art">${image(lead,'lead')}</div>
      <div class="library-feature-copy"><span class="library-label">সাম্প্রতিক গাইড</span><h2>${esc(lead.title)}</h2><span class="library-read">গাইড পড়ুন ↗</span></div>
    </a>
  </div>
  <section id="archive" class="library-archive" aria-labelledby="archive-heading">
    <div class="library-archive-head"><div><span class="library-label">বিষয় অনুযায়ী পড়ুন</span><h2 id="archive-heading">সব গাইড</h2></div><span class="library-total">${num(articles.length)}টি গাইড</span></div>
    <div class="library-controls" hidden>
      <label class="library-search"><span aria-hidden="true">⌕</span><span class="sr-only">গাইড খুঁজুন</span><input type="search" id="blogSearch" placeholder="গাইড খুঁজুন…"></label>
      <div class="library-filters" id="blogFilters" role="group" aria-label="বিষয় বাছাই"><button type="button" data-category="" aria-pressed="true">সব</button>${cats.map(c=>'<button type="button" data-category="'+esc(c)+'" aria-pressed="false">'+esc(c)+'</button>').join('')}</div>
    </div>
    <p class="library-count" role="status" id="blogCount"></p>
    <div class="blog-grid" id="blogGrid">
${articles.map(card).join('\n')}
    </div>
    <div class="library-empty" id="blogEmpty" hidden><p>অন্য কোনো শব্দ বা বিষয় দিয়ে আবার চেষ্টা করুন।</p><button type="button" id="blogReset">সব গাইড দেখুন</button></div>
    <button class="library-more" id="blogMore" type="button" hidden>আরও গাইড দেখুন ↓</button>
  </section>
</main>`;
function update(name, fn) {
  const file = path.join(ROOT,name);
  const source = fs.readFileSync(file,'utf8');
  const next = fn(source);
  if (source !== next) fs.writeFileSync(file,next,'utf8');
}
update('blog/index.html', html => {
  if (!/<main\b[\s\S]*?<\/main>/i.test(html)) throw new Error('Missing blog main element');
  return html.replace(/<main\b[\s\S]*?<\/main>/i, () => library);
});
console.log('Blog archive: ' + articles.length + ' illustrated guides');

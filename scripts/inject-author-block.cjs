#!/usr/bin/env node
/*
 * Inject author byline block + Person JSON-LD into every blog post.
 *
 * E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
 * is a Google ranking signal — clear author attribution + bio + dates
 * boost trust scoring.
 *
 * Per post we:
 *   1. Inject a styled author block (avatar + name + role + bio + dates)
 *      right after the article's <h1>, inside the .container.
 *   2. Inject a Person JSON-LD schema in <head>.
 *   3. Patch the existing Article JSON-LD author field from
 *      {"@type":"Organization","name":"BanglaAIGuide"} to a richer
 *      {"@type":"Person","name":"ইকফাজ","url":...} reference.
 *
 * Everything between sentinels: <!-- AUTHOR-BLOCK:START/END -->
 * Idempotent — re-running replaces the block.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BLOG = path.join(ROOT, 'blog');
const SITE = 'https://banglaaiguide.com';

// ---------- author info ----------
const AUTHOR = {
  name: 'ইকফাজ',
  nameEn: 'Ikfaz',
  role: 'প্রতিষ্ঠাতা ও সম্পাদক',
  roleEn: 'Founder & Editor',
  url: `${SITE}/about/`,
  bio: 'বাংলা AI গাইডের প্রতিষ্ঠাতা। বাংলাদেশি ব্যবহারকারীদের জন্য AI টুলস কিউরেট ও বিশ্লেষণ করেন — কোনটা BD থেকে কাজ করে, কোনটায় bKash চলে, কোনটা আসলে দৈনন্দিন কাজে লাগে।',
  social: 'https://github.com/ikfaz',
};

function hasNonAscii(s) { return /[^\x00-\x7F]/.test(s); }
function isRedirectStub(html) { return /http-equiv="refresh"/i.test(html); }

function extractPublishDate(html) {
  // Try Article JSON-LD datePublished
  const m = html.match(/"datePublished"\s*:\s*"([^"]+)"/);
  if (m) return m[1];
  return '2026-01-01';
}

function toBnDate(iso) {
  // Convert "2026-05-26" → "২৬ মে, ২০২৬"
  const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  const yr = m[1], mo = parseInt(m[2], 10) - 1, day = parseInt(m[3], 10);
  const bnDigits = (n) => String(n).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[+d]);
  return `${bnDigits(day)} ${months[mo] || ''}, ${bnDigits(yr)}`;
}

// ---------- block rendering ----------
function renderAuthorBlock(publishedIso) {
  const bnDate = toBnDate(publishedIso);
  return `<!-- AUTHOR-BLOCK:START -->
<section class="author-block" itemscope itemtype="https://schema.org/Person" aria-label="লেখক সম্পর্কে">
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
  <div class="avatar" aria-hidden="true">ই</div>
  <div class="meta">
    <div class="top">
      <span class="name" itemprop="name"><a href="${AUTHOR.url}" itemprop="url">${AUTHOR.name}</a></span>
      <span class="role" itemprop="jobTitle">${AUTHOR.role}</span>
    </div>
    <p class="bio" itemprop="description">${AUTHOR.bio}</p>
    <p class="dates">প্রকাশিত: <time itemprop="datePublished" datetime="${publishedIso}">${bnDate}</time></p>
  </div>
</section>
<!-- AUTHOR-BLOCK:END -->`;
}

function renderPersonSchema() {
  return `<!-- PERSON-SCHEMA:START -->
<script type="application/ld+json" data-injected-by="inject-author-block">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR.name,
    alternateName: AUTHOR.nameEn,
    jobTitle: AUTHOR.role,
    url: AUTHOR.url,
    sameAs: [AUTHOR.social],
    worksFor: {
      '@type': 'Organization',
      name: 'বাংলা AI গাইড',
      url: SITE,
    },
    knowsAbout: ['Artificial Intelligence', 'AI Tools', 'Bangladesh Tech', 'বাংলা AI'],
    description: AUTHOR.bio,
  })}</script>
<!-- PERSON-SCHEMA:END -->`;
}

// Patch the existing Article author block
function patchArticleAuthor(html) {
  // Replace any author with "BanglaAIGuide" or "Organization" with Person ref
  return html.replace(
    /"author"\s*:\s*\{[^}]*"name"\s*:\s*"(?:BanglaAIGuide|বাংলা AI গাইড|Bangla AI Guide)"[^}]*\}/g,
    `"author":{"@type":"Person","name":"${AUTHOR.name}","url":"${AUTHOR.url}"}`
  );
}

// ---------- injection ----------
function injectAuthorBlock(html, block) {
  if (/<!-- AUTHOR-BLOCK:START -->/.test(html)) {
    return html.replace(/<!-- AUTHOR-BLOCK:START -->[\s\S]*?<!-- AUTHOR-BLOCK:END -->/, block);
  }
  // Insert right after </h1> inside the article container
  // The blog posts have <h1>...</h1> as the first heading inside the container
  if (/<h1[\s>][\s\S]*?<\/h1>/i.test(html)) {
    return html.replace(/(<h1[\s>][\s\S]*?<\/h1>)/i, `$1\n        ${block}`);
  }
  return html;
}

function injectPersonSchema(html, schema) {
  if (/<!-- PERSON-SCHEMA:START -->/.test(html)) {
    return html.replace(/<!-- PERSON-SCHEMA:START -->[\s\S]*?<!-- PERSON-SCHEMA:END -->/, schema);
  }
  return html.replace(/<\/head>/i, `  ${schema}\n</head>`);
}

// ---------- main ----------
function run() {
  if (!fs.existsSync(BLOG)) { console.error('blog/ not found'); process.exit(1); }
  let scanned = 0, updated = 0;
  const personSchema = renderPersonSchema();

  for (const entry of fs.readdirSync(BLOG, { withFileTypes: true })) {
    if (!entry.isDirectory() || hasNonAscii(entry.name)) continue;
    const file = path.join(BLOG, entry.name, 'index.html');
    if (!fs.existsSync(file)) continue;
    let html = fs.readFileSync(file, 'utf8');
    if (isRedirectStub(html)) continue;
    scanned++;
    const date = extractPublishDate(html);
    const block = renderAuthorBlock(date);

    let next = html;
    next = patchArticleAuthor(next);
    next = injectAuthorBlock(next, block);
    next = injectPersonSchema(next, personSchema);

    if (next !== html) {
      fs.writeFileSync(file, next, 'utf8');
      updated++;
    }
  }

  console.log(`Author block: scanned ${scanned} articles, updated ${updated}`);
}

run();

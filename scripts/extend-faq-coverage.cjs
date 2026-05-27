#!/usr/bin/env node
/*
 * Extend FAQ schema coverage to articles that the auto-detector
 * (inject-faq-schema.cjs) couldn't find Q&A in. For each such article
 * we derive 4 genuine, on-topic FAQs from its own H2/H3 structure +
 * the first paragraph of each section, then inject BOTH a visible
 * <section class="article-faq">…</section> block AND matching
 * FAQPage JSON-LD schema.
 *
 * Why visible HTML + schema together:
 *   Google's FAQ Rich Result policy requires the Q&A to be visible on
 *   the page. Schema without visible content can earn a manual action.
 *
 * Idempotent. Skips articles that already have:
 *   - <!-- FAQ-SCHEMA:START --> sentinel  (from inject-faq-schema.cjs)
 *   - <!-- TEMPLATED-FAQ:START --> sentinel (from this script)
 *
 * Strategy per article:
 *   1. Read article title (topic) and lede paragraph.
 *   2. Collect (h2, first-paragraph) pairs from article body.
 *   3. Convert each h2 into a Bangla question form using a small set
 *      of paraphrasers; answer = stripped + truncated section content.
 *   4. Pick top-4 by answer length, dedupe similar questions.
 *   5. Render HTML accordion + JSONLD between sentinels.
 *
 *   node scripts/extend-faq-coverage.cjs [--dry]
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BLOG = path.join(ROOT, 'blog');
const DRY = process.argv.includes('--dry');
const REWRITE = process.argv.includes('--rewrite');     // tear down existing TEMPLATED-FAQ + redo

const hasNonAscii = s => /[^\x00-\x7F]/.test(s);
const isRedirectStub = h => /http-equiv="refresh"/i.test(h);

function stripHtml(s) {
  return String(s || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTitle(html) {
  const m = html.match(/<title>([^<]+)<\/title>/i);
  if (!m) return '';
  // Strip "| বাংলা AI গাইড" suffix if present
  return m[1].replace(/\s*\|\s*বাংলা AI গাইড.*$/i, '').replace(/\s*-\s*BanglaAIGuide.*$/i, '').trim();
}

// Pull the topic phrase from a title — drop trailing "বাংলা গাইড", "tutorial",
// em-dashed suffixes, years, parenthetical, etc. Iterated cleanup so multi-
// suffix titles ("Foo বাংলা গাইড — bar (২০২৬)") collapse to "Foo".
function extractTopic(title) {
  let t = title;
  for (let i = 0; i < 4; i++) {
    const before = t;
    t = t.replace(/\s*\(.*?\)\s*$/, '');                              // trailing parens
    // Em-dash / en-dash only (NOT hyphen — would break "Real-World" etc).
    t = t.replace(/\s+[—–]\s+.*$/, '');
    t = t.replace(/\s*(২০২৬|২০২৫|২০২৪|2026|2025|2024)\s*$/i, '');       // year
    t = t.replace(/\s*(সম্পূর্ণ|বিস্তারিত|complete|detailed)\s*$/i, '');
    t = t.replace(/\s*(বাংলা)\s*$/i, '');
    t = t.replace(/\s*(গাইড|টিউটোরিয়াল|guide|tutorial|comparison|review|নির্দেশিকা)\s*$/i, '');
    t = t.replace(/\s*এর\s*$/i, '');
    t = t.trim();
    if (t === before) break;
  }
  return t || title;
}

// Extract (h2text, sectionHtml) pairs from article body, scoped to the
// content area (between <h1> and the related-posts / pillar-links).
function extractSections(html) {
  const h1m = html.match(/<h1[\s>]/i);
  if (!h1m) return [];
  const start = h1m.index;
  const endMarkers = [
    '<!-- RELATED-POSTS:START -->',
    '<!-- PILLAR-LINKS:START -->',
    '<!-- TEMPLATED-FAQ:START -->',
    'class="related-posts"',
    'seo-newsletter-block',
    'প্রাসঙ্গিক টুলস',
  ];
  let end = html.length;
  for (const m of endMarkers) {
    const i = html.indexOf(m, start);
    if (i > -1 && i < end) end = i;
  }
  const body = html.slice(start, end);

  const sections = [];
  const re = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  const heads = [];
  let m;
  while ((m = re.exec(body)) !== null) {
    heads.push({ idx: m.index, end: m.index + m[0].length, text: stripHtml(m[1]) });
  }
  for (let i = 0; i < heads.length; i++) {
    const cur = heads[i];
    const nxt = heads[i + 1];
    const sectionHtml = body.slice(cur.end, nxt ? nxt.idx : body.length);
    const sectionText = stripHtml(sectionHtml);
    sections.push({ heading: cur.text, text: sectionText, html: sectionHtml });
  }
  return sections;
}

// Clean a heading: drop em-dash suffix, drop "Task N:" / "Step N:" / leading
// numbering, collapse whitespace. Returns a tidy phrase suitable to embed in
// a question.
function cleanHeading(h) {
  let s = String(h || '').trim();
  // Drop em-dash / en-dash suffix only — NOT hyphen (so "real-world" stays intact)
  s = s.replace(/\s*[—–]\s*.*$/, '');
  s = s.replace(/^(?:Task|Step|ধাপ|পদ্ধতি)\s*[০-৯0-9]+\s*[:.।)]?\s*/i, ''); // strip numbering label
  s = s.replace(/^[০-৯0-9]+\s*[.)।]\s*/, '');             // bare "1. " / "১. "
  s = s.replace(/\s*\(.*?\)\s*$/, '');                   // trailing parens
  return s.trim();
}

// Convert a declarative h2 into a Bangla interrogative form.
// Returns null if heading isn't suitable (too short, navigation, etc.).
function headingToQuestion(headingRaw, topic) {
  if (!headingRaw) return null;
  const h = cleanHeading(headingRaw);
  if (h.length < 3 || h.length > 100) return null;
  // skip navigational / conclusion / generic headings
  if (/^(উপসংহার|conclusion|ভূমিকা|introduction|references?|সচরাচর|প্রায়শই|faq|আরও পড়ুন|প্রাসঙ্গিক|overall|test setup|methodology)/i.test(h)) return null;
  // Already a question?
  if (/[?？]$/.test(h)) return h;

  // Pattern rewrites — lightweight, BD-natural
  if (/^দাম|pricing|price|খরচ|cost/i.test(h))
    return `${topic}-এর দাম কত এবং BD-তে এর ROI কেমন?`;
  if (/বাংলা.*কেমন|বাংলা.*quality|bangla.*quality|বাংলায়/i.test(h))
    return `${topic} বাংলায় কেমন কাজ করে?`;
  if (/^install|installation|setup|সেটআপ|ইনস্টল/i.test(h))
    return `${topic} কীভাবে install বা setup করব?`;
  if (/access|বাংলাদেশ.*থেকে|bd.*থেকে|থেকে.*access/i.test(h))
    return `বাংলাদেশ থেকে ${topic} কীভাবে access করব?`;
  if (/^কখন/i.test(h)) return `${h.replace(/[?？]+$/, '')}?`;
  if (/use case|application|কাজে|workflow/i.test(h) && h.length < 70)
    return `${topic} কোন কাজে সবচেয়ে ভালো?`;
  if (/vs\s|বনাম|comparison|তুলনা/i.test(h) && h.length < 70)
    return `${h} — কোনটা বেছে নেব?`;
  if (/^টিপস|^tips|^tricks/i.test(h))
    return `${topic} থেকে সর্বোচ্চ পেতে কী কী টিপস আছে?`;
  if (/feature|ফিচার|বৈশিষ্ট্য|capability|capabilities/i.test(h))
    return `${topic}-এর মূল features কী কী?`;
  if (/limit|সীমা|সমস্যা|problem|issue/i.test(h))
    return `${topic}-এর কী কী সীমাবদ্ধতা আছে?`;
  if (/alternative|বিকল্প|বদলে/i.test(h))
    return `${topic}-এর সেরা alternative কোনগুলো?`;
  if (/overkill|when.*not|কখন.*না/i.test(h))
    return `${topic} কখন না বেছে নেওয়াই ভালো?`;
  if (/^verdict|final/i.test(h))
    return `${topic}-এর জন্য final verdict কী?`;
  if (/^কী|^what|^কেন|^why|^কীভাবে|^how/i.test(h))
    return /[?？]$/.test(h) ? h : `${h}?`;
  if (/score|benchmark|performance|speed/i.test(h))
    return `${topic}-এর performance কেমন?`;
  if (/method|methodology|test setup/i.test(h)) return null;
  if (/privacy|security|নিরাপত্তা/i.test(h))
    return `${topic} ব্যবহারে privacy/security নিয়ে কী জানা দরকার?`;
  if (/example|উদাহরণ/i.test(h))
    return `${topic}-এর কিছু practical উদাহরণ কী?`;

  // Generic fallback — keep heading lean
  return `${h} — কী জানা দরকার?`;
}

function pickTopAnswers(sections, topic) {
  const pairs = [];
  for (const s of sections) {
    const q = headingToQuestion(s.heading, topic);
    if (!q) continue;
    let a = s.text;
    if (a.length < 80) continue;       // need substantive answer
    if (a.length > 700) a = a.slice(0, 700).replace(/\s+\S*$/, '') + '…';
    pairs.push({ q, a });
  }
  // Dedupe near-duplicate questions
  const seen = new Set();
  const unique = [];
  for (const p of pairs) {
    const key = p.q.replace(/\s+/g, '').toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(p);
  }
  // Take longest answers first (richer = better)
  unique.sort((a, b) => b.a.length - a.a.length);
  return unique.slice(0, 4);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderFaqHtml(pairs) {
  const items = pairs.map((p, i) => `
    <details class="faq-item"${i === 0 ? ' open' : ''}>
      <summary class="faq-q">${escapeHtml(p.q)}</summary>
      <div class="faq-a"><p>${escapeHtml(p.a)}</p></div>
    </details>`).join('');
  return `<!-- TEMPLATED-FAQ:START -->
<section class="article-faq" aria-labelledby="faq-heading">
  <style>
    .article-faq { max-width: 880px; margin: 56px auto 16px; padding: 0 20px; font-family: 'Hind Siliguri', sans-serif; }
    .article-faq h2 { font-family: 'Syne', 'Hind Siliguri', sans-serif; font-size: 28px; font-weight: 800; letter-spacing: -0.02em; color: #0F172A; margin: 0 0 18px; }
    .article-faq .faq-item { border: 1px solid #E2E8F0; border-radius: 14px; padding: 14px 18px; margin-bottom: 12px; background: #FFFFFF; }
    .article-faq .faq-item[open] { border-color: #16A34A; box-shadow: 0 8px 24px rgba(15,23,42,.06); }
    .article-faq .faq-q { font-weight: 700; font-size: 16px; line-height: 1.5; color: #0F172A; cursor: pointer; list-style: none; }
    .article-faq .faq-q::-webkit-details-marker { display: none; }
    .article-faq .faq-q::after { content: '+'; float: right; color: #16A34A; font-size: 22px; line-height: 1; transition: transform .2s; }
    .article-faq .faq-item[open] .faq-q::after { content: '−'; }
    .article-faq .faq-a { margin-top: 10px; color: #334155; font-size: 15px; line-height: 1.7; }
    .article-faq .faq-a p { margin: 0; }
  </style>
  <h2 id="faq-heading">সচরাচর জিজ্ঞাসা (FAQ)</h2>${items}
</section>
<!-- TEMPLATED-FAQ:END -->`;
}

function renderFaqJsonLd(pairs) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pairs.map(p => ({
      '@type': 'Question',
      name: p.q,
      acceptedAnswer: { '@type': 'Answer', text: p.a },
    })),
  };
  return `<script type="application/ld+json" data-injected-by="extend-faq-coverage">${JSON.stringify(json)}</script>`;
}

function injectVisible(html, blockHtml) {
  // Insert just before the first internal-links / pillar / related sentinel
  // OR if none, just before </main> / </article> / </body>
  const anchors = [
    '<!-- RELATED-POSTS:START -->',
    '<!-- PILLAR-LINKS:START -->',
    '<section class="seo-newsletter-block"',
  ];
  for (const a of anchors) {
    const i = html.indexOf(a);
    if (i > -1) return html.slice(0, i) + blockHtml + '\n\n' + html.slice(i);
  }
  if (/<\/main>/i.test(html)) return html.replace(/<\/main>/i, `${blockHtml}\n</main>`);
  if (/<\/article>/i.test(html)) return html.replace(/<\/article>/i, `${blockHtml}\n</article>`);
  return html.replace(/<\/body>/i, `${blockHtml}\n</body>`);
}

function injectSchema(html, schema) {
  return html.replace(/<\/head>/i, `  ${schema}\n</head>`);
}

function run() {
  if (!fs.existsSync(BLOG)) { console.error('blog/ not found'); process.exit(1); }
  const dirs = fs.readdirSync(BLOG, { withFileTypes: true })
    .filter(e => e.isDirectory() && !hasNonAscii(e.name));
  let scanned = 0, skippedExisting = 0, skippedShort = 0, injected = 0, errors = 0;
  const injectedSlugs = [];
  const failedSlugs = [];

  for (const e of dirs) {
    const f = path.join(BLOG, e.name, 'index.html');
    if (!fs.existsSync(f)) continue;
    scanned++;
    try {
      let html = fs.readFileSync(f, 'utf8');
      if (isRedirectStub(html)) continue;
      if (REWRITE) {
        // Strip existing TEMPLATED-FAQ HTML block AND the matching JSON-LD
        html = html.replace(/<!-- TEMPLATED-FAQ:START -->[\s\S]*?<!-- TEMPLATED-FAQ:END -->\s*/g, '');
        html = html.replace(/<script[^>]*data-injected-by="extend-faq-coverage"[^>]*>[\s\S]*?<\/script>\s*/g, '');
      } else {
        // Skip only if FAQPage schema is genuinely present (sentinel alone may
        // wrap a HowTo with no FAQ — we still want to add a FAQ in that case).
        if (/<!-- TEMPLATED-FAQ:START -->/.test(html) || /"@type"\s*:\s*"FAQPage"/.test(html)) {
          skippedExisting++;
          continue;
        }
      }
      const title = extractTitle(html);
      const topic = extractTopic(title);
      const sections = extractSections(html);
      const pairs = pickTopAnswers(sections, topic);
      if (pairs.length < 3) { skippedShort++; failedSlugs.push(e.name + ` (${pairs.length} pairs)`); continue; }
      const blockHtml = renderFaqHtml(pairs);
      const schemaJsonLd = renderFaqJsonLd(pairs);
      let next = injectVisible(html, blockHtml);
      next = injectSchema(next, schemaJsonLd);
      if (!DRY) fs.writeFileSync(f, next, 'utf8');
      injected++;
      injectedSlugs.push(e.name);
    } catch (err) {
      errors++;
      console.error(`! ${e.name}: ${err.message}`);
    }
  }
  console.log(`Scanned:          ${scanned}`);
  console.log(`Already had FAQ:  ${skippedExisting}`);
  console.log(`Too few Q/A:      ${skippedShort}`);
  console.log(`Injected:         ${injected}${DRY ? ' (dry-run)' : ''}`);
  if (errors) console.log(`Errors:           ${errors}`);
  if (failedSlugs.length && failedSlugs.length <= 50) {
    console.log('\nArticles still without FAQ (need manual look):');
    failedSlugs.forEach(s => console.log(' ', s));
  }
}

run();

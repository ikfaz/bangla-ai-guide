#!/usr/bin/env node
/*
 * Auto-detect FAQ-style content in blog posts and inject FAQPage + HowTo
 * JSON-LD schema so Google renders rich snippets (accordion, step list)
 * in search results. Huge CTR boost — proven 20-50% lift.
 *
 * Detection rules:
 *
 *   FAQ (FAQPage schema):
 *     - <h2> or <h3> ending in '?' (Bangla '?' or '？')
 *     - Followed by 1+ <p> elements before next heading
 *     → bundle each Q/A pair
 *     - Need >= 3 question/answer pairs to inject
 *
 *   HowTo (HowTo schema):
 *     - Numbered <h2> / <h3> (e.g. "১.", "২.", "Step 1", etc.)
 *     - At least 4 sequential steps
 *     - title looks like a how-to ("কীভাবে", "how to", "guide" etc)
 *     → emit HowTo with named steps
 *
 * Injects between sentinels:
 *   <!-- FAQ-SCHEMA:START --> ... <!-- FAQ-SCHEMA:END -->
 *
 * Idempotent. Skips redirect stubs + mojibake folders.
 */

const fs = require('fs');
const {
  BLOG,
  listBlogArticles,
  isRedirectStub,
  tryParseJson,
  isNewsletterQuestion,
  questionCore,
  visibleText,
  countLine,
} = require('./lib/site-policy.cjs');

function extractTag(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = html.match(re);
  return m ? m[1] : null;
}

// Strip HTML tags from a chunk and normalize whitespace
function stripHtml(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// Extract sequential heading/body blocks from article body
function extractBlocks(html) {
  // Find article body — between first <h1> and the "প্রাসঙ্গিক টুলস" section,
  // newsletter, or RELATED-POSTS / PILLAR-LINKS sentinels.
  const startMatch = html.match(/<h1[\s>]/i);
  if (!startMatch) return [];
  const startIdx = startMatch.index;
  const endMarkers = [
    '<!-- RELATED-POSTS:START -->',
    '<!-- PILLAR-LINKS:START -->',
    'class="related-posts"',
  ];
  let endIdx = html.length;
  for (const m of endMarkers) {
    const i = html.indexOf(m, startIdx);
    if (i > -1 && i < endIdx) endIdx = i;
  }
  // Stop at the related-tools heading itself. A table-of-contents link can
  // repeat the same words earlier; that link must not truncate the article.
  const headingStop = /<h[23]\b[^>]*>[^<]{0,80}প্রাসঙ্গিক টুলস/i.exec(html.slice(startIdx));
  if (headingStop && startIdx + headingStop.index < endIdx) endIdx = startIdx + headingStop.index;
  let body = html.slice(startIdx, endIdx);
  body = body.replace(/<(section|div|aside)\b[^>]*class=(["'])[^"']*newsletter[^"']*\2[^>]*>[\s\S]*?<\/\1>/gi, '');

  // Find all h2/h3 and capture the content until the next heading
  const blocks = [];
  const headingRe = /<(h[23])([^>]*)>([\s\S]*?)<\/\1>/gi;
  const matches = [];
  let m;
  while ((m = headingRe.exec(body)) !== null) {
    matches.push({ idx: m.index, end: m.index + m[0].length, tag: m[1].toLowerCase(), text: stripHtml(m[3]) });
  }
  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const nxt = matches[i + 1];
    const content = body.slice(cur.end, nxt ? nxt.idx : Math.min(body.length, cur.end + 5000));
    blocks.push({ tag: cur.tag, heading: cur.text, content });
  }
  return blocks;
}

// Is this heading a question? (ends with ? or ？ or starts with কী/কেন/কীভাবে/how etc)
function isQuestion(text) {
  if (!text) return false;
  const t = text.trim();
  if (isNewsletterQuestion(t)) return false;
  if (/[?？]$/.test(t)) return true;
  // Heuristic Bangla/English question starters
  if (/^(কী|কে|কেন|কীভাবে|কোন|কোথায়|কখন|কত|কাকে|কাদের)\b/.test(t)) {
    // require some interrogative force — must be < 100 chars and not pure label
    return t.length < 120;
  }
  if (/^(how|what|why|when|where|which|who|can|does|is|are|do)\b/i.test(t) && t.length < 120) return true;
  return false;
}

// Numbered step? "১." "1." "Step 1" "ধাপ ১"
function stepNumber(text) {
  if (!text) return null;
  const t = text.trim();
  const m = t.match(/^(?:Step\s*|ধাপ\s*|পদ্ধতি\s*|#\s*)?([০১২৩৪৫৬৭৮৯0-9]+)[.\)।]?\s+(.+)/i);
  if (!m) return null;
  // Convert Bangla digits to ASCII for ordering
  const bn = '০১২৩৪৫৬৭৮৯', en = '0123456789';
  let nStr = m[1];
  for (let i = 0; i < bn.length; i++) nStr = nStr.split(bn[i]).join(en[i]);
  const n = parseInt(nStr, 10);
  if (isNaN(n)) return null;
  return { n, label: m[2] };
}

function extractFaq(blocks) {
  const faqs = [];
  for (const b of blocks) {
    if (!isQuestion(b.heading)) continue;
    const answer = stripHtml(b.content);
    if (answer.length < 40) continue;
    faqs.push({ q: b.heading.replace(/[?？]+$/, '').trim() + '?', a: answer.slice(0, 1200) });
  }
  return faqs;
}

function extractHowToSteps(blocks, title) {
  const steps = [];
  for (const b of blocks) {
    const sn = stepNumber(b.heading);
    if (sn) steps.push({ ...sn, body: stripHtml(b.content).slice(0, 600) });
  }
  // Need at least 4 sequential steps starting at 1 or 2
  if (steps.length < 4) return null;
  steps.sort((a, b) => a.n - b.n);
  if (steps[0].n > 2) return null;
  // Title hint
  const isHowTo = /কীভাবে|kivabe|how to|guide|tutorial|গাইড|টিউটোরিয়াল|সম্পূর্ণ/i.test(title || '');
  if (!isHowTo) return null;
  return steps;
}

function jsonLdBlock(name, json) {
  return `<script type="application/ld+json" data-injected-by="inject-faq-schema">${JSON.stringify(json)}</script>`;
}

function buildBlock(faqs, steps, title, slug) {
  const url = `https://banglaaiguide.com/blog/${slug}/`;
  const parts = [];
  if (faqs.length) {
    parts.push(jsonLdBlock('FAQPage', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    }));
  }
  if (steps && steps.length >= 4) {
    parts.push(jsonLdBlock('HowTo', {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: stripHtml(title || '').slice(0, 110),
      step: steps.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.label.slice(0, 110),
        text: s.body || s.label,
        url: `${url}#step-${i + 1}`,
      })),
    }));
  }
  if (!parts.length) return null;
  return `<!-- FAQ-SCHEMA:START -->\n${parts.join('\n')}\n<!-- FAQ-SCHEMA:END -->`;
}

function injectBlock(html, block) {
  if (/<!-- FAQ-SCHEMA:START -->/.test(html)) {
    return html.replace(/<!-- FAQ-SCHEMA:START -->[\s\S]*?<!-- FAQ-SCHEMA:END -->/, block);
  }
  // Insert just before </head>
  return html.replace(/<\/head>/i, `  ${block}\n</head>`);
}

function eachJsonLd(html, fn) {
  const re = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = re.exec(html)) !== null) fn(match[1]);
}

function collectExistingFaqs(html) {
  const faqs = [];
  eachJsonLd(html, (body) => {
    const parsed = tryParseJson(body);
    const visit = (node) => {
      if (!node || typeof node !== 'object') return;
      if (Array.isArray(node)) { node.forEach(visit); return; }
      if (node['@type'] === 'FAQPage' && Array.isArray(node.mainEntity)) {
        for (const item of node.mainEntity) {
          const name = item && item.name ? String(item.name).trim() : '';
          const text = item && item.acceptedAnswer && item.acceptedAnswer.text
            ? String(item.acceptedAnswer.text).trim() : '';
          if (name && text) faqs.push({ q: name, a: text });
        }
      }
      if (node['@graph']) visit(node['@graph']);
    };
    visit(parsed);
  });
  return faqs;
}

function countFaqPages(html) {
  let count = 0;
  eachJsonLd(html, (body) => {
    const parsed = tryParseJson(body);
    const visit = (node) => {
      if (!node || typeof node !== 'object') return;
      if (Array.isArray(node)) { node.forEach(visit); return; }
      if (node['@type'] === 'FAQPage') count += 1;
      if (node['@graph']) visit(node['@graph']);
    };
    visit(parsed);
  });
  return count;
}

function removeSentinel(html) {
  return html.replace(/[ \t]*<!-- FAQ-SCHEMA:START -->[\s\S]*?<!-- FAQ-SCHEMA:END -->\s*/, '');
}

function stripFaqScripts(html) {
  return html.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, (block) => {
    const body = (block.match(/>([\s\S]*)<\/script>\s*$/i) || [])[1] || '';
    const parsed = tryParseJson(body);
    if (parsed === undefined) return block;
    if (parsed['@type'] === 'FAQPage') return '';
    if (parsed && Array.isArray(parsed['@graph'])) {
      const kept = parsed['@graph'].filter((node) => !node || node['@type'] !== 'FAQPage');
      if (kept.length === parsed['@graph'].length) return block;
      if (!kept.length) return '';
      parsed['@graph'] = kept;
      return block.replace(body, JSON.stringify(parsed));
    }
    return block;
  });
}

function mergeFaqs(existing, extracted, pageText) {
  const stats = { newsletter: 0, hidden: 0 };
  const seen = new Set();
  const kept = [];
  const consider = (item, fromExisting) => {
    const q = String(item.q || '').trim();
    const a = String(item.a || '').trim();
    if (!q || !a) return;
    if (isNewsletterQuestion(q)) { stats.newsletter += 1; return; }
    if (!isQuestion(q)) return;
    const core = questionCore(q);
    if (!core || !pageText.includes(core)) {
      if (fromExisting) stats.hidden += 1;
      return;
    }
    const key = core.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    kept.push({ q: `${core}?`, a: a.slice(0, 1200) });
  };
  existing.forEach((item) => consider(item, true));
  extracted.forEach((item) => consider(item, false));
  return { faqs: kept, ...stats, hadExisting: existing.length > 0 };
}

function run() {
  if (!fs.existsSync(BLOG)) { console.error('blog/ not found'); process.exit(1); }
  let scanned = 0, faqInjected = 0, howToInjected = 0, deduped = 0;
  let newsletterDropped = 0, hiddenDropped = 0;
  for (const article of listBlogArticles()) {
    const html = fs.readFileSync(article.file, 'utf8');
    if (isRedirectStub(html)) continue;
    scanned += 1;
    // Keep a hand-authored FAQPage that is not inside the injector sentinels.
    // Rebuilding it would append heading questions and rewrite the meta block.
    if (/FAQPage/.test(html) && !/<!-- FAQ-SCHEMA:START -->/.test(html)) continue;
    const beforeCount = countFaqPages(html);
    const title = stripHtml(extractTag(html, 'title') || '');
    const pageText = visibleText(html);
    const existing = collectExistingFaqs(html);
    const extracted = extractFaq(extractBlocks(html));
    const merged = mergeFaqs(existing, extracted, pageText);
    newsletterDropped += merged.newsletter;
    hiddenDropped += merged.hidden;
    const steps = extractHowToSteps(extractBlocks(html), title);
    const faqs = merged.hadExisting ? merged.faqs : (merged.faqs.length >= 3 ? merged.faqs : []);
    const block = buildBlock(faqs, steps, title, article.slug);
    let next = stripFaqScripts(removeSentinel(html));
    if (block) next = injectBlock(next, block);
    if (beforeCount > 1) deduped += 1;
    if (faqs.length) faqInjected += 1;
    if (steps && steps.length >= 4) howToInjected += 1;
    if (next !== html) fs.writeFileSync(article.file, next);
  }
  console.log(`FAQ schema: scanned ${scanned} articles`);
  console.log(`  FAQPage kept:      ${faqInjected}`);
  console.log(`  HowTo injected:    ${howToInjected}`);
  console.log(`  Duplicates merged: ${deduped}`);
  countLine('faq_deduped', deduped);
  countLine('newsletter_questions_dropped', newsletterDropped);
  countLine('hidden_faq_questions_dropped', hiddenDropped);
}

run();

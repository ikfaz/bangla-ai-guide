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
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BLOG = path.join(ROOT, 'blog');

function hasNonAscii(s) { return /[^\x00-\x7F]/.test(s); }
function isRedirectStub(html) { return /http-equiv="refresh"/i.test(html); }

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
    'seo-newsletter-block',
    'class="related-posts"',
    'প্রাসঙ্গিক টুলস',
  ];
  let endIdx = html.length;
  for (const m of endMarkers) {
    const i = html.indexOf(m, startIdx);
    if (i > -1 && i < endIdx) endIdx = i;
  }
  const body = html.slice(startIdx, endIdx);

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
  if (faqs.length >= 3) {
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

function removeBlock(html) {
  return html.replace(/<!-- FAQ-SCHEMA:START -->[\s\S]*?<!-- FAQ-SCHEMA:END -->\s*/, '');
}

function run() {
  if (!fs.existsSync(BLOG)) { console.error('blog/ not found'); process.exit(1); }
  let scanned = 0, faqInjected = 0, howToInjected = 0, removed = 0;
  for (const entry of fs.readdirSync(BLOG, { withFileTypes: true })) {
    if (!entry.isDirectory() || hasNonAscii(entry.name)) continue;
    const file = path.join(BLOG, entry.name, 'index.html');
    if (!fs.existsSync(file)) continue;
    let html = fs.readFileSync(file, 'utf8');
    if (isRedirectStub(html)) continue;
    scanned++;
    const title = stripHtml(extractTag(html, 'title') || '');
    const blocks = extractBlocks(html);
    const faqs = extractFaq(blocks);
    const steps = extractHowToSteps(blocks, title);
    const block = buildBlock(faqs, steps, title, entry.name);
    let next;
    if (block) {
      next = injectBlock(html, block);
      if (faqs.length >= 3) faqInjected++;
      if (steps && steps.length >= 4) howToInjected++;
    } else {
      // No schema applicable — remove old block if any so we stay clean
      next = removeBlock(html);
      if (next !== html) removed++;
    }
    if (next !== html) fs.writeFileSync(file, next, 'utf8');
  }
  console.log(`FAQ schema: scanned ${scanned} articles`);
  console.log(`  FAQPage injected:  ${faqInjected}`);
  console.log(`  HowTo injected:    ${howToInjected}`);
  if (removed) console.log(`  Cleaned stale:     ${removed}`);
}

run();

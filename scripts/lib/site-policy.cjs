#!/usr/bin/env node
// Shared editorial and SEO rules for the static build.
// Author credit is the organization only. Personal names are never emitted.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const SITE = 'https://banglaaiguide.com';
const ORG_NAME = 'বাংলা AI গাইড';
const ORG_URL = `${SITE}/editorial-policy/`;
const LOGO = `${SITE}/web-app-manifest-512x512.png`;
const BLOG = path.join(ROOT, 'blog');

// Slugs that stay on disk only as a redirect source. They must not be
// listed, fed, related, or sitemapped.
const REDIRECT_BLOG_SLUGS = new Set(['ai-tools-for-video-editing']);

const COVER_FILES = ['cover.png', 'cover.webp', 'cover.jpg', 'cover.jpeg', 'cover.svg'];
const NEWSLETTER_QUESTION = /নতুন\s+AI\s+আপডেট\s+পেতে\s+চান/;
const BLOCKED_AUTHOR = /ইকফাজ|Ikfaz|ikfaz/;

function hasNonAscii(s) {
  return /[^\x00-\x7F]/.test(s);
}

function isRedirectStub(html) {
  return /http-equiv="refresh"/i.test(html);
}

function orgAuthor() {
  return { '@type': 'Organization', name: ORG_NAME, url: ORG_URL };
}

function orgPublisher() {
  return {
    '@type': 'Organization',
    name: ORG_NAME,
    url: ORG_URL,
    logo: { '@type': 'ImageObject', url: LOGO },
  };
}

function coverImage(slug) {
  return {
    '@type': 'ImageObject',
    url: `${SITE}/blog/${slug}/cover.png`,
    width: 1200,
    height: 630,
  };
}

function normalizeIso(value) {
  if (!value) return null;
  const raw = String(value).trim().replace(/^22026-/, '2026-');
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 2018 || year > 2035) return null;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function gitContentDate(file) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], {
      cwd: ROOT,
      encoding: 'utf8',
    }).trim();
    return normalizeIso(out);
  } catch {
    return null;
  }
}

function readArticleDates(html, file) {
  const published = normalizeIso((html.match(/"datePublished"\s*:\s*"([^"]+)"/) || [])[1]);
  const modified = normalizeIso((html.match(/"dateModified"\s*:\s*"([^"]+)"/) || [])[1]);
  if (published && modified) return { published, modified };
  if (published) return { published, modified: published };
  if (modified) return { published: modified, modified };
  const fromGit = file ? gitContentDate(file) : null;
  const fallback = fromGit || '2026-03-11';
  return { published: fallback, modified: fallback };
}

function toBnDate(iso) {
  const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  const match = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return iso;
  const bnDigits = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);
  const month = months[parseInt(match[2], 10) - 1] || '';
  return `${bnDigits(parseInt(match[3], 10))} ${month}, ${bnDigits(match[1])}`;
}

function listBlogArticles() {
  if (!fs.existsSync(BLOG)) return [];
  const articles = [];
  for (const entry of fs.readdirSync(BLOG, { withFileTypes: true })) {
    if (!entry.isDirectory() || hasNonAscii(entry.name)) continue;
    const file = path.join(BLOG, entry.name, 'index.html');
    if (!fs.existsSync(file)) continue;
    articles.push({ slug: entry.name, file });
  }
  return articles;
}

function readHtml(file) {
  return fs.readFileSync(file);
}

function visibleText(html) {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function isQuestion(text) {
  if (!text) return false;
  const t = String(text).trim();
  if (NEWSLETTER_QUESTION.test(t)) return false;
  if (/[?？]\s*$/.test(t)) return true;
  if (/^(কী|কে|কেন|কীভাবে|কোন|কোথায়|কখন|কত|কাকে|কাদের)\b/.test(t)) return t.length < 120;
  if (/^(how|what|why|when|where|which|who|can|does|is|are|do)\b/i.test(t) && t.length < 120) return true;
  return false;
}

function questionCore(text) {
  return String(text || '').replace(/[?？]+\s*$/g, '').replace(/\s+/g, ' ').trim();
}

function isNewsletterQuestion(text) {
  return NEWSLETTER_QUESTION.test(String(text || ''));
}

function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function stripComments(input) {
  let out = '';
  let inStr = false;
  let esc = false;
  for (let i = 0; i < input.length; i += 1) {
    const c = input[i];
    if (inStr) {
      out += c;
      if (esc) { esc = false; continue; }
      if (c === '\\') { esc = true; continue; }
      if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') { inStr = true; out += c; continue; }
    if (c === '#') {
      while (i + 1 < input.length && input[i + 1] !== '\n') i += 1;
      continue;
    }
    if (c === '/' && input[i + 1] === '/') {
      while (i + 1 < input.length && input[i + 1] !== '\n') i += 1;
      continue;
    }
    if (c === '/' && input[i + 1] === '*') {
      i += 2;
      while (i < input.length && !(input[i] === '*' && input[i + 1] === '/')) i += 1;
      i += 1;
      continue;
    }
    out += c;
  }
  return out;
}

function repairUnescapedQuotes(input) {
  let out = '';
  let i = 0;
  while (i < input.length) {
    if (input[i] !== '"') {
      out += input[i];
      i += 1;
      continue;
    }
    out += '"';
    i += 1;
    while (i < input.length) {
      if (input[i] === '\\') {
        out += input[i] + (input[i + 1] || '');
        i += 2;
        continue;
      }
      if (input[i] === '"') {
        let j = i + 1;
        while (j < input.length && /\s/.test(input[j])) j += 1;
        const next = input[j];
        if (next === undefined || next === ',' || next === '}' || next === ']' || next === ':') {
          out += '"';
          i += 1;
          break;
        }
        out += '\\"';
        i += 1;
        continue;
      }
      out += input[i];
      i += 1;
    }
  }
  return out;
}

function stripTrailingCommas(input) {
  let out = '';
  let inStr = false;
  let esc = false;
  for (let i = 0; i < input.length; i += 1) {
    const c = input[i];
    if (inStr) {
      out += c;
      if (esc) { esc = false; continue; }
      if (c === '\\') { esc = true; continue; }
      if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') { inStr = true; out += c; continue; }
    if (c === ',') {
      let j = i + 1;
      while (j < input.length && /\s/.test(input[j])) j += 1;
      if (input[j] === '}' || input[j] === ']') continue;
    }
    out += c;
  }
  return out;
}

function repairJsonText(raw) {
  let text = String(raw).replace(/\u0000/g, '').replace(/^\uFEFF/, '');
  text = stripComments(text);
  text = text.replace(/([}\]])\s*,\s*[A-Za-z][^"\n\r]*/g, '$1,');
  text = repairUnescapedQuotes(text);
  text = stripTrailingCommas(text).trim();
  if (tryParseJson(text) !== undefined) return text;
  let current = text;
  for (let n = 0; n < 6; n += 1) {
    const next = current.replace(/\}\s*$/, '').trim();
    if (next === current) break;
    current = next;
    if (tryParseJson(current) !== undefined) return current;
  }
  return text;
}

function pngSize(buf) {
  if (!buf || buf.length < 24) return null;
  if (buf[0] !== 0x89 || buf.toString('ascii', 1, 4) !== 'PNG') return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function countLine(key, value) {
  console.log(`SEO-COUNT ${key}=${value}`);
}

module.exports = {
  ROOT,
  SITE,
  BLOG,
  ORG_NAME,
  ORG_URL,
  LOGO,
  REDIRECT_BLOG_SLUGS,
  COVER_FILES,
  NEWSLETTER_QUESTION,
  BLOCKED_AUTHOR,
  hasNonAscii,
  isRedirectStub,
  orgAuthor,
  orgPublisher,
  coverImage,
  normalizeIso,
  gitContentDate,
  readArticleDates,
  toBnDate,
  listBlogArticles,
  visibleText,
  isQuestion,
  questionCore,
  isNewsletterQuestion,
  tryParseJson,
  repairJsonText,
  pngSize,
  countLine,
};

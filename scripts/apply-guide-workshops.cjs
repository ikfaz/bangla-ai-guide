#!/usr/bin/env node
// Give published guides an action-oriented layout after the source generators.
const fs = require('node:fs');
const path = require('node:path');
const { load } = require('cheerio/slim');
const { listBlogArticles, isRedirectStub, REDIRECT_BLOG_SLUGS } = require('./lib/site-policy.cjs');

const ROOT = path.resolve(__dirname, '..');
const OPTIONS = { xmlMode: false, decodeEntities: true, encodeEntities: 'utf8', withStartIndices: true, withEndIndices: true };
const AUXILIARY = '.author-block,.related-posts,.pillar-links-section,.seo-newsletter-block,.newsletter,.mailchimp-card,.seo-cta-block,.article-toc,.seo-toc,.gw-chapters,form';
const COPY_ICON = '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 5V4a1 1 0 0 0-1-1H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1"/></svg>';

function plain(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}
function escape(text) {
  return String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function shorten(text, max) {
  const value = plain(text);
  if (value.length <= max) return value;
  return value.slice(0, max).replace(/\s+\S*$/, '') + '…';
}
function copyButton(id) {
  return '<button class="gw-copy" type="button" data-guide-copy="' + escape(id) + '" hidden aria-label="এই লেখা কপি করুন">' + COPY_ICON + '<span>কপি করুন</span></button>';
}
function contentHeadings(doc, reader) {
  return reader.find('h2[id]').filter((_, node) => {
    const heading = doc(node);
    return !heading.closest(AUXILIARY).length && !/আপডেট পেতে চান|সম্পর্কিত গাইড/.test(heading.text());
  });
}
function precedingHeading(doc, element) {
  // A heading within a section takes priority over an unrelated earlier chapter.
  let current = element;
  while (current.length) {
    const before = current.prevAll('h2,h3,h4').first();
    if (before.length) return plain(before.text());
    current = current.parent();
    if (current.is('[data-guide-workshop]')) break;
  }
  return '';
}
function promoteContent(doc, reader) {
  let index = 0;
  const ids = new Set(reader.find('[id]').map((_, node) => doc(node).attr('id')).get());
  reader.find('pre,blockquote,p').each((_, node) => {
    const block = doc(node);
    if (block.closest(AUXILIARY + ',.gw-feature,.gw-copy-block,.av-pullquote').length) return;
    if (block.is('p') && block.closest('pre,blockquote').length) return;
    const text = plain(block.text());
    const context = precedingHeading(doc, block);
    const previous = plain(block.prev().text());
    const promptContext = /prompt|প্রম্পট|ChatGPT|Claude|Gemini/i.test(context + ' ' + previous);
    const promptLabel = block.is('p') && /^(?:prompt|প্রম্পট)\s*:/i.test(text);
    const promptInstructions = /করো|করুন|তৈরি|দাও|লিখে|বানাও|generate|create|you are|act as|rules:|translate|rewrite|cleanup|convert/i.test(text);
    const directInstruction = /^["“]?\s*(?:You are|Act as|তুমি |নিচের |Upload করছি)/i.test(text) && promptInstructions;
    const isPrompt = promptLabel || ((block.is('blockquote') || block.is('pre')) && ((promptContext && promptInstructions) || directInstruction));
    if (!block.is('pre') && !isPrompt) return;
    if (!text || (text.length < 20 && !block.is('pre')) || block.find('cite,footer').length) return;
    index++;
    while (ids.has('guide-copy-' + index)) index++;
    const id = block.attr('id') || 'guide-copy-' + index;
    ids.add(id);
    block.attr('id', id).attr('data-guide-source', '');
    const label = isPrompt ? 'কপি করার প্রম্পট' : /npm |sudo |kubectl |wsl |whisper /i.test(text) ? 'কমান্ড' : 'কপি করার লেখা';
    block.wrap('<div class="gw-copy-block"></div>');
    block.before('<div class="gw-copy-head"><span>' + label + '</span>' + copyButton(id) + '</div>');
  });

  reader.find('ol').each((_, node) => {
    const list = doc(node);
    if (list.closest(AUXILIARY).length || list.hasClass('nb-prompts')) return;
    const context = precedingHeading(doc, list);
    if (/checklist|চেকলিস্ট|মিলিয়ে নিন|বিষয় মিলিয়ে/i.test(context)) {
      list.removeClass('gw-steps').addClass('gw-checklist');
      return;
    }
    if (list.is('.av-steps,.seo-steps,.steps') || /step|ধাপ|workflow|কীভাবে|কিভাবে|শুরু|setup|সেটআপ/i.test(context)) {
      list.addClass('gw-steps');
    }
  });

  reader.find('h3').each((_, node) => {
    const heading = doc(node);
    if (heading.closest(AUXILIARY).length) return;
    if (/^(?:step\s*\d|ধাপ\s*[০-৯0-9])/i.test(plain(heading.text()))) heading.addClass('gw-step-heading');
  });

  reader.find('ul,ol').each((_, node) => {
    const list = doc(node);
    if (list.closest(AUXILIARY + ',.gw-checklist').length || list.hasClass('gw-steps')) return;
    const context = precedingHeading(doc, list);
    if (/checklist|চেকলিস্ট|মিলিয়ে নিন|বিষয় মিলিয়ে/i.test(context)) list.addClass('gw-checklist');
  });

  reader.find('table').each((_, node) => {
    const table = doc(node);
    if (table.closest(AUXILIARY).length) return;
    table.addClass('gw-table');
    const caption = table.find('caption').first();
    const title = plain(caption.text()) || precedingHeading(doc, table) || 'তথ্যের সারণি';
    if (!table.parent().is('.gw-table-scroll')) table.wrap('<div class="gw-table-scroll" role="region" tabindex="0" aria-label="' + escape(title) + '"></div>');
    const columns = table.find('thead tr').last().children('th,td').map((_, cell) => plain(doc(cell).text())).get();
    table.find('tbody tr').each((_, row) => {
      doc(row).children('td,th').each((i, cell) => {
        if (columns[i]) doc(cell).attr('data-column', columns[i]);
      });
    });
    if (table.closest('#calendar').length) table.addClass('gw-calendar');
  });
  // Keep labels aligned with the section when an author edits a guide.
  reader.find('.gw-copy-block').each((_, node) => {
    const wrapper = doc(node);
    const source = wrapper.find('[data-guide-source]').first();
    const context = precedingHeading(doc, wrapper);
    if (source.is('pre') && /prompt|প্রম্পট/i.test(context)) wrapper.find('.gw-copy-head > span').text('কপি করার প্রম্পট');
  });
}
function addChapters(doc, reader) {
  const headings = contentHeadings(doc, reader);
  reader.find('.article-toc,.seo-toc,.gw-chapters').remove();
  if (headings.length < 2) return;
  const list = headings.map((_, node) => '<li><a href="#' + escape(doc(node).attr('id')) + '">' + escape(plain(doc(node).text())) + '</a></li>').get().join('\n');
  const contents = '<nav class="gw-chapters" aria-label="এই গাইডে"><details open><summary>এই গাইডে</summary><ol>\n' + list + '\n</ol></details></nav>';
  reader.find('.gw-layout').prepend(contents);
}
function ensureHeadingIds(doc, reader) {
  const used = new Set(doc('[id]').map((_, node) => doc(node).attr('id')).get());
  reader.find('h2').each((_, node) => {
    const heading = doc(node);
    if (heading.attr('id')) return;
    const base = plain(heading.text()).toLowerCase().replace(/[^\p{L}\p{M}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 72) || 'section';
    let id = base;
    let suffix = 2;
    while (used.has(id)) id = base + '-' + suffix++;
    heading.attr('id', id);
    used.add(id);
  });
}
function frameReader(doc, reader, description) {
  reader.attr('data-guide-reader', '').attr('data-guide-workshop', '');
  if (reader.find('.gw-hero').length) return;

  // Remove obsolete generator boundaries so subsequent builds cannot duplicate moved modules.
  reader.find('*').addBack().contents().filter((_, node) => node.type === 'comment' && /ARTICLE-(?:META|HERO|TOC):|INTERIOR:/.test(node.data || '')).remove();
  const heading = reader.find('h1').first().remove();
  const kicker = reader.find('.article-kicker').first().remove();
  const byline = reader.find('.byline').first().remove();
  const visual = reader.find('.article-hero,.inside-plate').first().remove();
  visual.addClass('article-hero');
  const breadcrumb = reader.find('.breadcrumb').first().remove();

  reader.find('.article-toc,.seo-toc').remove();
  // The old root-guide intro only grouped the original title, deck and image.
  reader.find('.inside-intro,.inside-copy,.inside-plate').each((_, node) => doc(node).replaceWith(doc(node).contents()));
  reader.find('header').each((_, node) => {
    const header = doc(node);
    if (!plain(header.text()) && !header.find('img,video,iframe').length) header.remove();
  });
  const reading = doc('<div class="gw-reading"></div>').append(reader.contents());
  const layout = doc('<div class="gw-layout"></div>').append(reading);
  const hero = doc('<div class="gw-hero"><div class="gw-hero-copy"></div><div class="gw-hero-visual"></div></div>');
  const copy = hero.find('.gw-hero-copy');
  if (kicker.length) copy.append(kicker);
  copy.append(heading);
  if (description) copy.append('<p class="gw-deck">' + escape(description) + '</p>');
  if (byline.length) copy.append(byline);
  hero.find('.gw-hero-visual').append(visual);
  reader.empty().append(breadcrumb).append(hero).append(layout);
}
function refreshHero(doc, reader) {
  reader.find('.gw-reading .av-hero').remove();
  reader.find('.gw-feature,.gw-actions').remove();
  const headings = contentHeadings(doc, reader);
  const target = headings.filter((_, node) => /step|ধাপ|workflow|কীভাবে|কিভাবে|প্রম্পট|prompt|কাজের জন্য/i.test(doc(node).text())).first();
  const first = target.length ? target : headings.first();
  if (first.length) {
    reader.find('.gw-hero-copy').append('<a class="gw-actions" href="#' + escape(first.attr('id')) + '">' + escape(shorten(plain(first.text()).replace(/^[০-৯0-9]+[.।)\s]+/, ''), 52)) + ' <span aria-hidden="true">↓</span></a>');
  }
  const prompt = reader.find('.gw-copy-block').filter((_, node) => doc(node).find('.gw-copy-head > span').text() === 'কপি করার প্রম্পট').first();
  if (prompt.length) {
    const source = prompt.find('[data-guide-source]').first();
    reader.find('.gw-hero-visual').append('<aside class="gw-feature"><div class="gw-copy-head"><span>চেষ্টা করে দেখুন</span>' + copyButton(source.attr('id')) + '</div><p>' + escape(shorten(source.text(), 280)) + '</p></aside>');
  }
}
function applyWorkshop(input, route) {
  if (isRedirectStub(input) || input.includes('data-nano-guide')) return input;
  const doc = load(input, OPTIONS, false);
  const rootArticle = doc('[data-guide-reader]').first();
  const reader = rootArticle.length ? rootArticle : doc('h1').first().closest('article');
  if (!reader.length || !reader.find('h1').length) throw new Error('Article boundary missing for ' + route);
  const originalNode = reader[0];
  const start = originalNode.startIndex;
  const end = originalNode.endIndex + 1;
  const description = doc('meta[name="description"]').attr('content') || '';
  frameReader(doc, reader, description);
  ensureHeadingIds(doc, reader);
  promoteContent(doc, reader);
  addChapters(doc, reader);
  refreshHero(doc, reader);
  if (!reader.find('[data-guide-copy-status]').length) reader.append('<p class="sr-only" data-guide-copy-status role="status" aria-live="polite"></p>');
  let result = input.slice(0, start) + doc.html(reader).replace(/[ \t]+$/gm, '') + input.slice(end);
  result = result.replace(/seo-pages\.js\?v=[^"'\s>]+/g, 'seo-pages.js?v=practical-guides-1');
  const assets = [
    '<link rel="stylesheet" href="/css/guide-workshop.css">',
    '<script src="/js/guide-workshop.js" defer></script>',
  ];
  for (const asset of assets) if (!result.includes(asset)) result = result.replace('</head>', '  ' + asset + '\n</head>');
  return result;
}
function targets() {
  const blog = listBlogArticles().filter(article => !REDIRECT_BLOG_SLUGS.has(article.slug));
  const roots = fs.readdirSync(ROOT, { withFileTypes: true }).filter(e => e.isDirectory() && /^[a-z0-9-]+$/.test(e.name)).flatMap(e => {
    const file = path.join(ROOT, e.name, 'index.html');
    if (!fs.existsSync(file)) return [];
    const html = fs.readFileSync(file, 'utf8');
    return /data-interior="(?:guide|standalone)"/.test(html) ? [{ slug: e.name, file }] : [];
  });
  return [...blog, ...roots];
}
function run() {
  let updated = 0;
  let count = 0;
  for (const { slug, file } of targets()) {
    const input = fs.readFileSync(file, 'utf8');
    if (isRedirectStub(input)) continue;
    const output = applyWorkshop(input, slug);
    count++;
    if (input !== output) { fs.writeFileSync(file, output); updated++; }
  }
  console.log('Practical guide layouts: ' + count + ' articles, ' + updated + ' updated.');
}
module.exports = { applyWorkshop, targets };
if (require.main === module) run();

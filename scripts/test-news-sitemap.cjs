const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { collectNewsArticles, buildNewsSitemap } = require('./generate-news-sitemap.cjs');

const parent = path.resolve(os.tmpdir());
const temporary = fs.mkdtempSync(path.join(parent, 'bag-news-test-'));
assert.equal(path.dirname(path.resolve(temporary)), parent);
let checks = 0;
const now = new Date('2026-11-07T12:00:00Z');
function article(slug, metadata, extra = '') {
  const dir = path.join(temporary, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), `<script type="application/ld+json">${JSON.stringify(metadata)}</script>${extra}`);
}
function metadata(datePublished, overrides = {}) {
  return { '@type': 'Article', headline: 'বাংলা "খবর" & গাইড <আজ>', datePublished, ...overrides };
}
function collect(at = now) { return collectNewsArticles({ now: at, blogDir: temporary }); }
function check(label, run) { run(); checks++; console.log('✓ ' + label); }
try {
  article('old-edited-today', metadata('2026-10-01', { dateModified: '2026-11-07' }));
  article('missing-published', metadata(undefined, { dateModified: '2026-11-07' }));
  article('future', metadata('2026-11-08'));
  article('future-today', metadata('2026-11-07T14:00:00Z'));
  article('invalid-calendar', metadata('2026-02-30'));
  article('invalid-hour', metadata('2026-11-06T24:00:00Z'));
  article('invalid-minute', metadata('2026-11-07T10:60:00Z'));
  article('invalid-offset', metadata('2026-11-07T10:00:00+24:00'));
  article('timezone-missing', metadata('2026-11-07T10:00:00'));
  article('unrelated-schema', { '@type': 'Product', headline: 'Not an article', datePublished: '2026-11-07' });
  article('missing-title', metadata('2026-11-07', { headline: '' }));
  article('redirect', metadata('2026-11-07'), '<meta http-equiv="refresh" content="0;url=/blog/">');
  article('ai-tools-for-video-editing', metadata('2026-11-07'));
  article('boundary-expired', metadata('2026-11-05T12:00:00Z'));
  article('boundary-fresh', metadata('2026-11-05T12:00:01Z'));
  article('date-only', metadata('2026-11-06', { dateModified: '2026-11-07' }));
  article('offset', metadata('2026-11-07T15:30:00.125+06:00'));
  article('graph', { '@graph': [{ '@type': 'WebSite', datePublished: '2026-11-08' }, metadata('2026-11-07T10:00:00Z', { '@type': ['Article', 'NewsArticle'] })] });
  article('array', [{ '@type': 'WebPage' }, metadata('2026-11-07T11:00:00Z')]);
  fs.writeFileSync(path.join(temporary, 'date-only', 'cover.png'), 'fixture');

  check('Only genuinely recent articles survive; edits, missing dates, future dates and redirects do not', () => {
    assert.deepEqual(collect().map(a => a.slug), ['array', 'graph', 'offset', 'date-only', 'boundary-fresh']);
    // Invalid dates must not normalize into another calendar day even when in range.
    assert(!collect(new Date('2026-03-02T12:00:00Z')).some(a => a.slug === 'invalid-calendar'));
  });
  check('XML preserves original dates, offsets, escaped titles and separately records edits', () => {
    const items = collect(); const xml = buildNewsSitemap(items);
    assert(xml.includes('<news:publication_date>2026-11-06</news:publication_date>'));
    assert(xml.includes('<news:publication_date>2026-11-07T15:30:00.125+06:00</news:publication_date>'));
    assert(!xml.includes('T09:00:00+06:00'));
    assert(xml.includes('বাংলা &quot;খবর&quot; &amp; গাইড &lt;আজ&gt;'));
    assert(xml.includes('<image:loc>https://banglaaiguide.com/blog/date-only/cover.png</image:loc>'));
    assert.equal(items.find(a => a.slug === 'date-only').modified, '2026-11-07');
  });
  check('Exact 48-hour cutoff expires entries and no recent articles produces an empty sitemap', () => {
    assert(!collect().some(a => a.slug === 'boundary-expired'));
    assert(collect().some(a => a.slug === 'boundary-fresh'));
    const empty = collect(new Date('2026-12-01T12:00:00Z'));
    assert.deepEqual(empty, []);
    assert(!buildNewsSitemap(empty).includes('<url>'));
    assert(buildNewsSitemap(empty).includes('</urlset>'));
  });
  check('Invalid clocks fail rather than silently producing misleading dates', () => {
    assert.throws(() => collect('not-a-date'), /Invalid news sitemap reference time/);
  });
  check('A fixed clock gives stable ordering and limits the sitemap to 1000 articles', () => {
    for (let i = 0; i < 1001; i++) article('fresh-' + String(i).padStart(4, '0'), metadata('2026-11-07T12:00:00Z'));
    const items = collect();
    assert.equal(items.length, 1000);
    assert.equal(items[0].slug, 'fresh-0000');
    assert.equal(items.at(-1).slug, 'fresh-0999');
    assert.equal(buildNewsSitemap(items), buildNewsSitemap(collect()));
  });
} finally {
  // Delete only this verified test directory directly beneath the OS temp root.
  assert.equal(path.dirname(path.resolve(temporary)), parent);
  assert(path.basename(temporary).startsWith('bag-news-test-'));
  fs.rmSync(temporary, { recursive: true, force: true });
}
console.log(`${checks} news sitemap checks passed.`);

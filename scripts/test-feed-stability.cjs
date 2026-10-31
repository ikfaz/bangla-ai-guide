const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { writeFeed } = require('./generate-feed.cjs');

const parent = path.resolve(os.tmpdir());
const temporary = fs.mkdtempSync(path.join(parent, 'bag-feed-test-'));
assert.equal(path.dirname(path.resolve(temporary)), parent);
const output = path.join(temporary, 'feed.xml');
const firstDate = new Date('2026-10-20T12:00:00Z');
const laterDate = new Date('2026-10-28T12:00:00Z');
const posts = [{
  slug: 'example', title: 'বাংলা উদাহরণ', description: 'Original description',
  pubDate: 'Mon, 19 Oct 2026 00:00:00 GMT',
}];
let checks = 0;
function check(label, fn) { fn(); checks++; console.log('✓ ' + label); }

try {
  check('New feed contains its build date and preserves article publication metadata', () => {
    assert.equal(writeFeed(output, posts, firstDate), true);
    const xml = fs.readFileSync(output, 'utf8');
    assert.ok(xml.includes('<lastBuildDate>Tue, 20 Oct 2026 12:00:00 GMT</lastBuildDate>'));
    assert.ok(xml.includes('<pubDate>Mon, 19 Oct 2026 00:00:00 GMT</pubDate>'));
    assert.ok(xml.includes('<atom:link href="https://banglaaiguide.com/feed.xml"'));
  });

  check('Same feed on a later day preserves both bytes and file modification time', () => {
    const original = fs.readFileSync(output, 'utf8');
    fs.utimesSync(output, firstDate, firstDate);
    const modified = fs.statSync(output).mtimeMs;
    assert.equal(writeFeed(output, posts, laterDate), false);
    assert.equal(fs.readFileSync(output, 'utf8'), original);
    assert.equal(fs.statSync(output).mtimeMs, modified);
  });

  check('Windows checkout line endings do not trigger a redundant rewrite', () => {
    const original = fs.readFileSync(output, 'utf8').replace(/\r?\n/g, '\r\n');
    fs.writeFileSync(output, original);
    assert.equal(writeFeed(output, posts, laterDate), false);
    assert.equal(fs.readFileSync(output, 'utf8'), original);
  });

  check('Changed article text updates the build date, preserves publication date and escapes XML', () => {
    assert.equal(writeFeed(output, [{ ...posts[0], title: 'Updated <title> & note' }], laterDate), true);
    const xml = fs.readFileSync(output, 'utf8');
    assert.ok(xml.includes('<lastBuildDate>Wed, 28 Oct 2026 12:00:00 GMT</lastBuildDate>'));
    assert.ok(xml.includes('Updated &lt;title&gt; &amp; note'));
    assert.ok(xml.includes('<pubDate>Mon, 19 Oct 2026 00:00:00 GMT</pubDate>'));
  });

  check('Channel metadata changes are not hidden by the timestamp comparison', () => {
    writeFeed(output, posts, firstDate);
    fs.writeFileSync(output, fs.readFileSync(output, 'utf8').replace('<language>bn-BD</language>', '<language>en</language>'));
    assert.equal(writeFeed(output, posts, laterDate), true);
    assert.ok(fs.readFileSync(output, 'utf8').includes('<language>bn-BD</language>'));
  });

  check('Missing or invalid build dates are repaired', () => {
    for (const replacement of ['', '<lastBuildDate>not a date</lastBuildDate>']) {
      const previous = fs.readFileSync(output, 'utf8');
      fs.writeFileSync(output, previous.replace(/<lastBuildDate>[^<]*<\/lastBuildDate>/, replacement));
      assert.equal(writeFeed(output, posts, laterDate), true);
      assert.ok(fs.readFileSync(output, 'utf8').includes(laterDate.toUTCString()));
    }
  });

  check('Removing articles updates the feed, then an empty feed remains stable', () => {
    assert.equal(writeFeed(output, [], laterDate), true);
    assert.ok(!fs.readFileSync(output, 'utf8').includes('<item>'));
    assert.equal(writeFeed(output, [], new Date('2026-10-29T12:00:00Z')), false);
  });
} finally {
  // This directory was allocated above directly beneath the OS temporary folder.
  assert.equal(path.dirname(path.resolve(temporary)), parent);
  fs.rmSync(temporary, { recursive: true });
}

console.log(`${checks} feed stability checks passed.`);

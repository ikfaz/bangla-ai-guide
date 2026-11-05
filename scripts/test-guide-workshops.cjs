const assert = require('node:assert/strict');
const { load } = require('cheerio/slim');
const { applyWorkshop } = require('./apply-guide-workshops.cjs');

const source = `<!doctype html><html lang="bn"><head><meta name="description" content="একটি ব্যবহারিক বাংলা গাইড"></head><body>
<article data-guide-reader>
<p class="article-kicker"><span class="article-chip">কোডিং</span></p><h1>নিজের প্রকল্পে কাজ করুন</h1>
<!-- ARTICLE-HERO:START --><figure class="article-hero"><img src="/assets/editorial/coding.svg" alt="কোডিং"></figure><!-- ARTICLE-HERO:END -->
<nav class="article-toc"><h2>সূচিপত্র</h2><ol><li><a href="#setup">শুরু</a></li></ol></nav>
<h2 id="setup">শুরু করার ধাপ</h2><ol class="seo-steps"><li>নিজের ফাইল খুলুন</li><li>একটি পরিবর্তন দেখুন</li></ol>
<h2 id="prompt">এই প্রম্পট দিয়ে শুরু করুন</h2><pre><code>আমার লেখাটি সম্পাদনা করো।\nআমার তথ্য বজায় রাখো।</code></pre>
<blockquote>“কাজটি সহজ হয়েছে।”<cite>একজন পাঠক</cite></blockquote>
<h2 id="commands">ইনস্টলেশন</h2><pre><code>npm install</code></pre>
<h2 id="check">প্রকাশের আগে চেকলিস্ট</h2><ul><li>তথ্য মিলেছে</li><li>নাম ঠিক আছে</li></ul>
<h2 id="comparison">বৈশিষ্ট্য তুলনা</h2><table><thead><tr><th>টুল</th><th>খরচ</th></tr></thead><tbody><tr><td>একটি টুল</td><td>নিজে যাচাই করুন</td></tr></tbody></table>
<a href="calendar.csv" download>ক্যালেন্ডার নিন</a><section class="seo-newsletter-block"><form action="/newsletter"><input name="email"></form></section>
</article></body></html>`;
const output = applyWorkshop(source, 'example');
const doc = load(output);
assert.equal(doc('[data-guide-workshop]').length, 1);
assert.equal(doc('.gw-hero h1').text(), 'নিজের প্রকল্পে কাজ করুন');
assert.equal(doc('.gw-copy-block').length, 2, 'Both the authored prompt and shell command can be copied.');
assert.equal(doc('.gw-copy-block').first().find('[data-guide-source]').text(), 'আমার লেখাটি সম্পাদনা করো।\nআমার তথ্য বজায় রাখো।');
assert.equal(doc('cite').parent().closest('.gw-copy-block').length, 0, 'An attributed quotation must remain a quotation.');
assert.equal(doc('.gw-steps > li').length, 2);
assert.equal(doc('.gw-checklist > li').length, 2);
assert.equal(doc('.gw-table-scroll table td').last().text(), 'নিজে যাচাই করুন');
assert.equal(doc('form').attr('action'), '/newsletter');
assert.equal(doc('a[download]').attr('href'), 'calendar.csv');
assert.equal(doc('.article-toc').length, 0);
for (const node of doc('.gw-chapters a').toArray()) {
  assert(doc('[id]').toArray().some(target => target.attribs.id === node.attribs.href.slice(1)), 'Every chapter link has a live target.');
}
assert.equal(applyWorkshop(output, 'example'), output, 'Retrying the build must preserve the output bytes.');
assert.equal(applyWorkshop('<html><head><meta http-equiv="refresh" content="0;url=/"></head></html>', 'alias'), '<html><head><meta http-equiv="refresh" content="0;url=/"></head></html>');
assert.equal(applyWorkshop('<article data-nano-guide>Custom workshop</article>', 'nano'), '<article data-nano-guide>Custom workshop</article>');
console.log('Practical guide checks passed: prompts versus quotations, copyable commands, steps, checklists, tables, chapter targets, original forms/downloads, redirects and repeat-build stability.');

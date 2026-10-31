const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const context = { state: { language: 'bn' } };
vm.createContext(context);
vm.runInContext(read('js/tools-data.js') + ';this.data = tools;', context);
const main = read('js/main.js');
vm.runInContext(main.slice(main.indexOf('  function getPriceInfo('), main.indexOf('  function matchSearch(')), context);
const home = read('index.html');
let guides = 0;
for (const slug of ['chatgpt', 'claude', 'gemini']) {
  const tool = context.data.find(t => t.name.toLowerCase() === slug);
  const html = read(slug + '/index.html');
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  const app = graph.find(n => n['@type'] === 'SoftwareApplication');
  assert.equal(app.url, 'https://banglaaiguide.com/' + slug + '/');
  const faq = graph.find(n => n['@type'] === 'FAQPage').mainEntity;
  const visible = [...html.matchAll(/<article class="seo-faq-item"><h3>(.*?)<\/h3><p>(.*?)<\/p><\/article>/gs)];
  assert.equal(visible.length, faq.length, slug + ' FAQ count');
  visible.forEach((m, i) => {
    assert.equal(m[1], faq[i].name, slug + ' FAQ question');
    assert.equal(m[2], faq[i].acceptedAnswer.text, slug + ' FAQ answer');
  });
  assert.ok(html.includes('detail-description seo-lead'));
  assert.ok(html.includes('তথ্য যাচাইয়ের অবস্থা'));
  assert.ok(html.includes('2026-10-28'));
  assert.ok(!html.includes('logo.clearbit.com'));
  assert.equal(tool.rating, null);
  assert.equal(tool.review_bn, '');
  assert.equal(tool.no_vpn, null);
  assert.equal(tool.payment, 'যাচাই বাকি');
  assert.ok(tool.sourceReview.sources.every(u => u.startsWith('https://')));
  for (const language of ['bn', 'en']) {
    context.state.language = language;
    const info = context.getPriceInfo(tool);
    assert.equal(info.bdtLabel, tool['priceSummary_' + language]);
    assert.equal(info.paidBdt, null, slug + ' untested checkout must not be converted to BDT');
  }
  assert.ok(home.includes(tool.priceSummary_bn), slug + ' static homepage price agrees with dynamic card');
  for (const [first, second] of require('./comparison-pairs.json')) {
    if (![first, second].includes(tool.name)) continue;
    const s = v => v.toLowerCase().replace(/\./g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const pair = [s(first), s(second)].sort().join('-vs-');
    assert.ok(read('compare/' + pair + '/index.html').includes(tool.priceSummary_bn), pair + ' stale reviewed price');
  }
  guides++;
}
const quiz = read('quiz/index.html');
vm.runInContext(quiz.slice(quiz.indexOf('    function parsePrice('), quiz.indexOf('    function computeResults(')), context);
for (const price of [undefined, '', 20, 'Check local pricing', 'Free access / Paid plans: check local price']) assert.equal(context.parsePrice(price), null);
assert.equal(context.parsePrice('Free'), 0);
assert.equal(context.parsePrice('Free / Pro $20/mo'), 20, 'free tier must not disguise paid plan cost');
assert.ok(!read('scripts/generate-comparison-pages.cjs').includes('y.rating'), 'pair selection must not use unsupported ratings');
assert.equal(require('./comparison-pairs.json').length, 54, 'preserve all published comparison destinations');
console.log(guides + ' reviewed guides: FAQ parity, schema identity, honest unknowns, browser/static price consistency and preserved comparisons passed. Quiz unknown/paid pricing cases passed.');

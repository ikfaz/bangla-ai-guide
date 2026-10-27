const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const ctx = {};
vm.runInNewContext(read('js/tools-data.js') + ';this.items=tools', ctx);
for (const tool of ctx.items.filter(t => t.affiliate_url)) {
  const slug = tool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const html = read(slug + '/index.html');
  const link = html.match(/<a class="btn btn-primary detail-cta"[^>]*>/)[0];
  assert.ok(link.includes('href="' + tool.direct_url + '"'), slug + ' must lead to product, not an unverified program/referral');
  assert.ok(link.includes('data-tool-slug="' + slug + '"'));
}
let pages = 0;
function scan(dir) {
  for (const item of fs.readdirSync(dir, {withFileTypes:true})) {
    if (['.git', 'node_modules'].includes(item.name)) continue;
    const file = path.join(dir, item.name);
    if (item.isDirectory()) scan(file);
    else if (item.name.endsWith('.html')) {
      const html = fs.readFileSync(file, 'utf8'); pages++;
      assert.ok(!html.includes('googletagmanager.com'), file + ': unconditional tracking connection');
      assert.ok(!/gtag\(['"]config/.test(html), file + ': unconditional analytics config');
      const consent = html.indexOf('src="/js/consent.js');
      const analytics = html.indexOf('src="/js/analytics.js');
      if (analytics >= 0) assert.ok(consent >= 0 && consent < analytics, file + ': consent must load first');
      for (const form of html.matchAll(/<form\b[^>]*data-mailchimp-form[^>]*>/g)) assert.ok(form[0].includes('target="_blank"'), file + ': newsletter must show provider confirmation');
    }
  }
}
scan(root);
assert.ok(read('index.html').includes('id="categoryTabs"'));
assert.ok(read('sitemap.xml').includes('https://banglaaiguide.com/editorial-policy/'));
assert.ok(read('scripts/generate-seo-pages.cjs').includes('if (page.slug === "bkash-diye-ai-tools-kena-jay")'));
console.log('Integration checks passed: six commercial destinations, ' + pages + ' HTML sources, consent ordering, provider handoffs, legacy anchor, policy sitemap and reviewed-page protection.');

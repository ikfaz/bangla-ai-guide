#!/usr/bin/env node
// Run: node scripts/test-tool-routes.cjs. Local evidence only; no remote URL claims.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ROOT = path.resolve(__dirname, '..');
const generator = require('./generate-tool-routes.cjs');
const api = require('../js/tool-routes.js');
const tools = generator.loadTools();
const manifestSource = fs.readFileSync(path.join(ROOT, 'js/tool-routes.js'), 'utf8');
let passed = 0;
function test(name, run) { run(); passed++; console.log('✓ ' + name); }
function profile(name, route = '/chatgpt/', extras = {}) {
  const canonical = extras.canonical || 'https://banglaaiguide.com' + route;
  const app = { '@type': extras.type || 'SoftwareApplication', name, url: extras.url || canonical };
  const data = { '@graph': [app, ...(extras.apps || [])] };
  return `<link href="${canonical}" rel="canonical"><h1>Unrelated editorial title</h1><script type="application/ld+json">${JSON.stringify(data)}</script>`;
}
test('All tools resolve to a present canonical profile or validated direct HTTPS product fallback', () => {
  assert.equal(Object.keys(api.routes).length, tools.length);
  for (const tool of tools) {
    const route = api.resolve(tool); assert(route, tool.name); assert.equal(route.name, tool.name);
    assert.equal(route.slug, generator.slugify(tool.name)); assert.equal(api.resolve(tool.name), route); assert.equal(api.resolve(route.slug), route);
    if (route.isProfile) {
      assert.equal(route.kind, 'profile'); assert.equal(route.isExternal, false);
      assert.match(route.href, /^\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/);
      const file = path.join(ROOT, route.href.slice(1), 'index.html'); assert(fs.existsSync(file), file);
      assert.equal(generator.profileIdentity(fs.readFileSync(file, 'utf8'), route.href), tool.name.trim().replace(/\s+/g, ' ').toLowerCase());
      assert.equal(route.labelEn, 'View tool profile');
    } else {
      assert.equal(route.kind, 'external'); assert.equal(route.isExternal, true); assert.equal(route.href, generator.directDestination(tool));
      assert.equal(new URL(route.href).protocol, 'https:'); assert.equal(route.labelEn, 'Visit product website'); assert.equal(route.labelBn, 'টুলের ওয়েবসাইট');
    }
  }
});
test('PlayHT resolves its real canonical profile using name and both slugs', () => {
  assert.equal(api.resolve('PlayHT').href, '/play-ht/');
  assert.equal(api.resolve('playht'), api.resolve('play-ht'));
});
test('Current directory gaps remain explicitly external, without invented profile pages', () => {
  const missing = tools.filter(tool => !api.resolve(tool).isProfile);
  assert.equal(missing.length, 12);
  for (const tool of missing) {
    assert(!fs.existsSync(path.join(ROOT, generator.slugify(tool.name), 'index.html')), tool.name);
    assert(!api.resolve(tool).href.startsWith('/'));
  }
});
test('Canonical and schema identity are mandatory; article headings never establish profiles', () => {
  assert.equal(generator.profileIdentity('<link rel="canonical" href="https://banglaaiguide.com/chatgpt/"><h1>ChatGPT</h1>', '/chatgpt/'), null);
  assert.equal(generator.profileIdentity(profile('ChatGPT', '/chatgpt/', { type: 'Article' }), '/chatgpt/'), null);
  assert.equal(generator.profileIdentity(profile('Claude'), '/chatgpt/'), 'claude', 'identity must come from structured product name, never title or slug');
  assert.equal(generator.profileIdentity(profile('ChatGPT', '/chatgpt/', { canonical: 'https://banglaaiguide.com/other/' }), '/chatgpt/'), null);
  assert.equal(generator.profileIdentity(profile('ChatGPT', '/chatgpt/', { url: 'https://chatgpt.com/' }), '/chatgpt/'), null);
  assert.equal(generator.profileIdentity(profile('ChatGPT', '/chatgpt/', { apps: [{ '@type': 'SoftwareApplication', name: 'Claude', url: 'https://claude.ai' }] }), '/chatgpt/'), null);
  assert.equal(generator.profileIdentity(profile(' ChatGPT '), '/chatgpt/'), 'chatgpt');
});
test('Unsafe or internal direct fallbacks are rejected instead of creating broken routes', () => {
  for (const direct_url of [undefined, '', 'javascript:alert(1)', 'http://example.org', 'https://user:password@example.org', 'https://banglaaiguide.com/missing/', 'https://www.banglaaiguide.com/missing/', '/missing/', 'https://localhost']) {
    assert.throws(() => generator.directDestination({ name: 'Bad URL', direct_url }));
  }
  assert.equal(generator.directDestination({ name: 'Good', direct_url: 'https://example.org/tool' }), 'https://example.org/tool');
});
test('Browser and CommonJS consumers share immutable entries and unknown names return null', () => {
  const context = { window: {} }; vm.runInNewContext(manifestSource, context);
  const browser = context.window.bagToolRoutes;
  assert.equal(JSON.stringify(browser.routes), JSON.stringify(api.routes));
  for (const key of ['unknown', '__proto__', 'constructor', null, { name: 'Unlisted tool', direct_url: 'https://example.org' }]) assert.equal(browser.resolve(key), null);
  assert(Object.isFrozen(api)); assert(Object.isFrozen(api.routes)); assert(Object.isFrozen(api.resolve('ChatGPT')));
});
test('Manifest regeneration is deterministic and contains no stale data', () => {
  const first = generator.renderManifest(generator.createManifest());
  const second = generator.renderManifest(generator.createManifest(ROOT, [...tools].reverse()));
  assert.equal(first, second); assert.equal(first, manifestSource);
});
test('Build generates routes before HTML consumers', () => {
  const build = fs.readFileSync(path.join(ROOT, 'scripts/build.cjs'), 'utf8');
  assert(build.indexOf('generate-tool-routes.cjs') > build.indexOf('fix-mojibake-slugs.cjs'));
  assert(build.indexOf('generate-tool-routes.cjs') < build.indexOf('prerender-homepage.cjs'));
});
console.log(`\n${passed} routing tests passed for ${tools.length} tools. No network requests made.`);

#!/usr/bin/env node
// Run: node scripts/test-consent-analytics.cjs — no third-party packages or network needed.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ROOT = path.resolve(__dirname, '..');
const consentSource = fs.readFileSync(path.join(ROOT, 'js/consent.js'), 'utf8');
const analyticsSource = fs.readFileSync(path.join(ROOT, 'js/analytics.js'), 'utf8');
const KEY = 'banglaAiGuideAnalyticsConsentV2';
function harness(initial = {}, brokenStorage = false) {
  const listeners = new Map();
  const values = new Map(Object.entries(initial));
  const allNodes = [];
  let document;
  class Node {
    constructor(tag) { this.tagName = tag.toUpperCase(); this.children = []; this.attributes = {}; this.isConnected = false; this.events = {}; this.hidden = false; this.dataset = {}; allNodes.push(this); }
    appendChild(node) { node.isConnected = true; this.children.push(node); return node; }
    setAttribute(name, value) { this.attributes[name] = String(value); }
    getAttribute(name) { return this.attributes[name] || null; }
    addEventListener(type, fn) { this.events[type] = fn; }
    querySelector(selector) { return selector === 'button' ? { focus() {} } : null; }
    focus() { document.activeElement = this; }
    remove() { this.isConnected = false; }
  }
  const cookies = new Map([['_ga', 'abc'], ['_ga_DMM6V53DKC', 'xyz'], ['unrelated', 'keep']]);
  document = {
    readyState: 'complete', documentElement: { lang: 'bn' }, head: new Node('head'), body: new Node('body'),
    activeElement: null, referrer: 'https://example.org/ref?email=private@example.org#secret',
    createElement: tag => new Node(tag),
    getElementById: id => allNodes.find(n => n.id === id && n.isConnected) || null,
    addEventListener(type, fn) { listeners.set('document:' + type, [...(listeners.get('document:' + type) || []), fn]); },
    get cookie() { return [...cookies].map(([k, v]) => k + '=' + v).join('; '); },
    set cookie(value) { if (value.includes('Max-Age=0')) cookies.delete(value.split('=')[0]); },
  };
  const window = {
    location: { origin: 'https://banglaaiguide.com', hostname: 'banglaaiguide.com', pathname: '/', href: 'https://banglaaiguide.com/?q=private@example.org#secret' },
    localStorage: {
      getItem(key) { if (brokenStorage) throw new Error('disabled'); return values.get(key) ?? null; },
      setItem(key, value) { if (brokenStorage) throw new Error('disabled'); values.set(key, value); },
    },
    addEventListener(type, fn) { listeners.set(type, [...(listeners.get(type) || []), fn]); },
    dispatchEvent(event) { for (const fn of listeners.get(event.type) || []) fn(event); },
  };
  const context = vm.createContext({ window, document, URL, Date, Object, CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init?.detail; } }, MutationObserver: class { observe() {} } });
  vm.runInContext(consentSource, context);
  vm.runInContext(analyticsSource, context);
  return {
    window, document, values, cookies,
    script: () => document.getElementById('bagAnalyticsScript'),
    calls: () => JSON.parse(JSON.stringify(window.dataLayer.map(args => Array.from(args)))),
    load: () => document.getElementById('bagAnalyticsScript').onload(),
    activateDownload(href, options = {}) {
      const event = { type: 'click', button: 0, defaultPrevented: false,
        target: { closest: selector => selector === 'a[download]' ? { href } : null }, ...options };
      for (const fn of listeners.get('document:' + event.type) || []) fn(event);
      return event;
    },
  };
}
let passed = 0;
function test(name, run) { run(); passed++; console.log('✓ ' + name); }
test('No choice: no analytics request, no event queue, settings offered', () => {
  const h = harness();
  assert.equal(h.script(), null);
  assert.equal(h.window.bagAnalytics.track('tool_outbound', { tool_id: 'chatgpt' }), false);
  assert.equal(h.window.gtag, undefined);
  assert(h.document.getElementById('cookieConsentBanner'));
  assert.equal(h.calls().filter(c => c[0] === 'event').length, 0);
});
test('Legacy generic cookie acceptance is not treated as analytics consent', () => {
  const h = harness({ banglaAiGuideConsentV1: 'accepted', banglaAiGuideCookieAccepted: 'true' });
  assert.equal(h.window.bagConsent.getAnalytics(), null);
  assert.equal(h.script(), null);
});
test('Stored refusal or corrupt values never load analytics', () => {
  assert.equal(harness({ [KEY]: 'rejected' }).script(), null);
  assert.equal(harness({ [KEY]: 'yes' }).script(), null);
});
test('Stored acceptance loads exactly one script and sanitizes the page view', () => {
  const h = harness({ [KEY]: 'accepted' });
  assert(h.script());
  assert.equal(h.calls().filter(c => c[0] === 'config').length, 0);
  h.load();
  const view = h.calls().find(c => c[0] === 'event' && c[1] === 'page_view');
  assert.equal(view[2].page_location, 'https://banglaaiguide.com/');
  assert.equal(view[2].page_referrer, 'https://example.org');
  assert(!JSON.stringify(h.calls()).includes('private@example.org'));
  assert.equal(h.calls().find(c => c[0] === 'config')[2].send_page_view, false);
  const first = h.script(); h.window.bagConsent.setAnalytics('accepted'); assert.equal(h.script(), first);
});
test('Storage failure denies by default; explicit consent is page-session only', () => {
  const h = harness({}, true);
  assert.equal(h.script(), null);
  h.window.bagConsent.setAnalytics('accepted'); assert(h.script());
  assert.equal(h.values.has(KEY), false);
  assert.equal(harness({}, true).script(), null);
});
test('Revocation while a script is in flight prevents config and page view', () => {
  const h = harness(); h.window.bagConsent.setAnalytics('accepted'); h.window.bagConsent.setAnalytics('rejected'); h.load();
  assert.equal(h.window['ga-disable-G-DMM6V53DKC'], true);
  assert.equal(h.calls().filter(c => ['config', 'event'].includes(c[0])).length, 0);
});
test('Revocation after loading blocks new events and clears only GA cookies', () => {
  const h = harness({ [KEY]: 'accepted' }); h.load(); h.window.bagConsent.setAnalytics('rejected');
  assert.equal(h.window.bagAnalytics.track('tool_outbound', { source: 'detail', tool_id: 'chatgpt' }), false);
  assert.equal(h.cookies.has('_ga'), false); assert.equal(h.cookies.has('_ga_DMM6V53DKC'), false);
  assert.equal(h.cookies.get('unrelated'), 'keep'); assert.equal(h.values.get(KEY), 'rejected');
});
test('Cross-tab refusal and clearing choices disable analytics', () => {
  const h = harness({ [KEY]: 'accepted' }); h.load(); h.values.set(KEY, 'rejected');
  h.window.dispatchEvent({ type: 'storage', key: KEY }); assert.equal(h.window['ga-disable-G-DMM6V53DKC'], true);
  h.values.delete(KEY); h.window.dispatchEvent({ type: 'storage', key: null });
  assert.equal(h.window.bagConsent.getAnalytics(), null); assert(h.document.getElementById('cookieConsentBanner'));
});
test('Only allowed parameters pass; raw query, email and destination URLs are discarded', () => {
  const h = harness({ [KEY]: 'accepted' }); h.load();
  assert.equal(h.window.bagAnalytics.track('tool_outbound', { source: 'detail', tool_id: 'chatgpt', email: 'secret@example.com', query: 'secret', link_url: 'https://example.com/?email=secret' }), true);
  const event = h.calls().at(-1); assert.equal(event[1], 'tool_outbound');
  assert.deepEqual(Object.keys(event[2]).sort(), ['page_location', 'page_referrer', 'source', 'tool_id']);
  assert.equal(event[2].tool_id, 'chatgpt'); assert.equal(event[2].source, 'detail');
  h.window.bagAnalytics.track('tool_save', { action: 'unknown', tool_id: 'private@example.com' });
  assert.deepEqual(Object.keys(h.calls().at(-1)[2]).sort(), ['page_location', 'page_referrer']);
});
test('Unknown events, including unproven newsletter success, are rejected', () => {
  const h = harness({ [KEY]: 'accepted' }); h.load();
  assert.equal(h.window.bagAnalytics.track('newsletter_success'), false);
  assert.equal(h.window.bagAnalytics.track('constructor'), false);
  assert.equal(h.window.bagAnalytics.track('newsletter_submit', { source: 'homepage' }), true);
});
test('Invalid consent values cannot change the user choice', () => {
  const h = harness(); assert.equal(h.window.bagConsent.setAnalytics('anything'), false);
  assert.equal(h.window.bagConsent.getAnalytics(), null); assert.equal(h.script(), null);
});
test('A failed analytics download can be retried without blocking site consent', () => {
  const h = harness({ [KEY]: 'accepted' }); h.script().onerror(); assert.equal(h.script(), null);
  assert.equal(h.window.bagConsent.setAnalytics('accepted'), true); assert(h.script());
});
const calendarUrl = 'https://banglaaiguide.com/blog/choto-online-dokan-7-diner-content-plan/content-calendar.csv';
const promptsUrl = calendarUrl.replace('content-calendar.csv', 'bangla-prompts.txt');
const downloads = h => h.calls().filter(c => c[0] === 'event' && c[1] === 'template_download_click');
test('Template clicks without consent or before loading are discarded, never replayed', () => {
  for (const choice of [undefined, 'rejected', 'accepted']) {
    const h = harness(choice ? { [KEY]: choice } : {});
    h.activateDownload(calendarUrl);
    assert.equal(downloads(h).length, 0);
    h.window.bagConsent.setAnalytics('accepted'); h.load();
    assert.equal(downloads(h).length, 0);
  }
});
test('Mouse, keyboard and middle-click template activations emit fixed IDs without blocking navigation', () => {
  const h = harness({ [KEY]: 'accepted' }); h.load();
  let prevented = false;
  h.activateDownload(calendarUrl, { preventDefault() { prevented = true; } });
  h.activateDownload(promptsUrl, { detail: 0 });
  h.activateDownload(calendarUrl, { type: 'auxclick', button: 1 });
  assert.equal(prevented, false);
  assert.deepEqual(downloads(h).map(c => c[2].resource_id), ['shop-calendar-csv', 'shop-prompts-txt', 'shop-calendar-csv']);
  for (const call of downloads(h)) {
    assert.deepEqual(Object.keys(call[2]).sort(), ['page_location', 'page_referrer', 'resource_id']);
    assert.equal(call[2].page_location, 'https://banglaaiguide.com/');
    assert.equal(call[2].page_referrer, 'https://example.org');
  }
});
test('Unknown, external, query-bearing, fragment, non-download and cancelled links are ignored', () => {
  const h = harness({ [KEY]: 'accepted' }); h.load();
  for (const href of [calendarUrl.replace('banglaaiguide.com', 'example.org'), calendarUrl + '?email=private@example.org', calendarUrl + '#secret', calendarUrl.replace('content-calendar.csv', 'other.csv'), 'http://[']) h.activateDownload(href);
  h.activateDownload(calendarUrl, { type: 'auxclick', button: 2 });
  h.activateDownload(calendarUrl, { button: 1 });
  h.activateDownload(calendarUrl, { defaultPrevented: true });
  h.activateDownload(calendarUrl, { target: { closest: () => null } });
  assert.equal(downloads(h).length, 0);
});
test('Revocation immediately stops download events and reacceptance never replays them', () => {
  const h = harness({ [KEY]: 'accepted' }); h.load();
  h.activateDownload(calendarUrl); h.window.bagConsent.setAnalytics('rejected');
  h.activateDownload(promptsUrl); h.window.bagConsent.setAnalytics('accepted');
  assert.equal(downloads(h).length, 1);
  h.activateDownload(promptsUrl); assert.equal(downloads(h).length, 2);
});
test('Template event cannot pass arbitrary resource IDs or private fields', () => {
  const h = harness({ [KEY]: 'accepted' }); h.load();
  assert.equal(h.window.bagAnalytics.track('template_download_click', { resource_id: 'private@example.org' }), false);
  assert.equal(h.window.bagAnalytics.track('template_download_click'), false);
  assert.equal(h.window.bagAnalytics.track('template_download_click', null), false);
  assert.equal(downloads(h).length, 0);
  h.window.bagAnalytics.track('template_download_click', { resource_id: 'shop-calendar-csv', link_url: calendarUrl, file_name: 'secret.txt', query: 'secret' });
  assert.deepEqual(Object.keys(downloads(h)[0][2]).sort(), ['page_location', 'page_referrer', 'resource_id']);
});
test('Published guide uses the fresh analytics script and both real downloadable resources', () => {
  const articleDir = path.join(ROOT, 'blog/choto-online-dokan-7-diner-content-plan');
  const html = fs.readFileSync(path.join(articleDir, 'index.html'), 'utf8');
  assert(html.includes('/js/analytics.js?v=2026-11-06-downloads'));
  for (const file of ['content-calendar.csv', 'bangla-prompts.txt']) {
    assert(html.includes('href="' + file + '" download'));
    assert(fs.statSync(path.join(articleDir, file)).size > 0);
  }
});
console.log(`\n${passed} consent and analytics checks passed.`);

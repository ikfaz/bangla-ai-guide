#!/usr/bin/env node
// Run: node scripts/test-tool-submission.cjs. No dependencies, emails or network requests.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ROOT = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(ROOT, 'js/submit.js'), 'utf8');
const html = fs.readFileSync(path.join(ROOT, 'submit/index.html'), 'utf8');
class Element {
  constructor(props = {}) { this.listeners = new Map(); this.attributes = {}; this.textContent = ''; this.hidden = true; Object.assign(this, props); }
  addEventListener(type, fn) { this.listeners.set(type, [...(this.listeners.get(type) || []), fn]); }
  emit(type) { const event = { defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } }; for (const fn of this.listeners.get(type) || []) fn(event); return event; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  focus() { this.focused = true; }
}
function harness(overrides = {}, { initialize = true, missingDraft = false } = {}) {
  const defaults = { toolName: 'Test AI', websiteUrl: 'https://example.org', category: 'productivity', pricing: 'free', usdPrice: 'Free', descriptionBn: 'বাংলা লেখার কাজে ব্যবহার করা যায়।', submitterEmail: 'reader@example.org' };
  const fields = Object.fromEntries(Object.entries({ ...defaults, ...overrides }).filter(([k]) => k in defaults).map(([name, value]) => [name, new Element({ name, value, required: !['usdPrice', 'submitterEmail'].includes(name), validity: { typeMismatch: name === 'submitterEmail' && value !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) } })]));
  const choices = { worksInBd: ['yes', 'no'], vpnRequired: ['yes', 'no'], paymentMethod: ['not_required', 'card', 'bkash', 'both', 'unknown'], listingType: ['free', 'featured'] };
  const radios = Object.fromEntries(Object.entries(choices).map(([name, values]) => [name, values.map((value, index) => new Element({ name, value, checked: name in overrides ? value === overrides[name] : index === 0 }))]));
  const elements = { ...fields };
  for (const [name, inputs] of Object.entries(radios)) elements[name] = { get value() { return inputs.find(i => i.checked)?.value || ''; } };
  const allInputs = [...Object.values(fields), ...Object.values(radios).flat()];
  const errors = Object.fromEntries(Object.keys(elements).map(name => [name, new Element()]));
  const status = new Element(); const link = new Element({ href: 'mailto:ifale200@gmail.com' }); const counter = new Element(); const submit = new Element({ disabled: true });
  let resets = 0; let sends = 0;
  const form = new Element({ elements, reset() { resets++; }, submit() { sends++; }, requestSubmit() { sends++; } });
  form.querySelector = () => submit;
  form.querySelectorAll = selector => selector === '.field-error' ? Object.values(errors) : selector === "[aria-invalid='true']" ? allInputs.filter(i => i.attributes['aria-invalid'] === 'true') : Object.values(fields);
  const document = {
    getElementById: id => ({ toolSubmitForm: form, submitSuccess: status, toolEmailDraft: missingDraft ? null : link, descriptionBn: fields.descriptionBn, descriptionCounter: counter })[id] || null,
    querySelector: selector => errors[/data-error-for="([^"]+)"/.exec(selector)?.[1]] || null,
    querySelectorAll: selector => radios[/input\[name="([^"]+)"\]/.exec(selector)?.[1]] || [],
  };
  const external = [];
  const block = name => () => { external.push(name); throw new Error('Unexpected external call: ' + name); };
  const boot = () => vm.runInNewContext(source, { document, window: { open: block('open'), fetch: block('fetch'), location: { assign: block('assign') } }, fetch: block('fetch'), navigator: { sendBeacon: block('sendBeacon') }, XMLHttpRequest: block('XHR'), URL, encodeURIComponent });
  if (initialize) boot();
  return { fields, radios, errors, status, link, counter, submit, form, boot, external, resets: () => resets, sends: () => sends, snapshot: () => JSON.stringify(Object.fromEntries(Object.entries(elements).map(([k,v]) => [k,v.value]))) };
}
let passed = 0;
function test(name, fn) { fn(); passed++; console.log('✓ ' + name); }
test('Nested route loads root-relative assets and truthful draft markup', () => {
  assert.match(html, /src="\/js\/submit\.js\?[^\"]+" defer/); assert.match(html, /href="\/css\/style\.css"/);
  assert.match(html, /<button type="submit" disabled/); assert.match(html, /id="toolEmailDraft"/);
  assert.match(html, /তথ্য এখনো পাঠানো হয়নি/); assert.match(html, /প্রকাশ বা নির্দিষ্ট সময়ে পর্যালোচনার নিশ্চয়তা নেই/);
  assert(!html.includes('৳৯৯৯')); assert(!html.includes('২৪ ঘন্টার মধ্যে'));
  const localHrefs = [...html.matchAll(/href="([^\"]+)"/g)].map(m => m[1]).filter(href => !/^[a-z]+:/i.test(href));
  assert(localHrefs.every(href => href.startsWith('/')), 'local links must resolve from /submit/');
});
test('Submit stays disabled until handler binds, and remains disabled if draft UI is missing', () => {
  const h = harness({}, { initialize: false }); assert.equal(h.submit.disabled, true); h.boot();
  assert.equal(h.submit.disabled, false); assert.equal(h.form.listeners.get('submit').length, 1);
  const missing = harness({}, { missingDraft: true }); assert.equal(missing.submit.disabled, true); assert.equal(missing.form.listeners.has('submit'), false);
});
test('Invalid required fields, URL protocols, email, length and radio groups prevent a draft', () => {
  const invalids = [{ toolName: '' }, { websiteUrl: '' }, { websiteUrl: 'not-a-url' }, { websiteUrl: 'javascript:alert(1)' }, { websiteUrl: 'ftp://example.org' }, { category: '' }, { pricing: '' }, { descriptionBn: '' }, { descriptionBn: 'a'.repeat(201) }, { submitterEmail: 'bad-email' }, { worksInBd: '' }, { vpnRequired: '' }, { paymentMethod: '' }, { listingType: '' }];
  for (const values of invalids) {
    const h = harness(values); const before = h.snapshot(); const name = Object.keys(values)[0];
    assert.equal(h.form.emit('submit').defaultPrevented, true); assert.equal(h.status.hidden, true, name);
    assert(h.errors[name].textContent, name); assert.equal(h.link.href, 'mailto:ifale200@gmail.com');
    assert.equal(h.snapshot(), before); assert.equal(h.resets(), 0); assert.equal(h.sends(), 0); assert.equal(h.external.length, 0);
  }
});
test('Valid submission includes every detail in a draft without sending or resetting', () => {
  const h = harness(); const before = h.snapshot(); const count = h.counter.textContent;
  assert.equal(h.form.emit('submit').defaultPrevented, true); assert.equal(h.status.hidden, false); assert.equal(h.link.focused, true);
  const uri = new URL(h.link.href); assert.equal(uri.protocol, 'mailto:'); assert.equal(uri.pathname, 'ifale200@gmail.com');
  assert.equal(uri.searchParams.get('subject'), 'AI tool review: Test AI');
  const body = uri.searchParams.get('body');
  for (const field of Object.values(h.fields)) assert(body.includes(field.value), field.name);
  for (const label of ['Works in Bangladesh:', 'VPN required:', 'Tool payment method: প্রয়োজন নেই', 'Enquiry: টুল পর্যালোচনার অনুরোধ']) assert(body.includes(label));
  assert.equal(h.snapshot(), before); assert.equal(h.counter.textContent, count); assert.equal(h.resets(), 0); assert.equal(h.sends(), 0); assert.equal(h.external.length, 0);
});
test('Draft encoding prevents recipient and query injection; sponsorship is an enquiry', () => {
  const name = 'AI &bcc=attacker@example.org?#%'; const description = 'Details &cc=attacker@example.org?#%\nবাংলা';
  const h = harness({ toolName: name, descriptionBn: description, listingType: 'featured' }); h.form.emit('submit');
  const uri = new URL(h.link.href); assert.deepEqual([...uri.searchParams.keys()], ['subject', 'body']); assert.equal(uri.hash, ''); assert.equal(uri.pathname, 'ifale200@gmail.com');
  assert.equal(uri.searchParams.get('subject'), 'AI tool review: ' + name); assert(uri.searchParams.get('body').includes(description));
  assert(uri.searchParams.get('body').includes('স্পনসরশিপ সম্পর্কে জানতে চাই')); assert(!uri.searchParams.get('body').includes('৯৯৯'));
});
test('Optional email and price may be blank; free tool requires no payment', () => {
  const h = harness({ submitterEmail: '', usdPrice: '', paymentMethod: 'not_required' }); h.form.emit('submit');
  assert.equal(h.status.hidden, false); assert(new URL(h.link.href).searchParams.get('body').includes('Submitter email: উল্লেখ করা হয়নি'));
});
test('Counter tracks edits and invalid resubmit hides the previous draft status', () => {
  const h = harness(); h.form.emit('submit'); assert.equal(h.status.hidden, false);
  h.fields.descriptionBn.value = ''; h.fields.descriptionBn.emit('input'); assert.equal(h.counter.textContent, '০/২০০');
  h.form.emit('submit'); assert.equal(h.status.hidden, true); assert.equal(h.resets(), 0);
});
console.log(`\n${passed} tool submission tests passed. No emails or network requests sent.`);

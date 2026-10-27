#!/usr/bin/env node
// Run: node scripts/test-form-handoffs.cjs. Uses only Node built-ins; never sends a request.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ROOT = path.resolve(__dirname, '..');
const contactSource = fs.readFileSync(path.join(ROOT, 'js/contact.js'), 'utf8');
const contactHTML = fs.readFileSync(path.join(ROOT, 'contact/index.html'), 'utf8');
const newsletterSource = fs.readFileSync(path.join(ROOT, 'js/mailchimp.js'), 'utf8');

class Element {
  constructor(properties = {}) {
    this.listeners = new Map(); this.attributes = {}; this.dataset = {}; this.hidden = true;
    this.textContent = ''; Object.assign(this, properties);
  }
  addEventListener(type, listener) {
    this.listeners.set(type, [...(this.listeners.get(type) || []), listener]);
  }
  emit(type) {
    const event = { type, target: this, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } };
    for (const listener of this.listeners.get(type) || []) listener(event);
    return event;
  }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  focus() { this.focused = true; }
}
function noExternalEffects(document, source) {
  const calls = [];
  const blocked = name => (...args) => { calls.push({ name, args }); throw new Error('Unexpected external effect: ' + name); };
  const window = { open: blocked('window.open'), fetch: blocked('window.fetch'), location: { assign: blocked('location.assign'), replace: blocked('location.replace') } };
  const context = vm.createContext({ document, window, fetch: blocked('fetch'), navigator: { sendBeacon: blocked('sendBeacon') }, XMLHttpRequest: blocked('XMLHttpRequest'), encodeURIComponent });
  vm.runInContext(source, context);
  return calls;
}
function contact(values = {}, initialize = true) {
  const defaults = { name: 'রহিম', email: 'reader@example.org', topic: 'feedback', message: 'I have a detailed suggestion for your guide.' };
  const fields = Object.fromEntries(Object.entries({ ...defaults, ...values }).map(([name, value]) => [name, new Element({ name, value, required: true, validity: { typeMismatch: name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) } })]));
  fields.topic.selectedOptions = [{ textContent: 'Feedback' }];
  const errors = Object.fromEntries(Object.keys(fields).map(name => [name, new Element()]));
  const status = new Element(); const link = new Element({ href: 'mailto:ifale200@gmail.com' });
  let resets = 0; let sends = 0;
  const submit = new Element({ disabled: true });
  const form = new Element({ elements: fields, reset() { resets++; }, submit() { sends++; }, requestSubmit() { sends++; } });
  form.querySelector = selector => selector === 'button[type="submit"]' ? submit : null;
  form.querySelectorAll = selector => selector === 'input, select, textarea' ? Object.values(fields) : selector === '.contact-error' ? Object.values(errors) : Object.values(fields).filter(field => field.getAttribute('aria-invalid') === 'true');
  const document = {
    getElementById: id => ({ contactForm: form, contactSuccess: status, contactEmailDraft: link })[id] || null,
    querySelector: selector => errors[/data-error-for="([^"]+)"/.exec(selector)?.[1]] || null,
  };
  const external = [];
  const initializeScript = () => external.push(...noExternalEffects(document, contactSource));
  if (initialize) initializeScript();
  return { form, fields, errors, status, link, submit, initializeScript, external, resets: () => resets, sends: () => sends, values: () => Object.fromEntries(Object.entries(fields).map(([name, field]) => [name, field.value])) };
}
function newsletter(valid = true, withStatus = true) {
  const email = new Element({ value: 'reader@example.org' });
  const status = withStatus ? new Element() : null;
  let reports = 0; let resets = 0; let sends = 0;
  const action = 'https://banglaaiguide.us15.list-manage.com/subscribe/post?u=public-list&id=public-form';
  const form = new Element({ action, method: 'post', target: 'hidden-iframe', checkValidity: () => valid, reportValidity() { reports++; }, reset() { resets++; }, submit() { sends++; }, requestSubmit() { sends++; }, parentElement: { querySelector: () => status }, querySelector: () => email });
  const document = new Element(); document.querySelectorAll = () => [form];
  const external = noExternalEffects(document, newsletterSource);
  document.emit('DOMContentLoaded');
  return { document, form, email, status, external, action, reports: () => reports, resets: () => resets, sends: () => sends };
}
let passed = 0;
function test(name, run) { run(); passed++; console.log('✓ ' + name); }

test('Contact: disabled markup and root-relative script protect the nested route', () => {
  const scriptTag = contactHTML.match(/<script\b[^>]*\bsrc=["'][^"']*contact\.js[^"']*["'][^>]*>/i)?.[0];
  assert(scriptTag, 'contact page must load the draft handler');
  const src = scriptTag.match(/\bsrc=["']([^"']+)["']/i)[1];
  assert.match(src, /^\/js\/contact\.js(?:\?|$)/);
  assert.equal(new URL(src, 'https://banglaaiguide.com/contact/').pathname, '/js/contact.js');
  assert.match(scriptTag, /\bdefer\b/i);
  const formHTML = contactHTML.match(/<form\b[^>]*\bid=["']contactForm["'][^>]*>[\s\S]*?<\/form>/i)?.[0];
  assert(formHTML);
  const submitTag = formHTML.match(/<button\b[^>]*\btype=["']submit["'][^>]*>/i)?.[0];
  assert(submitTag); assert.match(submitTag, /\sdisabled(?:\s|=|>)/i);
});
test('Contact: submit stays disabled without script and enables when handler binds', () => {
  const h = contact({}, false);
  assert.equal(h.submit.disabled, true); assert.equal(h.form.listeners.has('submit'), false);
  assert.equal(h.sends(), 0); assert.equal(h.external.length, 0);
  h.initializeScript();
  assert.equal(h.submit.disabled, false); assert.equal(h.form.listeners.get('submit').length, 1);
  assert.equal(h.form.emit('submit').defaultPrevented, true); assert.equal(h.sends(), 0);
});
test('Contact: required and invalid inputs prevent handoff and preserve input', () => {
  for (const invalid of [{ name: '' }, { name: 'A' }, { email: '' }, { email: 'not-email' }, { topic: '' }, { message: '' }, { message: 'Too short' }]) {
    const h = contact(invalid); const before = h.values();
    assert.equal(h.form.emit('submit').defaultPrevented, true);
    assert.equal(h.status.hidden, true);
    const name = Object.keys(invalid)[0]; assert.equal(h.fields[name].getAttribute('aria-invalid'), 'true'); assert(h.errors[name].textContent);
    assert.deepEqual(h.values(), before); assert.equal(h.resets(), 0); assert.equal(h.sends(), 0); assert.equal(h.external.length, 0);
    assert.equal(h.link.href, 'mailto:ifale200@gmail.com');
  }
});
test('Contact: valid submission prepares a draft only; no sending, resetting, or navigation', () => {
  const h = contact(); const before = h.values();
  assert.equal(h.form.emit('submit').defaultPrevented, true);
  assert.equal(h.status.hidden, false); assert.equal(h.link.focused, true);
  const uri = new URL(h.link.href);
  assert.equal(uri.protocol, 'mailto:'); assert.equal(uri.pathname, 'ifale200@gmail.com');
  assert.equal(uri.searchParams.get('subject'), 'Bangla AI Guide: Feedback');
  assert.equal(uri.searchParams.get('body'), before.message + '\n\n' + before.name + '\n' + before.email);
  assert.deepEqual(h.values(), before); assert.equal(h.resets(), 0); assert.equal(h.sends(), 0); assert.equal(h.external.length, 0);
  assert.equal(h.status.textContent, '', 'script must not replace the honest draft status with a success claim');
});
test('Contact: user text cannot inject recipient or additional mailto query parameters', () => {
  const h = contact({ name: 'রহিম &bcc=attacker@example.org', message: 'A detailed message &cc=attacker@example.org?#%\nবাংলা' });
  h.fields.topic.selectedOptions[0].textContent = 'Feedback &bcc=attacker@example.org?#%';
  h.form.emit('submit'); const uri = new URL(h.link.href);
  assert.deepEqual([...uri.searchParams.keys()], ['subject', 'body']);
  assert.equal(uri.pathname, 'ifale200@gmail.com'); assert.equal(uri.hash, '');
  assert.equal(uri.searchParams.get('subject'), 'Bangla AI Guide: ' + h.fields.topic.selectedOptions[0].textContent);
  assert(uri.searchParams.get('body').includes(h.fields.message.value));
  assert.equal(h.external.length, 0);
});
test('Contact: an invalid resubmission hides the previous draft status', () => {
  const h = contact(); h.form.emit('submit'); assert.equal(h.status.hidden, false);
  h.fields.message.value = 'short'; h.form.emit('submit'); assert.equal(h.status.hidden, true); assert.equal(h.resets(), 0);
});
test('Contact: field correction clears validation feedback', () => {
  const h = contact({ name: 'A' }); h.fields.name.emit('blur'); assert.equal(h.fields.name.getAttribute('aria-invalid'), 'true');
  h.fields.name.value = 'Valid name'; h.fields.name.emit('input');
  assert.equal(h.fields.name.getAttribute('aria-invalid'), 'false'); assert.equal(h.errors.name.textContent, '');
});
test('Contact: missing page form is safe', () => {
  assert.deepEqual(noExternalEffects({ getElementById: () => null }, contactSource), []);
});
test('Newsletter: invalid form prevents native submission and reports validity', () => {
  const h = newsletter(false); h.email.emit('invalid');
  assert.equal(h.status.hidden, false); assert.match(h.status.textContent, /valid email address/);
  assert.equal(h.form.emit('submit').defaultPrevented, true); assert.equal(h.reports(), 1);
  assert.equal(h.email.value, 'reader@example.org'); assert.equal(h.resets(), 0); assert.equal(h.sends(), 0); assert.equal(h.external.length, 0);
});
test('Newsletter: valid form retains provider action and explicitly unconfirmed handoff', () => {
  const h = newsletter(); assert.equal(h.form.emit('submit').defaultPrevented, false);
  assert.equal(h.form.action, h.action); assert.equal(h.form.method, 'post'); assert.equal(h.form.target, '_blank');
  assert.equal(h.form.rel, 'noopener noreferrer'); assert.equal(h.status.hidden, false);
  assert.match(h.status.textContent, /subscription is not confirmed here/); assert.match(h.status.textContent, /Complete signup on the Mailchimp page/);
  assert.equal(h.email.value, 'reader@example.org'); assert.equal(h.resets(), 0); assert.equal(h.sends(), 0); assert.equal(h.external.length, 0);
});
test('Newsletter: initialization is idempotent, repeated attempts retain input', () => {
  const h = newsletter(); h.document.emit('DOMContentLoaded'); assert.equal(h.form.listeners.get('submit').length, 1);
  h.form.emit('submit'); h.form.emit('submit'); assert.equal(h.email.value, 'reader@example.org'); assert.equal(h.resets(), 0);
});
test('Newsletter: optional status node and pages without a form are safe', () => {
  assert.equal(newsletter(true, false).form.emit('submit').defaultPrevented, false);
  const document = new Element(); document.querySelectorAll = () => [];
  assert.deepEqual(noExternalEffects(document, newsletterSource), []); document.emit('DOMContentLoaded');
});
console.log(`\n${passed} form handoff tests passed. No emails, subscriptions, or network requests were sent.`);

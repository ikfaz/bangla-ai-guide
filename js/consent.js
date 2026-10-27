/* Consent choices for optional analytics. No analytics is loaded by this file. */
(() => {
  'use strict';
  const KEY = 'banglaAiGuideAnalyticsConsentV2';
  const ACCEPTED = 'accepted';
  const REJECTED = 'rejected';
  const isChoice = value => value === ACCEPTED || value === REJECTED;
  function readChoice() {
    try {
      const value = window.localStorage.getItem(KEY);
      return isChoice(value) ? value : null;
    } catch { return null; }
  }
  let choice = readChoice();
  let previousFocus = null;
  const language = () => document.documentElement.lang.startsWith('en') ? 'en' : 'bn';
  const copy = {
    bn: {
      label: 'অ্যানালিটিক্স কুকির পছন্দ',
      message: 'কোন গাইড ও টুল কাজে লাগছে তা বুঝতে আপনার অনুমতি নিয়ে অ্যানালিটিক্স ব্যবহার করতে চাই। না বললেও সাইটের সব সুবিধা ব্যবহার করতে পারবেন।',
      accept: 'অ্যানালিটিক্সে সম্মতি দিন', reject: 'অ্যানালিটিক্স নয়', privacy: 'গোপনীয়তা', settings: 'কুকি সেটিংস',
    },
    en: {
      label: 'Analytics cookie preferences',
      message: 'With your permission, analytics helps us understand which guides and tools are useful. You can use every site feature without accepting analytics.',
      accept: 'Allow analytics', reject: 'No analytics', privacy: 'Privacy', settings: 'Cookie settings',
    },
  };
  function notify() {
    window.dispatchEvent(new CustomEvent('bag:consent-change', { detail: { analytics: choice } }));
  }
  function clearAnalyticsCookies() {
    // Remove this site's GA cookies when permission is withdrawn. No unrelated cookies are touched.
    const domains = ['', window.location.hostname, '.' + window.location.hostname];
    const labels = window.location.hostname.split('.');
    if (labels.length > 2) domains.push('.' + labels.slice(-2).join('.'));
    try {
      document.cookie.split(';').forEach(part => {
        const name = part.split('=')[0].trim();
        if (name !== '_ga' && !name.startsWith('_ga_')) return;
        domains.forEach(domain => {
          document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax' + (domain ? '; domain=' + domain : '');
        });
      });
    } catch { /* Storage protection must not prevent opting out. */ }
  }
  function hideBanner() {
    document.getElementById('cookieConsentBanner')?.remove();
    const settings = document.getElementById('cookieSettingsBtn');
    if (settings) settings.hidden = false;
    if (previousFocus?.isConnected) previousFocus.focus();
    previousFocus = null;
  }
  function setChoice(value) {
    if (!isChoice(value)) return false;
    choice = value;
    try { window.localStorage.setItem(KEY, value); } catch { /* Consent lasts for this page only. */ }
    if (value === REJECTED) clearAnalyticsCookies();
    notify();
    hideBanner();
    return true;
  }
  function showBanner(moveFocus = false) {
    if (document.getElementById('cookieConsentBanner')) return;
    const words = copy[language()];
    const banner = document.createElement('aside');
    banner.id = 'cookieConsentBanner';
    banner.className = 'bag-consent-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', words.label);
    banner.innerHTML = `<p>${words.message}</p><div class="bag-consent-actions"><button type="button" data-consent-action="accept">${words.accept}</button><button type="button" data-consent-action="reject">${words.reject}</button><a href="/privacy/">${words.privacy}</a></div>`;
    banner.addEventListener('click', event => {
      const button = event.target.closest('[data-consent-action]');
      if (!button) return;
      setChoice(button.dataset.consentAction === 'accept' ? ACCEPTED : REJECTED);
    });
    document.body.appendChild(banner);
    const settings = document.getElementById('cookieSettingsBtn');
    if (settings) settings.hidden = true;
    if (moveFocus) {
      previousFocus = document.activeElement;
      banner.querySelector('button')?.focus();
    }
  }
  function init() {
    if (!document.getElementById('bagConsentStyles')) {
      const style = document.createElement('style');
      style.id = 'bagConsentStyles';
      style.textContent = '.bag-consent-banner{position:fixed;z-index:1000;bottom:16px;left:16px;right:16px;max-width:690px;margin:auto;background:#fff;color:#21382a;border:1px solid #c7d6c5;border-radius:12px;padding:18px;box-shadow:0 8px 35px #102f2526;font:14px/1.6 "Hind Siliguri",system-ui,sans-serif}.bag-consent-banner p{margin:0 0 12px}.bag-consent-actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.bag-consent-actions button{font:inherit;min-height:44px;padding:8px 13px;background:#edf3e8;color:#173e30;border:1px solid #a7bca0;border-radius:7px;cursor:pointer}.bag-consent-actions a{color:#175b43;text-decoration:underline}.bag-consent-banner button:focus-visible,.bag-consent-banner a:focus-visible,#cookieSettingsBtn:focus-visible{outline:3px solid #a47a32;outline-offset:3px}#cookieSettingsBtn{position:fixed;bottom:10px;left:10px;z-index:100;background:#fff;color:#36573f;border:1px solid #c7d6c5;border-radius:6px;padding:7px 10px;min-height:38px;font:12px/1.4 "Hind Siliguri",system-ui,sans-serif;cursor:pointer}#cookieSettingsBtn[hidden]{display:none}';
      document.head.appendChild(style);
    }
    if (!document.getElementById('cookieSettingsBtn')) {
      const settings = document.createElement('button');
      settings.type = 'button';
      settings.id = 'cookieSettingsBtn';
      settings.textContent = copy[language()].settings;
      settings.addEventListener('click', () => showBanner(true));
      document.body.appendChild(settings);
    }
    if (!choice) showBanner();
  }
  window.bagConsent = Object.freeze({ getAnalytics: () => choice, setAnalytics: setChoice, openSettings: () => showBanner(true) });
  window.addEventListener('storage', event => {
    if (event.key !== KEY && event.key !== null) return;
    choice = readChoice();
    if (choice !== ACCEPTED) clearAnalyticsCookies();
    notify();
    if (choice) hideBanner(); else showBanner();
  });
  document.addEventListener('click', event => {
    if (event.target.closest('[data-consent-settings]')) showBanner(true);
  });
  if (typeof MutationObserver === 'function') {
    new MutationObserver(() => {
      const isOpen = !!document.getElementById('cookieConsentBanner');
      if (isOpen) document.getElementById('cookieConsentBanner').remove();
      const settings = document.getElementById('cookieSettingsBtn');
      if (settings) settings.textContent = copy[language()].settings;
      if (isOpen) showBanner();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
  notify();
})();

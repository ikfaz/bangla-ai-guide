/* Optional GA4 loader: only explicit analytics consent allows a network request. */
(() => {
  'use strict';
  const MEASUREMENT_ID = 'G-DMM6V53DKC';
  const DISABLE_KEY = 'ga-disable-' + MEASUREMENT_ID;
  let script = null;
  let loaded = false;
  let configured = false;
  const accepted = () => window.bagConsent?.getAnalytics() === 'accepted';
  window[DISABLE_KEY] = !accepted();
  window.dataLayer = window.dataLayer || [];
  // Keep the queue private: old handlers must not buffer events before consent.
  function enqueue() { window.dataLayer.push(arguments); }
  enqueue('consent', 'default', {
    analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  });
  // Keep free-text searches, email addresses, fragments and inbound query parameters out of events.
  function safePageLocation() { return window.location.origin + window.location.pathname; }
  function safeReferrer() {
    try { return document.referrer ? new URL(document.referrer).origin : ''; } catch { return ''; }
  }
  function enable() {
    if (!loaded || !accepted()) return;
    window[DISABLE_KEY] = false;
    enqueue('consent', 'update', { analytics_storage: 'granted' });
    if (!configured) {
      enqueue('js', new Date());
      enqueue('config', MEASUREMENT_ID, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        page_location: safePageLocation(),
        page_referrer: safeReferrer(),
      });
      configured = true;
      enqueue('event', 'page_view', { page_location: safePageLocation(), page_referrer: safeReferrer() });
    }
  }
  function sync() {
    if (!accepted()) {
      window[DISABLE_KEY] = true;
      enqueue('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
      return;
    }
    window[DISABLE_KEY] = false;
    if (loaded) { enable(); return; }
    if (script) return;
    script = document.createElement('script');
    script.id = 'bagAnalyticsScript';
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
    script.onload = () => { loaded = true; enable(); };
    script.onerror = () => { script.remove(); script = null; };
    document.head.appendChild(script);
  }
  const schemas = {
    directory_search: { source: ['hero', 'directory', 'popular'] },
    directory_result_open: { source: ['directory', 'featured', 'hero', 'detail'], tool_id: 'slug' },
    tool_outbound: { source: ['directory', 'featured', 'detail'], tool_id: 'slug' },
    tool_save: { action: ['save', 'remove'], tool_id: 'slug' },
    category_select: { category: ['all', 'writing', 'image', 'video', 'coding', 'marketing', 'productivity', 'free'] },
    newsletter_submit: { source: ['homepage'] },
    template_download_click: { resource_id: ['shop-calendar-csv', 'shop-prompts-txt'] },
    post_plan_create: {},
    post_plan_csv_click: { variant: ['example', 'custom'] },
  };
  function track(name, parameters = {}) {
    if (!accepted() || !loaded || !configured || !Object.hasOwn(schemas, name)) return false;
    if (name === 'template_download_click' && !schemas[name].resource_id.includes(parameters?.resource_id)) return false;
    if (name === 'post_plan_csv_click' && !schemas[name].variant.includes(parameters?.variant)) return false;
    const payload = { page_location: safePageLocation(), page_referrer: safeReferrer() };
    for (const [key, rule] of Object.entries(schemas[name])) {
      const value = parameters[key];
      if (rule === 'slug' && typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 80) payload[key] = value;
      else if (Array.isArray(rule) && rule.includes(value)) payload[key] = value;
    }
    enqueue('event', name, payload);
    return true;
  }
  window.bagAnalytics = Object.freeze({ track });
  // These events describe link activation, never a completed download or file use.
  // Resolve only known local resources; do not send link text, filenames or URLs.
  const templateResources = new Map([
    ['/blog/choto-online-dokan-7-diner-content-plan/content-calendar.csv', 'shop-calendar-csv'],
    ['/blog/choto-online-dokan-7-diner-content-plan/bangla-prompts.txt', 'shop-prompts-txt'],
  ]);
  function trackTemplateClick(event) {
    if (event.defaultPrevented || (event.type === 'click' && event.button !== 0) ||
        (event.type === 'auxclick' && event.button !== 1)) return;
    const link = event.target?.closest?.('a[download]');
    if (!link) return;
    try {
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.search || url.hash) return;
      const resource = templateResources.get(url.pathname);
      if (resource) track('template_download_click', { resource_id: resource });
    } catch { /* Invalid links must not interfere with navigation. */ }
  }
  document.addEventListener('click', trackTemplateClick);
  document.addEventListener('auxclick', trackTemplateClick);
  window.addEventListener('bag:consent-change', sync);
  sync();
})();

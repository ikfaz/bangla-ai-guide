/*
 * BanglaAIGuide — Service Worker
 *
 * Strategy:
 *   - HTML pages: network-first with stale fallback (always-fresh content,
 *     offline survivable)
 *   - Assets (CSS/JS/fonts/images): stale-while-revalidate (instant load,
 *     background update)
 *   - search-index.json: stale-while-revalidate (instant search)
 *   - Cross-origin (clearbit, fonts.googleapis): cache-first short TTL
 */

const VERSION = 'bag-v2026-05-26-1';
const HTML_CACHE = 'bag-html-' + VERSION;
const ASSET_CACHE = 'bag-asset-' + VERSION;
const RUNTIME = 'bag-runtime-' + VERSION;

const PRECACHE = [
  '/',
  '/blog/',
  '/css/style.css?v=2026-03-12',
  '/js/tools-data.js?v=2026-05-26',
  '/js/main.js?v=2026-05-26',
  '/js/search-overlay.js?v=2026-05-26',
  '/favicon.svg',
  '/site.webmanifest',
  '/search-index.json',
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(ASSET_CACHE).then((cache) =>
      Promise.all(
        PRECACHE.map((url) =>
          fetch(url, { cache: 'reload' })
            .then((r) => (r.ok ? cache.put(url, r) : null))
            .catch(() => null)
        )
      )
    )
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('bag-') && !k.endsWith(VERSION))
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

function isHtmlRequest(req) {
  return req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html');
}

function isSameOrigin(url) {
  return new URL(url).origin === self.location.origin;
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Don't touch analytics / mailchimp / GA — let them pass through
  if (/googletagmanager|google-analytics|mailchimp|list-manage|clearbit/.test(url.hostname)) return;

  // HTML — network first
  if (isHtmlRequest(req)) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(HTML_CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) =>
            cached || caches.match('/') || new Response('Offline', { status: 503, statusText: 'Offline' })
          )
        )
    );
    return;
  }

  // Same-origin assets — stale-while-revalidate
  if (isSameOrigin(req.url)) {
    e.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req)
          .then((res) => {
            if (res && res.ok) {
              const copy = res.clone();
              caches.open(ASSET_CACHE).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Cross-origin (fonts) — cache-first with refresh
  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(RUNTIME).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});

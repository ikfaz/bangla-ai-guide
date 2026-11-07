/*
 * BanglaAIGuide — site-wide search overlay (Cmd+K / Ctrl+K)
 *
 * Self-contained. Self-injects CSS + DOM on load.
 * Loads /search-index.json on first open (lazy).
 *
 * UX:
 *   - Cmd+K / Ctrl+K → open
 *   - Esc → close
 *   - ↑ / ↓ → navigate results
 *   - Enter → open selected
 *   - Click result → open
 *   - Filter chips: All / Tools / Articles
 *
 * Uses the same paper and forest palette as the directory.
 */

(function () {
  'use strict';

  if (window.__BAG_SEARCH_INSTALLED__) return;
  window.__BAG_SEARCH_INSTALLED__ = true;

  // ---------- styles ----------
  var STYLE = `
    .bag-search-trigger,.bag-search-bar .esc,.bag-search-tab,.bag-search-footer .key {font:inherit;border:1px solid #d9e2d5;color:#455b4d;background:#fff;border-radius:7px}
    .bag-search-trigger {display:inline-flex;align-items:center;gap:8px;padding:7px 12px;cursor:pointer;font-size:14px}
    .bag-search-trigger .kbd,.bag-search-footer .key {font:11px/1.5 ui-monospace,monospace;padding:2px 5px}
    .bag-search-overlay {position:fixed;inset:0;z-index:2000;display:none;align-items:start;justify-items:center;padding-top:min(11vh,90px);background:#17332566;backdrop-filter:blur(4px)}
    .bag-search-overlay.open {display:grid}
    .bag-search-modal {width:min(650px,94vw);max-height:85dvh;display:flex;flex-direction:column;background:#fafbf7;color:#1e3028;border:1px solid #cedbc9;border-radius:16px;box-shadow:0 24px 80px #152c2340;overflow:hidden;font:15px/1.55 'Hind Siliguri',system-ui,sans-serif}
    .bag-search-bar,.bag-search-tabs,.bag-search-footer {display:flex;align-items:center;gap:10px;padding:14px 20px;border-bottom:1px solid #e0e7db;flex:none}
    .bag-search-bar svg {width:20px;height:20px;color:#526959;display:block}
    .bag-search-bar input {min-width:0;flex:1;border:0;background:transparent;color:#203528;font:inherit;font-size:17px}
    .bag-search-bar input::placeholder {color:#607265}
    .bag-search-bar .esc {padding:6px 9px;cursor:pointer;font-size:13px}
    .bag-search-tabs {gap:5px;padding:9px 15px;overflow-x:auto}
    .bag-search-tab {border-color:transparent;background:transparent;padding:5px 10px;cursor:pointer;font-size:14px;white-space:nowrap}
    .bag-search-tab:hover,.bag-search-item:hover,.bag-search-item.active {background:#eaf1e6}
    .bag-search-tab.active {background:#175b43;color:#fff}
    .bag-search-tab .count {margin-left:3px;font-size:11px}
    .bag-search-results {overflow-y:auto;max-height:min(55vh,460px);padding:7px}
    .bag-search-item {display:flex;align-items:center;gap:12px;padding:10px 12px;color:inherit;border-radius:8px;text-decoration:none}
    .bag-search-item .icon {width:38px;height:38px;background:#f2e9d6;border-radius:9px;display:grid;place-items:center;flex-shrink:0}
    .bag-search-item.kind-blog .icon {background:#e1edde}.bag-search-item.kind-tool .icon {background:#e8e4f0}
    .bag-search-item .body {min-width:0;flex:1}
    .bag-search-item .title {font-weight:600;line-height:1.45;color:#1e3028;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .bag-search-item .meta {display:flex;align-items:center;gap:8px;font-size:12px;color:#53695a}
    .bag-search-item .badge {border:1px solid #d8e1d3;padding:0 5px;border-radius:4px}
    .bag-search-empty {text-align:center;padding:32px 14px;color:#53695a}.bag-search-empty .big {font-size:28px}
    .bag-search-footer {justify-content:space-between;gap:8px;border:0;border-top:1px solid #e0e7db;padding:10px 18px;font-size:11px;color:#53695a}
    .bag-search-footer .keys {display:flex;gap:12px}.bag-hl {color:#175b43;font-weight:700}
    .bag-search-modal :focus-visible {outline:2px solid #987434;outline-offset:2px}
    @media(max-width:600px){.bag-search-bar{padding:12px}.bag-search-footer{display:none}.bag-search-overlay{padding-top:5vh}.bag-search-tab{padding:5px 8px}.bag-search-tabs{padding:8px}}
  `;

  // ---------- DOM ----------
  var ICON_SEARCH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
  var KIND_ICON = { tool: '⚡', blog: '📖', page: '🔗' };
  var KIND_LABEL = { tool: 'টুল', blog: 'গাইড', page: 'পেজ' };

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k]); }
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function installStyles() {
    var style = el('style'); style.textContent = STYLE; document.head.appendChild(style);
  }

  // ---------- state ----------
  var state = {
    items: null, // [{t,u,d,k,c}]
    loading: false,
    filter: 'all', // all | tool | blog | page
    query: '',
    results: [],
    selected: 0,
    open: false,
  };

  // ---------- index loading ----------
  function loadIndex() {
    if (state.items || state.loading) return Promise.resolve();
    state.loading = true;
    return fetch('/search-index.json', { cache: 'force-cache' })
      .then(function (r) { return r.json(); })
      .then(function (j) { state.items = j.items || []; state.loading = false; })
      .catch(function () { state.items = []; state.loading = false; });
  }

  // ---------- search ----------
  function safeUrl(u) {
    var s = String(u || '').trim();
    if (/^\/(?!\/)/.test(s) || /^https:\/\//i.test(s)) return s;
    return '/';
  }

  function highlight(rawText, q) {
    var text = String(rawText == null ? '' : rawText);
    if (!q) return escapeHtml(text);
    var re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
    var parts = text.split(re);
    var out = '';
    for (var i = 0; i < parts.length; i++) {
      if (i % 2 === 1) out += '<span class="bag-hl">' + escapeHtml(parts[i]) + '</span>';
      else out += escapeHtml(parts[i]);
    }
    return out;
  }

  function search() {
    var q = state.query.trim().toLowerCase();
    var items = state.items || [];
    var pool = state.filter === 'all' ? items : items.filter(function (i) { return i.k === state.filter; });
    if (!q) {
      // Show top 10 of pool when no query (mix kinds if 'all')
      state.results = pool.slice(0, 12);
      state.selected = 0;
      return render();
    }
    var scored = [];
    for (var i = 0; i < pool.length; i++) {
      var it = pool[i];
      var t = (it.t || '').toLowerCase();
      var d = (it.d || '').toLowerCase();
      var c = (it.c || '').toLowerCase();
      var u = (it.u || '').toLowerCase();
      var s = 0;
      if (t.indexOf(q) === 0) s += 50;
      else if (t.indexOf(q) > -1) s += 30;
      if (d.indexOf(q) > -1) s += 10;
      if (c.indexOf(q) > -1) s += 8;
      if (u.indexOf(q) > -1) s += 5;
      if (s > 0) scored.push({ it: it, s: s });
    }
    scored.sort(function (a, b) { return b.s - a.s; });
    state.results = scored.slice(0, 25).map(function (x) { return x.it; });
    state.selected = 0;
    render();
  }

  // ---------- rendering ----------
  var refs = {};
  function buildModal() {
    var overlay = el('div', { class: 'bag-search-overlay', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'সাইট সার্চ' });
    var modal = el('div', { class: 'bag-search-modal' });
    var bar = el('div', { class: 'bag-search-bar' });
    bar.appendChild(el('span', {}, ICON_SEARCH));
    var input = el('input', { type: 'search', placeholder: 'টুল বা গাইড খুঁজুন... (e.g. ChatGPT, ছবি, freelancing)', 'aria-label': 'সার্চ' });
    bar.appendChild(input);
    var closeButton = el('button', { type:'button', class:'esc', 'aria-label':'সার্চ বন্ধ করুন' }, 'বন্ধ ×');
    closeButton.addEventListener('click', close);
    bar.appendChild(closeButton);
    modal.appendChild(bar);

    var tabs = el('div', { class: 'bag-search-tabs', role: 'tablist' });
    [
      { id: 'all', label: 'সব' },
      { id: 'tool', label: 'টুলস' },
      { id: 'blog', label: 'গাইড' },
      { id: 'page', label: 'পেজ' },
    ].forEach(function (t) {
      var b = el('button', { class: 'bag-search-tab' + (t.id === state.filter ? ' active' : ''), 'data-filter': t.id, type: 'button', role: 'tab' });
      b.innerHTML = t.label + ' <span class="count" data-count="' + t.id + '"></span>';
      b.addEventListener('click', function () { state.filter = t.id; search(); updateTabsActive(); });
      tabs.appendChild(b);
    });
    modal.appendChild(tabs);

    var results = el('div', { class: 'bag-search-results', role: 'listbox' });
    modal.appendChild(results);

    var footer = el('div', { class: 'bag-search-footer' });
    footer.innerHTML = '<div class="keys"><span><span class="key">↑↓</span> navigate</span><span><span class="key">↵</span> open</span><span><span class="key">esc</span> close</span></div><div>BanglaAIGuide</div>';
    modal.appendChild(footer);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    refs = { overlay: overlay, input: input, results: results, tabs: tabs };

    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    input.addEventListener('input', function (e) { state.query = e.target.value; search(); });
    input.addEventListener('keydown', onKeydown);
    overlay.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && state.open) { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      var focusables = overlay.querySelectorAll('input, button, a[href]');
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  function updateTabsActive() {
    refs.tabs.querySelectorAll('.bag-search-tab').forEach(function (b) {
      b.classList.toggle('active', b.dataset.filter === state.filter);
    });
  }
  function updateCounts() {
    if (!state.items) return;
    var counts = { all: state.items.length, tool: 0, blog: 0, page: 0 };
    state.items.forEach(function (i) { counts[i.k] = (counts[i.k] || 0) + 1; });
    refs.tabs.querySelectorAll('[data-count]').forEach(function (sp) {
      var k = sp.dataset.count; sp.textContent = counts[k] || 0;
    });
  }

  function render() {
    var q = state.query.trim();
    if (!state.results.length) {
      refs.results.innerHTML = '<div class="bag-search-empty"><div class="big">🔍</div><div>' + (q ? '"' + escapeHtml(q) + '" এর জন্য কোনো ফলাফল নেই' : 'কী খুঁজছেন?') + '</div></div>';
      return;
    }
    refs.results.innerHTML = '';
    state.results.forEach(function (it, idx) {
      var a = el('a', {
        class: 'bag-search-item kind-' + escapeHtml(it.k || 'page') + (idx === state.selected ? ' active' : ''),
        href: safeUrl(it.u), role: 'option', 'data-idx': idx,
      });
      a.innerHTML =
        '<span class="icon">' + (KIND_ICON[it.k] || '🔗') + '</span>' +
        '<span class="body">' +
          '<div class="title">' + highlight(it.t || '', q) + '</div>' +
          '<div class="meta">' +
            '<span class="badge">' + escapeHtml(KIND_LABEL[it.k] || 'পেজ') + '</span>' +
            (it.c ? '<span>' + escapeHtml(it.c) + '</span>' : '') +
            (it.d ? '<span>· ' + truncate(escapeHtml(it.d), 60) + '</span>' : '') +
          '</div>' +
        '</span>' +
        '<span class="arrow">→</span>';
      a.addEventListener('mouseenter', function () { state.selected = idx; updateSelected(); });
      refs.results.appendChild(a);
    });
  }

  function updateSelected() {
    refs.results.querySelectorAll('.bag-search-item').forEach(function (el, i) {
      el.classList.toggle('active', i === state.selected);
      if (i === state.selected) {
        var r = el.getBoundingClientRect(), p = refs.results.getBoundingClientRect();
        if (r.bottom > p.bottom) el.scrollIntoView({ block: 'end' });
        if (r.top < p.top) el.scrollIntoView({ block: 'start' });
      }
    });
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function truncate(s, n) { return s.length <= n ? s : s.slice(0, n - 1) + '…'; }

  function onKeydown(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); state.selected = Math.min(state.selected + 1, state.results.length - 1); updateSelected(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); state.selected = Math.max(state.selected - 1, 0); updateSelected(); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      var it = state.results[state.selected];
      if (it) window.location.href = safeUrl(it.u);
    } else if (e.key === 'Escape') { e.preventDefault(); close(); }
  }

  function open() {
    if (state.open) return;
    state.open = true;
    if (!refs.overlay) buildModal();
    refs.previousFocus = document.activeElement;
    refs.overlay.classList.add('open');
    loadIndex().then(function () { updateCounts(); search(); });
    refs.input.focus(); refs.input.select();
    document.body.style.overflow = 'hidden';
  }
  function close() {
    state.open = false;
    if (refs.overlay) refs.overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (refs.previousFocus && refs.previousFocus.isConnected) refs.previousFocus.focus();
  }

  function setupTrigger() {
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault(); open();
      } else if (e.key === '/' && !state.open && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
        e.preventDefault(); open();
      }
    });
    // The mobile menu is a native disclosure and remains usable without JavaScript.
    var menu = document.querySelector('.gs-mobile');
    if (menu) {
      document.addEventListener('click', function (e) { if (!menu.contains(e.target)) menu.open = false; });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); }
      });
      menu.addEventListener('focusout', function (e) { if (e.relatedTarget && !menu.contains(e.relatedTarget)) menu.open = false; });
    }
    // Any element with data-bag-search opens it
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-bag-search]');
      if (t) { e.preventDefault(); open(); }
    });
  }

  function start() {
    installStyles();
    setupTrigger();
    // Expose API
    window.BAGSearch = { open: open, close: close };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();

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
 * Designed to match dark elegant theme on homepage but also degrade
 * gracefully on light-theme pages.
 */

(function () {
  'use strict';

  if (window.__BAG_SEARCH_INSTALLED__) return;
  window.__BAG_SEARCH_INSTALLED__ = true;

  // ---------- styles ----------
  var STYLE = `
    .bag-search-trigger {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 7px 14px 7px 12px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 9999px;
      color: rgba(255,255,255,0.7);
      font-family: inherit; font-size: 13px;
      cursor: pointer; transition: all .2s;
    }
    .bag-search-trigger:hover { background: rgba(255,255,255,0.1); color: #fff; border-color: rgba(255,255,255,0.2); }
    .bag-search-trigger .kbd {
      display: inline-flex; gap: 2px; padding: 2px 6px;
      background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
      border-radius: 6px; font-family: ui-monospace, monospace; font-size: 11px;
    }

    .bag-search-overlay {
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(8,8,12,0.7);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      opacity: 0; pointer-events: none;
      transition: opacity .15s ease;
      display: grid; place-items: start center;
      padding-top: 12vh;
    }
    .bag-search-overlay.open { opacity: 1; pointer-events: auto; }
    .bag-search-modal {
      width: min(680px, 92vw);
      background: #13131A;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px;
      box-shadow: 0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset;
      overflow: hidden;
      transform: translateY(-12px) scale(0.98);
      transition: transform .2s ease;
      font-family: 'Hind Siliguri', 'Inter', system-ui, sans-serif;
      color: #fff;
    }
    .bag-search-overlay.open .bag-search-modal { transform: translateY(0) scale(1); }

    .bag-search-bar {
      display: flex; align-items: center; gap: 12px;
      padding: 18px 22px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .bag-search-bar svg { width: 20px; height: 20px; color: #94A3B8; flex-shrink: 0; }
    .bag-search-bar input {
      flex: 1; background: transparent; border: none; outline: none;
      color: #fff; font-size: 17px; font-family: inherit;
    }
    .bag-search-bar input::placeholder { color: #64748B; }
    .bag-search-bar .esc {
      padding: 4px 10px; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12); border-radius: 6px;
      color: #94A3B8; font-size: 11px; font-family: ui-monospace, monospace;
    }

    .bag-search-tabs {
      display: flex; gap: 6px; padding: 12px 22px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .bag-search-tab {
      background: transparent; border: 1px solid transparent;
      color: #94A3B8; padding: 6px 14px; border-radius: 9999px;
      font-size: 13px; font-family: inherit; cursor: pointer; transition: all .15s;
    }
    .bag-search-tab:hover { color: #fff; background: rgba(255,255,255,0.04); }
    .bag-search-tab.active { background: rgba(34,197,94,0.15); color: #22C55E; border-color: rgba(34,197,94,0.3); }
    .bag-search-tab .count { opacity: 0.6; margin-left: 6px; font-size: 11px; }

    .bag-search-results {
      max-height: min(60vh, 480px); overflow-y: auto;
      padding: 8px;
    }
    .bag-search-results::-webkit-scrollbar { width: 8px; }
    .bag-search-results::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

    .bag-search-item {
      display: flex; gap: 14px; align-items: center;
      padding: 12px 14px; border-radius: 12px;
      cursor: pointer; transition: background .12s;
      text-decoration: none; color: inherit;
    }
    .bag-search-item:hover, .bag-search-item.active {
      background: rgba(255,255,255,0.05);
    }
    .bag-search-item.active { background: rgba(34,197,94,0.1); }
    .bag-search-item .icon {
      width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
      display: grid; place-items: center; font-size: 18px;
    }
    .bag-search-item.kind-tool .icon { background: linear-gradient(135deg, rgba(99,102,241,.25), rgba(167,139,250,.15)); border-color: rgba(167,139,250,.3); }
    .bag-search-item.kind-blog .icon { background: linear-gradient(135deg, rgba(34,197,94,.2), rgba(34,211,238,.15)); border-color: rgba(34,197,94,.3); }
    .bag-search-item.kind-page .icon { background: linear-gradient(135deg, rgba(245,158,11,.2), rgba(251,113,133,.15)); border-color: rgba(245,158,11,.3); }
    .bag-search-item .body { flex: 1; min-width: 0; }
    .bag-search-item .title {
      font-size: 14px; font-weight: 600; line-height: 1.35;
      color: #fff; margin: 0 0 4px;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .bag-search-item .meta { font-size: 12px; color: #94A3B8; display: flex; gap: 8px; align-items: center; }
    .bag-search-item .badge {
      padding: 2px 8px; border-radius: 9999px;
      font-size: 10px; letter-spacing: 0.04em; text-transform: uppercase;
      background: rgba(255,255,255,0.06); color: #C7D2DE;
    }
    .bag-search-item .arrow { color: #64748B; font-size: 14px; flex-shrink: 0; }

    .bag-search-empty {
      text-align: center; padding: 60px 20px; color: #64748B; font-size: 14px;
    }
    .bag-search-empty .big { font-size: 36px; margin-bottom: 12px; opacity: 0.5; }

    .bag-search-footer {
      padding: 10px 22px; border-top: 1px solid rgba(255,255,255,0.06);
      display: flex; justify-content: space-between; align-items: center;
      font-size: 11px; color: #64748B;
    }
    .bag-search-footer .keys { display: flex; gap: 16px; }
    .bag-search-footer .key {
      padding: 1px 7px; background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 4px;
      font-family: ui-monospace, monospace;
    }

    /* Highlighted match */
    .bag-hl { color: #22C55E; font-weight: 700; }

    @media (max-width: 600px) {
      .bag-search-overlay { padding-top: 6vh; }
      .bag-search-bar input { font-size: 16px; }
      .bag-search-tabs { padding: 10px 14px; overflow-x: auto; }
      .bag-search-footer { display: none; }
    }
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
  function highlight(text, q) {
    if (!q) return text;
    var re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
    return text.replace(re, '<span class="bag-hl">$1</span>');
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
    bar.appendChild(el('span', { class: 'esc' }, 'ESC'));
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
      refs.results.innerHTML = '<div class="bag-search-empty"><div class="big">🔍</div><div>' + (q ? '"' + q + '" এর জন্য কোনো ফলাফল নেই' : 'কী খুঁজছেন?') + '</div></div>';
      return;
    }
    refs.results.innerHTML = '';
    state.results.forEach(function (it, idx) {
      var a = el('a', {
        class: 'bag-search-item kind-' + (it.k || 'page') + (idx === state.selected ? ' active' : ''),
        href: it.u, role: 'option', 'data-idx': idx,
      });
      a.innerHTML =
        '<span class="icon">' + (KIND_ICON[it.k] || '🔗') + '</span>' +
        '<span class="body">' +
          '<div class="title">' + highlight(escapeHtml(it.t || ''), q) + '</div>' +
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
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function truncate(s, n) { return s.length <= n ? s : s.slice(0, n - 1) + '…'; }

  function onKeydown(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); state.selected = Math.min(state.selected + 1, state.results.length - 1); updateSelected(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); state.selected = Math.max(state.selected - 1, 0); updateSelected(); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      var it = state.results[state.selected];
      if (it) window.location.href = it.u;
    } else if (e.key === 'Escape') { e.preventDefault(); close(); }
  }

  function open() {
    if (state.open) return;
    state.open = true;
    if (!refs.overlay) buildModal();
    refs.overlay.classList.add('open');
    loadIndex().then(function () { updateCounts(); search(); });
    setTimeout(function () { refs.input.focus(); refs.input.select(); }, 50);
    document.body.style.overflow = 'hidden';
  }
  function close() {
    state.open = false;
    if (refs.overlay) refs.overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function setupTrigger() {
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault(); open();
      } else if (e.key === '/' && !state.open && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
        e.preventDefault(); open();
      }
    });
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

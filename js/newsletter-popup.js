/*
 * BanglaAIGuide — Newsletter exit-intent popup
 *
 * Triggers (first visit, not dismissed, not already subscribed):
 *   - Mouse leaves viewport from top (desktop exit-intent)
 *   - 70% page scroll (mobile-friendly fallback)
 *   - 30s on page if neither fired
 *
 * Suppression rules:
 *   - localStorage 'bagNlDismissed' set after close → never re-show
 *   - localStorage 'bagNlSubscribed' set after submit → never re-show
 *   - sessionStorage 'bagNlShown' → don't reopen during this session
 *   - 'no-popup' query param skips it
 *   - Doesn't trigger on /quiz/ result step or /submit/ page
 *
 * Posts to Mailchimp via hidden iframe (no full reload).
 */

(function () {
  'use strict';

  if (window.__BAG_NL_INSTALLED__) return;
  window.__BAG_NL_INSTALLED__ = true;

  // ---------- guard rails ----------
  function get(s, k) { try { return s.getItem(k); } catch (_) { return null; } }
  function set(s, k, v) { try { s.setItem(k, v); } catch (_) {} }

  if (location.search.indexOf('no-popup') > -1) return;
  if (/\/(submit|quiz|contact|privacy|terms)\//.test(location.pathname)) return;
  if (get(localStorage, 'bagNlDismissed') === '1') return;
  if (get(localStorage, 'bagNlSubscribed') === '1') return;
  if (get(sessionStorage, 'bagNlShown') === '1') return;

  // ---------- styles ----------
  var STYLE = `
    .bag-nl-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(8,8,12,0.7); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); opacity: 0; pointer-events: none; transition: opacity .25s ease; display: grid; place-items: center; padding: 20px; }
    .bag-nl-overlay.open { opacity: 1; pointer-events: auto; }
    .bag-nl-modal {
      width: min(540px, 100%);
      background: linear-gradient(180deg, #13131A 0%, #0F0F17 100%);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 24px;
      box-shadow: 0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset, 0 0 80px rgba(34,197,94,0.12);
      overflow: hidden; position: relative;
      transform: translateY(20px) scale(0.96);
      transition: transform .3s cubic-bezier(.34,1.36,.64,1);
      font-family: 'Hind Siliguri', 'Inter', system-ui, sans-serif;
      color: #fff;
    }
    .bag-nl-overlay.open .bag-nl-modal { transform: translateY(0) scale(1); }
    .bag-nl-modal::before { content:''; position:absolute; inset:0; background: radial-gradient(ellipse 80% 50% at 20% 0%, rgba(34,197,94,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 100% 100%, rgba(34,211,238,0.12) 0%, transparent 60%); pointer-events:none; z-index:0; }
    .bag-nl-modal > * { position: relative; z-index: 1; }
    .bag-nl-close { position: absolute; top: 14px; right: 14px; width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #94A3B8; font-size: 18px; cursor: pointer; transition: all .15s; display: grid; place-items: center; z-index: 2; }
    .bag-nl-close:hover { background: rgba(255,255,255,0.1); color: #fff; }
    .bag-nl-body { padding: 44px 36px 36px; text-align: center; }
    .bag-nl-icon { display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 18px; background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); margin: 0 auto 20px; font-size: 32px; box-shadow: 0 12px 32px rgba(34,197,94,0.4); }
    .bag-nl-eyebrow { display: inline-block; padding: 4px 14px; background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); border-radius: 9999px; color: #22C55E; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px; }
    .bag-nl-modal h2 { font-family: 'Syne', 'Hind Siliguri', sans-serif; font-size: clamp(24px, 3.5vw, 32px); font-weight: 800; line-height: 1.15; letter-spacing: -0.025em; margin: 0 0 12px; color: #fff; }
    .bag-nl-modal h2 .grad { background: linear-gradient(135deg, #22C55E, #22D3EE); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .bag-nl-modal p { color: #94A3B8; font-size: 15px; line-height: 1.65; margin: 0 0 24px; }
    .bag-nl-form { display: flex; gap: 8px; max-width: 380px; margin: 0 auto 14px; }
    .bag-nl-form input { flex: 1; padding: 13px 18px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.14); border-radius: 9999px; color: #fff; font-family: inherit; font-size: 14px; }
    .bag-nl-form input::placeholder { color: #64748B; }
    .bag-nl-form input:focus { outline: none; border-color: #22C55E; box-shadow: 0 0 0 4px rgba(34,197,94,0.15); background: rgba(255,255,255,0.08); }
    .bag-nl-form button { padding: 13px 24px; background: linear-gradient(135deg, #22C55E, #16A34A); color: #fff; border: none; border-radius: 9999px; font-family: inherit; font-weight: 700; font-size: 14px; cursor: pointer; transition: all .2s; box-shadow: 0 8px 24px rgba(34,197,94,0.35); }
    .bag-nl-form button:hover { transform: translateY(-1px); box-shadow: 0 12px 32px rgba(34,197,94,0.45); }
    .bag-nl-perks { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 24px 0 0; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.06); }
    .bag-nl-perk { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px; }
    .bag-nl-perk .icon { font-size: 16px; }
    .bag-nl-perk .label { font-size: 11px; color: #94A3B8; line-height: 1.3; }
    .bag-nl-fineprint { font-size: 11px; color: #64748B; margin-top: 14px; }
    .bag-nl-fineprint button { background: transparent; border: none; color: #64748B; font-family: inherit; font-size: 11px; text-decoration: underline; cursor: pointer; padding: 0; }
    .bag-nl-fineprint button:hover { color: #94A3B8; }
    .bag-nl-success { display: none; padding: 56px 36px 48px; text-align: center; }
    .bag-nl-success.show { display: block; }
    .bag-nl-success .check { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #22C55E, #16A34A); margin: 0 auto 18px; display: grid; place-items: center; font-size: 32px; color: white; box-shadow: 0 12px 32px rgba(34,197,94,0.4); animation: bagPop .5s cubic-bezier(.34,1.56,.64,1); }
    @keyframes bagPop { from { transform: scale(0); } to { transform: scale(1); } }
    .bag-nl-success h2 { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; margin: 0 0 8px; color: #fff; }
    .bag-nl-success p { color: #94A3B8; margin: 0 0 24px; }

    @media (max-width: 480px) {
      .bag-nl-body { padding: 36px 24px 28px; }
      .bag-nl-form { flex-direction: column; }
      .bag-nl-perks { grid-template-columns: 1fr 1fr; }
      .bag-nl-perks .bag-nl-perk:last-child { grid-column: 1 / -1; }
    }
  `;

  // ---------- DOM ----------
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k]); }
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function installStyles() {
    var s = el('style'); s.setAttribute('data-bag-nl', '1'); s.textContent = STYLE; document.head.appendChild(s);
  }

  var refs = {};

  function build() {
    var overlay = el('div', { class: 'bag-nl-overlay', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'নিউজলেটার সাবস্ক্রিপশন' });
    overlay.innerHTML =
      '<div class="bag-nl-modal">' +
        '<button type="button" class="bag-nl-close" aria-label="বন্ধ">✕</button>' +
        '<div class="bag-nl-body" data-form-wrap>' +
          '<div class="bag-nl-icon">📬</div>' +
          '<div class="bag-nl-eyebrow">FREE · বাংলায়</div>' +
          '<h2>একটি AI টিপ <span class="grad">প্রতি সপ্তাহে</span></h2>' +
          '<p>বাংলাদেশি AI ব্যবহারকারীদের জন্য কিউরেটেড — নতুন টুল, ফ্রি ডিল, bKash পেমেন্ট হ্যাক, সব ইনবক্সে।</p>' +
          '<form class="bag-nl-form newsletter-form newsletter-form--mailchimp" action="https://banglaaiguide.us15.list-manage.com/subscribe/post?u=d389c0647878724daecc58fc6&id=aaca6896d2&f_id=007c9ae1f0" method="post" target="bag-nl-iframe" accept-charset="UTF-8" data-mailchimp-form="true">' +
            '<input type="email" name="EMAIL" placeholder="আপনার ইমেইল" required>' +
            '<button type="submit">সাবস্ক্রাইব</button>' +
          '</form>' +
          '<div class="bag-nl-perks">' +
            '<div class="bag-nl-perk"><span class="icon">⚡</span><span class="label">সাপ্তাহিক AI টুল</span></div>' +
            '<div class="bag-nl-perk"><span class="icon">💰</span><span class="label">এক্সক্লুসিভ ডিল</span></div>' +
            '<div class="bag-nl-perk"><span class="icon">🇧🇩</span><span class="label">BD-Focused</span></div>' +
          '</div>' +
          '<p class="bag-nl-fineprint">কোনো spam না · যেকোনো সময় বন্ধ · <button type="button" data-never>আর দেখাবেন না</button></p>' +
        '</div>' +
        '<div class="bag-nl-success" data-success>' +
          '<div class="check">✓</div>' +
          '<h2>ধন্যবাদ!</h2>' +
          '<p>ইমেইলে কনফার্মেশন পাঠিয়েছি — চেক করে নিন।</p>' +
        '</div>' +
      '</div>' +
      '<iframe name="bag-nl-iframe" style="display:none" aria-hidden="true" tabindex="-1"></iframe>';
    document.body.appendChild(overlay);
    refs.overlay = overlay;
    refs.modal = overlay.querySelector('.bag-nl-modal');
    refs.formWrap = overlay.querySelector('[data-form-wrap]');
    refs.success = overlay.querySelector('[data-success]');

    overlay.querySelector('.bag-nl-close').addEventListener('click', function () { close(false); });
    overlay.querySelector('[data-never]').addEventListener('click', function () { close(true); });
    overlay.querySelector('form').addEventListener('submit', function () {
      // Mailchimp posts to hidden iframe → show success after short delay
      setTimeout(function () {
        refs.formWrap.style.display = 'none';
        refs.success.classList.add('show');
        set(localStorage, 'bagNlSubscribed', '1');
        // Close after 3s
        setTimeout(function () { close(false); }, 3500);
      }, 700);
    });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && refs.overlay && refs.overlay.classList.contains('open')) close(false); });
  }

  var opened = false;
  function open() {
    if (opened) return;
    if (!refs.overlay) build();
    refs.overlay.classList.add('open');
    set(sessionStorage, 'bagNlShown', '1');
    opened = true;
    // GA event
    if (typeof gtag === 'function') gtag('event', 'newsletter_popup_open');
  }
  function close(permanent) {
    if (refs.overlay) refs.overlay.classList.remove('open');
    if (permanent) set(localStorage, 'bagNlDismissed', '1');
    if (typeof gtag === 'function') gtag('event', permanent ? 'newsletter_popup_never' : 'newsletter_popup_close');
  }

  // ---------- triggers ----------
  function setupTriggers() {
    // Exit intent (desktop)
    if (!('ontouchstart' in window)) {
      document.addEventListener('mouseout', function (e) {
        if (!e.relatedTarget && !e.toElement && e.clientY <= 0) open();
      });
    }
    // 70% scroll
    var scrollHandler = function () {
      var d = document.documentElement, b = document.body;
      var pct = (window.scrollY || d.scrollTop) / (Math.max(d.scrollHeight, b.scrollHeight) - window.innerHeight);
      if (pct >= 0.7) { open(); window.removeEventListener('scroll', scrollHandler); }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    // 30s fallback
    setTimeout(open, 30000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { installStyles(); setupTriggers(); });
  } else {
    installStyles(); setupTriggers();
  }
})();

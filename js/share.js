/**
 * Social Share Buttons — BanglaAIGuide
 * Facebook, WhatsApp, Copy Link, X/Twitter
 * Auto-injects into any page with <article> tag
 */
(function () {
  'use strict';

  const pageUrl = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(document.title);

  function createShareBar() {
    const bar = document.createElement('div');
    bar.className = 'share-bar';
    bar.setAttribute('aria-label', 'শেয়ার করুন');

    bar.innerHTML = `
      <span class="share-label">শেয়ার করুন</span>
      <div class="share-buttons">
        <a href="https://www.facebook.com/sharer/sharer.php?u=${pageUrl}"
           target="_blank" rel="noopener noreferrer"
           class="share-btn share-fb" aria-label="Facebook এ শেয়ার করুন"
           title="Facebook এ শেয়ার করুন">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </a>
        <a href="https://api.whatsapp.com/send?text=${pageTitle}%20${pageUrl}"
           target="_blank" rel="noopener noreferrer"
           class="share-btn share-wa" aria-label="WhatsApp এ শেয়ার করুন"
           title="WhatsApp এ শেয়ার করুন">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </a>
        <button class="share-btn share-copy" aria-label="লিংক কপি করুন" title="লিংক কপি করুন">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        </button>
        <a href="https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageUrl}"
           target="_blank" rel="noopener noreferrer"
           class="share-btn share-x" aria-label="X এ শেয়ার করুন"
           title="X এ শেয়ার করুন">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
      </div>
    `;

    // Copy link handler
    bar.querySelector('.share-copy').addEventListener('click', function () {
      navigator.clipboard.writeText(window.location.href).then(function () {
        var btn = bar.querySelector('.share-copy');
        btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
        btn.style.color = '#16a34a';
        setTimeout(function () {
          btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>';
          btn.style.color = '';
        }, 2000);
      });
    });

    return bar;
  }

  // Insert share bar after H1 in article pages
  function init() {
    var article = document.querySelector('article');
    if (!article) return;

    var h1 = article.querySelector('h1');
    if (!h1) return;

    // Insert after h1 (or after lead paragraph if exists)
    var lead = h1.nextElementSibling;
    var insertAfter = (lead && lead.classList.contains('seo-lead')) ? lead : h1;
    insertAfter.parentNode.insertBefore(createShareBar(), insertAfter.nextSibling);

    // Also add sticky bottom share bar on mobile
    var sticky = document.createElement('div');
    sticky.className = 'share-bar-sticky';
    sticky.innerHTML = createShareBar().innerHTML;
    document.body.appendChild(sticky);

    // Copy handler for sticky bar too
    sticky.querySelector('.share-copy').addEventListener('click', function () {
      navigator.clipboard.writeText(window.location.href);
      this.style.color = '#16a34a';
      var self = this;
      setTimeout(function () { self.style.color = ''; }, 2000);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

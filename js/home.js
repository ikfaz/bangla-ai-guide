/* Translations and consent-gated measurement for the homepage and directory. */
(() => {
  'use strict';
  const search = document.getElementById('searchInput');
  const track = (name, parameters) => window.bagAnalytics?.track(name, parameters);
  const slug = value => String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  let searchTimer;
  search?.addEventListener('input', () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      if (search.value.trim()) track('directory_search', { source: 'directory' });
    }, 700);
  });
  document.addEventListener('click', event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const favorite = target.closest('.fav-btn[data-fav-tool]');
    if (favorite) {
      // main.js registers its click handler first and has already updated the selected state.
      track('tool_save', { tool_id: slug(favorite.dataset.favTool), action: favorite.classList.contains('fav-btn--active') ? 'save' : 'remove' });
      return;
    }
    const category = target.closest('#categoryTabList [data-category], [data-jump-category]');
    if (category) track('category_select', { category: category.dataset.category || category.dataset.jumpCategory });
    const link = target.closest('a[href]');
    if (!link) return;
    const card = link.closest('#toolsGrid .tool-card');
    if (card) {
      const detailLink = card.querySelector('.tool-title a');
      if (!detailLink) return;
      const detailUrl = new URL(detailLink.href, window.location.href);
      const toolId = card.dataset.toolId || detailUrl.pathname.split('/').filter(Boolean).pop();
      const targetUrl = new URL(link.href, window.location.href);
      track(targetUrl.origin === window.location.origin ? 'directory_result_open' : 'tool_outbound', { tool_id: toolId, source: 'directory' });
    }
  });
  // A valid form submission is an attempt, not proof of a confirmed subscriber.
  document.querySelectorAll('[data-mailchimp-form]').forEach(form => form.addEventListener('submit', () => {
    if (form.checkValidity()) track('newsletter_submit', { source: 'homepage' });
  }));
  function translateHome() {
    const language = document.documentElement.lang === 'en' ? 'en' : 'bn';
    document.querySelectorAll('[data-home-bn]').forEach(node => {
      node.innerHTML = node.getAttribute('data-home-' + language);
    });
    document.querySelectorAll('[data-home-placeholder-bn]').forEach(node => {
      node.placeholder = node.getAttribute('data-home-placeholder-' + language);
    });
  }
  new MutationObserver(translateHome).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  translateHome();
})();

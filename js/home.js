/* Enhancements for the redesigned homepage. Core directory behavior stays in main.js. */
(() => {
  const search = document.getElementById('searchInput');
  const heroQuery = document.getElementById('heroQuery');
  function searchDirectory(query) {
    search.value = query;
    search.dispatchEvent(new Event('input', { bubbles: true }));
    document.getElementById('toolsSection').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    search.focus({ preventScroll: true });
  }
  document.getElementById('heroSearchForm').addEventListener('submit', event => {
    event.preventDefault(); searchDirectory(heroQuery.value.trim());
  });
  document.querySelectorAll('[data-search-query]').forEach(button => button.addEventListener('click', () => {
    heroQuery.value = button.dataset.searchQuery; searchDirectory(button.dataset.searchQuery);
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

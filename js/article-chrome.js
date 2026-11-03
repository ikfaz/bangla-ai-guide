/* Small enhancements for blog articles. Deferred, no libraries.
   Progress bar is fixed and does not shift layout. */
(function () {
  'use strict';

  var article = document.querySelector('article, .article-sheet');
  if (!article) return;

  var bar = document.createElement('div');
  bar.className = 'article-progress';
  bar.setAttribute('aria-hidden', 'true');
  var span = document.createElement('span');
  bar.appendChild(span);
  document.body.appendChild(bar);

  var ticking = false;
  function paint() {
    ticking = false;
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var progress = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
    span.style.transform = 'scaleX(' + progress + ')';
  }

  document.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(paint);
  }, { passive: true });
  paint();

  article.querySelectorAll('table').forEach(function (table) {
    if (table.closest('.av-table-scroll, .calendar-scroll, .article-hero')) return;
    var wrap = document.createElement('div');
    wrap.className = 'av-table-scroll';
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);
  });
})();

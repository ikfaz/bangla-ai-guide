// The complete, linked catalogue is present even without JavaScript.
(() => {
  const library = document.querySelector('.guide-library');
  if (!library) return;
  const cards = [...library.querySelectorAll('.blog-card')];
  const items = cards.map(el => ({ el, category: el.dataset.category, text: el.textContent.toLocaleLowerCase('bn') }));
  const controls = library.querySelector('.library-controls');
  const search = document.getElementById('blogSearch');
  const buttons = [...controls.querySelectorAll('[data-category]')];
  const more = document.getElementById('blogMore');
  const count = document.getElementById('blogCount');
  const empty = document.getElementById('blogEmpty');
  const bn = new Intl.NumberFormat('bn-BD');
  let selected = '', limit = 12;

  function render() {
    const q = search.value.trim().toLocaleLowerCase('bn');
    let found = 0;
    for (const {el, category, text} of items) {
      const match = (!selected || category === selected) && (!q || text.includes(q));
      el.hidden = !match || ++found > limit;
    }
    count.textContent = found ? bn.format(found) + 'টি গাইডের মধ্যে ' + bn.format(Math.min(found, limit)) + 'টি দেখানো হচ্ছে' : 'কোনো গাইড পাওয়া যায়নি';
    empty.hidden = found !== 0;
    more.hidden = found <= limit;
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.category === selected)));
  }
  controls.addEventListener('click', event => {
    const button = event.target.closest('button[data-category]');
    if (!button) return;
    selected = button.dataset.category;
    limit = 12;
    render();
  });
  search.addEventListener('input', () => { limit = 12; render(); });
  more.addEventListener('click', () => {
    const hidden = new Set(cards.filter(el => el.hidden));
    limit += 12;
    render();
    const firstNew = cards.find(el => !el.hidden && hidden.has(el));
    if (firstNew) firstNew.querySelector('a').focus();
  });
  document.getElementById('blogReset').addEventListener('click', () => {
    selected = ''; search.value = ''; limit = 12; render(); search.focus();
  });
  controls.hidden = false;
  render();
})();

(() => {
  const guide = document.querySelector('[data-nano-guide]');
  if (!guide) return;

  const navigation = guide.querySelector('.nb-tabs');
  const tabs = Array.from(navigation.querySelectorAll('a'));
  const panels = tabs.map(tab => document.getElementById(tab.hash.slice(1)));
  navigation.setAttribute('role', 'tablist');
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panels[index].id);
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].tabIndex = 0;
  });

  function select(index) {
    tabs.forEach((tab, item) => {
      const active = item === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[item].hidden = !active;
    });
  }

  function selectFromHash() {
    const target = document.getElementById(location.hash.slice(1));
    const index = panels.findIndex(panel => panel === target || (target && panel.contains(target)));
    if (index >= 0) select(index);
  }

  navigation.addEventListener('click', event => {
    const tab = event.target.closest('a');
    if (!tab || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    select(tabs.indexOf(tab));
    tab.focus({preventScroll: true});
  });
  navigation.addEventListener('keydown', event => {
    const current = tabs.indexOf(event.target);
    if (current < 0) return;
    const directions = {ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1};
    let next;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else if (Object.hasOwn(directions, event.key)) next = (current + directions[event.key] + tabs.length) % tabs.length;
    else return;
    event.preventDefault();
    select(next);
    tabs[next].focus();
  });
  select(0);
  selectFromHash();
  window.addEventListener('hashchange', selectFromHash);

  const status = guide.querySelector('[data-copy-status]');
  const buttons = guide.querySelectorAll('button[data-copy]');
  buttons.forEach(button => { button.hidden = false; });

  function selectText(element) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
    return selection;
  }
  guide.addEventListener('click', async event => {
    const button = event.target.closest('button[data-copy]');
    if (!button) return;
    const source = document.getElementById(button.dataset.copy);
    let copied = false;
    try {
      await navigator.clipboard.writeText(source.textContent.trim());
      copied = true;
    } catch {
      const selection = selectText(source);
      try { copied = document.execCommand('copy'); } catch { /* Manual copy remains available. */ }
      if (copied) selection.removeAllRanges();
    }
    const feedback = copied ? 'কপি হয়েছে' : 'লেখা নির্বাচন করা আছে। কপি করুন।';
    button.querySelector('span').textContent = feedback;
    status.textContent = feedback;
    window.setTimeout(() => { button.querySelector('span').textContent = 'কপি করুন'; }, 2200);
  });
})();

// Small progressive enhancements. All guide content is available without JavaScript.
(() => {
  const guide = document.querySelector('[data-guide-workshop]');
  if (!guide) return;

  const copyStatus = guide.querySelector('[data-guide-copy-status]');
  guide.querySelectorAll('[data-guide-copy]').forEach(button => { button.hidden = false; });
  guide.addEventListener('click', async event => {
    const button = event.target.closest('[data-guide-copy]');
    if (!button) return;
    const source = document.getElementById(button.dataset.guideCopy);
    if (!source) return;
    const text = source.textContent.trim().replace(/^(?:prompt|প্রম্পট)\s*:\s*/i, '');
    let copied = false;
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(source);
      selection.removeAllRanges();
      selection.addRange(range);
      try { copied = document.execCommand('copy'); } catch { /* The selected text remains available for manual copying. */ }
      if (copied) selection.removeAllRanges();
    }
    const message = copied ? 'কপি হয়েছে' : 'লেখা নির্বাচন করা আছে। কপি করুন।';
    button.querySelector('span').textContent = message;
    copyStatus.textContent = message;
    window.setTimeout(() => { button.querySelector('span').textContent = 'কপি করুন'; }, 2200);
  });

  guide.querySelectorAll('.gw-checklist').forEach(list => {
    const items = Array.from(list.children).filter(node => node.tagName === 'LI');
    if (!items.length) return;
    const progress = document.createElement('p');
    progress.className = 'gw-check-progress';
    progress.setAttribute('role', 'status');
    list.before(progress);
    const boxes = items.map(item => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      const content = document.createElement('span');
      content.append(...item.childNodes);
      label.append(input, content);
      item.append(label);
      return input;
    });
    const update = () => {
      const checked = boxes.filter(box => box.checked).length;
      progress.textContent = checked.toLocaleString('bn-BD') + ' / ' + boxes.length.toLocaleString('bn-BD') + 'টি মিলিয়েছেন';
    };
    list.addEventListener('change', update);
    update();
  });

  const contents = guide.querySelector('.gw-chapters details');
  const compact = window.matchMedia('(max-width: 900px)');
  function sizeContents() {
    if (contents) contents.open = !compact.matches;
  }
  sizeContents();
  compact.addEventListener('change', sizeContents);

  const links = Array.from(guide.querySelectorAll('.gw-chapters a'));
  const headings = links.map(link => document.getElementById(decodeURIComponent(link.hash.slice(1)))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const active = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!active) return;
      links.forEach(link => {
        if (decodeURIComponent(link.hash.slice(1)) === active.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-100px 0px -65% 0px' });
    headings.forEach(heading => observer.observe(heading));
  }
  guide.querySelector('.gw-chapters')?.addEventListener('click', event => {
    if (compact.matches && event.target.closest('a')) contents.open = false;
  });
})();

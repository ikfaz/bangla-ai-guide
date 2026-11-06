(() => {
  'use strict';

  const DAYS = ['শনিবার', 'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার'];
  const POST_DAYS = { 3: [0, 2, 5], 5: [0, 1, 2, 4, 5], 7: [0, 1, 2, 3, 4, 5, 6] };
  const EXAMPLE = {
    product: 'সুতি ব্যাগ',
    audience: 'দৈনন্দিন বাজারের জন্য ব্যাগ খুঁজছেন এমন ক্রেতা',
    frequency: 3,
    facts: 'মাপ ১৪ × ১৬ ইঞ্চি। রং প্রাকৃতিক সাদা।',
  };

  const IDEAS = [
    { title: 'পণ্যের পরিচয়', idea: p => p + ' কী, কী কাজে লাগে এবং এর একটি যাচাই করা বৈশিষ্ট্য বলুন।', photo: 'পুরো পণ্যটি দিনের আলোতে তুলুন।' },
    { title: 'কেনার আগে প্রশ্ন', idea: p => p + ' নিয়ে সম্ভাব্য একটি প্রশ্ন বেছে নিন। নিজের দোকানের তথ্য দিয়ে সংক্ষিপ্ত উত্তর লিখুন।', photo: 'উত্তরের সঙ্গে মিল আছে এমন একটি বিস্তারিত ছবি তুলুন।' },
    { title: 'ব্যবহার দেখান', idea: p => p + ' বাস্তবে কীভাবে কাজে লাগে, একটি ছোট উদাহরণ দিয়ে দেখান।', photo: 'পণ্যটি ব্যবহারের একটি বাস্তব দৃশ্য তুলুন।' },
    { title: 'কাছ থেকে দেখুন', idea: p => p + '–এর মাপ, রং বা উপাদান থেকে একটি তথ্য বেছে নিন। ছবি দিয়ে সেটি পরিষ্কার করুন।', photo: 'মাপের ফিতা বা কাছ থেকে তোলা একটি ছবি রাখুন।' },
    { title: 'প্রস্তুতির গল্প', idea: p => p + ' তৈরি, পরীক্ষা বা প্যাক করার একটি ধাপ দেখান।', photo: 'কাজের টেবিলে প্রস্তুতি বা প্যাকিংয়ের ছবি তুলুন।' },
    { title: 'অর্ডারের ধাপ', idea: p => p + ' অর্ডার করতে কী তথ্য দিতে হবে এবং স্টক ও ডেলিভারি কীভাবে নিশ্চিত হবে, তা লিখুন।', photo: 'প্যাক করা পণ্যের ছবি তুলুন। ঠিকানা বা ফোন নম্বর ঢেকে রাখুন।' },
    { title: 'পছন্দ জানতে চান', idea: p => p + ' নিয়ে ক্রেতারা পরের বার কী দেখতে চান, একটি প্রশ্ন করুন।', photo: 'যাচাই করা দুটি বিকল্প থাকলে পাশাপাশি ছবি তুলুন।' },
  ];

  function tidy(value, limit) {
    return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, limit);
  }

  function makePlan(input) {
    const product = tidy(input.product, 80);
    const audience = tidy(input.audience, 100);
    const facts = tidy(input.facts, 280);
    const frequency = Number(input.frequency);
    const postingDays = POST_DAYS[frequency];
    if (!product || !postingDays) throw new Error('A product and a supported weekly frequency are required.');

    const days = DAYS.map((day, index) => {
      if (!postingDays.includes(index)) return { day, title: 'পোস্টের বিরতি', idea: 'ছবি, তথ্য ও খসড়া প্রস্তুত রাখুন।', photo: '' };
      const { title, idea, photo } = IDEAS[index];
      return { day, title, idea: idea(product), photo };
    });
    const posts = days.filter(day => day.photo);
    const prompt = [
      'আমার ছোট দোকানের ফেসবুক পেজের জন্য ' + frequency.toLocaleString('bn-BD') + 'টি বাংলা পোস্টের খসড়া তৈরি করো।',
      'পণ্য বা সেবা: ' + product,
      'পাঠক: ' + (audience || '[কার জন্য পোস্ট, এখানে লিখুন]'),
      'যাচাই করা তথ্য: ' + (facts || '[দাম, মাপ, ডেলিভারি বা প্রযোজ্য তথ্য এখানে লিখুন]'),
      '',
      'এই পরিকল্পনা অনুসরণ করো:',
      ...posts.map(post => post.day + ' — ' + post.title + '। ' + post.idea),
      '',
      'প্রতি পোস্টে ৫০ শব্দের মধ্যে সহজ বাংলা খসড়া, প্রয়োজনীয় ছবি ও প্রকাশের আগে যাচাইয়ের একটি প্রশ্ন দাও। দাম, ছাড়, স্টক, ক্রেতার অভিজ্ঞতা বা ডেলিভারির তথ্য বানিয়ে লিখবে না। কোনো তথ্য না থাকলে আগে প্রশ্ন করো।',
    ].join('\n');

    return { product, audience, facts, frequency, days, prompt };
  }

  function toCsv(plan) {
    const escapeCell = value => {
      let text = String(value ?? '');
      // Spreadsheet programs can execute user text that begins with a formula marker.
      if (/^\s*[=+\-@]/.test(text) || /^[\t\r\n]/.test(text)) text = "'" + text;
      return '"' + text.replace(/"/g, '""') + '"';
    };
    const rows = [['দিন', 'পোস্টের ধরন', 'পোস্টের আইডিয়া', 'ছবির তালিকা', 'পণ্য বা সেবা', 'পাঠক', 'যাচাই করা তথ্য']];
    for (const day of plan.days) rows.push([day.day, day.title, day.idea, day.photo, plan.product, plan.audience, plan.facts]);
    return '\ufeff' + rows.map(row => row.map(escapeCell).join(',')).join('\r\n') + '\r\n';
  }

  if (typeof module !== 'undefined') module.exports = { makePlan, toCsv };
  if (typeof document === 'undefined') return;

  const form = document.getElementById('post-planner-form');
  if (!form) return;

  const product = form.elements.product;
  const days = document.getElementById('planner-days');
  const photos = document.getElementById('planner-photos');
  const heading = document.getElementById('planner-result-title');
  const summary = document.getElementById('planner-result-summary');
  const prompt = document.getElementById('planner-prompt');
  const status = document.getElementById('planner-status');
  const exportButton = document.getElementById('planner-export');
  const copyButton = document.getElementById('planner-copy');
  const copyStatus = document.getElementById('planner-copy-status');
  const newsletter = document.getElementById('planner-newsletter');

  let currentPlan;
  let isExample;

  function element(tag, text, className) {
    const node = document.createElement(tag);
    node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function showPlan(plan, example) {
    currentPlan = plan;
    isExample = example;
    heading.textContent = example ? 'নমুনা সপ্তাহ · ' + plan.product : plan.product + ' · আপনার পোস্ট প্ল্যান';
    summary.textContent = plan.frequency.toLocaleString('bn-BD') + 'টি পোস্ট · ৭ দিন' + (plan.audience ? ' · ' + plan.audience : '');
    days.replaceChildren(...plan.days.map(post => {
      const item = element('li', '', post.photo ? 'planner-day' : 'planner-day planner-day--rest');
      item.append(element('span', post.day, 'planner-weekday'), element('strong', post.title), element('p', post.idea));
      return item;
    }));
    photos.replaceChildren(...plan.days.filter(post => post.photo).map(post => {
      const item = document.createElement('li');
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      label.append(input, element('span', post.photo));
      item.append(label);
      return item;
    }));
    prompt.value = plan.prompt;
    copyStatus.textContent = '';
    newsletter.hidden = true;
  }

  form.querySelector('fieldset').disabled = false;
  exportButton.disabled = false;
  copyButton.disabled = false;
  showPlan(makePlan(EXAMPLE), true);

  product.addEventListener('input', () => product.setCustomValidity(''));
  document.getElementById('planner-sample').addEventListener('click', () => {
    for (const [name, value] of Object.entries(EXAMPLE)) form.elements[name].value = value;
    product.setCustomValidity('');
    showPlan(makePlan(EXAMPLE), true);
    status.textContent = 'নমুনার তথ্য বসানো হয়েছে। চাইলে নিজের তথ্য দিয়ে বদলান।';
    product.focus();
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!product.value.trim()) {
      product.setCustomValidity('পণ্য বা সেবার নাম লিখুন।');
      product.reportValidity();
      return;
    }
    showPlan(makePlan(Object.fromEntries(new FormData(form))), false);
    window.bagAnalytics?.track('post_plan_create');
    status.textContent = 'আপনার সাত দিনের প্ল্যান তৈরি হয়েছে।';
    heading.focus();
  });

  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(currentPlan.prompt);
      copyStatus.textContent = 'প্রম্পট কপি হয়েছে।';
    } catch {
      prompt.closest('details').open = true;
      prompt.focus();
      prompt.select();
      let copied = false;
      try { copied = document.execCommand('copy'); } catch { /* The selected text remains available. */ }
      copyStatus.textContent = copied ? 'প্রম্পট কপি হয়েছে।' : 'প্রম্পট নির্বাচন করা হয়েছে। এখন কপি করুন।';
    }
  });

  exportButton.addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([toCsv(currentPlan)], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bangla-7-day-post-plan.csv';
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    window.bagAnalytics?.track('post_plan_csv_click', { variant: isExample ? 'example' : 'custom' });
    newsletter.hidden = false;
    status.textContent = 'CSV ডাউনলোড শুরু হয়েছে।';
  });
})();

#!/usr/bin/env node
// Apply the shared public navigation after page generators (including the comparison generator).
// Keep actual page content, legacy redirect stubs, authoring sources and the bilingual homepage intact.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(file, 'utf8');
const links = [
  ['/#toolsSection', 'টুলস'], ['/compare/', 'তুলনা'], ['/quiz/', 'কুইজ'],
  ['/blog/', 'ব্লগ'], ['/#newsletter', 'নিউজলেটার']
];
const brand = '<a class="gs-brand" href="/" aria-label="বাংলা AI গাইড হোম"><img src="/assets/brand/logo.svg" width="48" height="48" alt=""><span><strong>বাংলা AI গাইড</strong><small lang="en">AI, made simple. In Bangla.</small></span></a>';
const rootOf = route => route.split('/')[1];
function menu(route) {
  return links.map(([href,label]) => {
    const current = route === href ? ' aria-current="page"' : rootOf(route) === rootOf(href) ? ' aria-current="location"' : '';
    return '<a href="'+href+'"'+current+'>'+label+'</a>';
  }).join('');
}
function masthead(route, target) {
  const items = menu(route);
  return `<!-- GUIDE-HEADER:START -->
<a class="gs-skip" href="#${target}">মূল কন্টেন্টে যান</a>
<div class="gs-ribbon"><span>AI শেখার শুরুটা হোক বাংলায়</span><a href="/blog/">গাইড পড়ুন ↗</a></div>
<header class="gs-mast" id="top">
  <div class="gs-wrap gs-bar">${brand}
    <nav class="gs-nav" aria-label="প্রধান ন্যাভিগেশন">${items}</nav>
    <div class="gs-actions"><button type="button" class="gs-search" data-bag-search aria-label="সাইটে খুঁজুন"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="10.5" cy="10.5" r="6.75"/><path d="m16 16 4.5 4.5" stroke-linecap="round"/></svg><span>খুঁজুন</span></button>
      <a class="gs-submit" href="/submit/">টুল সাবমিট +</a>
      <details class="gs-mobile"><summary aria-label="প্রধান মেনু"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></summary><nav aria-label="মোবাইল ন্যাভিগেশন">${items}<a href="/submit/">টুল সাবমিট +</a></nav></details>
    </div>
  </div>
</header>
<!-- GUIDE-HEADER:END -->`;
}
const groups = [
  ['ডিরেক্টরি', [['/#toolsSection','সব টুলস'],['/free-ai-tools-2026-bangladesh/','ফ্রি টুলস'],['/ai-tools-bdt-price-2026-bangladesh/','টাকায় দাম'],['/compare/','টুল তুলনা']]],
  ['রিসোর্স', [['/blog/','সব লেখা'],['/bangla-ai-guide/','বাংলা AI গাইড'],['/quiz/','টুল বাছাই কুইজ'],['/submit/','টুল সাবমিট']]],
  ['আমাদের কথা', [['/about/','আমাদের সম্পর্কে'],['/editorial-policy/','সম্পাদকীয় নীতি'],['/contact/','যোগাযোগ'],['/contact/#advertising','বিজ্ঞাপন']]]
];
const foot = `<footer class="gs-foot"><div class="gs-wrap"><div class="gs-foot-grid"><div>${brand}<p>বাংলাদেশের জন্য AI টুল, টাকায় দাম আর ব্যবহারিক গাইড—সব এক জায়গায়, বাংলায়।</p></div>${groups.map(([label,items])=>'<div class="gs-foot-col"><strong>'+label+'</strong>'+items.map(([href,title])=>'<a href="'+href+'">'+title+'</a>').join('')+'</div>').join('')}</div>
<div class="gs-fine"><span>© ২০২৬ বাংলা AI গাইড · বাংলাদেশের জন্য তৈরি</span><span><a href="/privacy/">গোপনীয়তা</a><a href="/terms/">শর্তাবলী</a><a href="/disclaimer/">ডিসক্লেইমার</a><a href="/feed.xml" lang="en">RSS</a></span></div></div></footer>`;
function skipTarget(html) {
  // Prefer the main landmark. Many older articles are plain divs; their heading is a good fallback.
  const m = html.match(/<main\b[^>]*>/i) || html.match(/<h1\b[^>]*>/i);
  if (!m) throw Error('No main landmark or heading');
  const id = m[0].match(/\bid=["']([^"']+)["']/i);
  if (id) return [html, id[1]];
  return [html.slice(0,m.index) + m[0].replace(/>$/, ' id="gs-content">') + html.slice(m.index+m[0].length), 'gs-content'];
}
function design(html, route) {
  // The homepage implements its own language switcher and remains the design reference.
  let out = html.replace(/<link\b(?=[^>]*(?:fonts\.googleapis\.com|fonts\.gstatic\.com))[^>]*>\s*/gi, '');
  if (!out.includes('href="/css/type.css"')) out = out.replace(/(<head\b[^>]*>)/i, '$1\n  <link rel="stylesheet" href="/css/type.css">');
  out = out.replace(/search-overlay\.js\?v=[^"'\s>]+/g,'search-overlay.js?v=editorial-1');
  if (route === '/') return out;
  let target; [out,target] = skipTarget(out);
  const head = masthead(route,target);
  const previous = /<!-- GUIDE-HEADER:START -->[\s\S]*?<!-- GUIDE-HEADER:END -->/;
  if (previous.test(out)) out = out.replace(previous, () => head);
  else {
    out = out.replace(/<a\b[^>]*class=["']skip-link["'][^>]*>[\s\S]*?<\/a>\s*/i,'');
    const legacy = /<header\b[^>]*class=["'](?:navbar|nav)["'][^>]*>[\s\S]*?<\/header>/i;
    const legacyNav = /(<body\b[^>]*>\s*)<nav>\s*<div class="nav-container">[\s\S]*?<\/nav>/i;
    if (legacy.test(out)) out = out.replace(legacy, () => head);
    else if (legacyNav.test(out)) out = out.replace(legacyNav, (_,body)=>body+head);
    else out = out.replace(/(<body\b[^>]*>)/i, (_,body)=>body+'\n'+head);
  }
  // Some articles have their own semantic footer. Only the last footer belongs to the site.
  const old = [...out.matchAll(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi)].pop();
  if (old) out = out.slice(0,old.index)+foot+out.slice(old.index+old[0].length);
  else out = out.replace(/<\/body>/i, foot+'\n</body>');
  if (!/src=["'][^"']*\/search-overlay\.js/.test(out)) out = out.replace('</head>','  <script src="/js/search-overlay.js?v=editorial-1" defer></script>\n</head>');
  if (!out.includes('href="/css/site-shell.css"')) out = out.replace('</head>','  <link rel="stylesheet" href="/css/site-shell.css">\n</head>');
  return out;
}
function pages(dir = root, parts = []) {
  const files = [];
  for (const e of fs.readdirSync(dir,{withFileTypes:true})) {
    if (/^\.|^(?:node_modules|scripts|assets|docs|css|js)$/.test(e.name)) continue;
    const file = path.join(dir,e.name);
    if (e.isDirectory()) files.push(...pages(file,[...parts,e.name]));
    else if (e.name.endsWith('.html')) files.push([file,'/'+[...parts,e.name].join('/').replace(/index\.html$/,'')]);
  }
  return files;
}
let count=0, changed=0;
for (const [file,route] of pages()) {
  const html=read(file);
  if (/<meta\b[^>]*http-equiv=["']refresh/i.test(html)) continue;
  const out=design(html,route); count++;
  if (out!==html) { fs.writeFileSync(file,out); changed++; }
}
console.log(`Shared shell: ${count} pages, ${changed} updated.`);

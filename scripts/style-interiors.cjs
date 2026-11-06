#!/usr/bin/env node
// Apply the reading and interaction layouts after source generators have run.
// The original headings, paragraphs and controls remain the source of truth.
const fs = require('node:fs');
const path = require('node:path');
const {slugify} = require('./generate-tool-routes.cjs');
const {artFor} = require('./lib/editorial-art.cjs');
const root = path.resolve(__dirname, '..');
const escaped = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain = html => html.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();

const sectionLabels = {
  about:'আমাদের পরিচয়', 'editorial-policy':'সম্পাদনা বিভাগ', contact:'যোগাযোগ', submit:'টুল ডিরেক্টরি',
  terms:'ব্যবহারের নীতি', privacy:'গোপনীয়তা', disclaimer:'পাঠকের জন্য'
};
const pairArt = {src:'/assets/interior/compare.svg',alt:'দুটি টুলের বৈশিষ্ট্য পাশাপাশি সাজানো',width:640,height:370};
const quizArt = {src:'/assets/interior/compass.svg',alt:'পথের মানচিত্রের ওপর দিকনির্দেশক কম্পাস',width:640,height:370};
const copyOnly = /<!-- INTERIOR:START -->[\s\S]*?<!-- INTERIOR:COPY -->([\s\S]*?)<!-- INTERIOR:\/COPY -->[\s\S]*?<!-- INTERIOR:END -->/g;
function intro(copy, label, image) {
  const opening = label ? '<p class="inside-kicker"><span aria-hidden="true"></span>'+escaped(label)+'</p>' : '';
  const plate = image ? '<figure class="inside-plate"><img src="'+escaped(image.src)+'" alt="'+escaped(image.alt)+'" width="'+image.width+'" height="'+image.height+'" decoding="async"></figure>' : '';
  return '<!-- INTERIOR:START --><div class="inside-intro'+(image?' inside-illustrated':'')+'"><div class="inside-copy">'+opening+'<!-- INTERIOR:COPY -->'+copy+'<!-- INTERIOR:/COPY --></div>'+plate+'</div><!-- INTERIOR:END -->';
}
function pageKind(route,html) {
  if (route==='404.html') return 'missing';
  if (route==='tool-detail.html') return 'dynamic';
  if (route==='quiz') return 'quiz';
  if (route==='compare') return 'picker';
  if (route.startsWith('compare/')) return 'pair';
  if (['about','editorial-policy'].includes(route)) return 'about';
  if (['submit','contact'].includes(route)) return 'form';
  if (route in sectionLabels) return 'policy';
  if (html.includes('class="detail-title"')) return 'profile';
  if (html.includes('seo-article-page')) return 'guide';
  if (/<article\b/i.test(html)) return 'standalone';
  throw new Error('Unrecognized interior route: '+route);
}
function fixMark(tag) {
  if (!tag.includes('logo.clearbit.com')) return tag;
  const name = (tag.match(/\balt="([^"]*)"/i)?.[1]||'').replace(/ logo$/i,'');
  const slug = ({Copilot:'github-copilot', Perplexity:'perplexity-ai'})[name] || slugify(name);
  const src = '/assets/tool-marks/'+slug+'.svg';
  if (!fs.existsSync(path.join(root,src))) return tag;
  return tag.replace(/\bsrc="[^"]*"/i,'src="'+src+'"').replace(/\s+onerror="[^"]*"/i,'');
}
function enhance(input, route) {
  if (route === 'tools' || route === 'post-planner') return input;
  if (input.includes('data-guide-workshop')) return input;
  if (/<meta\b[^>]*http-equiv\s*=\s*["']refresh["']/i.test(input)) return input;
  let html = input.replace(copyOnly,(_,copy)=>copy);
  const kind = pageKind(route,html);
  html = html.replace(/<body\b([^>]*)>/i,(_,a)=>'<body'+a.replace(/\sdata-interior="[^"]*"/,'')+' data-interior="'+kind+'">');
  if (!html.includes('href="/css/interiors.css"')) html = html.replace(/<\/head>/i,'  <link rel="stylesheet" href="/css/interiors.css">\n</head>');
  html = html.replace(/<img\b[^>]*>/gi,fixMark);
  const heading = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  if (!heading && !['dynamic','missing'].includes(kind)) throw Error('Missing heading: '+route);
  const title = heading && plain(heading[1]);
  if (kind==='guide'||kind==='standalone') {
    // Keep handwritten TL;DR, author notes and figures intact on special guides.
    const image = artFor(route,title);
    html = html.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>(?:\s*<p class="seo-lead">[\s\S]*?<\/p>)?/i, copy=>intro(copy,'বাংলা AI গাইড  /  ব্যবহারিক নির্দেশিকা',image));
  } else if (kind==='profile') {
    const start = html.indexOf('<div class="tool-header detail-title-row">');
    const lead = /<p class="detail-description seo-lead">[\s\S]*?<\/p>/i.exec(html);
    if (start<0 || !lead || lead.index<start) throw Error('Missing profile introduction: '+route);
    const end=lead.index+lead[0].length;
    html=html.slice(0,start)+intro(html.slice(start,end),'টুল ডিরেক্টরি  /  পরিচিতি',artFor(route,title))+html.slice(end);
  } else if (kind==='quiz' || kind==='picker') {
    // These original sections have one outer end tag and no nested sections.
    const re= kind==='quiz'? /(<section class="intro" id="intro">)([\s\S]*?)(<\/section>)/ : /(<section class="hero">\s*<div class="container">)([\s\S]*?)(<\/div>\s*<\/section>)/;
    html=html.replace(re,(_,open,copy,close)=>open+intro(copy,'',kind==='quiz'?quizArt:pairArt)+close);
  } else if (sectionLabels[route]) {
    html=html.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>(?:\s*<p(?: class="(?:privacy-lead|submit-subtext)")?>[\s\S]*?<\/p>)?/i, copy=>intro(copy,sectionLabels[route],null));
  }
  return html;
}
function targets() {
  const files=[['404.html','404.html'],['tool-detail.html','tool-detail.html']];
  const add = (dir,prefix='') => {
    for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
      if(!entry.isDirectory() || !/^[a-z0-9-]+$/.test(entry.name) || ['blog','node_modules'].includes(entry.name)) continue;
      const route=prefix+entry.name, file=path.join(dir,entry.name,'index.html');
      if(fs.existsSync(file)) files.push([file,route]);
    }
  };
  add(root); add(path.join(root,'compare'),'compare/');
  return files.map(([file,route])=>[path.resolve(root,file),route]);
}
function generate() {
  let changed=0,pages=0;
  for (const [file,route] of targets()) {
    const input=fs.readFileSync(file,'utf8'), output=enhance(input,route);
    if (output.includes('data-interior=')) pages++;
    if (input!==output) {fs.writeFileSync(file,output);changed++;}
  }
  console.log('Interior layouts: '+pages+' content pages ('+changed+' updated).');
}
module.exports={enhance,targets};
if(require.main===module)generate();

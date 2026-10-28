// Keep tool links in stored HTML aligned with real profile destinations.
const fs = require('node:fs');
const path = require('node:path');
const routes = require('../js/tool-routes.js');
const root = path.resolve(__dirname, '..');
const lookup = new Map();
for (const route of Object.values(routes.routes)) {
  for (const slug of [route.slug, route.name.toLowerCase().replace(/\./g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''), ...(route.isProfile ? [route.href.slice(1,-1)] : [])]) lookup.set('/'+slug+'/',route);
}
const esc = s => s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
function repair(html, pageUrl) {
  return html.replace(/<a\b([^>]*\bhref="([^"]+)"[^>]*)>([\s\S]*?)<\/a>/g, (whole, attributes, href, content) => {
    let url;
    try { url = new URL(href.replaceAll('&amp;','&'),pageUrl); } catch { return whole; }
    if (url.origin !== 'https://banglaaiguide.com' || url.search || url.hash) return whole;
    const route = lookup.get(url.pathname);
    if (!route || route.href === url.pathname) return whole;
    attributes = attributes.replace('href="'+href+'"','href="'+esc(route.href)+'"');
    if (route.isExternal) {
      if (!/\btitle=/.test(attributes)) attributes += ' title="'+esc(route.name+' — '+route.labelBn)+'"';
      if (/^(পেজ দেখুন|দেখুন|বিস্তারিত দেখুন|টুল দেখুন)\s*→?$/.test(content.trim())) content = route.labelBn+' →';
    }
    return '<a'+attributes+'>'+content+'</a>';
  });
}
function run(dir=root) {
  let changed=0;
  for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
    if (['.git','node_modules'].includes(entry.name)) continue;
    const file=path.join(dir,entry.name);
    if (entry.isDirectory()) { changed+=run(file); continue; }
    if (!entry.name.endsWith('.html')) continue;
    const relative=path.relative(root,file).split(path.sep).join('/');
    const url='https://banglaaiguide.com/'+relative.replace(/index\.html$/,'');
    const before=fs.readFileSync(file,'utf8'),after=repair(before,url);
    if(after!==before){fs.writeFileSync(file,after);changed++;}
  }
  return changed;
}
module.exports={repair,run};
if(require.main===module) console.log('Tool link repair: '+run()+' HTML files updated.');

const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),routes=require('../js/tool-routes.js'),{repair}=require('./repair-tool-links.cjs');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const aliases=new Map();for(const r of Object.values(routes.routes))for(const s of [r.slug,r.name.toLowerCase().replace(/\./g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')])aliases.set('/'+s+'/',r);
let pages=0,profiles=0;
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(['.git','node_modules'].includes(e.name))continue;const file=path.join(dir,e.name);if(e.isDirectory()){walk(file);continue;}if(!e.name.endsWith('.html'))continue;const h=fs.readFileSync(file,'utf8');pages++;
const consumer=h.search(/<script[^>]*src="[^"]*js\/(main|seo-pages|tool-detail)\.js/);if(consumer>=0)assert.ok(h.indexOf('src="/js/tool-routes.js')>=0&&h.indexOf('src="/js/tool-routes.js')<consumer,file+': route load order');
for(const m of h.matchAll(/<a\b[^>]*href="([^"]+)"/g)){const u=new URL(m[1].replaceAll('&amp;','&'),'https://banglaaiguide.com/'+path.relative(root,file).split(path.sep).join('/'));if(u.origin!=='https://banglaaiguide.com'||u.search||u.hash)continue;const route=aliases.get(u.pathname);if(route)assert.equal(route.href,u.pathname,file+': obsolete profile destination '+m[1]);}
}}
walk(root);
for(const r of Object.values(routes.routes).filter(r=>r.isProfile)){const h=read(r.href.slice(1)+'index.html');assert.ok(h.includes('তথ্য যাচাইয়ের অবস্থা'),r.name);assert.ok(!/<p class="rating">/.test(h),r.name+' unsupported rating');assert.ok(!/<blockquote[^>]*detail-review/.test(h),r.name+' testimonial');profiles++;}
const fixture='<a href="../microsoft-copilot/">পেজ দেখুন →</a><a href="/playht/">PlayHT</a><a href="/chatgpt/?q=keep">keep</a><a href="https://other.example/playht/">external</a>';
const result=repair(fixture,'https://banglaaiguide.com/chatgpt/');assert.ok(result.includes('href="https://copilot.microsoft.com/"'));assert.ok(result.includes('টুলের ওয়েবসাইট'));assert.ok(result.includes('href="/play-ht/"'));assert.ok(result.includes('/chatgpt/?q=keep'));assert.ok(result.includes('https://other.example/playht/'));assert.equal(repair(result,'https://banglaaiguide.com/chatgpt/'),result);
for(const p of ['js/main.js','js/home.js','js/seo-pages.js','js/tool-detail.js','scripts/prerender-homepage.cjs','scripts/generate-tool-pages.cjs','scripts/generate-comparison-pages.cjs'])new vm.Script(read(p),{filename:p});
console.log('Discovery integration passed: '+pages+' HTML sources, '+profiles+' evidence notices, canonical/static destinations, script order, safe idempotent link repair and JS syntax.');

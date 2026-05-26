#!/usr/bin/env node
/*
 * Auto-generate static SEO-indexable comparison pages.
 *
 * Output: compare/<slug-a>-vs-<slug-b>/index.html
 *
 * Inputs:
 *   - js/tools-data.js (parsed via eval-sandbox)
 *   - A curated list of high-search-volume pairs (CURATED) plus
 *     auto-generated pairs within same category (CATEGORY_AUTO).
 *
 * Each page:
 *   - Unique <title>, description, og tags
 *   - Auto-generated Bangla intro (template-based)
 *   - Full side-by-side comparison table
 *   - Pricing, payment, BD-access details
 *   - Schema.org Article + ItemList
 *   - Links back to /compare/ interactive page and individual tool pages
 *
 * Pairs are ordered alphabetically (chatgpt-vs-claude, not claude-vs-chatgpt)
 * so we don't generate duplicate pages.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const COMPARE_DIR = path.join(ROOT, 'compare');
const TOOLS_FILE = path.join(ROOT, 'js', 'tools-data.js');

// ---------- load tools-data.js ----------

function loadTools() {
  const src = fs.readFileSync(TOOLS_FILE, 'utf8');
  const sandbox = { tools: null, window: {} };
  vm.createContext(sandbox);
  // tools-data.js declares `const tools = [...]` — wrap to capture it
  const wrapped = src.replace(/^\s*const\s+tools\s*=/m, 'sandbox.tools =').replace(/^\s*window\.tools/m, 'sandbox.tools');
  try {
    vm.runInContext(wrapped.replace(/sandbox\.tools/g, 'tools'), sandbox);
  } catch (e) {
    // fallback: extract array via regex (less reliable)
    const m = src.match(/const\s+tools\s*=\s*(\[[\s\S]*?\n\];)/);
    if (m) sandbox.tools = vm.runInContext('(' + m[1].replace(/\];$/, ']') + ')', sandbox);
  }
  return sandbox.tools || [];
}

function slugify(s) {
  return String(s || '').toLowerCase().replace(/\./g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function pairKey(a, b) {
  const [s1, s2] = [slugify(a.name), slugify(b.name)].sort();
  return `${s1}-vs-${s2}`;
}

// ---------- pair selection ----------

// High-search-volume pairs (manually curated)
const CURATED_PAIRS = [
  ['ChatGPT', 'Claude'],
  ['ChatGPT', 'Gemini'],
  ['ChatGPT', 'DeepSeek'],
  ['ChatGPT', 'Perplexity'],
  ['ChatGPT', 'Grok'],
  ['Claude', 'Gemini'],
  ['Claude', 'DeepSeek'],
  ['Midjourney', 'Flux'],
  ['Midjourney', 'Leonardo AI'],
  ['Midjourney', 'Stable Diffusion'],
  ['Midjourney', 'Adobe Firefly'],
  ['Midjourney', 'Ideogram'],
  ['Cursor', 'GitHub Copilot'],
  ['Cursor', 'Windsurf'],
  ['Cursor', 'Codeium'],
  ['GitHub Copilot', 'Codeium'],
  ['Runway ML', 'Pika Labs'],
  ['Runway ML', 'Kling AI'],
  ['Pika Labs', 'Kling AI'],
  ['Synthesia', 'HeyGen'],
  ['Synthesia', 'D-ID'],
  ['HeyGen', 'D-ID'],
  ['ElevenLabs', 'Murf AI'],
  ['ElevenLabs', 'Play.HT'],
  ['Jasper AI', 'Copy.ai'],
  ['Jasper AI', 'Writesonic'],
  ['Copy.ai', 'Writesonic'],
  ['Writesonic', 'Rytr'],
  ['Notion AI', 'Taskade AI'],
  ['Otter.ai', 'Fireflies.ai'],
  ['Bolt.new', 'Lovable'],
  ['Bolt.new', 'v0 by Vercel'],
  ['v0 by Vercel', 'Lovable'],
  ['Replit AI', 'Bolt.new'],
  ['Canva AI', 'Adobe Express AI'],
  ['Canva AI', 'Beautiful.ai'],
  ['Suno AI', 'ElevenLabs'],
];

function autoCategoryPairs(tools) {
  const byCat = {};
  for (const t of tools) {
    const c = t.category || 'other';
    (byCat[c] ||= []).push(t);
  }
  const pairs = [];
  for (const c in byCat) {
    const list = byCat[c];
    // pair within category: top-rated only (avoid quadratic explosion)
    const top = list.slice().sort((x, y) => (y.rating || 0) - (x.rating || 0)).slice(0, 4);
    for (let i = 0; i < top.length; i++)
      for (let j = i + 1; j < top.length; j++)
        pairs.push([top[i].name, top[j].name]);
  }
  return pairs;
}

// ---------- meta helpers ----------

function priceLabel(t) {
  if (t.pricing === 'free') return 'সম্পূর্ণ ফ্রি';
  if (t.pricing === 'freemium') return 'Freemium (ফ্রি + paid plans)';
  if (t.pricing === 'paid') return 'Paid';
  return t.usdPrice || '—';
}

function paymentLabel(p) {
  if (p === 'card') return 'International card লাগবে';
  if (p === 'bkash') return 'bKash দিয়ে কেনা যায়';
  if (p === 'free') return 'পেমেন্ট লাগে না';
  return p || '—';
}

function bdAccessLabel(t) {
  if (t.works_in_bd && t.no_vpn) return '<span class="badge good">✓ সরাসরি কাজ করে</span>';
  if (t.works_in_bd && !t.no_vpn) return '<span class="badge warn">VPN লাগতে পারে</span>';
  return '<span class="badge bad">সীমাবদ্ধ</span>';
}

function bool(v, yes='✓ হ্যাঁ', no='✕ না') {
  if (v === true) return `<span class="badge good">${yes}</span>`;
  if (v === false) return `<span class="badge bad">${no}</span>`;
  return '<span class="muted">—</span>';
}

// ---------- HTML template ----------

function buildPage(a, b) {
  const slug = pairKey(a, b);
  const url = `https://banglaaiguide.com/compare/${slug}/`;
  const title = `${a.name} vs ${b.name} — বাংলাদেশে কোনটি ভালো? (২০২৬)`;
  const desc = `${a.name} এবং ${b.name} এর সম্পূর্ণ তুলনা — দাম, ফিচার, বাংলাদেশ থেকে অ্যাক্সেস, পেমেন্ট পদ্ধতি। বাংলায় বিস্তারিত গাইড।`;

  // Pick a "winner" per criterion based on simple heuristics
  function pricier(x, y) { return parsePrice(x.usdPrice) - parsePrice(y.usdPrice); }
  function parsePrice(s) { if (!s) return 0; if (/free/i.test(s)) return 0; const m = String(s).match(/\$([0-9.]+)/); return m ? parseFloat(m[1]) : 999; }
  const cheaperOne = pricier(a, b) < 0 ? a : b;
  const ratingWin = (a.rating || 0) >= (b.rating || 0) ? a : b;

  const tableRows = [
    ['বিবরণ', escapeHtml(a.description_bn || ''), escapeHtml(b.description_bn || '')],
    ['ক্যাটাগরি', escapeHtml(a.category || ''), escapeHtml(b.category || '')],
    ['দাম', escapeHtml(priceLabel(a)), escapeHtml(priceLabel(b))],
    ['পেমেন্ট', escapeHtml(paymentLabel(a.payment)), escapeHtml(paymentLabel(b.payment))],
    ['BD থেকে অ্যাক্সেস', bdAccessLabel(a), bdAccessLabel(b)],
    ['VPN লাগে না', bool(a.no_vpn), bool(b.no_vpn)],
    ['বাংলা সাপোর্ট', bool(a.supportsBangla), bool(b.supportsBangla)],
    ['ফ্রি প্ল্যান', bool(a.freePlanAvailable), bool(b.freePlanAvailable)],
    ['মোবাইল ফ্রেন্ডলি', bool(a.mobileFriendly), bool(b.mobileFriendly)],
    ['নতুনদের জন্য', bool(a.beginnerFriendly), bool(b.beginnerFriendly)],
    ['রেটিং', `<span class="rating-big">${a.rating || '—'} ★</span>`, `<span class="rating-big">${b.rating || '—'} ★</span>`],
    ['সেরা কাজে', (a.bestFor || []).slice(0, 4).map(x => `<span class="chip">${escapeHtml(x)}</span>`).join(' '), (b.bestFor || []).slice(0, 4).map(x => `<span class="chip">${escapeHtml(x)}</span>`).join(' ')],
  ].map(([label, va, vb]) => `
        <div class="cmp-row">
          <div class="cmp-label">${escapeHtml(label)}</div>
          <div class="cmp-val">${va}</div>
          <div class="cmp-val">${vb}</div>
        </div>`).join('');

  return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="shortcut icon" href="/favicon.ico" />
  <meta name="theme-color" content="#0A0A0F" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(desc)}" />
  <meta name="keywords" content="${escapeHtml(a.name + ' vs ' + b.name + ', ' + a.name + ' bangla, ' + b.name + ' bangla, AI comparison bangla, AI টুলস তুলনা')}" />
  <meta name="author" content="বাংলা AI গাইড" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(desc)}" />
  <meta property="og:image" content="https://banglaaiguide.com/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content="bn_BD" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:image" content="https://banglaaiguide.com/og-image.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preconnect" href="https://logo.clearbit.com" />
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700;800&family=Syne:wght@500;700;800&display=swap" rel="stylesheet" />
  <script src="/js/search-overlay.js?v=2026-05-26" defer></script>

  <script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: desc,
    image: 'https://banglaaiguide.com/og-image.png',
    author: { '@type': 'Organization', name: 'বাংলা AI গাইড' },
    publisher: { '@type': 'Organization', name: 'বাংলা AI গাইড', logo: { '@type': 'ImageObject', url: 'https://banglaaiguide.com/web-app-manifest-512x512.png' } },
    datePublished: '2026-05-26',
    dateModified: '2026-05-26',
    mainEntityOfPage: url,
  })}</script>
  <script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'হোম', item: 'https://banglaaiguide.com/' },
      { '@type': 'ListItem', position: 2, name: 'তুলনা', item: 'https://banglaaiguide.com/compare/' },
      { '@type': 'ListItem', position: 3, name: `${a.name} vs ${b.name}`, item: url },
    ],
  })}</script>

  <style>
    *,*::before,*::after{box-sizing:border-box}
    :root{
      --bg:#0A0A0F;--bg-2:#0F0F17;
      --surface:rgba(255,255,255,0.03);--surface-2:rgba(255,255,255,0.06);--surface-3:rgba(255,255,255,0.09);
      --border:rgba(255,255,255,0.08);--border-2:rgba(255,255,255,0.14);
      --text:#FFFFFF;--text-2:#D8DEE9;--text-3:#94A3B8;--text-4:#64748B;
      --accent:#22C55E;--accent-2:#16A34A;--accent-soft:rgba(34,197,94,0.12);--accent-glow:rgba(34,197,94,0.35);
      --cyan:#22D3EE;--warning:#FBBF24;--danger:#EF4444;
      --r:16px;--r-lg:24px;--r-pill:9999px;
      --font-display:'Syne','Hind Siliguri',sans-serif;
      --font-body:'Hind Siliguri',system-ui,sans-serif;
    }
    html{scroll-behavior:smooth}
    body{margin:0;background:var(--bg);color:var(--text);font-family:var(--font-body);font-size:16px;line-height:1.7;-webkit-font-smoothing:antialiased;overflow-x:hidden}
    body::before{content:'';position:fixed;inset:0;z-index:0;
      background:radial-gradient(ellipse 80% 50% at 50% 0%,rgba(34,197,94,0.18) 0%,transparent 60%),radial-gradient(ellipse 60% 40% at 80% 30%,rgba(34,211,238,0.10) 0%,transparent 60%);
      pointer-events:none}
    body>*{position:relative;z-index:1}
    a{color:inherit;text-decoration:none}
    .container{max-width:1100px;margin:0 auto;padding:0 24px}

    .nav{position:sticky;top:0;z-index:50;backdrop-filter:blur(20px) saturate(180%);-webkit-backdrop-filter:blur(20px) saturate(180%);background:rgba(10,10,15,0.72);border-bottom:1px solid var(--border)}
    .nav-inner{display:flex;align-items:center;justify-content:space-between;height:64px;gap:24px}
    .brand{display:flex;align-items:center;gap:12px}
    .brand-mark{width:38px;height:38px;display:grid;place-items:center;background:linear-gradient(135deg,var(--accent),var(--accent-2));border-radius:11px;font-family:var(--font-display);font-weight:800;color:white}
    .brand-name{font-weight:700;font-size:15px}
    .nav-links{display:flex;gap:24px}
    .nav-links a{color:var(--text-2);font-size:14px;font-weight:500}
    .nav-links a:hover{color:var(--text)}

    .crumb{padding:20px 0 0;font-size:13px;color:var(--text-3)}
    .crumb a{color:var(--text-3);text-decoration:none}.crumb a:hover{color:var(--accent)}
    .crumb .sep{margin:0 8px;opacity:.6}

    .hero{padding:36px 0 24px;text-align:center}
    .eyebrow{display:inline-block;padding:6px 16px;background:var(--surface-2);border:1px solid var(--border-2);border-radius:var(--r-pill);color:var(--accent);font-size:13px;font-weight:600;margin-bottom:18px}
    .hero h1{font-family:var(--font-display);font-size:clamp(32px,4.5vw,52px);font-weight:800;line-height:1.1;letter-spacing:-0.025em;margin:0 0 14px}
    .hero h1 .grad{background:linear-gradient(135deg,var(--accent),var(--cyan));-webkit-background-clip:text;background-clip:text;color:transparent}
    .hero p{color:var(--text-3);font-size:17px;max-width:62ch;margin:0 auto}

    .vs-hero{display:grid;grid-template-columns:1fr auto 1fr;gap:24px;align-items:center;margin:48px 0 36px;max-width:880px;margin-left:auto;margin-right:auto}
    .vs-card{background:var(--surface);border:1px solid var(--border-2);border-radius:var(--r-lg);padding:28px 24px;text-align:center;transition:all .2s}
    .vs-card:hover{background:var(--surface-2);border-color:var(--accent);transform:translateY(-3px)}
    .vs-card img{width:72px;height:72px;border-radius:14px;background:white;padding:8px;object-fit:contain;margin:0 auto 16px;display:block}
    .vs-card h2{font-family:var(--font-display);font-size:26px;font-weight:700;margin:0 0 6px}
    .vs-card .meta{color:var(--text-3);font-size:13px;margin:0 0 14px}
    .vs-card .rating{font-size:14px;color:var(--text-2);margin:0 0 14px}
    .vs-card .rating .star{color:var(--warning)}
    .vs-card .price{display:inline-block;padding:6px 14px;background:var(--surface-3);border:1px solid var(--border);border-radius:var(--r-pill);font-size:12px;color:var(--text-2)}
    .vs-circle{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent-2));display:grid;place-items:center;font-family:var(--font-display);font-weight:800;font-size:20px;color:white;box-shadow:0 8px 24px var(--accent-glow)}

    .summary{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:28px 32px;margin:32px 0}
    .summary h3{font-family:var(--font-display);font-size:22px;font-weight:700;margin:0 0 12px}
    .summary p{color:var(--text-2);margin:0 0 12px;line-height:1.75}
    .summary p:last-child{margin-bottom:0}
    .summary strong{color:var(--accent)}

    .section-title{font-family:var(--font-display);font-size:clamp(26px,3.5vw,36px);font-weight:800;letter-spacing:-0.02em;margin:48px 0 8px;text-align:center}
    .section-sub{text-align:center;color:var(--text-3);margin:0 0 32px;font-size:15px}

    .cmp-table{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);overflow:hidden;margin:0 0 48px}
    .cmp-row{display:grid;grid-template-columns:200px 1fr 1fr;gap:16px;padding:16px 24px;border-bottom:1px solid var(--border);align-items:start}
    .cmp-row:last-child{border-bottom:none}
    .cmp-row:nth-child(even){background:rgba(255,255,255,0.015)}
    .cmp-label{color:var(--text-3);font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;padding-top:2px}
    .cmp-val{color:var(--text);font-size:15px;line-height:1.6}
    .badge{display:inline-block;padding:4px 11px;border-radius:var(--r-pill);font-size:12px;font-weight:600}
    .badge.good{background:rgba(34,197,94,.15);color:var(--accent)}
    .badge.warn{background:rgba(251,191,36,.15);color:var(--warning)}
    .badge.bad{background:rgba(239,68,68,.15);color:var(--danger)}
    .chip{display:inline-block;padding:3px 10px;background:var(--surface-3);border:1px solid var(--border);border-radius:var(--r-pill);font-size:12px;color:var(--text-2);margin:2px}
    .rating-big{font-weight:700;font-size:22px;color:var(--warning)}
    .muted{color:var(--text-4)}

    .verdict{background:linear-gradient(135deg,var(--accent-soft),rgba(34,211,238,0.04));border:1px solid var(--accent);border-radius:var(--r-lg);padding:32px;margin:0 0 48px}
    .verdict h3{font-family:var(--font-display);font-size:22px;margin:0 0 16px}
    .verdict .winners{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px}
    .verdict .winner{background:var(--surface-2);border:1px solid var(--border-2);border-radius:var(--r);padding:18px 20px}
    .verdict .winner .label{font-size:11px;color:var(--text-3);text-transform:uppercase;letter-spacing:0.08em;margin:0 0 6px}
    .verdict .winner .name{font-family:var(--font-display);font-size:18px;font-weight:700}

    .cta-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin:0 0 48px}
    .btn{display:inline-flex;align-items:center;gap:8px;padding:13px 26px;border-radius:var(--r-pill);font-family:inherit;font-weight:700;font-size:14px;text-decoration:none;border:1px solid transparent;cursor:pointer;transition:all .2s}
    .btn-primary{background:linear-gradient(135deg,var(--accent),var(--accent-2));color:white;box-shadow:0 8px 24px var(--accent-glow)}
    .btn-primary:hover{transform:translateY(-2px)}
    .btn-ghost{background:var(--surface-2);color:var(--text);border-color:var(--border-2)}
    .btn-ghost:hover{background:var(--surface-3)}

    .other-pairs{margin:48px 0 64px}
    .other-pairs h3{font-family:var(--font-display);font-size:22px;margin:0 0 20px;text-align:center}
    .pairs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}
    .pair-link{display:flex;align-items:center;gap:12px;padding:14px 18px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r);color:var(--text);transition:all .2s}
    .pair-link:hover{background:var(--surface-2);border-color:var(--accent);transform:translateX(3px)}
    .pair-link .logos{display:flex;align-items:center;gap:4px;flex-shrink:0}
    .pair-link .logos img{width:24px;height:24px;border-radius:6px;background:white;padding:2px}
    .pair-link .name{font-size:13px;font-weight:600}

    .footer{padding:40px 0;border-top:1px solid var(--border);text-align:center;color:var(--text-3);font-size:13px}
    .footer a{color:var(--text-3);margin:0 8px}.footer a:hover{color:var(--text)}

    @media(max-width:800px){
      .vs-hero{grid-template-columns:1fr;gap:14px}
      .vs-circle{justify-self:center;width:48px;height:48px;font-size:16px}
      .cmp-row{grid-template-columns:1fr;gap:8px;padding:14px 18px}
      .cmp-label{font-size:11px}
      .nav-links{display:none}
    }
  </style>
</head>
<body>

  <header class="nav">
    <div class="container nav-inner">
      <a href="/" class="brand"><span class="brand-mark">বা</span><span class="brand-name">বাংলা AI গাইড</span></a>
      <nav class="nav-links">
        <a href="/#toolsSection">টুলস</a>
        <a href="/blog/">ব্লগ</a>
        <a href="/compare/" style="color:var(--accent)">তুলনা</a>
        <a href="/quiz/">কুইজ</a>
      </nav>
    </div>
  </header>

  <div class="container">
    <nav class="crumb" aria-label="ব্রেডক্রাম্ব">
      <a href="/">হোম</a><span class="sep">›</span><a href="/compare/">তুলনা</a><span class="sep">›</span><span>${escapeHtml(a.name)} vs ${escapeHtml(b.name)}</span>
    </nav>
  </div>

  <main class="container">

    <section class="hero">
      <div class="eyebrow">⚡ পাশাপাশি তুলনা</div>
      <h1>${escapeHtml(a.name)} <span class="grad">vs</span> ${escapeHtml(b.name)}</h1>
      <p>বাংলাদেশে কোনটি ব্যবহার করা ভালো? দাম, ফিচার, পেমেন্ট পদ্ধতি, বাংলা সাপোর্ট — সব দিক থেকে তুলনা। ২০২৬ আপডেটেড।</p>
    </section>

    <section class="vs-hero">
      <div class="vs-card">
        <img src="${escapeHtml(a.logo || '')}" alt="${escapeHtml(a.name)}" onerror="this.style.display='none'" />
        <h2>${escapeHtml(a.name)}</h2>
        <p class="meta">${escapeHtml(a.category || '')}</p>
        <p class="rating"><span class="star">★</span> ${a.rating || '—'}</p>
        <span class="price">${escapeHtml(priceLabel(a))}</span>
      </div>
      <div class="vs-circle">VS</div>
      <div class="vs-card">
        <img src="${escapeHtml(b.logo || '')}" alt="${escapeHtml(b.name)}" onerror="this.style.display='none'" />
        <h2>${escapeHtml(b.name)}</h2>
        <p class="meta">${escapeHtml(b.category || '')}</p>
        <p class="rating"><span class="star">★</span> ${b.rating || '—'}</p>
        <span class="price">${escapeHtml(priceLabel(b))}</span>
      </div>
    </section>

    <section class="summary">
      <h3>সংক্ষেপে</h3>
      <p><strong>${escapeHtml(a.name)}</strong> — ${escapeHtml(a.description_bn || '')}</p>
      <p><strong>${escapeHtml(b.name)}</strong> — ${escapeHtml(b.description_bn || '')}</p>
      <p>দুটিই ${escapeHtml(a.category || '')} ক্যাটাগরির শক্তিশালী AI টুল। নিচে দেখুন কোনটি আপনার জন্য সেরা — বাংলাদেশি ব্যবহারকারীর প্রেক্ষাপটে।</p>
    </section>

    <h2 class="section-title">বিস্তারিত তুলনা</h2>
    <p class="section-sub">১২টি গুরুত্বপূর্ণ মানদণ্ডে পাশাপাশি</p>

    <div class="cmp-table">
      <div class="cmp-row" style="background:var(--surface-2);font-weight:800">
        <div class="cmp-label" style="color:var(--text)">মানদণ্ড</div>
        <div class="cmp-val"><strong style="font-family:var(--font-display);font-size:18px">${escapeHtml(a.name)}</strong></div>
        <div class="cmp-val"><strong style="font-family:var(--font-display);font-size:18px">${escapeHtml(b.name)}</strong></div>
      </div>
      ${tableRows}
    </div>

    <section class="verdict">
      <h3>🏆 কোনটি কোন কাজে ভালো?</h3>
      <div class="winners">
        <div class="winner"><p class="label">কম খরচে</p><div class="name">${escapeHtml(cheaperOne.name)}</div></div>
        <div class="winner"><p class="label">উচ্চ রেটিং</p><div class="name">${escapeHtml(ratingWin.name)}</div></div>
        ${a.supportsBangla && !b.supportsBangla ? `<div class="winner"><p class="label">বাংলা সাপোর্ট</p><div class="name">${escapeHtml(a.name)}</div></div>` : ''}
        ${b.supportsBangla && !a.supportsBangla ? `<div class="winner"><p class="label">বাংলা সাপোর্ট</p><div class="name">${escapeHtml(b.name)}</div></div>` : ''}
        ${a.beginnerFriendly && !b.beginnerFriendly ? `<div class="winner"><p class="label">নতুনদের জন্য</p><div class="name">${escapeHtml(a.name)}</div></div>` : ''}
        ${b.beginnerFriendly && !a.beginnerFriendly ? `<div class="winner"><p class="label">নতুনদের জন্য</p><div class="name">${escapeHtml(b.name)}</div></div>` : ''}
        ${a.no_vpn && !b.no_vpn ? `<div class="winner"><p class="label">VPN ছাড়া</p><div class="name">${escapeHtml(a.name)}</div></div>` : ''}
        ${b.no_vpn && !a.no_vpn ? `<div class="winner"><p class="label">VPN ছাড়া</p><div class="name">${escapeHtml(b.name)}</div></div>` : ''}
      </div>
    </section>

    <div class="cta-row">
      <a href="/${slugify(a.name)}/" class="btn btn-primary">${escapeHtml(a.name)} পেজ দেখুন →</a>
      <a href="/${slugify(b.name)}/" class="btn btn-primary">${escapeHtml(b.name)} পেজ দেখুন →</a>
      <a href="/compare/" class="btn btn-ghost">অন্য তুলনা করুন</a>
      <a href="/quiz/" class="btn btn-ghost">🎯 কুইজ নিন</a>
    </div>

    <section class="other-pairs">
      <h3>আরও জনপ্রিয় তুলনা</h3>
      <div class="pairs-grid" id="otherPairs"></div>
    </section>

  </main>

  <footer class="footer">
    <div class="container">
      <p>© ২০২৬ <a href="/">বাংলা AI গাইড</a> · <a href="/blog/">ব্লগ</a> · <a href="/compare/">তুলনা</a> · <a href="/quiz/">কুইজ</a></p>
    </div>
  </footer>

  <script>
    // Inject "Other pairs" list dynamically
    (function(){
      var pairs = ${JSON.stringify(getOtherPairs(a, b))};
      var html = pairs.map(function(p){
        return '<a class="pair-link" href="/compare/' + p.slug + '/">'
          + '<span class="logos"><img src="' + p.la + '" alt=""><img src="' + p.lb + '" alt=""></span>'
          + '<span class="name">' + p.label + '</span>'
          + '</a>';
      }).join('');
      var c = document.getElementById('otherPairs');
      if (c) c.innerHTML = html;
    })();
  </script>
</body>
</html>`;
}

// ---------- "Other pairs" suggestions ----------
let ALL_PAIRS_CACHE = null;
function getOtherPairs(a, b) {
  if (!ALL_PAIRS_CACHE) return [];
  return ALL_PAIRS_CACHE
    .filter(p => !(p.aName === a.name && p.bName === b.name) && !(p.aName === b.name && p.bName === a.name))
    .filter(p => p.aName === a.name || p.bName === a.name || p.aName === b.name || p.bName === b.name)
    .slice(0, 6)
    .map(p => ({ slug: pairKey({ name: p.aName }, { name: p.bName }), label: `${p.aName} vs ${p.bName}`, la: p.la, lb: p.lb }));
}

// ---------- main ----------

function run() {
  const tools = loadTools();
  if (!tools.length) { console.error('Failed to load tools-data.js'); process.exit(1); }
  console.log(`Loaded ${tools.length} tools`);

  const byName = {};
  tools.forEach(t => { byName[t.name] = t; });

  // Build pair set
  const pairsSet = new Map();
  const addPair = (n1, n2) => {
    const a = byName[n1], b = byName[n2];
    if (!a || !b || a.name === b.name) return;
    const key = pairKey(a, b);
    if (!pairsSet.has(key)) pairsSet.set(key, [a, b]);
  };
  CURATED_PAIRS.forEach(p => addPair(p[0], p[1]));
  autoCategoryPairs(tools).forEach(p => addPair(p[0], p[1]));

  // For "other pairs" suggestions
  ALL_PAIRS_CACHE = Array.from(pairsSet.values()).map(([a, b]) => ({
    aName: a.name, bName: b.name,
    la: a.logo || '', lb: b.logo || '',
  }));

  if (!fs.existsSync(COMPARE_DIR)) fs.mkdirSync(COMPARE_DIR, { recursive: true });

  let written = 0;
  for (const [slug, [a, b]] of pairsSet) {
    const dir = path.join(COMPARE_DIR, slug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), buildPage(a, b), 'utf8');
    written++;
  }
  console.log(`Comparison pages: wrote ${written} static pages → /compare/<a>-vs-<b>/`);
}

run();

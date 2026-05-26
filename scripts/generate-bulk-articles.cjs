#!/usr/bin/env node
/*
 * Bulk article generator for /blog/<slug>/index.html
 * Renders 10 keyword-targeted Bangla blog posts using the existing premium template.
 * Idempotent: re-running overwrites the generated files (won't touch unrelated posts).
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '..', 'blog');
const PUBLISHED = '2026-05-26';

const css = `:root{--bg-gradient:linear-gradient(180deg,#F0FDF9 0%,#FAFBFC 50%,#FFFFFF 100%);--accent:#16A34A;--accent-hover:#15803D;--accent-light:#22C55E;--accent-soft:#DCFCE7;--text:#0F172A;--text-muted:#475569;--border:#E2E8F0;--shadow-sm:0 4px 12px rgba(15,23,42,.06);--shadow-md:0 10px 30px rgba(15,23,42,.08);--radius-lg:24px;--radius-md:18px}body{font-family:'Hind Siliguri',sans-serif;line-height:1.8;margin:0;padding:0;background:var(--bg-gradient);color:var(--text);-webkit-font-smoothing:antialiased}.container{max-width:820px;margin:60px auto 80px;background:#fff;padding:60px 70px;border-radius:var(--radius-lg);box-shadow:var(--shadow-md);position:relative}.container::before{content:'';position:absolute;top:0;left:0;width:6px;height:100%;background:linear-gradient(135deg,#16A34A 0%,#22C55E 100%);border-radius:var(--radius-lg) 0 0 var(--radius-lg)}h1{font-family:'Syne',sans-serif;color:var(--text);font-size:2.75rem;font-weight:800;line-height:1.2;margin:0 0 32px 0;padding-bottom:24px;border-bottom:3px solid var(--border);position:relative}h1::after{content:'';position:absolute;bottom:-3px;left:0;width:80px;height:3px;background:linear-gradient(135deg,#16A34A 0%,#22C55E 100%)}h2{font-family:'Syne',sans-serif;color:var(--text);font-size:2rem;font-weight:700;line-height:1.3;margin:48px 0 20px 0;padding-left:20px;border-left:4px solid var(--accent)}h3{font-family:'Syne',sans-serif;color:var(--text);font-size:1.5rem;font-weight:600;line-height:1.4;margin:32px 0 16px 0}p{margin-bottom:1.5em;font-size:1.125rem;color:var(--text-muted);line-height:1.8}ul{list-style:none;margin:24px 0;padding:0}ul li{position:relative;padding:14px 20px 14px 50px;margin-bottom:14px;background:linear-gradient(135deg,#F9FAFB 0%,#F0FDF4 100%);border-radius:var(--radius-md);border:1px solid var(--border);font-size:1.0625rem;line-height:1.7;color:var(--text-muted);transition:all .2s ease}ul li:hover{background:linear-gradient(135deg,#FFFFFF 0%,#F0FDF4 100%);border-color:rgba(22,163,74,.3);transform:translateX(4px);box-shadow:var(--shadow-sm)}ul li::before{content:'\\2713';position:absolute;left:18px;top:50%;transform:translateY(-50%);width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#16A34A 0%,#22C55E 100%);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px}b{font-weight:600;color:var(--text)}a{color:var(--accent);text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:3px;font-weight:500;transition:all .2s ease}a:hover{color:var(--accent-hover);text-decoration-thickness:3px}@media (max-width:768px){.container{margin:30px 20px;padding:40px 30px}h1{font-size:2rem}h2{font-size:1.5rem}h3{font-size:1.25rem}p,ul li{font-size:1rem}}`;

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderSections(sections) {
  return sections.map(sec => {
    let html = `\n        <h2>${escapeHtml(sec.h2)}</h2>`;
    if (sec.paragraphs) {
      for (const p of sec.paragraphs) html += `\n        <p>${p}</p>`;
    }
    if (sec.list) {
      html += `\n        <ul>`;
      for (const li of sec.list) html += `\n            <li>${li}</li>`;
      html += `\n        </ul>`;
    }
    if (sec.subs) {
      for (const sub of sec.subs) {
        html += `\n\n        <h3>${escapeHtml(sub.h3)}</h3>`;
        if (sub.paragraphs) for (const p of sub.paragraphs) html += `\n        <p>${p}</p>`;
        if (sub.list) {
          html += `\n        <ul>`;
          for (const li of sub.list) html += `\n            <li>${li}</li>`;
          html += `\n        </ul>`;
        }
      }
    }
    return html;
  }).join('\n');
}

function renderArticle(a) {
  const url = `https://banglaaiguide.com/blog/${a.slug}/`;
  const body = renderSections(a.sections);
  const related = (a.related || []).map(r => `<li><a href="${r.href}">${escapeHtml(r.label)}</a></li>`).join('\n            ');
  const breadcrumb = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "বাংলা AI গাইড", "item": "https://banglaaiguide.com/" },
      { "@type": "ListItem", "position": 2, "name": "ব্লগ", "item": "https://banglaaiguide.com/blog/" },
      { "@type": "ListItem", "position": 3, "name": a.title, "item": url }
    ]
  });
  const article = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": a.title,
    "description": a.description,
    "image": "https://banglaaiguide.com/web-app-manifest-512x512.png",
    "author": { "@type": "Organization", "name": "BanglaAIGuide" },
    "publisher": {
      "@type": "Organization",
      "name": "বাংলা AI গাইড",
      "logo": { "@type": "ImageObject", "url": "https://banglaaiguide.com/web-app-manifest-512x512.png" }
    },
    "datePublished": PUBLISHED,
    "dateModified": PUBLISHED
  }, null, 2);

  return `<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(a.title)}</title>
    <meta name="description" content="${escapeHtml(a.description)}">
    <meta name="keywords" content="${escapeHtml(a.keywords)}">
    <meta name="author" content="BanglaAIGuide">
    <meta property="og:title" content="${escapeHtml(a.title)}">
    <meta property="og:description" content="${escapeHtml(a.description)}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="https://banglaaiguide.com/web-app-manifest-512x512.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(a.title)}">
    <meta name="twitter:description" content="${escapeHtml(a.description)}">
    <meta name="twitter:image" content="https://banglaaiguide.com/web-app-manifest-512x512.png">
    <link rel="canonical" href="${url}">

    <script type="application/ld+json">
${article}
    </script>
    <script type="application/ld+json">${breadcrumb}</script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Syne:wght@500;700;800&display=swap" rel="stylesheet">
    <style>${css}</style>
    <link rel="stylesheet" href="../../css/style.css">
    <link rel="stylesheet" href="../../css/blog-premium.css">
</head>
<body>
    <header class="navbar">
        <div class="container navbar-inner">
            <a href="/" class="logo">
                <img class="logo-mark" src="/favicon.svg" alt="বাংলা AI গাইড লোগো" width="28" height="28" decoding="async" />
                <span class="logo-text">বাংলা AI গাইড</span>
            </a>
            <nav class="nav-links">
                <a href="/#toolsSection">টুলস দেখুন</a>
                <a href="/blog/">ব্লগ</a>
                <a href="/bangla-ai-guide/">বাংলা AI গাইড</a>
            </nav>
        </div>
    </header>

    <div class="container">
        <h1>${escapeHtml(a.title)}</h1>
${body}

        <h2>প্রাসঙ্গিক টুলস ও গাইড</h2>
        <ul>
            ${related}
        </ul>

<section class="seo-newsletter-block" style="margin-top:2.5rem;padding:2rem;background:#f0fdf4;border-radius:12px;text-align:center;">
  <h2 style="color:#16a34a;margin-bottom:0.5rem;">AI আপডেট পেতে চান?</h2>
  <p style="margin-bottom:1rem;">প্রতি সপ্তাহে নতুন AI টুলস ও টিউটোরিয়াল বাংলায় পান।</p>
  <form class="newsletter-form newsletter-form--mailchimp" action="https://banglaaiguide.us15.list-manage.com/subscribe/post?u=d389c0647878724daecc58fc6&amp;id=aaca6896d2&amp;f_id=007c9ae1f0" method="post" target="mailchimp-subscribe-frame" accept-charset="UTF-8" data-mailchimp-form="true" style="display:flex;gap:8px;max-width:440px;margin:0 auto;">
    <input type="email" name="EMAIL" placeholder="আপনার ইমেইল লিখুন" required style="flex:1;padding:10px 14px;border:1px solid #e5e7eb;border-radius:8px;font-size:15px;">
    <button type="submit" style="padding:10px 20px;background:#16a34a;color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer;">সাবস্ক্রাইব</button>
  </form>
  <p style="font-size:12px;color:#64748b;margin-top:0.75rem;">ফ্রি নিউজলেটার। যেকোনো সময় আনসাবস্ক্রাইব করতে পারবেন।</p>
</section>

    </div>

    <footer class="footer">
        <div class="container footer-inner">
            <p class="footer-brand">
                <img class="logo-mark" src="/favicon.svg" alt="বাংলা AI গাইড লোগো" width="20" height="20" decoding="async" />
                <span>বাংলা AI গাইড</span>
            </p>
            <p>© ২০২৬ বাংলা AI গাইড · বাংলাদেশের জন্য তৈরি</p>
            <p class="footer-links">
                <a href="/privacy/">গোপনীয়তা</a> ·
                <a href="/terms/">শর্তাবলী</a> ·
                <a href="/contact/">যোগাযোগ</a> ·
                <a href="/bangla-ai-guide/">বাংলা AI গাইড</a>
            </p>
        </div>
    </footer>
<script src="/js/mailchimp.js" defer></script>
</body>
</html>`;
}

const dataFile = process.argv[2] || './data/bulk-articles-data.cjs';
const articles = require(dataFile);

let written = 0;
for (const a of articles) {
  const dir = path.join(BLOG_DIR, a.slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'index.html');
  fs.writeFileSync(file, renderArticle(a), 'utf8');
  console.log('Wrote:', path.relative(path.join(__dirname, '..'), file));
  written++;
}
console.log(`\nGenerated ${written} articles.`);

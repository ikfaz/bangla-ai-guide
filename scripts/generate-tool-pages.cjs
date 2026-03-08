const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const toolRedirectDir = path.join(root, "tools");
const lastmod = "2026-03-09";
const siteUrl = "https://banglaaiguide.com";

const categoryLabelMap = {
  llm: "LLM",
  image: "ইমেজ ও ভিডিও",
  coding: "কোডিং",
  productivity: "প্রোডাক্টিভিটি",
};

const applicationCategoryMap = {
  llm: "ChatbotApplication",
  image: "MultimediaApplication",
  coding: "DeveloperApplication",
  productivity: "BusinessApplication",
};

const articleLinks = {
  chatgpt: { href: "../chatgpt-bangladesh-theke-bebohar.html", text: "ChatGPT Bangladesh guide" },
  cursor: { href: "../cursor-ai-bangla.html", text: "Cursor AI বাংলা" },
  elevenlabs: { href: "../elevenlabs-bangla-voice.html", text: "ElevenLabs বাংলা ভয়েস" },
  midjourney: { href: "../midjourney-bangladesh-free.html", text: "Midjourney Bangladesh free" },
  "kling-ai": { href: "../ai-tools-for-youtube-bangladesh.html", text: "AI tools for YouTube Bangladesh" },
  claude: { href: "../ai-tools-for-freelancers-bangladesh.html", text: "AI tools for freelancers Bangladesh" },
  gamma: { href: "../best-ai-tools-for-content-creators-bangladesh.html", text: "Best AI tools for content creators" },
  notebooklm: { href: "../notebooklm-bangla-guide.html", text: "NotebookLM বাংলা গাইড" },
};

const baseLinks = [
  { href: "../index.html", text: "সব AI টুলস দেখুন" },
  { href: "../ai-tools-bdt-price-2026-bangladesh.html", text: "AI tools BDT price 2026" },
  { href: "../vpn-chara-ai-tools-bangladesh.html", text: "VPN ছাড়া AI tools Bangladesh" },
  { href: "../submit.html", text: "নতুন টুল সাবমিট করুন" },
];

const categoryLinks = {
  llm: [
    { href: "../chatgpt-bangladesh-theke-bebohar.html", text: "ChatGPT Bangladesh guide" },
    { href: "../ai-tools-for-freelancers-bangladesh.html", text: "AI tools for freelancers Bangladesh" },
    { href: "../best-ai-tools-for-content-creators-bangladesh.html", text: "Best AI tools for content creators" },
  ],
  image: [
    { href: "../midjourney-bangladesh-free.html", text: "Midjourney Bangladesh free" },
    { href: "../ai-tools-for-youtube-bangladesh.html", text: "AI tools for YouTube Bangladesh" },
    { href: "../ai-image-generator-free-bangladesh.html", text: "AI image generator free Bangladesh" },
  ],
  coding: [
    { href: "../cursor-ai-bangla.html", text: "Cursor AI বাংলা" },
    { href: "../best-ai-coding-tools-for-beginners-bangladesh.html", text: "Best AI coding tools for beginners" },
    { href: "../ai-tools-for-freelancers-bangladesh.html", text: "AI tools freelancer Bangladesh income" },
  ],
  productivity: [
    { href: "../bangladeshe-ai-tools-kibhabe-bebohar-korben.html", text: "বাংলাদেশে AI tools কীভাবে ব্যবহার করবেন" },
    { href: "../best-ai-tools-for-content-creators-bangladesh.html", text: "AI tools for content creators Bangladesh" },
    { href: "../ai-tools-for-freelancers-bangladesh.html", text: "AI tools freelancer Bangladesh income" },
  ],
};

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function bnNum(value) {
  return Number(value).toLocaleString("bn-BD");
}

function loadTools() {
  const source = fs.readFileSync(path.join(root, "js", "tools-data.js"), "utf8");
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);
  vm.runInContext(`${source}\nthis.__tools = window.tools || tools; this.__rate = window.USD_TO_BDT || USD_TO_BDT;`, sandbox);
  return { tools: sandbox.__tools || [], usdToBdt: Number(sandbox.__rate || 122) };
}

function isFullyFree(tool) {
  const pricing = String(tool.pricing || "").toLowerCase();
  const usdPrice = String(tool.usdPrice || "").toLowerCase();
  return pricing === "free" || tool.payment === "free" || usdPrice.includes("সম্পূর্ণ ফ্রি") || usdPrice === "free";
}

function extractUsdNumber(rawPrice) {
  const match = String(rawPrice).match(/\$(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

function getPriceInfo(tool, conversionRate) {
  const raw = String(tool.usdPrice || "").trim();
  if (isFullyFree(tool)) {
    return { usdLabel: raw || "সম্পূর্ণ ফ্রি", bdtLabel: "৳০ — ফ্রি" };
  }
  if (raw.toLowerCase() === "usage-based") {
    return { usdLabel: raw, bdtLabel: "চাহিদাভিত্তিক" };
  }
  if (/^free\s*\/\s*api paid$/i.test(raw)) {
    return { usdLabel: raw, bdtLabel: "ফ্রি / API পেইড" };
  }
  const usdValue = extractUsdNumber(raw);
  if (usdValue !== null) {
    const bdt = `৳${bnNum(Math.round(usdValue * conversionRate))}`;
    const monthly = /\/mo/i.test(raw) ? "/মাস" : "";
    if (/^free\s*\//i.test(raw)) {
      return { usdLabel: raw, bdtLabel: `ফ্রি / ${bdt}${monthly}` };
    }
    return { usdLabel: raw, bdtLabel: `${bdt}${monthly}` };
  }
  return { usdLabel: raw || "প্রযোজ্য নয়", bdtLabel: raw || "প্রযোজ্য নয়" };
}

function getToolDomain(tool) {
  const rawUrl = tool.direct_url || tool.affiliate_url || "";
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function getToolLogo(tool) {
  if (tool.logo) {
    return tool.logo;
  }
  const domain = getToolDomain(tool);
  return domain ? `https://logo.clearbit.com/${domain}` : "https://logo.clearbit.com/openai.com";
}

function getToolLogoFallback(tool) {
  if (tool.logo_fallback) {
    return tool.logo_fallback;
  }
  const domain = getToolDomain(tool) || "openai.com";
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
}

function getPaymentBadges(tool) {
  const values = Array.isArray(tool.payment) ? tool.payment : [tool.payment || "card"];
  const labels = { free: "🆓 ফ্রি", card: "💳 কার্ড", wise: "Wise", bkash: "bKash" };
  return values
    .filter(Boolean)
    .map((value) => `<span class="badge ${value === "free" ? "badge--accent" : "badge--neutral"}">${escapeHtml(labels[value] || value)}</span>`)
    .join("");
}

function parseDetailsHighlights(details) {
  return String(details || "")
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?।])\s+/)
    .map((item) => item.replace(/[.!?।]+$/, "").trim())
    .filter(Boolean)
    .slice(0, 3);
}

function dedupeLinks(links) {
  return links.filter(Boolean).filter((link, index, all) => link.href && all.findIndex((item) => item.href === link.href) === index);
}

function buildNotebookLmProfile(tool, slug, conversionRate) {
  const priceInfo = getPriceInfo(tool, conversionRate);
  return {
    title: `${tool.name} বাংলাদেশে ব্যবহার গাইড | বাংলা AI গাইড`,
    description: "NotebookLM বাংলাদেশে কীভাবে ব্যবহার করবেন, PDF summary workflow, study notes, audio overview, এবং free access context বাংলায় জানুন।",
    intro: [
      "NotebookLM হলো Google-এর research assistant যেখানে PDF, notes, website summary, এবং source-based প্রশ্নোত্তর করা যায়।",
      "বাংলাদেশের শিক্ষার্থী, শিক্ষক, researcher, এবং content planner-দের জন্য এটি বিশেষভাবে useful কারণ source-grounded summary দ্রুত পাওয়া যায়।",
    ],
    quickAnswer: [
      "NotebookLM বাংলাদেশ থেকে সাধারণভাবে ব্যবহার করা যায় এবং বেশিরভাগ ক্ষেত্রে VPN লাগে না।",
      "PDF, lecture note, report, বা research source আপলোড করে summary, Q&A, এবং audio overview তৈরি করা যায়।",
      `বর্তমান pricing context: ${priceInfo.bdtLabel}.`,
    ],
    usage: [
      "পরীক্ষার প্রস্তুতি, class note revision, thesis source summary, এবং long PDF breakdown-এ NotebookLM খুবই কার্যকর।",
      "Random AI answer-এর বদলে source-bound output পাওয়া যায়, তাই factual work-এ এটি বেশি নির্ভরযোগ্য workflow দেয়।",
      "বাংলা source এবং ইংরেজি source একসাথে রেখে mixed-language research note তৈরি করা যায়।",
    ],
    steps: [
      "NotebookLM খুলে একটি নতুন notebook তৈরি করুন।",
      "PDF, Google Docs, note, বা web source যোগ করুন।",
      "প্রথমে ছোট প্রশ্ন দিয়ে source coverage যাচাই করুন।",
      "তারপর summary, outline, FAQ, বা study note generate করুন।",
      "গুরুত্বপূর্ণ output নিজে verify করে final note তৈরি করুন।",
    ],
    payment: [
      "Free plan দিয়েই বেশিরভাগ study ও note workflow শুরু করা যায়।",
      "Google account ecosystem-এর সাথে কাজ করলে onboarding সহজ হয়।",
      `দাম/অ্যাক্সেস context: ${priceInfo.usdLabel} | ${priceInfo.bdtLabel}.`,
    ],
    vpn: [
      "সাধারণত VPN লাগে না।",
      "যদি account-level feature rollout দেরিতে আসে, browser profile এবং Google account region state পরীক্ষা করুন।",
    ],
    faq: [
      { q: "NotebookLM কি বাংলাদেশ থেকে ব্যবহার করা যায়?", a: "হ্যাঁ, সাধারণভাবে ব্যবহার করা যায় এবং source upload workflow বেশিরভাগ ক্ষেত্রে চালু থাকে।" },
      { q: "NotebookLM কি ফ্রি?", a: "মূল workflow অনেক ক্ষেত্রেই ফ্রি দিয়ে শুরু করা যায়। heavy বা enterprise use-case আলাদা হতে পারে।" },
      { q: "NotebookLM দিয়ে article বা study note বানানো যায়?", a: "হ্যাঁ, source upload করে outline, summary, FAQ, study guide, এবং source-based note বানানো যায়।" },
      { q: "NotebookLM-এর জন্য আলাদা গাইড আছে?", a: "হ্যাঁ, বিস্তারিত NotebookLM বাংলা গাইড থেকে setup, study workflow, এবং resource strategy দেখা যাবে।" },
    ],
    links: dedupeLinks([articleLinks[slug], ...baseLinks, ...(categoryLinks[tool.category] || [])]).slice(0, 6),
  };
}

function buildGenericProfile(tool, slug, conversionRate) {
  const priceInfo = getPriceInfo(tool, conversionRate);
  const details = parseDetailsHighlights(tool.details);
  const categoryLabel = categoryLabelMap[tool.category] || "অন্যান্য";
  const intro = [
    `${tool.name} হলো ${categoryLabel} ক্যাটাগরির একটি টুল যা বাংলাদেশি ব্যবহারকারীদের জন্য ${tool.works_in_bd ? "বাস্তবভাবে ব্যবহারযোগ্য" : "ব্যবহারের আগে region support যাচাই করা উচিত"}।`,
    tool.review_bn || `${tool.name} ব্যবহার করার আগে official pricing, payment method, এবং workflow fit যাচাই করা ভালো।`,
  ];
  return {
    title: `${tool.name} বাংলাদেশে ব্যবহার, দাম ও রিভিউ | বাংলা AI গাইড`,
    description: `${tool.name} বাংলাদেশে ব্যবহার গাইড: ${tool.no_vpn ? "VPN ছাড়া access" : "access policy"}, ${priceInfo.bdtLabel} price context, এবং ${categoryLabel} workflow বাংলায় জানুন।`,
    intro,
    quickAnswer: [
      `${tool.name} ${tool.works_in_bd ? "বাংলাদেশ থেকে সাধারণভাবে ব্যবহার করা যায়" : "ব্যবহারের আগে availability যাচাই করা উচিত"} এবং ${tool.no_vpn ? "বেশিরভাগ ক্ষেত্রে VPN লাগে না" : "কিছু ক্ষেত্রে VPN লাগতে পারে"}।`,
      details[0] || `${tool.name} ${categoryLabel} workflow-এ use-case অনুযায়ী ভালো ফল দিতে পারে।`,
      `Pricing context: ${priceInfo.usdLabel} | ${priceInfo.bdtLabel}.`,
    ],
    usage: [
      tool.description_bn || `${tool.name} ${categoryLabel} use-case-এ কাজ করে।`,
      details[1] || `${tool.name} ব্যবহার করার আগে official pricing, limits, এবং support policy মিলিয়ে দেখা উচিত।`,
      details[2] || `${tool.name} নিয়ে কাজ করার সময় output quality ও cost দুটিই একসাথে track করা ভালো।`,
    ],
    steps: [
      `${tool.name} account খুলে free/basic tier দিয়ে শুরু করুন।`,
      "ছোট use-case দিয়ে output quality যাচাই করুন।",
      "payment, limit, এবং support policy note করে রাখুন।",
      "repeatable workflow বানিয়ে তারপর production use-এ যান।",
      "গুরুত্বপূর্ণ output human review করে final করুন।",
    ],
    payment: [
      `Official price label: ${priceInfo.usdLabel}.`,
      `আনুমানিক BDT context: ${priceInfo.bdtLabel}.`,
      tool.payment === "card" ? "International card checkout-এর আগে activation status যাচাই করুন।" : "Free বা local-friendly access থাকলে onboarding সহজ হয়।",
    ],
    vpn: [
      tool.no_vpn ? "সাধারণত VPN ছাড়াই ব্যবহার করা যায়।" : "কিছু region বা feature-এ VPN লাগতে পারে।",
      "Login বা access সমস্যা হলে official help page এবং region policy check করুন।",
    ],
    faq: [
      { q: `${tool.name} কি বাংলাদেশ থেকে ব্যবহার করা যায়?`, a: tool.works_in_bd ? "হ্যাঁ, সাধারণভাবে ব্যবহার করা যায়।" : "ব্যবহারের আগে official region support যাচাই করা ভালো।" },
      { q: `${tool.name} এর দাম আনুমানিক কত?`, a: `বর্তমান label অনুযায়ী ${priceInfo.usdLabel}; বাংলাদেশি budget context-এ ${priceInfo.bdtLabel}.` },
      { q: `${tool.name} ব্যবহার করতে VPN লাগে কি?`, a: tool.no_vpn ? "সাধারণত না, তবে network বা account issue হলে exception হতে পারে।" : "কিছু ক্ষেত্রে লাগতে পারে, তাই আগে access check করুন।" },
      { q: `${tool.name} কারা ব্যবহার করলে বেশি লাভবান হবে?`, a: `${categoryLabel} workflow-এ যারা speed, structure, বা automation চান তারা বেশি উপকার পাবেন।` },
    ],
    links: dedupeLinks([articleLinks[slug], ...baseLinks, ...(categoryLinks[tool.category] || [])]).slice(0, 6),
  };
}

function pickRelatedTools(tools, currentTool) {
  return tools
    .filter((tool) => tool.name !== currentTool.name)
    .sort((a, b) => {
      const aScore = (a.category === currentTool.category ? 50 : 0) + (Math.abs(Number(a.rating || 0) - Number(currentTool.rating || 0)) < 0.5 ? 10 : 0);
      const bScore = (b.category === currentTool.category ? 50 : 0) + (Math.abs(Number(b.rating || 0) - Number(currentTool.rating || 0)) < 0.5 ? 10 : 0);
      return bScore - aScore || String(a.name).localeCompare(String(b.name));
    })
    .slice(0, 4);
}

function renderRelatedTools(tools, currentTool) {
  return pickRelatedTools(tools, currentTool)
    .map((tool) => {
      const slug = toSlug(tool.name);
      return `
        <article class="tool-card">
          <div class="tool-header">
            <div class="tool-title-wrap">
              <img class="tool-logo" src="${escapeHtml(getToolLogo(tool))}" alt="${escapeHtml(tool.name)} logo" width="48" height="48" style="border-radius:10px; object-fit:contain;" onerror="this.onerror=null; this.src='${escapeHtml(getToolLogoFallback(tool))}'" loading="lazy" decoding="async" />
              <h3 class="tool-title">${escapeHtml(tool.name)}</h3>
            </div>
            <span class="category-tag">${escapeHtml(categoryLabelMap[tool.category] || "অন্যান্য")}</span>
          </div>
          <p class="tool-desc">${escapeHtml(tool.description_bn || "")}</p>
          <div class="tool-meta">
            <p class="rating">★ ${Number(tool.rating || 0).toLocaleString("bn-BD", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</p>
            <a class="btn btn-ghost" href="../${escapeHtml(slug)}/">দেখুন →</a>
          </div>
        </article>
      `;
    })
    .join("");
}

function buildSchema(tool, canonicalUrl, priceInfo, profile) {
  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "বাংলা AI গাইড", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: tool.name, item: canonicalUrl },
    ],
  };
  const software = {
    "@type": "SoftwareApplication",
    name: tool.name,
    applicationCategory: applicationCategoryMap[tool.category] || "SoftwareApplication",
    operatingSystem: "Web",
    url: canonicalUrl,
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: priceInfo.bdtLabel.replace(/[^\d]/g, "") || "0",
      availability: "https://schema.org/InStock",
    },
    description: tool.description_bn || profile.description,
  };
  const faq = {
    "@type": "FAQPage",
    inLanguage: "bn-BD",
    url: canonicalUrl,
    mainEntity: profile.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return { "@context": "https://schema.org", "@graph": [breadcrumb, software, faq] };
}

function renderPage(tool, tools, conversionRate) {
  const slug = toSlug(tool.name);
  const canonicalUrl = `${siteUrl}/${slug}/`;
  const priceInfo = getPriceInfo(tool, conversionRate);
  const profile = slug === "notebooklm" ? buildNotebookLmProfile(tool, slug, conversionRate) : buildGenericProfile(tool, slug, conversionRate);
  const relatedHtml = renderRelatedTools(tools, tool);
  const badgeHtml = `
    <span class="badge badge--accent">${tool.works_in_bd ? "✅ BD-তে কাজ করে" : "⚠️ BD-তে availability check"}</span>
    <span class="badge ${tool.no_vpn ? "badge--accent" : "badge--neutral"}">${tool.no_vpn ? "🔵 VPN লাগে না" : "⚠️ VPN লাগতে পারে"}</span>
    ${getPaymentBadges(tool)}
  `;
  const schema = buildSchema(tool, canonicalUrl, priceInfo, profile);
  const verifiedText = escapeHtml(tool.verified || "মার্চ ২০২৬");
  const actionUrl = escapeHtml(tool.affiliate_url || tool.direct_url || "#");
  const pricingUrl = escapeHtml(tool.pricing_url || tool.direct_url || tool.affiliate_url || "#");
  const linksHtml = profile.links.map((link) => `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.text)}</a></li>`).join("");
  const faqHtml = profile.faq.map((item) => `<article class="seo-faq-item"><h3>${escapeHtml(item.q)}</h3><p>${escapeHtml(item.a)}</p></article>`).join("");
  return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/png" href="../favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/svg+xml" href="../favicon.svg" />
  <link rel="shortcut icon" href="../favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="../apple-touch-icon.png" />
  <link rel="manifest" href="../site.webmanifest" />
  <meta name="theme-color" content="#059669" />
  <title>${escapeHtml(profile.title)}</title>
  <meta name="description" content="${escapeHtml(profile.description)}" />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="${canonicalUrl}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Syne:wght@500;700;800&display=swap" />
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Syne:wght@500;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../css/style.css" />
  <script src="../js/consent.js" defer></script>
  <script src="../js/tools-data.js" defer></script>
  <script src="../js/seo-pages.js" defer></script>
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body data-page-slug="${escapeHtml(slug)}">
  <header class="navbar" id="top">
    <div class="container navbar-inner">
      <a href="/" class="logo" aria-label="বাংলা AI গাইড হোম">
        <img class="logo-mark" src="../favicon.svg" alt="বাংলা AI গাইড লোগো" width="28" height="28" decoding="async" />
        <span class="logo-text">বাংলা AI গাইড</span>
      </a>
      <button class="hamburger" id="hamburgerBtn" type="button" aria-expanded="false" aria-controls="mobileMenu" aria-label="মেনু টগল করুন">
        <span></span><span></span><span></span>
      </button>
      <div class="nav-desktop">
        <nav class="nav-links" aria-label="প্রধান ন্যাভিগেশন">
          <a href="../index.html#toolsSection">টুলস দেখুন</a>
          <a href="../index.html#categoryTabs">ক্যাটাগরি</a>
          <a href="../index.html#newsletter">নিউজলেটার</a>
        </nav>
        <a href="../submit.html" class="btn btn-primary">টুল সাবমিট করুন</a>
      </div>
    </div>
    <div class="mobile-menu" id="mobileMenu" aria-hidden="true">
      <a href="../index.html#toolsSection">টুলস দেখুন</a>
      <a href="../index.html#categoryTabs">ক্যাটাগরি</a>
      <a href="../index.html#newsletter">নিউজলেটার</a>
      <a href="../submit.html" class="btn btn-primary mobile-cta">টুল সাবমিট করুন</a>
    </div>
  </header>

  <main class="seo-main">
    <article class="container seo-article-page">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="../index.html">হোম</a><span>&gt;</span><a href="../index.html#categoryTabs">${escapeHtml(categoryLabelMap[tool.category] || "অন্যান্য")}</a><span>&gt;</span><span>${escapeHtml(tool.name)}</span>
      </nav>
      <div class="tool-header detail-title-row">
        <div class="tool-title-wrap">
          <img class="tool-logo" src="${escapeHtml(getToolLogo(tool))}" alt="${escapeHtml(tool.name)} logo" width="48" height="48" style="border-radius:10px; object-fit:contain;" onerror="this.onerror=null; this.src='${escapeHtml(getToolLogoFallback(tool))}'" loading="lazy" decoding="async" />
          <h1 class="detail-title">${escapeHtml(tool.name)}</h1>
        </div>
        <span class="category-tag">${escapeHtml(categoryLabelMap[tool.category] || "অন্যান্য")}</span>
      </div>
      <div class="badges detail-badges">${badgeHtml}</div>
      <p class="detail-description">${escapeHtml(tool.description_bn || profile.description)}</p>
      <blockquote class="review-block detail-review">
        <p>"${escapeHtml(tool.review_bn || `${tool.name} সম্পর্কে বাংলা রিভিউ ও ব্যবহার গাইড এখানে দেয়া হয়েছে।`)}"</p>
        <p class="review-source">— BanglaAIGuide</p>
      </blockquote>
      <div class="detail-meta">
        <div>
          <p class="price">${escapeHtml(priceInfo.usdLabel)} | ${escapeHtml(priceInfo.bdtLabel)}</p>
          <a class="pricing-link" href="${pricingUrl}" target="_blank" rel="noopener noreferrer">💰 দাম দেখুন</a>
          <span class="verified-date">🗓️ যাচাই: ${verifiedText}</span>
        </div>
        <p class="rating">★ ${Number(tool.rating || 0).toLocaleString("bn-BD", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</p>
      </div>
      <div class="seo-cta-actions">
        <a class="btn btn-primary detail-cta" href="${actionUrl}" target="_blank" rel="nofollow noopener noreferrer">এখনই ব্যবহার করুন →</a>
        <a class="btn btn-ghost" href="../index.html">সব টুলস দেখুন</a>
      </div>

      <section class="seo-block"><h2>Quick answer</h2>${profile.quickAnswer.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</section>
      <section class="seo-block"><h2>বাংলাদেশে ব্যবহারযোগ্যতা</h2>${profile.usage.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</section>
      <section class="seo-block"><h2>Payment/BDT Context</h2>${profile.payment.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</section>
      <section class="seo-block"><h2>VPN Requirement</h2>${profile.vpn.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</section>
      <section class="seo-block"><h2>Step-by-step ব্যবহার পদ্ধতি</h2><ol class="seo-steps">${profile.steps.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol></section>
      <section class="seo-block"><h2>FAQ</h2>${faqHtml}</section>
      <section class="seo-block"><h2>আরও রিসোর্স</h2><ul class="seo-links-list">${linksHtml}</ul></section>
    </article>

    <section class="container related-section">
      <h2>সম্পর্কিত টুলস</h2>
      <div class="related-grid">${relatedHtml}</div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <p class="footer-brand"><img class="logo-mark" src="../favicon.svg" alt="বাংলা AI গাইড লোগো" width="20" height="20" decoding="async" /><span>বাংলা AI গাইড</span></p>
      <p>© ২০২৬ বাংলা AI গাইড · বাংলাদেশের জন্য তৈরি</p>
      <nav class="footer-links" aria-label="ফুটার লিংক"><a href="../submit.html">টুল সাবমিট</a><a href="../contact.html#advertising">বিজ্ঞাপন</a><a href="../privacy.html">প্রাইভেসি</a><a href="../terms.html">শর্তাবলী</a><a href="../disclaimer.html">ডিসক্লেইমার</a><a href="../contact.html">যোগাযোগ</a></nav>
    </div>
  </footer>
</body>
</html>`;
}

function renderLegacyRedirectPage(slug) {
  const canonicalUrl = `${siteUrl}/${slug}/`;
  const escapedCanonical = escapeHtml(canonicalUrl);
  const escapedPath = `/${encodeURIComponent(slug)}/`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0; url=${escapedCanonical}" />
  <meta name="robots" content="noindex,follow" />
  <link rel="canonical" href="${escapedCanonical}" />
  <title>Redirecting...</title>
  <script>
    window.location.replace(${JSON.stringify(escapedPath)});
  </script>
</head>
<body>
  <p>This page has moved to <a href="${escapedCanonical}">${escapedCanonical}</a>.</p>
</body>
</html>`;
}

function updateSitemap(tools) {
  const sitemapPath = path.join(root, "sitemap.xml");
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  const toolEntries = tools
    .map((tool) => {
      const slug = toSlug(tool.name);
      return `  <url>\n    <loc>${siteUrl}/${slug}/</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>`;
    })
    .join("\n");
  const notebookEntry = `  <url>\n    <loc>${siteUrl}/notebooklm-bangla-guide.html</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
  const block = `\n  <!-- Generated Tool Pages -->\n${toolEntries}\n\n  <!-- NotebookLM Tool Article -->\n${notebookEntry}\n`;
  let updated = sitemap.replace(/\n  <!-- Generated Tool Pages -->[\s\S]*?\n(?=<\/urlset>)/, "\n");
  updated = updated.replace("</urlset>", `${block}</urlset>`);
  fs.writeFileSync(sitemapPath, updated, "utf8");
}

function main() {
  const { tools, usdToBdt } = loadTools();
  if (!Array.isArray(tools) || !tools.length) {
    throw new Error("No tools loaded from js/tools-data.js");
  }

  fs.mkdirSync(toolRedirectDir, { recursive: true });

  for (const tool of tools) {
    const slug = toSlug(tool.name);
    const html = renderPage(tool, tools, usdToBdt);
    const canonicalDir = path.join(root, slug);
    fs.mkdirSync(canonicalDir, { recursive: true });
    fs.writeFileSync(path.join(canonicalDir, "index.html"), html, "utf8");
    fs.writeFileSync(path.join(toolRedirectDir, `${slug}.html`), renderLegacyRedirectPage(slug), "utf8");
  }

  updateSitemap(tools);
  console.log(`Generated ${tools.length} clean tool pages and legacy redirects`);
}

main();

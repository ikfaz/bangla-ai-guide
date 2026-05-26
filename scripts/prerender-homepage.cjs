#!/usr/bin/env node
// Pre-render the top featured tool cards into index.html's tools-grid so
// crawlers see real content without JS. The client-side renderer in main.js
// replaces innerHTML when it loads, so the dynamic UI is unaffected.
//
//   node scripts/prerender-homepage.cjs
//
// Idempotent: content between PRERENDER markers is replaced on each run.

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const INDEX = path.join(ROOT, "index.html");
const DATA = path.join(ROOT, "js", "tools-data.js");

const SECTIONS = [
  { id: "toolsGrid", count: 12, marker: "TOOLS", renderer: "card" },
  { id: "heroFeatured", count: 4, marker: "HERO", renderer: "heroCard" },
  { id: "trendingGrid", count: 8, marker: "TRENDING", renderer: "card" },
];

function loadTools() {
  const source = fs.readFileSync(DATA, "utf8");
  // const at top-level inside vm.runInContext doesn't attach to context;
  // re-export via an explicit capture line.
  const wrapped = `${source}\n;__captured__ = { tools, USD_TO_BDT };`;
  const ctx = { __captured__: null };
  vm.createContext(ctx);
  vm.runInContext(wrapped, ctx);
  const cap = ctx.__captured__ || {};
  return { tools: cap.tools || [], USD_TO_BDT: cap.USD_TO_BDT || 122 };
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function categoryLabel(cat) {
  const map = {
    llm: "LLM",
    image: "ইমেজ",
    video: "ভিডিও",
    coding: "কোডিং",
    writing: "রাইটিং",
    marketing: "মার্কেটিং",
    productivity: "প্রোডাক্টিভিটি",
    voice: "ভয়েস",
    design: "ডিজাইন",
  };
  return map[cat] || "AI";
}

function bdtPrice(tool, rate) {
  if (tool.pricing === "free") return "৳০ — ফ্রি";
  const m = String(tool.usdPrice || "").match(/\$(\d+(?:\.\d+)?)/);
  if (!m) return "চাহিদাভিত্তিক";
  const bdt = Math.round(parseFloat(m[1]) * rate);
  return `ফ্রি / ৳${bdt.toLocaleString("bn-BD")}/মাস`;
}

function renderCard(tool, rate) {
  const slug = slugify(tool.name);
  const url = `/${slug}/`;
  const cat = categoryLabel(tool.category);
  const price = bdtPrice(tool, rate);
  const access = tool.no_vpn ? "VPN লাগে না" : "VPN লাগে";
  const rating = tool.rating ? `★ ${tool.rating}` : "";
  return `<article class="tool-card" itemscope itemtype="https://schema.org/SoftwareApplication" data-category="${escapeHtml(tool.category || "other")}" data-pricing="${escapeHtml(tool.pricing || "unknown")}">
  <div class="tool-card-topline">
    <span class="category-tag">${escapeHtml(cat)}</span>
    <div class="tool-card-topline-right">${rating ? `<span class="tool-rating-chip">${escapeHtml(rating)}</span>` : ""}</div>
  </div>
  <div class="tool-header tool-header-modern">
    <div class="tool-title-wrap tool-title-wrap-modern">
      <div class="tool-logo-shell">
        <img class="tool-logo" src="${escapeHtml(tool.logo)}" alt="${escapeHtml(tool.name)} logo" width="48" height="48" loading="lazy" decoding="async" />
      </div>
      <div class="tool-name-block">
        <h3 class="tool-title" itemprop="name"><a href="${escapeHtml(url)}">${escapeHtml(tool.name)}</a></h3>
        <p class="tool-subtitle">${escapeHtml(cat)}</p>
      </div>
    </div>
  </div>
  <meta itemprop="applicationCategory" content="${escapeHtml(tool.category || "Application")}" />
  <meta itemprop="operatingSystem" content="Web" />
  <p class="tool-desc" itemprop="description">${escapeHtml(tool.description_bn || "")}</p>
  <div class="tool-insight-grid">
    <div class="tool-insight-card"><span>মূল্য</span><strong>${escapeHtml(price)}</strong></div>
    <div class="tool-insight-card"><span>অ্যাক্সেস</span><strong>${escapeHtml(access)}</strong></div>
  </div>
  <div class="tool-card-footer">
    <a class="btn btn-ghost" href="${escapeHtml(url)}">বিস্তারিত দেখুন</a>
    <a class="btn btn-primary" href="${escapeHtml(tool.direct_url || "#")}" target="_blank" rel="noopener noreferrer">টুল ব্যবহার করুন</a>
  </div>
</article>`;
}

function pickTopTools(tools, n, offset = 0) {
  return tools
    .slice()
    .sort((a, b) => {
      const af = a.featured ? 1 : 0;
      const bf = b.featured ? 1 : 0;
      if (af !== bf) return bf - af;
      return (b.rating || 0) - (a.rating || 0);
    })
    .slice(offset, offset + n);
}

function renderHeroCard(tool) {
  const slug = slugify(tool.name);
  const url = `/${slug}/`;
  const cat = categoryLabel(tool.category);
  return `<a class="hero-feature-card" href="${escapeHtml(url)}">
  <img class="hero-feature-logo" src="${escapeHtml(tool.logo)}" alt="${escapeHtml(tool.name)} logo" width="40" height="40" loading="lazy" decoding="async" />
  <div class="hero-feature-body">
    <h3>${escapeHtml(tool.name)}</h3>
    <p class="hero-feature-cat">${escapeHtml(cat)}</p>
    <p class="hero-feature-desc">${escapeHtml((tool.description_bn || "").slice(0, 90))}</p>
  </div>
</a>`;
}

function injectSection(html, section, block) {
  const start = `<!-- PRERENDER:${section.marker}:START -->`;
  const end = `<!-- PRERENDER:${section.marker}:END -->`;
  const wrapped = `${start}\n${block}\n${end}`;

  if (html.includes(start) && html.includes(end)) {
    const re = new RegExp(`${start}[\\s\\S]*?${end}`, "m");
    return html.replace(re, wrapped);
  }
  // First run: inject between the container's opening/closing tags
  const containerRe = new RegExp(
    `(<div [^>]*id="${section.id}"[^>]*>)\\s*</div>`,
    "m",
  );
  return html.replace(containerRe, `$1${wrapped}</div>`);
}

function run() {
  const { tools, USD_TO_BDT } = loadTools();
  if (!tools.length) {
    console.error("No tools loaded — aborting");
    process.exit(1);
  }

  let html = fs.readFileSync(INDEX, "utf8");
  const before = html.length;
  const summaries = [];

  for (const section of SECTIONS) {
    const picks = pickTopTools(tools, section.count);
    const renderer = section.renderer === "heroCard" ? renderHeroCard : (t) => renderCard(t, USD_TO_BDT);
    const block = picks.map(renderer).join("\n");
    html = injectSection(html, section, block);
    summaries.push(`${section.id}: ${picks.length}`);
  }

  fs.writeFileSync(INDEX, html, "utf8");
  console.log(
    `Pre-rendered ${summaries.join(", ")} into index.html (${before} → ${html.length} bytes)`,
  );
}

run();

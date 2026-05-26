#!/usr/bin/env node
// Inject a consistent "জনপ্রিয় গাইড" pillar-link block before </main> on
// every tool / SEO page, so each page links to the 4-6 pillar pages.
// This deepens internal linking, which is the single biggest on-site
// SEO lever once content exists.
//
//   node scripts/inject-pillar-links.cjs
//
// Idempotent — content between markers is replaced on each run.

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const START = "<!-- PILLAR-LINKS:START -->";
const END = "<!-- PILLAR-LINKS:END -->";

// Pillar pages that every tool page should link to.
// Each entry: { path, label }
const PILLARS = [
  { path: "/bangla-ai-guide/", label: "বাংলা AI গাইড (পিলার)" },
  { path: "/ai-tools-bangladesh-bengali/", label: "বাংলাদেশের সেরা AI টুলস" },
  { path: "/bkash-diye-ai-tools-kena-jay/", label: "bKash দিয়ে AI tools কেনা" },
  { path: "/vpn-chara-ai-tools-bangladesh/", label: "VPN ছাড়া AI tools" },
  { path: "/ai-tools-bdt-price-2026-bangladesh/", label: "AI tools BDT দাম" },
  { path: "/free-ai-tools-2026-bangladesh/", label: "ফ্রি AI tools" },
];

// Top-level slugs that should NOT receive an injected pillar block.
const SKIP_SLUGS = new Set([
  "privacy",
  "terms",
  "disclaimer",
  "contact",
  "submit",
  "about",
  "tools", // legacy redirect folder
]);

function hasNonAscii(s) {
  return /[^\x00-\x7F]/.test(s);
}

function isRedirectStub(html) {
  return /http-equiv="refresh"/i.test(html);
}

function buildBlock(currentPath) {
  const links = PILLARS.filter((p) => p.path !== currentPath)
    .map(
      (p) =>
        `      <a class="pillar-link" href="${p.path}">${p.label}</a>`,
    )
    .join("\n");
  return `<section class="container pillar-links-section" aria-label="জনপ্রিয় গাইড">
  <h2 class="pillar-links-heading">আরও পড়ুন — বাংলাদেশের AI গাইড</h2>
  <nav class="pillar-links-nav">
${links}
  </nav>
</section>`;
}

function inject(html, currentPath) {
  const block = buildBlock(currentPath);
  const wrapped = `${START}\n${block}\n${END}`;

  if (html.includes(START) && html.includes(END)) {
    const re = new RegExp(`${START}[\\s\\S]*?${END}`, "m");
    return html.replace(re, wrapped);
  }
  // First-run insertion point, in priority order:
  //   1. before </main>
  //   2. before opening <footer (covers blog posts without <main>)
  //   3. before </body>
  if (/<\/main>/i.test(html)) {
    return html.replace(/<\/main>/i, `${wrapped}\n</main>`);
  }
  if (/<footer\b/i.test(html)) {
    return html.replace(/<footer\b/i, `${wrapped}\n<footer`);
  }
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${wrapped}\n</body>`);
  }
  return html;
}

function processFile(filePath, currentPath) {
  let html = fs.readFileSync(filePath, "utf8");
  if (isRedirectStub(html)) return false;
  const before = html;
  html = inject(html, currentPath);
  if (html === before) return false;
  fs.writeFileSync(filePath, html, "utf8");
  return true;
}

function run() {
  let updated = 0;
  let skipped = 0;

  // Root-level tool / SEO pages
  for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    if (SKIP_SLUGS.has(name)) continue;
    if (hasNonAscii(name)) continue;
    if (name === "blog") continue;
    if (name.startsWith(".") || ["css", "js", "scripts", "node_modules"].includes(name))
      continue;

    const indexPath = path.join(ROOT, name, "index.html");
    if (!fs.existsSync(indexPath)) continue;

    const currentPath = `/${name}/`;
    if (processFile(indexPath, currentPath)) {
      updated += 1;
    } else {
      skipped += 1;
    }
  }

  // Blog posts get the pillar block too — these are the highest-traffic
  // potential pages and currently have no consistent pillar-link footer.
  const blogDir = path.join(ROOT, "blog");
  if (fs.existsSync(blogDir)) {
    for (const entry of fs.readdirSync(blogDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (hasNonAscii(entry.name)) continue;
      const indexPath = path.join(blogDir, entry.name, "index.html");
      if (!fs.existsSync(indexPath)) continue;
      const currentPath = `/blog/${entry.name}/`;
      if (processFile(indexPath, currentPath)) {
        updated += 1;
      } else {
        skipped += 1;
      }
    }
  }

  console.log(`Pillar links: updated ${updated} pages, skipped ${skipped}`);
}

run();

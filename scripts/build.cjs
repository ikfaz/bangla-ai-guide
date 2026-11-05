#!/usr/bin/env node
// Run all pre-deploy generators. Re-runnable; each step is idempotent.
//
//   node scripts/build.cjs

const { spawnSync } = require("child_process");
const path = require("path");

const steps = [
  ["sanitize-html.cjs"],
  ["repair-jsonld.cjs"],
  ["fix-mojibake-slugs.cjs"],
  ["generate-tool-routes.cjs"],
  ["meta-lint.cjs"],
  ["prerender-homepage.cjs"],
  ["inject-pillar-links.cjs"],
  ["generate-blog-covers.cjs"],
  ["inject-article-chrome.cjs"],
  ["inject-related-posts.cjs"],
  ["inject-faq-schema.cjs"],
  ["inject-author-block.cjs"],
  ["inject-breadcrumb-schema.cjs"],
  ["normalize-article-schema.cjs"],
  ["generate-comparison-pages.cjs"],
  ["regenerate-blog-listing.cjs"],
  ["repair-tool-links.cjs"],
  ["apply-site-shell.cjs"],
  ["style-interiors.cjs"],
  ["apply-guide-workshops.cjs"],
  ["generate-search-index.cjs"],
  ["generate-feed.cjs"],
  ["generate-sitemap.cjs"],
  ["meta-lint.cjs", "--check"],
];

let failed = false;
for (const args of steps) {
  const label = args.join(" ");
  console.log(`\n→ ${label}`);
  const result = spawnSync(process.execPath, [path.join(__dirname, args[0]), ...args.slice(1)], {
    stdio: "inherit",
  });
  if (result.status !== 0) {
    failed = true;
    console.error(`✗ ${label} exited with status ${result.status}`);
    break;
  }
}

process.exit(failed ? 1 : 0);

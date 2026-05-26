#!/usr/bin/env node
// Run all pre-deploy generators. Re-runnable; each step is idempotent.
//
//   node scripts/build.cjs

const { spawnSync } = require("child_process");
const path = require("path");

const steps = [
  "fix-mojibake-slugs.cjs",
  "meta-lint.cjs",
  "prerender-homepage.cjs",
  "inject-pillar-links.cjs",
  "generate-blog-covers.cjs",
  "inject-related-posts.cjs",
  "regenerate-blog-listing.cjs",
  "generate-search-index.cjs",
  "generate-feed.cjs",
  "generate-sitemap.cjs",
];

let failed = false;
for (const step of steps) {
  console.log(`\n→ ${step}`);
  const result = spawnSync("node", [path.join(__dirname, step)], {
    stdio: "inherit",
  });
  if (result.status !== 0) {
    failed = true;
    console.error(`✗ ${step} exited with status ${result.status}`);
  }
}

process.exit(failed ? 1 : 0);

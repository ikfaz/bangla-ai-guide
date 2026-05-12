#!/usr/bin/env node
// Rename blog folders whose names came in with corrupted Bengali encoding
// (CP-1252 bytes instead of UTF-8 / transliteration). Each old folder is
// turned into a redirect stub that 301s via meta refresh + rel=canonical
// to the new slug, so any existing inbound link still works.
//
//   node scripts/fix-mojibake-slugs.cjs
//
// Idempotent: safe to re-run.

const fs = require("fs");
const path = require("path");

const BLOG = path.resolve(__dirname, "..", "blog");
const SITE = "https://banglaaiguide.com";

// Map of mojibake folder name → action.
//  - { rename: "<new-slug>" }    move content to new slug, keep redirect at old
//  - { redirect: "<target>" }     near-duplicate → redirect to existing page
const PLAN = [
  {
    // "AI দিয়ে কন্টেন্ট রাইটিং — বাংলায় শিখুন"
    match: (n) => n.startsWith("ai-") && n.includes("αªòαª¿"),
    rename: "ai-diye-content-writing-banglay-shikhun",
  },
  {
    // "Claude vs ChatGPT: বাংলাদেশে কোনটি সেরা?"
    match: (n) => n.startsWith("claude-vs-chatgpt"),
    rename: "claude-vs-chatgpt-bangladeshe-konti-bhalo",
  },
  {
    // "Notion AI এর বিকল্প"
    match: (n) => n.startsWith("notion-ai-"),
    rename: "notion-ai-er-bikalpo",
  },
  {
    // "ChatGPT এর বিকল্প" — near-duplicate of existing chatgpt-er-bikalpo-* page
    match: (n) => n.startsWith("chatgpt-") && /αª¼αªòαª▓αª¬/.test(n),
    redirect:
      "/blog/chatgpt-er-bikalpo-free-ai-chatbot-bangladesher-byaboharokareder-jonno-sera-pochondo/",
  },
  {
    // "বিকাশ দিয়ে AI টুলস কেনার সম্পূর্ণ গাইড" — near-duplicate of pillar
    match: (n) => /^αª¼αªòαª╢/.test(n) || n.startsWith("αª¼αªòαª╢"),
    redirect: "/bkash-diye-ai-tools-kena-jay/",
  },
];

function makeRedirectStub(targetPath, title) {
  const targetUrl = `${SITE}${targetPath}`;
  return `<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<link rel="canonical" href="${targetUrl}">
<meta name="robots" content="noindex, follow">
<meta http-equiv="refresh" content="0; url=${targetUrl}">
<script>window.location.replace(${JSON.stringify(targetUrl)});</script>
</head>
<body>
<p>এই পাতাটি স্থানান্তরিত হয়েছে। <a href="${targetUrl}">এখানে ক্লিক করুন</a>।</p>
</body>
</html>
`;
}

function updateCanonical(htmlPath, newUrl) {
  let html = fs.readFileSync(htmlPath, "utf8");
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${newUrl}">`,
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${newUrl}">`,
  );
  fs.writeFileSync(htmlPath, html, "utf8");
}

function moveDir(from, to) {
  // fs.renameSync may fail across volumes; use copy + remove as fallback.
  try {
    fs.renameSync(from, to);
  } catch {
    fs.cpSync(from, to, { recursive: true });
    fs.rmSync(from, { recursive: true, force: true });
  }
}

function run() {
  const dirs = fs
    .readdirSync(BLOG, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /[^\x00-\x7F]/.test(d.name))
    .map((d) => d.name);

  if (!dirs.length) {
    console.log("No mojibake folders found — nothing to do.");
    return;
  }

  for (const name of dirs) {
    const action = PLAN.find((p) => p.match(name));
    const fromPath = path.join(BLOG, name);

    if (!action) {
      console.warn(`! No rule matched: ${name}`);
      continue;
    }

    if (action.rename) {
      const newName = action.rename;
      const toPath = path.join(BLOG, newName);
      const newUrl = `${SITE}/blog/${newName}/`;

      if (fs.existsSync(toPath)) {
        console.warn(`! Skip ${name}: target ${newName} already exists`);
        continue;
      }

      moveDir(fromPath, toPath);
      const indexHtml = path.join(toPath, "index.html");
      if (fs.existsSync(indexHtml)) updateCanonical(indexHtml, newUrl);

      // Leave a redirect stub at the old name so existing links don't 404.
      // Recreate the directory since moveDir removed it.
      fs.mkdirSync(fromPath, { recursive: true });
      fs.writeFileSync(
        path.join(fromPath, "index.html"),
        makeRedirectStub(`/blog/${newName}/`, "Redirecting…"),
        "utf8",
      );
      console.log(`✓ Renamed → ${newName}`);
    } else if (action.redirect) {
      // Replace folder contents with a single redirect stub
      fs.rmSync(fromPath, { recursive: true, force: true });
      fs.mkdirSync(fromPath, { recursive: true });
      fs.writeFileSync(
        path.join(fromPath, "index.html"),
        makeRedirectStub(action.redirect, "Redirecting…"),
        "utf8",
      );
      console.log(`✓ Redirected → ${action.redirect}`);
    }
  }
}

run();

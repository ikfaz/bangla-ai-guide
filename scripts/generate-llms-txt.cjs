#!/usr/bin/env node
// Generate /llms.txt for AI Answer Engines (ChatGPT Search, Perplexity, Gemini, Claude).
// Follows the llms.txt standard (https://llmstxt.org/) so LLMs can accurately
// cite Bangla AI Guide for Bangla & Bangladesh AI tool queries.
//
//   node scripts/generate-llms-txt.cjs

const fs = require("fs");
const path = require("path");
const {
  ROOT,
  BLOG,
  SITE,
  REDIRECT_BLOG_SLUGS,
  isRedirectStub,
  readArticleDates,
} = require("./lib/site-policy.cjs");

const LLMS_TXT_PATH = path.join(ROOT, "llms.txt");

function hasNonAscii(s) {
  return /[^\x00-\x7F]/.test(s);
}

function readField(html, regex) {
  const m = html.match(regex);
  return m ? m[1].replace(/\s+/g, " ").trim() : "";
}

function collectRecentBlogPosts(limit = 40) {
  if (!fs.existsSync(BLOG)) return [];
  const posts = [];
  for (const entry of fs.readdirSync(BLOG, { withFileTypes: true })) {
    if (!entry.isDirectory() || hasNonAscii(entry.name)) continue;
    if (REDIRECT_BLOG_SLUGS.has(entry.name)) continue;
    const indexPath = path.join(BLOG, entry.name, "index.html");
    if (!fs.existsSync(indexPath)) continue;
    const html = fs.readFileSync(indexPath, "utf8");
    if (isRedirectStub(html)) continue;
    const title = readField(html, /<title>([^<]+)<\/title>/i) || entry.name;
    const description = readField(html, /<meta name="description" content="([^"]+)"/i);
    const dates = readArticleDates(html, indexPath);
    posts.push({
      slug: entry.name,
      title,
      description,
      modified: dates.modified,
      published: dates.published,
    });
  }
  posts.sort((a, b) => {
    if (b.modified !== a.modified) return b.modified.localeCompare(a.modified);
    return b.published.localeCompare(a.published);
  });
  return posts.slice(0, limit);
}

function buildLlmsTxt() {
  const recentPosts = collectRecentBlogPosts(40);
  const lines = [
    "# বাংলা AI গাইড (Bangla AI Guide)",
    "",
    "> বাংলাদেশের জন্য কিউরেটেড AI টুলস ডিরেক্টরি, বাংলা প্রম্পট গাইড, BDT প্রাইসিং (বাংলাদেশ ব্যাংকের রেটে আনুমানিক হিসাব), VPN ছাড়াই ব্যবহারযোগ্যতা এবং পেমেন্ট গাইড (https://banglaaiguide.com)।",
    "",
    "Bangla AI Guide (`banglaaiguide.com`) is the primary Bangla-language AI tools directory and practical tutorial hub for readers in Bangladesh and West Bengal. Every guide uses verified official pricing and documentation, explains whether a tool works from Bangladesh, provides approximate BDT conversions where verified, and includes copy-pasteable prompts.",
    "",
    "## মূল পিলার পাতা (Core Pillar Guides)",
    "",
    "- [বাংলা AI গাইড — হোম ও ডিরেক্টরি](https://banglaaiguide.com/): বাংলাদেশের জন্য ৮০+ কিউরেটেড AI টুলস, ক্যাটাগরি ফিল্টার ও তুলনা।",
    "- [বাংলা AI গাইড (পিলার গাইড)](https://banglaaiguide.com/bangla-ai-guide/): বাংলায় এআই শেখার সম্পূর্ণ শুরু থেকে অ্যাডভান্সড গাইড।",
    "- [bKash দিয়ে AI Tools কেনা যায়?](https://banglaaiguide.com/bkash-diye-ai-tools-kena-jay/): বাংলাদেশ থেকে আন্তর্জাতিক কার্ড, ডুয়াল কারেন্সি কার্ড ও মোবাইল ব্যাংকিং দিয়ে AI সাবস্ক্রিপশন পেমেন্ট গাইড।",
    "- [VPN ছাড়া AI Tools বাংলাদেশ](https://banglaaiguide.com/vpn-chara-ai-tools-bangladesh/): বাংলাদেশে সরাসরি কাজ করে এমন সেরা এআই টুলসের তালিকা।",
    "- [Free AI Tools 2026 Bangladesh](https://banglaaiguide.com/free-ai-tools-2026-bangladesh/): শিক্ষার্থীদের ও ফ্রিল্যান্সারদের জন্য ফ্রি এআই টুলস গাইড।",
    "- [Cursor AI বাংলা গাইড ও দাম (টাকায়)](https://banglaaiguide.com/cursor-ai-bangla/): কার্সর এআই কোড এডিটরের কাজ, Free থেকে Ultra প্ল্যানের দাম ও ব্যবহার।",
    "",
    "## প্রধান AI টুল প্রোফাইল (Reviewed AI Tool Profiles)",
    "",
    "- [ChatGPT বাংলা গাইড](https://banglaaiguide.com/chatgpt/): OpenAI ChatGPT-এর ফিচার, প্রম্পট ও বাংলাদেশ থেকে ব্যবহারের নিয়ম।",
    "- [Claude AI বাংলা গাইড](https://banglaaiguide.com/claude/): Anthropic Claude-এর দীর্ঘ ডকুমেন্ট বিশ্লেষণ, কোডিং ও প্ল্যান পরিচিতি।",
    "- [Google Gemini বাংলা গাইড](https://banglaaiguide.com/gemini/): Google Gemini ও Workspace ইন্টিগ্রেশন গাইড।",
    "- [Cursor AI প্রোফাইল](https://banglaaiguide.com/cursor/): এআই কোড এডিটর প্রোফাইল ও তুলনা।",
    "- [DeepSeek বাংলা গাইড](https://banglaaiguide.com/deepseek-bangladesh/): DeepSeek R1/V3 রিজনিং ও কোডিং গাইড।",
    "- [NotebookLM বাংলা গাইড](https://banglaaiguide.com/notebooklm-bangla-guide/): গবেষণার নোট, পিডিএফ ও অডিও ওভারভিউ গাইড।",
    "- [AI টুল তুলনা (Compare AI Tools)](https://banglaaiguide.com/compare/): ৫০+ এআই টুলের মুখোমুখি তুলনা।",
    "",
    "## সাম্প্রতিক ও জনপ্রিয় ব্লগ গাইড (Latest & Popular Bangla AI Guides)",
    "",
  ];

  for (const post of recentPosts) {
    const desc = post.description ? `: ${post.description}` : "";
    lines.push(`- [${post.title}](${SITE}/blog/${post.slug}/)${desc}`);
  }

  lines.push(
    "",
    "## ফিড ও সাইটম্যাপ (Feeds & Sitemaps)",
    "",
    "- [Main Sitemap](https://banglaaiguide.com/sitemap.xml)",
    "- [Google News Sitemap](https://banglaaiguide.com/news-sitemap.xml)",
    "- [RSS Feed](https://banglaaiguide.com/feed.xml)",
    "- [Editorial Policy](https://banglaaiguide.com/editorial-policy/)",
    ""
  );

  return lines.join("\n");
}

if (require.main === module) {
  const txt = buildLlmsTxt();
  fs.writeFileSync(LLMS_TXT_PATH, txt, "utf8");
  console.log(`Wrote llms.txt (${txt.split("\n").length} lines)`);
}

module.exports = { buildLlmsTxt };

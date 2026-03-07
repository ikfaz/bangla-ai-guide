const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const lastmod = "2026-03-07";

const labelMap = new Map([
  ["index.html", "বাংলা AI গাইড হোম"],
  ["submit.html", "নতুন টুল সাবমিট করুন"],
  ["ai-tools-bangladesh-bengali.html", "Bangla AI tools directory"],
  ["chatgpt-bangladesh-theke-bebohar.html", "ChatGPT Bangladesh guide"],
  ["vpn-chara-ai-tools-bangladesh.html", "VPN ছাড়া AI tools Bangladesh"],
  ["bkash-diye-ai-tools-kena-jay.html", "bKash দিয়ে AI tools কেনা যায়"],
  ["elevenlabs-bangla-voice.html", "ElevenLabs বাংলা ভয়েস"],
  ["midjourney-bangladesh-free.html", "Midjourney Bangladesh free"],
  ["cursor-ai-bangla.html", "Cursor AI বাংলা"],
  ["ai-tools-for-freelancers-bangladesh.html", "AI tools for freelancers Bangladesh"],
  ["ai-tools-bdt-price-2026-bangladesh.html", "AI tools BDT price 2026"],
  ["bangladeshe-ai-tools-kibhabe-bebohar-korben.html", "বাংলাদেশে AI tools কীভাবে ব্যবহার করবেন"],
  ["best-ai-tools-for-content-creators-bangladesh.html", "best AI tools for content creators"],
  ["free-ai-tools-2026-bangladesh.html", "free AI tools 2026 Bangladesh"],
  ["ai-image-generator-free-bangladesh.html", "AI image generator free Bangladesh"],
  ["best-ai-coding-tools-for-beginners-bangladesh.html", "best AI coding tools for beginners"],
  ["ai-tools-for-youtube-bangladesh.html", "AI tools for YouTube Bangladesh"],
]);

const clusterPages = [
  {
    slug: "chatgpt-bangladesh-theke-bebohar",
    primaryKeyword: "ChatGPT Bangladesh",
    secondaryKeywords: ["ChatGPT বাংলাদেশ থেকে ব্যবহার", "AI tools Bangladesh Bengali"],
    longTailTargets: ["ChatGPT Bangladesh without VPN", "buy ChatGPT Plus Bangladesh"],
    intentType: "explainer",
    yearPolicy: "2026_current_state",
    title: "ChatGPT Bangladesh | বাংলা AI গাইড",
    description: "ChatGPT Bangladesh 2026 guide: বাংলাদেশ থেকে setup, BDT budget, VPN reality এবং safe workflow নিয়ে practical নির্দেশনা।",
    h1: "ChatGPT Bangladesh: বাংলাদেশ থেকে ব্যবহার করার পূর্ণ গাইড",
    topicBn: "ChatGPT",
    outbound: ["ChatGPT খুলুন", "https://chat.openai.com"],
    internalLinks: ["ai-tools-bangladesh-bengali.html", "vpn-chara-ai-tools-bangladesh.html", "bkash-diye-ai-tools-kena-jay.html", "ai-tools-bdt-price-2026-bangladesh.html", "ai-tools-for-freelancers-bangladesh.html"],
  },
  {
    slug: "vpn-chara-ai-tools-bangladesh",
    primaryKeyword: "VPN ছাড়া AI tools Bangladesh",
    secondaryKeywords: ["AI tools without VPN Bangladesh", "which AI tools work in Bangladesh"],
    longTailTargets: ["ChatGPT Bangladesh without VPN", "AI tools that work in Bangladesh without VPN"],
    intentType: "guide",
    yearPolicy: "2026_current_state",
    title: "VPN ছাড়া AI tools Bangladesh | বাংলা AI গাইড",
    description: "VPN ছাড়া AI tools Bangladesh 2026: stable access, payment planning, এবং production-safe workflow নিয়ে বাংলাদেশি গাইড।",
    h1: "VPN ছাড়া AI tools Bangladesh: Stable setup গাইড",
    topicBn: "VPN-free AI tools",
    outbound: ["Perplexity খুলুন", "https://www.perplexity.ai"],
    internalLinks: ["ai-tools-bangladesh-bengali.html", "chatgpt-bangladesh-theke-bebohar.html", "free-ai-tools-2026-bangladesh.html", "ai-tools-bdt-price-2026-bangladesh.html", "index.html"],
  },
  {
    slug: "bkash-diye-ai-tools-kena-jay",
    primaryKeyword: "bKash দিয়ে AI tools কেনা যায়",
    secondaryKeywords: ["AI tools payment Bangladesh without credit card", "ChatGPT bKash payment Bangladesh"],
    longTailTargets: ["how to pay for ChatGPT in Bangladesh", "Midjourney subscription Bangladesh how to pay"],
    intentType: "guide",
    yearPolicy: "2026_current_state",
    title: "bKash দিয়ে AI tools কেনা যায় | বাংলা AI গাইড",
    description: "bKash দিয়ে AI tools কেনা যায় কি না, card fallback, BDT budget এবং safe payment flow নিয়ে 2026 practical guide।",
    h1: "bKash দিয়ে AI tools কেনা যায়? বাস্তব গাইড",
    topicBn: "AI payment",
    outbound: ["OpenAI Pricing", "https://openai.com/chatgpt/pricing"],
    internalLinks: ["ai-tools-bangladesh-bengali.html", "ai-tools-bdt-price-2026-bangladesh.html", "chatgpt-bangladesh-theke-bebohar.html", "midjourney-bangladesh-free.html", "index.html"],
  },
  {
    slug: "elevenlabs-bangla-voice",
    primaryKeyword: "ElevenLabs বাংলা ভয়েস",
    secondaryKeywords: ["ElevenLabs বাংলা voice generator free", "AI tools for Bangladeshi YouTubers"],
    longTailTargets: ["ElevenLabs বাংলা voice generator free", "AI tools for YouTube Bangladesh"],
    intentType: "explainer",
    yearPolicy: "2026_current_state",
    title: "ElevenLabs বাংলা ভয়েস | বাংলা AI গাইড",
    description: "ElevenLabs বাংলা ভয়েস 2026 guide: voice quality setup, free tier, BDT budgeting এবং creator workflow নিয়ে বাংলা নির্দেশনা।",
    h1: "ElevenLabs বাংলা ভয়েস: Creator workflow গাইড",
    topicBn: "বাংলা AI voice",
    outbound: ["ElevenLabs Pricing", "https://elevenlabs.io/pricing"],
    internalLinks: ["ai-tools-bangladesh-bengali.html", "ai-tools-for-youtube-bangladesh.html", "best-ai-tools-for-content-creators-bangladesh.html", "free-ai-tools-2026-bangladesh.html", "index.html"],
  },
  {
    slug: "midjourney-bangladesh-free",
    primaryKeyword: "Midjourney Bangladesh free",
    secondaryKeywords: ["AI image generator free Bangladesh", "Midjourney Bangladesh card payment"],
    longTailTargets: ["Midjourney subscription Bangladesh how to pay", "AI tools for Bangladeshi YouTubers"],
    intentType: "explainer",
    yearPolicy: "2026_current_state",
    title: "Midjourney Bangladesh free | বাংলা AI গাইড",
    description: "Midjourney Bangladesh free query-এর বাস্তবতা, card payment context, BDT planning এবং creator alternatives নিয়ে 2026 guide।",
    h1: "Midjourney Bangladesh free: বাস্তবতা ও বিকল্প",
    topicBn: "AI image creation",
    outbound: ["Midjourney Pricing", "https://www.midjourney.com/account"],
    internalLinks: ["ai-tools-bangladesh-bengali.html", "ai-image-generator-free-bangladesh.html", "bkash-diye-ai-tools-kena-jay.html", "ai-tools-for-youtube-bangladesh.html", "index.html"],
  },
  {
    slug: "cursor-ai-bangla",
    primaryKeyword: "Cursor AI বাংলা",
    secondaryKeywords: ["Cursor AI বাংলাদেশে কীভাবে কাজ করে", "best AI coding tools for beginners"],
    longTailTargets: ["Cursor AI বাংলাদেশে কীভাবে কাজ করে", "AI tools freelancer Bangladesh income"],
    intentType: "explainer",
    yearPolicy: "2026_current_state",
    title: "Cursor AI বাংলা | বাংলা AI গাইড",
    description: "Cursor AI বাংলা 2026 guide: coding workflow, beginner adoption, BDT budgeting এবং freelancer productivity নিয়ে practical বাংলা বিশ্লেষণ।",
    h1: "Cursor AI বাংলা: ডেভেলপারদের জন্য workflow গাইড",
    topicBn: "AI coding",
    outbound: ["Cursor Pricing", "https://cursor.com/pricing"],
    internalLinks: ["ai-tools-bangladesh-bengali.html", "best-ai-coding-tools-for-beginners-bangladesh.html", "ai-tools-for-freelancers-bangladesh.html", "chatgpt-bangladesh-theke-bebohar.html", "index.html"],
  },
  {
    slug: "ai-tools-for-freelancers-bangladesh",
    primaryKeyword: "AI tools for freelancers Bangladesh",
    secondaryKeywords: ["AI tools freelancer Bangladesh income", "AI দিয়ে ফ্রিল্যান্সিং বাংলাদেশ"],
    longTailTargets: ["AI tools for Bangladeshi freelancers Upwork", "AI tools increase freelancing income Bangladesh"],
    intentType: "guide",
    yearPolicy: "2026_current_state",
    title: "AI tools for freelancers Bangladesh | বাংলা AI গাইড",
    description: "AI tools for freelancers Bangladesh: proposal-to-delivery workflow, BDT control এবং income-focused stack নিয়ে 2026 practical guide।",
    h1: "AI tools for freelancers Bangladesh: বাস্তব কাজের স্ট্যাক",
    topicBn: "freelancer AI workflow",
    outbound: ["Upwork", "https://www.upwork.com"],
    internalLinks: ["ai-tools-bangladesh-bengali.html", "chatgpt-bangladesh-theke-bebohar.html", "cursor-ai-bangla.html", "best-ai-tools-for-content-creators-bangladesh.html", "index.html"],
  },
  {
    slug: "ai-tools-bdt-price-2026-bangladesh",
    primaryKeyword: "AI tools BDT price 2026",
    secondaryKeywords: ["AI tools BDT price", "বাংলাদেশে AI টুলস পেমেন্ট"],
    longTailTargets: ["AI tools payment Bangladesh without credit card", "buy ChatGPT Plus Bangladesh"],
    intentType: "guide",
    yearPolicy: "2026_current_state",
    title: "AI tools BDT price 2026 | বাংলা AI গাইড",
    description: "AI tools BDT price 2026: USD conversion, payment method, subscription planning এবং Bangladesh cost-control strategy বাংলায়।",
    h1: "AI tools BDT price 2026: বাংলাদেশি বাজেট গাইড",
    topicBn: "AI pricing",
    outbound: ["ChatGPT Pricing", "https://openai.com/chatgpt/pricing"],
    internalLinks: ["ai-tools-bangladesh-bengali.html", "bkash-diye-ai-tools-kena-jay.html", "free-ai-tools-2026-bangladesh.html", "chatgpt-bangladesh-theke-bebohar.html", "index.html"],
  },
  {
    slug: "bangladeshe-ai-tools-kibhabe-bebohar-korben",
    primaryKeyword: "বাংলাদেশে AI tools কীভাবে ব্যবহার করবেন",
    secondaryKeywords: ["AI tools Bangladesh Bengali", "বাংলা AI গাইড"],
    longTailTargets: ["বাংলাদেশে AI tools কীভাবে ব্যবহার করবেন", "বাংলাদেশে AI দিয়ে আয় করার উপায়"],
    intentType: "guide",
    yearPolicy: "2026_current_state",
    title: "বাংলাদেশে AI tools কীভাবে ব্যবহার করবেন | বাংলা AI গাইড",
    description: "বাংলাদেশে AI tools কীভাবে ব্যবহার করবেন: beginner tutorial, payment context, VPN reality এবং 2026 practical roadmap।",
    h1: "বাংলাদেশে AI tools কীভাবে ব্যবহার করবেন: টিউটোরিয়াল",
    topicBn: "AI beginner setup",
    outbound: ["Google AI", "https://ai.google"],
    internalLinks: ["ai-tools-bangladesh-bengali.html", "ai-tools-for-freelancers-bangladesh.html", "vpn-chara-ai-tools-bangladesh.html", "free-ai-tools-2026-bangladesh.html", "index.html"],
  },
  {
    slug: "best-ai-tools-for-content-creators-bangladesh",
    primaryKeyword: "best AI tools for content creators",
    secondaryKeywords: ["best AI tools for content creators Bangladesh", "Bangla AI tools directory"],
    longTailTargets: ["AI tools for Bangladeshi YouTubers", "AI tools for content creators Bangladesh"],
    intentType: "guide",
    yearPolicy: "2026_current_state",
    title: "best AI tools for content creators | বাংলা AI গাইড",
    description: "best AI tools for content creators Bangladesh: idea-to-publish stack, BDT budget এবং creator growth workflow নিয়ে 2026 guide।",
    h1: "best AI tools for content creators: বাংলাদেশি creator stack",
    topicBn: "content creator stack",
    outbound: ["Canva Magic Studio", "https://www.canva.com/magic-studio/"],
    internalLinks: ["ai-tools-bangladesh-bengali.html", "ai-tools-for-youtube-bangladesh.html", "ai-image-generator-free-bangladesh.html", "elevenlabs-bangla-voice.html", "index.html"],
  },
  {
    slug: "free-ai-tools-2026-bangladesh",
    primaryKeyword: "free AI tools 2026 Bangladesh",
    secondaryKeywords: ["ফ্রি AI টুলস বাংলাদেশ ২০২৬", "free AI tools BD"],
    longTailTargets: ["free AI tools Bangladesh 2026", "AI tools without VPN Bangladesh"],
    intentType: "guide",
    yearPolicy: "2026_current_state",
    title: "free AI tools 2026 Bangladesh | বাংলা AI গাইড",
    description: "free AI tools 2026 Bangladesh তালিকা: limited budget setup, usage limits, upgrade trigger এবং no-VPN context নিয়ে practical guide।",
    h1: "free AI tools 2026 Bangladesh: ফ্রি স্ট্যাকে বাস্তব কাজ",
    topicBn: "free AI stack",
    outbound: ["Gemini", "https://gemini.google.com"],
    internalLinks: ["ai-tools-bangladesh-bengali.html", "vpn-chara-ai-tools-bangladesh.html", "ai-tools-bdt-price-2026-bangladesh.html", "chatgpt-bangladesh-theke-bebohar.html", "index.html"],
  },
  {
    slug: "ai-image-generator-free-bangladesh",
    primaryKeyword: "AI image generator free Bangladesh",
    secondaryKeywords: ["AI image generator free Bangladesh tutorial", "Midjourney Bangladesh free"],
    longTailTargets: ["AI image generator free Bangladesh", "best AI tools for content creators"],
    intentType: "explainer",
    yearPolicy: "2026_current_state",
    title: "AI image generator free Bangladesh | বাংলা AI গাইড",
    description: "AI image generator free Bangladesh tutorial: prompt strategy, creator workflow, BDT budgeting এবং tool comparison নিয়ে 2026 guide।",
    h1: "AI image generator free Bangladesh: creator visual workflow",
    topicBn: "free image generation",
    outbound: ["Ideogram Pricing", "https://ideogram.ai/pricing"],
    internalLinks: ["ai-tools-bangladesh-bengali.html", "midjourney-bangladesh-free.html", "best-ai-tools-for-content-creators-bangladesh.html", "ai-tools-for-youtube-bangladesh.html", "index.html"],
  },
  {
    slug: "best-ai-coding-tools-for-beginners-bangladesh",
    primaryKeyword: "best AI coding tools for beginners",
    secondaryKeywords: ["best AI coding tools for beginners Bangladesh", "Cursor AI বাংলা"],
    longTailTargets: ["Cursor AI বাংলাদেশে কীভাবে কাজ করে", "AI tools for freelancers Bangladesh"],
    intentType: "guide",
    yearPolicy: "2026_current_state",
    title: "best AI coding tools for beginners | বাংলা AI গাইড",
    description: "best AI coding tools for beginners Bangladesh: learning-first setup, BDT planning এবং beginner-to-freelancer coding roadmap নিয়ে guide।",
    h1: "best AI coding tools for beginners: বাংলাদেশি learner roadmap",
    topicBn: "coding beginner stack",
    outbound: ["GitHub Copilot Pricing", "https://github.com/features/copilot#pricing"],
    internalLinks: ["ai-tools-bangladesh-bengali.html", "cursor-ai-bangla.html", "ai-tools-for-freelancers-bangladesh.html", "chatgpt-bangladesh-theke-bebohar.html", "index.html"],
  },
  {
    slug: "ai-tools-for-youtube-bangladesh",
    primaryKeyword: "AI tools for YouTube Bangladesh",
    secondaryKeywords: ["AI tools for Bangladeshi YouTubers", "best AI tools for content creators"],
    longTailTargets: ["AI tools for YouTube Bangladesh বাংলা tutorial", "ElevenLabs বাংলা voice generator free"],
    intentType: "guide",
    yearPolicy: "2026_current_state",
    title: "AI tools for YouTube Bangladesh | বাংলা AI গাইড",
    description: "AI tools for YouTube Bangladesh: script, thumbnail, voice, BDT cost control এবং creator growth workflow নিয়ে 2026 বাংলা guide।",
    h1: "AI tools for YouTube Bangladesh: creator production stack",
    topicBn: "YouTube creator AI",
    outbound: ["YouTube Studio", "https://studio.youtube.com"],
    internalLinks: ["ai-tools-bangladesh-bengali.html", "best-ai-tools-for-content-creators-bangladesh.html", "elevenlabs-bangla-voice.html", "ai-image-generator-free-bangladesh.html", "index.html"],
  },
];

const docxSlugToExistingSlug = {
  "chatgpt-bangladesh.html": "chatgpt-bangladesh-theke-bebohar",
  "vpn-free-ai-tools-bangladesh.html": "vpn-chara-ai-tools-bangladesh",
  "bkash-ai-tools-payment-bangladesh.html": "bkash-diye-ai-tools-kena-jay",
  "ai-tools-bdt-price-2026.html": "ai-tools-bdt-price-2026-bangladesh",
  "elevenlabs-bangla-voice.html": "elevenlabs-bangla-voice",
  "ai-tools-freelancers-bangladesh.html": "ai-tools-for-freelancers-bangladesh",
  "midjourney-bangladesh-free.html": "midjourney-bangladesh-free",
  "cursor-ai-bangla.html": "cursor-ai-bangla",
  "bangladeshe-ai-tools-kivabe-byabohar-korben.html": "bangladeshe-ai-tools-kibhabe-bebohar-korben",
  "ai-tools-content-creators-bangladesh.html": "best-ai-tools-for-content-creators-bangladesh",
  "free-ai-tools-2026-bangladesh.html": "free-ai-tools-2026-bangladesh",
  "ai-image-generator-free-bangladesh.html": "ai-image-generator-free-bangladesh",
  "ai-coding-tools-beginners-bangladesh.html": "best-ai-coding-tools-for-beginners-bangladesh",
  "ai-tools-youtube-bangladesh.html": "ai-tools-for-youtube-bangladesh",
};

const docxFiles = [
  path.join(__dirname, "data", "cluster-articles-1-7.txt"),
  path.join(__dirname, "data", "cluster-articles-8-14.txt"),
];

function normalizeYear(text) {
  return text
    .replace(/২০২৫/g, "২০২৬")
    .replace(/à§¨à§¦à§¨à§«/g, "২০২৬")
    .replace(/\b2025\b/g, "2026");
}

function normalizeLine(text) {
  return normalizeYear(text).replace(/\s+/g, " ").trim();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseDocxArticles(text) {
  const content = text.replace(/\r/g, "");
  const pattern = /Article\s+(\d+)\s*\/\s*(?:14|১৪)\s*([\s\S]*?)(?=\nArticle\s+\d+\s*\/\s*(?:14|১৪)|$)/g;
  const items = [];
  let match = pattern.exec(content);
  while (match) {
    const articleId = Number(match[1]);
    const block = match[2].trim();
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const title = lines[0] || `Article ${articleId}`;
    const fileMatch = block.match(/File:\s*([a-z0-9\-]+\.html)/i);
    const sourceSlug = fileMatch ? fileMatch[1].toLowerCase() : "";
    const primaryMatch = block.match(/Primary Keyword:\s*([^\n]+)/i);
    const primaryFromDocx = primaryMatch ? normalizeLine(primaryMatch[1]) : "";
    const internalLinkIndex = lines.findIndex((line) => /^Internal Link:/i.test(line));
    const fallbackStart = lines.findIndex((line) => /^Primary Keyword:/i.test(line));
    const bodyStart = (internalLinkIndex >= 0 ? internalLinkIndex : fallbackStart) + 1;
    const bodyLines = lines
      .slice(Math.max(bodyStart, 0))
      .map(normalizeLine)
      .filter(Boolean)
      .filter((line) => !/^File:/i.test(line) && !/^Primary Keyword:/i.test(line) && !/^Internal Link:/i.test(line));
    items.push({ articleId, title: normalizeLine(title), sourceSlug, primaryFromDocx, bodyLines });
    match = pattern.exec(content);
  }
  return items;
}

function loadDocxCorpus() {
  const combined = [];
  for (const filePath of docxFiles) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing DOCX extracted text source: ${filePath}`);
    }
    const rawText = fs.readFileSync(filePath, "utf8");
    combined.push(...parseDocxArticles(rawText));
  }
  if (combined.length !== 14) {
    throw new Error(`Expected 14 DOCX articles, found ${combined.length}`);
  }
  return combined;
}

function uniqueLines(lines) {
  const seen = new Set();
  const result = [];
  for (const line of lines) {
    const key = line.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(line);
    }
  }
  return result;
}

function truncateLine(line, limit = 110) {
  if (line.length <= limit) return line;
  return `${line.slice(0, limit - 1).trim()}â€¦`;
}

function parseFaqItems(lines) {
  const faq = [];
  for (let i = 0; i < lines.length; i += 1) {
    const current = lines[i];
    const questionMatch = current.match(/^(?:প্রশ্ন|à¦ªà§à¦°à¦¶à§à¦¨)[:：]\s*(.+)$/);
    if (!questionMatch) continue;
    const question = questionMatch[1].trim();
    let answer = "";
    for (let j = i + 1; j < lines.length; j += 1) {
      const candidate = lines[j];
      if (/^(?:প্রশ্ন|à¦ªà§à¦°à¦¶à§à¦¨)[:：]/.test(candidate)) break;
      if (candidate) {
        answer = candidate;
        break;
      }
    }
    if (question && answer) {
      faq.push([question, answer]);
    }
  }
  return faq;
}

function buildSteps(stepLines, allLines, topicBn) {
  const raw = uniqueLines(stepLines.map(normalizeLine)).filter(Boolean);
  const steps = [];
  for (const line of raw) {
    if (line.length < 8) continue;
    if (line.length > 160) continue;
    const normalized = line.replace(/^[-•*]\s*/, "");
    if (/\?$/.test(normalized) && !/^(Step|ধাপ|পদ্ধতি|দিন\s*\d+)/i.test(normalized)) continue;
    if (/^(Step|ধাপ|পদ্ধতি|দিন\s*\d+)/i.test(normalized)) {
      steps.push(normalized);
    } else if (/^\d+[.)]/.test(normalized) || /^[০-৯]+[.)]/.test(normalized)) {
      steps.push(`ধাপ ${steps.length + 1}: ${normalized.replace(/^[০-৯0-9]+[.)]\s*/, "")}`);
    } else {
      steps.push(`ধাপ ${steps.length + 1}: ${normalized}`);
    }
    if (steps.length === 7) break;
  }
  const fallback = [
    `Step 1: ${topicBn} ব্যবহারের লক্ষ্য স্পষ্ট করুন।`,
    "Step 2: ???? ?????? ????? ?-?? ??? ??????? ??? ??? ????",
    "Step 3: ?????? quality ??? ???? ??????? ????? ?????",
    "Step 4: payment/vpn ???????? ????? ??? workflow ?????? ?????",
    "Step 5: ????? ROI ???? stack optimize ?????",
  ];
  if (steps.length < 4) {
    for (const item of fallback) {
      if (steps.length >= 5) break;
      steps.push(item);
    }
  }
  if (!steps.length) {
    return fallback;
  }
  return steps;
}

function buildComparisonRows(page, blocks) {
  return [
    ["Primary Intent", page.primaryKeyword, "2026 Bangladesh use-case"],
    [
      "????????? ??????????????",
      truncateLine(blocks.bdUsability[0] || `${page.topicBn} tool stack local workflow-এ ব্যবহার করা যায়।`),
      truncateLine(blocks.bdUsability[1] || "use-case ??????? rollout ???? ?? ???? ????"),
    ],
    [
      "Payment/BDT",
      truncateLine(blocks.paymentContext[0] || "????????? pricing page ???? BDT budget ??? ?????"),
      truncateLine(blocks.paymentContext[1] || "renewal risk ???? ????? cap ??? ?????"),
    ],
    [
      "VPN/Access",
      truncateLine(blocks.vpnContext[0] || "VPN ????? ?? ?? ??? ????? ?????"),
      truncateLine(blocks.vpnContext[1] || "fallback tool ????? production risk ????"),
    ],
  ];
}

function buildContentBlocks(page, docArticle) {
  const allLines = uniqueLines(
    docArticle.bodyLines
      .map(normalizeLine)
      .filter(Boolean)
      .filter((line) => !/^Article\s+\d+/i.test(line))
  ).filter((line) => line !== docArticle.title && line !== page.h1 && line !== page.primaryKeyword);
  const quickAnswer = allLines.slice(0, 3);
  const rest = allLines.slice(3);
  const paymentContext = [];
  const vpnContext = [];
  const stepPool = [];
  const bdUsability = [];
  const paymentRegex = /(৳|BDT|দাম|মূল্য|পেমেন্ট|payment|কার্ড|bKash|ডলার|Wise|Payoneer|সাবস্ক্রিপশন|মূল্য তালিকা)/i;
  const vpnRegex = /(VPN|ভিপিএন|প্রক্সি|proxy|WARP|Proton|Windscribe)/i;
  const stepRegex = /(^Step|^ধাপ|Step-by-Step|পদ্ধতি\s*[০-৯0-9]+|^[০-৯0-9]+[.)]|Install|Sign Up|সাইন আপ|Download|ইন্সটল|খোলার নিয়ম|শুরু করুন|ক্লিক করুন|যান$)/i;
  const faqRegex = /^প্রশ্ন[:?]/;
  for (const line of rest) {
    if (faqRegex.test(line)) continue;
    if (stepRegex.test(line)) {
      stepPool.push(line);
      continue;
    }
    if (vpnRegex.test(line)) {
      vpnContext.push(line);
      continue;
    }
    if (paymentRegex.test(line)) {
      paymentContext.push(line);
      continue;
    }
    bdUsability.push(line);
  }
  const parsedFaq = parseFaqItems(allLines);
  const faqItems = parsedFaq.slice(0, 5);
  if (faqItems.length < 3) {
    faqItems.push(
      [`${page.primaryKeyword} à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶à§‡ à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦°à¦¯à§‹à¦—à§à¦¯ à¦•à¦¿?`, "হ্যাঁ, সঠিক workflow, budget discipline, এবং policy awareness থাকলে ব্যবহারযোগ্য।"],
      [`${page.longTailTargets[0]} à¦¬à¦¾à¦¸à§à¦¤à¦¬à§‡ à¦•à§€à¦­à¦¾à¦¬à§‡ à¦¯à¦¾à¦šà¦¾à¦‡ à¦•à¦°à¦¬?`, "Official pricing/access policy এবং নিজের usage log মিলিয়ে যাচাই করুন।"],
      ["২০২৬ সালে safest rollout strategy কী?", "ফ্রি দিয়ে শুরু, ধাপে ধাপে scale, এবং monthly review।"]
    );
  }
  const uniqueRest = uniqueLines(rest);
  const enrichedBd = uniqueLines([...bdUsability, ...uniqueRest.filter((line) => !paymentRegex.test(line) && !vpnRegex.test(line))]).slice(0, 40);
  const enrichedPayment = uniqueLines(paymentContext).slice(0, 25);
  const enrichedVpn = uniqueLines(vpnContext).slice(0, 20);
  return {
    quickAnswer: quickAnswer.length ? quickAnswer : [docArticle.title, `${page.primaryKeyword} নিয়ে এই গাইডে বাস্তব ব্যবহার পদ্ধতি দেয়া হয়েছে।`],
    bdUsability: enrichedBd.length ? enrichedBd : uniqueRest.slice(0, 14),
    paymentContext: enrichedPayment.length ? enrichedPayment : ["????????? ??? official pricing page ? BDT conversion ????? ?????"],
    vpnContext: enrichedVpn.length ? enrichedVpn : ["VPN requirement tool ???????? ???????? ??? ????; ??????? ????? ??? ??????? ?????"],
    steps: buildSteps(stepPool.length ? stepPool : rest, allLines, page.topicBn),
    comparisonRows: buildComparisonRows(page, {
      bdUsability: enrichedBd,
      paymentContext: enrichedPayment,
      vpnContext: enrichedVpn,
    }),
    faqItems: faqItems.slice(0, 5),
  };
}

const pillarAnchorRotation = [
  "Bangla AI tools directory",
  "????? AI ?????? pillar",
  "AI tools Bangladesh hub",
];

function buildFaqItems(page) {
  return [
    [`${page.primaryKeyword} বাংলাদেশে কি practical?`, "?????, ???? workflow, QA ??? cost control ????? practical?"],
    [`${page.longTailTargets[0]} নিয়ে সাধারণ ভুল কী?`, "Official policy ?? ???? ????????? ?????? ??? no-log usage ????"],
    ["2026 ???? ?????? safe rollout ????", "Small pilot, measurable KPI, ??? monthly optimization ????? rollout ?????"],
  ];
}

function ensureInternalLinks(page) {
  const links = Array.isArray(page.internalLinks) ? page.internalLinks : [];
  const set = new Set(links.filter(Boolean));
  set.add("index.html");
  set.add("ai-tools-bangladesh-bengali.html");
  page.internalLinks = Array.from(set);
  if (page.internalLinks.length < 4) {
    throw new Error(`Minimum internal links requirement failed for ${page.slug}`);
  }
}

function buildDocxMap() {
  const map = new Map();
  const corpus = loadDocxCorpus();
  for (const item of corpus) {
    const existingSlug = docxSlugToExistingSlug[item.sourceSlug];
    if (!existingSlug) {
      throw new Error(`Missing slug mapping for DOCX source ${item.sourceSlug}`);
    }
    map.set(existingSlug, item);
  }
  if (map.size !== 14) {
    throw new Error(`Expected mapped 14 DOCX articles, found ${map.size}`);
  }
  return map;
}

const docxBySlug = buildDocxMap();

for (const [index, page] of clusterPages.entries()) {
  if (!Array.isArray(page.secondaryKeywords) || page.secondaryKeywords.length > 2) {
    throw new Error(`secondaryKeywords max 2 for ${page.slug}`);
  }
  ensureInternalLinks(page);
  if (!page.internalLinks.includes("ai-tools-bangladesh-bengali.html")) {
    throw new Error(`Missing mandatory pillar link for ${page.slug}`);
  }
  const docArticle = docxBySlug.get(page.slug);
  if (!docArticle) {
    throw new Error(`Missing DOCX article payload for ${page.slug}`);
  }
  page.docxArticleId = docArticle.articleId;
  page.docxSourceSlug = docArticle.sourceSlug;
  page.contentBlocks = buildContentBlocks(page, docArticle);
  page.pillarBacklinkLabel = page.pillarBacklinkLabel || pillarAnchorRotation[index % pillarAnchorRotation.length];
  page.faqItems = page.contentBlocks.faqItems.length >= 3 ? page.contentBlocks.faqItems : buildFaqItems(page);
}

function faqSchema(url, page) {
  return {
    "@type": "FAQPage",
    inLanguage: "bn-BD",
    url,
    mainEntity: page.faqItems.map((item) => ({
      "@type": "Question",
      name: item[0],
      acceptedAnswer: { "@type": "Answer", text: item[1] },
    })),
  };
}

function articleSchema(url, page) {
  return {
    "@type": "Article",
    headline: page.h1,
    description: page.description,
    inLanguage: "bn-BD",
    url,
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: "বাংলা AI গাইড" },
    publisher: { "@type": "Organization", name: "বাংলা AI গাইড" },
    datePublished: lastmod,
    dateModified: lastmod,
  };
}

function keywordSignal(page) {
  return `<p class="seo-lead" data-keyword-signal="true">${escapeHtml(page.primaryKeyword)} ফোকাস ধরে ${escapeHtml(page.secondaryKeywords[0])} এবং ${escapeHtml(page.longTailTargets[0])} সহ বাংলাদেশি ব্যবহারকারীর জন্য 2026-ready গাইড দেয়া হয়েছে।</p>`;
}

function renderPillarBacklink(page) {
  return `<p class="seo-lead">Full stack comparison দেখতে <a href="ai-tools-bangladesh-bengali.html">${escapeHtml(page.pillarBacklinkLabel)}</a> দেখুন।</p>`;
}

function renderTable(blocks) {
  return `<div class="seo-table-wrap"><table class="seo-table"><thead><tr><th>Focus</th><th>বাংলাদেশ context</th><th>Execution</th></tr></thead><tbody>${blocks.comparisonRows
    .map((row) => `<tr><td>${escapeHtml(row[0])}</td><td>${escapeHtml(row[1])}</td><td>${escapeHtml(row[2])}</td></tr>`)
    .join("")}</tbody></table></div>`;
}

function renderResources(page, fileName) {
  const required = ["index.html", "ai-tools-bangladesh-bengali.html", ...page.internalLinks, "submit.html"]
    .filter((href) => href !== fileName)
    .filter((href, index, arr) => arr.indexOf(href) === index)
    .slice(0, 8);
  return required.map((href) => `<li><a href="${href}">${labelMap.get(href) || href}</a></li>`).join("");
}

function buildSchema(url, page) {
  const graph = [];
  if (page.intentType === "explainer") {
    graph.push(articleSchema(url, page));
  }
  graph.push(faqSchema(url, page));
  return { "@context": "https://schema.org", "@graph": graph };
}

function renderPage(page) {
  const file = `${page.slug}.html`;
  const url = `https://banglaaiguide.com/${file}`;
  const schema = buildSchema(url, page);
  const blocks = page.contentBlocks;
  const quickAnswerHtml = blocks.quickAnswer.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
  const bdUsabilityHtml = blocks.bdUsability.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
  const paymentHtml = blocks.paymentContext.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
  const vpnHtml = blocks.vpnContext.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
  const stepsHtml = blocks.steps.map((line) => `<li>${escapeHtml(line)}</li>`).join("");
  const faqHtml = page.faqItems
    .map((item) => `<article class="seo-faq-item"><h3>${escapeHtml(item[0])}</h3><p>${escapeHtml(item[1])}</p></article>`)
    .join("");
  return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="shortcut icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <meta name="apple-mobile-web-app-title" content="MyWebSite" />
  <link rel="manifest" href="/site.webmanifest" />
  <meta name="theme-color" content="#059669" />
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.description)}" />
  <link rel="canonical" href="${url}" />
  <meta name="docx-article-id" content="${page.docxArticleId}" />
  <meta name="docx-source-slug" content="${escapeHtml(page.docxSourceSlug)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Syne:wght@500;700;800&display=swap" />
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Syne:wght@500;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/style.css" />
  <script src="js/consent.js" defer></script>
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
  <script src="js/tools-data.js" defer></script>
  <script src="js/seo-pages.js" defer></script>
</head>
<body data-page-slug="${escapeHtml(page.slug)}" data-year-policy="${escapeHtml(page.yearPolicy)}" data-docx-article-id="${page.docxArticleId}">
  <header class="navbar" id="top"><div class="container navbar-inner"><a href="index.html" class="logo" aria-label="বাংলা AI গাইড হোম"><img class="logo-mark" src="/favicon.svg" alt="বাংলা AI গাইড লোগো" width="28" height="28" decoding="async" /><span class="logo-text">বাংলা AI গাইড</span></a><button class="hamburger" id="hamburgerBtn" type="button" aria-expanded="false" aria-controls="mobileMenu" aria-label="মেনু টগল করুন"><span></span><span></span><span></span></button><div class="nav-desktop"><nav class="nav-links" aria-label="প্রধান ন্যাভিগেশন"><a href="index.html#toolsSection">টুলস দেখুন</a><a href="index.html#categoryTabs">ক্যাটাগরি</a><a href="index.html#newsletter">নিউজলেটার</a></nav><a href="submit.html" class="btn btn-primary">টুল সাবমিট করুন</a></div></div><div class="mobile-menu" id="mobileMenu" aria-hidden="true"><a href="index.html#toolsSection">টুলস দেখুন</a><a href="index.html#categoryTabs">ক্যাটাগরি</a><a href="index.html#newsletter">নিউজলেটার</a><a href="submit.html" class="btn btn-primary mobile-cta">টুল সাবমিট করুন</a></div></header>
  <main class="seo-main">
    <article class="container seo-article-page">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">হোম</a><span>&gt;</span><span>${escapeHtml(page.primaryKeyword)}</span></nav>
      <h1>${escapeHtml(page.h1)}</h1>
      ${keywordSignal(page)}
      <p class="seo-lead">${escapeHtml(page.primaryKeyword)} intent-এ এই পেজটি 2026 current-state অনুযায়ী Bangladesh-first guidance দেয়।</p>
      <p class="seo-lead">${escapeHtml(page.secondaryKeywords[0])} এবং ${escapeHtml(page.secondaryKeywords[1] || page.longTailTargets[1] || page.primaryKeyword)} query cluster ধরে content সাজানো হয়েছে যাতে cannibalization কমে।</p>
      <p class="seo-lead">${escapeHtml(page.longTailTargets[0])} সহ long-tail search intent গুলো FAQ এবং section heading-এ naturalভাবে কভার করা হয়েছে।</p>
      ${renderPillarBacklink(page)}
      <section class="seo-block"><h2>Quick answer</h2>${quickAnswerHtml}</section>
      <section class="seo-block"><h2>বাংলাদেশে ব্যবহারযোগ্যতা</h2>${bdUsabilityHtml}</section>
      <section class="seo-block"><h2>Payment/BDT Context</h2>${paymentHtml}</section>
      <section class="seo-block"><h2>VPN Requirement</h2>${vpnHtml}</section>
      <section class="seo-block"><h2>Step-by-step ব্যবহার পদ্ধতি</h2><ol class="seo-steps">${stepsHtml}</ol></section>
      <section class="seo-block"><h2>দ্রুত তুলনামূলক টেবিল</h2>${renderTable(blocks)}</section>
      <section class="seo-block"><h2>FAQ</h2>${faqHtml}</section>
      <section class="seo-cta-block"><h2>পরবর্তী ধাপ</h2><p>আরও AI resource দেখতে index-এ যান অথবা নতুন tool submit করুন।</p><div class="seo-cta-actions"><a class="btn btn-primary" data-cluster-cta="index" href="index.html">সব টুল দেখুন</a><a class="btn btn-ghost" data-cluster-cta="submit" href="submit.html">টুল সাবমিট করুন</a><a class="btn btn-ghost" data-outbound-affiliate="true" href="${page.outbound[1]}" target="_blank" rel="nofollow noopener noreferrer">${page.outbound[0]}</a></div></section>
      <section class="seo-block"><h2>Bangladesh AI Resources</h2><ul class="seo-links-list">${renderResources(page, file)}</ul></section>
    </article>
  </main>
  <footer class="site-footer"><div class="container footer-inner"><p class="footer-brand"><img class="logo-mark" src="/favicon.svg" alt="বাংলা AI গাইড লোগো" width="20" height="20" decoding="async" /><span>বাংলা AI গাইড</span></p><p>© ২০২৬ বাংলা AI গাইড · বাংলাদেশের জন্য তৈরি</p><nav class="footer-links" aria-label="ফুটার লিংক"><a href="submit.html">টুল সাবমিট</a><a href="contact.html#advertising">বিজ্ঞাপন</a><a href="privacy.html">প্রাইভেসি</a><a href="terms.html">শর্তাবলী</a><a href="disclaimer.html">ডিসক্লেইমার</a><a href="contact.html">যোগাযোগ</a></nav></div></footer>
</body>
</html>`;
}

for (const page of clusterPages) {
  fs.writeFileSync(path.join(root, `${page.slug}.html`), renderPage(page), "utf8");
}

console.log(`Generated ${clusterPages.length} cluster SEO pages`);


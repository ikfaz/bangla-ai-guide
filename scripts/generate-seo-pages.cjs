const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const lastmod = "2026-03-05";

const linkPool = [
  ["index.html", "বাংলা AI গাইড হোম"],
  ["submit.html", "নতুন টুল সাবমিট করুন"],
  ["ai-tools-bangladesh-bengali.html", "Bangla AI tools directory"],
  ["chatgpt-bangladesh-theke-bebohar.html", "ChatGPT Bangladesh guide"],
  ["ai-tools-bdt-price-2026-bangladesh.html", "AI tools BDT price 2026"],
  ["bkash-diye-ai-tools-kena-jay.html", "bKash দিয়ে AI tools কেনা"],
  ["vpn-chara-ai-tools-bangladesh.html", "VPN ছাড়া AI tools Bangladesh"],
];

const mediumPages = [
  {
    slug: "ai-tools-bangladesh-bengali",
    primary: "Bangla AI tools directory",
    title: "Bangla AI tools directory | বাংলা AI গাইড",
    description: "Bangla AI tools directory: বাংলাদেশে ব্যবহারযোগ্য AI টুলস, BDT price, payment method এবং VPN reality নিয়ে practical resource hub।",
    h1: "Bangla AI tools directory: বাংলাদেশের জন্য কিউরেটেড AI resource",
    schemaType: "faq",
    quick: ["এই পেজটি বাংলা AI গাইডের central directory hub।", "Bangla readability + English search intent একসাথে রাখা হয়েছে।", "লক্ষ্য: বাংলাদেশি user-দের দ্রুত সঠিক tool নির্বাচন।"],
    use: ["Content, coding, image, productivity use-case ধরে tool shortlist করুন।", "সব category থেকে একসাথে paid tool না নিয়ে phased adoption করুন।", "Monthly re-test করে access ও quality যাচাই করুন।"],
    pay: ["USD price থেকে BDT estimate করে budget cap রাখুন।", "bKash/card route আগে যাচাই করুন।", "Low-value subscription বাদ দিয়ে stack lean রাখুন।"],
    vpn: ["VPN-free tool daily কাজে বেশি stable।", "Policy change হলে access behavior বদলাতে পারে।", "Backup workflow থাকলে production risk কমে।"],
    steps: ["Step 1: use-case list করুন।", "Step 2: free benchmark চালান।", "Step 3: cost-output score দিন।", "Step 4: best tools shortlist করুন।", "Step 5: quarterly stack refresh করুন।"],
    table: [["Use Case", "Starter Stack", "Budget"], ["Content", "LLM + editor", "৳০-৳২,২০০"], ["Coding", "AI IDE + chat", "৳০-৳৫,৫০০"], ["Creator", "Image + voice", "৳০-৳৬,৫০০"]],
    faq: [["Bangla AI tools directory কী?", "বাংলাদেশ-কেন্দ্রিক টুল ও গাইডের কিউরেটেড তালিকা।"], ["সব টুল কি একইভাবে কাজ করে?", "না, access/payment toolভেদে ভিন্ন।"], ["কোন frequency-তে update করব?", "সাপ্তাহিক content, মাসিক compatibility check।"], ["Beginner কীভাবে শুরু করবে?", "একটি use-case দিয়ে free stack শুরু করুন।"]],
    outbound: ["বাংলা AI গাইড হোম", "https://banglaaiguide.com/"],
  },
  {
    slug: "chatgpt-bangladesh-theke-bebohar",
    primary: "ChatGPT Bangladesh",
    title: "ChatGPT Bangladesh | বাংলা AI গাইড",
    description: "ChatGPT Bangladesh setup, prompt workflow, BDT cost planning এবং বাংলাদেশ থেকে ব্যবহারযোগ্যতা নিয়ে practical গাইড।",
    h1: "ChatGPT Bangladesh: বাংলাদেশ থেকে ব্যবহার করার পূর্ণ গাইড",
    schemaType: "article",
    quick: ["এই পেজটি ChatGPT Bangladesh search intent target করে retarget করা।", "বাংলাদেশি user-এর setup, pricing এবং workflow question ফোকাস করা হয়েছে।", "লক্ষ্য: repeatable ও safe usage।"],
    use: ["Client communication, research, draft writing এবং coding support-এ ChatGPT কার্যকর।", "বাংলা output ভালো পেতে context + format prompt-এ দিন।", "Reusable prompts রাখলে কাজ দ্রুত হয়।"],
    pay: ["Free plan দিয়ে শুরু করে value বুঝে paid plan নিন।", "BDT conversion ধরে মাসিক budget রাখুন।", "Team use হলে shared prompt library রাখুন।"],
    vpn: ["Stable login pattern account safety বাড়ায়।", "Frequent region switching এড়িয়ে চলুন।", "Policy-compliant usage দীর্ঘমেয়াদি stability দেয়।"],
    steps: ["Step 1: account setup সম্পন্ন করুন।", "Step 2: ৩টি default prompt template বানান।", "Step 3: feedback loop রাখুন।", "Step 4: reusable instruction snippets রাখুন।", "Step 5: weekly output review করুন।"],
    table: [["Task", "Prompt Focus", "Outcome"], ["Blog draft", "Audience + outline", "Faster draft"], ["Client email", "Tone + action", "Clear reply"], ["Code help", "Error + context", "Actionable fix"]],
    faq: [["ChatGPT Bangladesh থেকে ব্যবহার করতে extra setup লাগে?", "সাধারণত standard signup যথেষ্ট।"], ["বাংলা output কি ভালো?", "Detailed instruction দিলে ভাল output পাওয়া যায়।"], ["Free plan কি কার্যকর?", "হ্যাঁ, শুরুতে validation-এর জন্য যথেষ্ট।"], ["Freelancer কীভাবে ব্যবহার করবে?", "Proposal, research, comms, draft automation-এ।"]],
    outbound: ["ChatGPT খুলুন", "https://chat.openai.com"],
  },
  {
    slug: "ai-tools-for-freelancers-bangladesh",
    primary: "AI tools for freelancers Bangladesh",
    title: "AI tools for freelancers Bangladesh | বাংলা AI গাইড",
    description: "AI tools for freelancers Bangladesh: প্রপোজাল, রিসার্চ, ডেলিভারি অটোমেশন এবং BDT বাজেটে practical টুল স্ট্যাক।",
    h1: "AI tools for freelancers Bangladesh: কাজের জন্য বাস্তব স্ট্যাক",
    schemaType: "faq",
    quick: ["Freelancer-দের জন্য AI টুলস মানে সরাসরি output speed বৃদ্ধি।", "এই গাইডে বাংলাদেশি ফ্রিল্যান্স workflow অনুযায়ী ব্যবহারযোগ্য stack দেয়া হয়েছে।", "লক্ষ্য: কম খরচে বেশি deliverable।"],
    use: ["Proposal, client reply, brief analysis এবং delivery polish-এ AI টুলস high leverage দেয়।", "Use-case ধরে stack সাজালে tool overlap কমে।", "Weekly review করলে low-value tool বাদ দেয়া সহজ হয়।"],
    pay: ["একটি paid + free helper model শুরুতে সবচেয়ে কার্যকর।", "USD price কে BDT conversion করে monthly cap রাখুন।", "Renewal reminder না রাখলে অপ্রয়োজনীয় খরচ বাড়ে।"],
    vpn: ["VPN-free tool হলে daily client work-এ friction কমে।", "Access unstable tool deadline miss করাতে পারে।", "VPN-required flow হলে backup stack রাখুন।"],
    steps: ["Step 1: time-consuming 3টি task লিখুন।", "Step 2: প্রতিটি task-এ একটি core AI tool দিন।", "Step 3: ১৪ দিনের benchmark করুন।", "Step 4: quality+speed score করুন।", "Step 5: ROI দেখে final stack রাখুন।"],
    table: [["Task", "Tool Type", "Outcome"], ["Proposal", "LLM", "Faster response"], ["Research", "AI Search", "Better insights"], ["Delivery", "Editor AI", "Cleaner output"]],
    faq: [["Freelancer-এর প্রথম paid tool কোনটি?", "সাধারণত একটি শক্তিশালী LLM।"], ["Free tool দিয়েই কি কাজ হয়?", "হ্যাঁ, শুরুতে বেশিরভাগ কাজ হয়।"], ["Budget cap কত?", "শুরুতে আয়ের ৫-১০%।"], ["সব টুল কি monthly নেব?", "না, value না পেলে বাদ দিন।"]],
    outbound: ["ChatGPT খুলুন", "https://chat.openai.com"],
  },
  {
    slug: "best-ai-tools-for-content-creators-bangladesh",
    primary: "best AI tools for content creators",
    title: "best AI tools for content creators | বাংলা AI গাইড",
    description: "best AI tools for content creators in Bangladesh: idea থেকে publish পর্যন্ত creator workflow stack, BDT budget এবং tool selection guide।",
    h1: "best AI tools for content creators: বাংলাদেশি creator stack",
    schemaType: "faq",
    quick: ["Creator workflow-এ AI সবচেয়ে বেশি কাজ দেয় ideation ও production speed-এ।", "Platform অনুযায়ী stack আলাদা হওয়া দরকার।", "এই পেজে বাংলাদেশি creator-দের জন্য practical setup দেয়া হয়েছে।"],
    use: ["Topic ideation, script, thumbnail concept এবং caption-এ AI সমানভাবে useful।", "Small team হলে role-based tool নির্বাচন করুন।", "Template library রাখলে consistent output পাওয়া যায়।"],
    pay: ["One premium + two free model অনেক creator-এর জন্য যথেষ্ট।", "BDT per content হিসাব করুন।", "Irregular income হলে monthly plan safer।"],
    vpn: ["Publishing week-এ unstable tool বড় ঝুঁকি।", "VPN-free tools primary pipeline-এ রাখুন।", "Risky tool experimentation-এ সীমাবদ্ধ রাখুন।"],
    steps: ["Step 1: pipeline লিখুন (idea→script→asset→publish)।", "Step 2: প্রতিটি stage-এ core AI tool দিন।", "Step 3: ১০টি content test করুন।", "Step 4: CTR/watch-time দেখে tune করুন।", "Step 5: best workflow template করুন।"],
    table: [["Stage", "Tool Type", "KPI"], ["Ideation", "LLM/Search", "Topic quality"], ["Production", "Script + Voice", "Time saved"], ["Packaging", "Image + Copy", "CTR"]],
    faq: [["Beginner creator কোন stack নেবে?", "LLM + free image tool + editor।"], ["Premium কি দরকার?", "সব সময় নয়।"], ["AI content monetization-safe?", "Policy-compliant হলে।"], ["Budget planning কীভাবে?", "Per-video cost track করে।"]],
    outbound: ["Canva Magic Studio", "https://www.canva.com/magic-studio/"],
  },
  {
    slug: "free-ai-tools-2026-bangladesh",
    primary: "free AI tools 2026 Bangladesh",
    title: "free AI tools 2026 Bangladesh | বাংলা AI গাইড",
    description: "free AI tools 2026 Bangladesh: ফ্রি টুলস দিয়ে বাস্তব কাজ, limit management, upgrade trigger এবং budget-saving workflow বাংলায়।",
    h1: "free AI tools 2026 Bangladesh: ফ্রি স্ট্যাকে কাজের ফল",
    schemaType: "faq",
    quick: ["ফ্রি AI টুলস দিয়ে 2026-এও practical workflow সম্ভব।", "Limit-aware strategy না থাকলে free stack ভেঙে যায়।", "এই গাইডে বাংলাদেশি user-এর জন্য tested approach দেয়া হয়েছে।"],
    use: ["Students, starter freelancer এবং small business-এ free tools high ROI দেয়।", "Credit/message cap track করা জরুরি।", "Single tool dependency এড়িয়ে combo stack রাখুন।"],
    pay: ["Bottleneck প্রমাণিত হলে তবেই paid upgrade নিন।", "BDT conversion ধরে savings হিসাব করুন।", "অপ্রয়োজনীয় upgrade এড়াতে monthly review করুন।"],
    vpn: ["Free tool policy দ্রুত বদলাতে পারে, monthly check করুন।", "VPN-required হলে backup free option রাখুন।", "VPN-free tools daily use habit তৈরি করে।"],
    steps: ["Step 1: 3টি core কাজ ঠিক করুন।", "Step 2: প্রতি কাজে 2টি free tool shortlist করুন।", "Step 3: ১৪ দিনের usage log রাখুন।", "Step 4: output quality score করুন।", "Step 5: দরকার হলে only one paid upgrade নিন।"],
    table: [["Category", "Free Option", "Limit"], ["LLM", "Chat tier", "Message cap"], ["Image", "Free credits", "Monthly cap"], ["Coding", "IDE assist", "Feature lock"]],
    faq: [["ফ্রি stack কি client কাজে চলে?", "হ্যাঁ, QA করলে চলে।"], ["কখন paid হওয়া উচিত?", "Limit business impact করলে।"], ["সব free tool কি stable?", "না, retest দরকার।"], ["Free-first strategy কি টেকসই?", "হ্যাঁ, structured হলে।"]],
    outbound: ["Perplexity free", "https://www.perplexity.ai"],
  },
  {
    slug: "ai-image-generator-free-bangladesh",
    primary: "AI image generator free Bangladesh",
    title: "AI image generator free Bangladesh | বাংলা AI গাইড",
    description: "AI image generator free Bangladesh গাইড: prompt workflow, free credit strategy, output QA এবং creator-ready visual production বাংলায়।",
    h1: "AI image generator free Bangladesh: free visual workflow",
    schemaType: "article",
    quick: ["Free image generator দিয়ে social visual দ্রুত তৈরি করা যায়।", "Prompt template না থাকলে quality inconsistent হয়।", "এই গাইডে concept থেকে publish-ready flow দেয়া আছে।"],
    use: ["Thumbnail, ad concept, blog cover এবং social post visual-এ free tools কার্যকর।", "A/B prompt testing করলে output improve হয়।", "Publish আগে manual QA জরুরি।"],
    pay: ["Free credit শেষ হলে production plan বানান।", "Client কাজে premium fallback রাখুন।", "BDT per asset হিসাব করুন।"],
    vpn: ["Region issue আগে test করুন।", "VPN-dependent tool কে primary stack করবেন না।", "Stable tool দিয়ে prompt library বানান।"],
    steps: ["Step 1: visual brief লিখুন।", "Step 2: ১০টি prompt variation চালান।", "Step 3: best outputs refine করুন।", "Step 4: editor-এ final touch দিন।", "Step 5: policy/license check করে publish করুন।"],
    table: [["Goal", "Workflow", "Result"], ["Thumbnail", "Prompt + overlay", "Clickable asset"], ["Ad concept", "Batch gen", "Idea direction"], ["Blog cover", "Template style", "Brand consistency"]],
    faq: [["Free image tool commercial use হবে?", "License terms দেখে ব্যবহার করুন।"], ["Prompt কেমন লিখব?", "Style+subject+format স্পষ্ট দিন।"], ["Beginner কোথা থেকে শুরু?", "Simple template দিয়ে iterative test করুন।"], ["সব কাজে premium লাগবে?", "না, use-case based।"]],
    outbound: ["Adobe Firefly", "https://firefly.adobe.com"],
  },
  {
    slug: "best-ai-coding-tools-for-beginners-bangladesh",
    primary: "best AI coding tools for beginners",
    title: "best AI coding tools for beginners | বাংলা AI গাইড",
    description: "best AI coding tools for beginners in Bangladesh: শেখা + project build-এর জন্য beginner-safe AI coding workflow, cost planning এবং tool selection।",
    h1: "best AI coding tools for beginners: বাংলাদেশি learner guide",
    schemaType: "faq",
    quick: ["AI coding tool beginner-দের শেখার গতি বাড়ায়।", "Blind copy করলে dependency বাড়ে।", "এই গাইডে learning-first setup দেয়া হয়েছে।"],
    use: ["Concept explanation, debugging এবং starter project scaffold-এ AI useful।", "Problem statement লিখে prompt দিলে নির্ভুলতা বাড়ে।", "Generated code test ছাড়া merge করবেন না।"],
    pay: ["Free tier + one low-cost tool দিয়ে শুরু করুন।", "Daily usage stable হলে paid evaluate করুন।", "BDT budget cap maintain করুন।"],
    vpn: ["Stable IDE access learning momentum ধরে রাখে।", "VPN issue বেশি হলে alternate tool রাখুন।", "Policy-safe usage long-term দরকার।"],
    steps: ["Step 1: language goal ঠিক করুন।", "Step 2: প্রতিদিন ১টি coding problem AI সহ solve করুন।", "Step 3: generated code নিজে explain করুন।", "Step 4: tests লিখে validate করুন।", "Step 5: weekly mini-project build করুন।"],
    table: [["Stage", "Tool", "Benefit"], ["Concept", "AI Tutor", "Clarity"], ["Build", "AI IDE", "Speed"], ["Debug", "Error Explainer", "Direction"]],
    faq: [["AI দিয়ে শিখব নাকি manual?", "দুটো মিশিয়ে শিখুন।"], ["AI code copy safe?", "না, review+test বাধ্যতামূলক।"], ["Beginner budget কত?", "Free-first model।"], ["কখন paid coding tool?", "Productivity gain প্রমাণিত হলে।"]],
    outbound: ["GitHub Copilot", "https://github.com/features/copilot"],
  },
  {
    slug: "ai-tools-for-youtube-bangladesh",
    primary: "AI tools for YouTube Bangladesh",
    title: "AI tools for YouTube Bangladesh | বাংলা AI গাইড",
    description: "AI tools for YouTube Bangladesh: script, thumbnail, voice এবং publish optimization workflow-এর জন্য practical creator guide বাংলায়।",
    h1: "AI tools for YouTube Bangladesh: creator production stack",
    schemaType: "faq",
    quick: ["YouTube workflow-এ AI সবচেয়ে বেশি কাজ দেয় speed ও consistency-তে।", "এই পেজে বাংলাদেশি creator use-case ধরে tool mapping করা হয়েছে।", "লক্ষ্য: quality বজায় রেখে দ্রুত publish।"],
    use: ["Topic research, hook writing, script drafting, thumbnail এবং subtitle-এ AI ব্যবহার করুন।", "Template-driven pipeline ছাড়া long-term consistency কঠিন।", "Analytics feedback loop দিয়ে prompt উন্নত করুন।"],
    pay: ["Start with free + one paid core tool.", "Per-video BDT cost track করুন।", "Growth stable হলে advanced plan নিন।"],
    vpn: ["Upload week-এ access fail হলে schedule নষ্ট হয়।", "VPN-free tools primary pipeline রাখুন।", "Risky tools experiment-only রাখুন।"],
    steps: ["Step 1: niche topic bank তৈরি করুন।", "Step 2: script outline AI দিয়ে করুন।", "Step 3: thumbnail concept batch বানান।", "Step 4: voice/subtitle finalize করুন।", "Step 5: CTR + retention দেখে iterate করুন।"],
    table: [["Stage", "AI Type", "KPI"], ["Research", "LLM/Search", "Topic relevance"], ["Production", "Script+Voice", "Publish speed"], ["Packaging", "Title+Thumb AI", "CTR"]],
    faq: [["YouTube creator-এর প্রথম AI tool কোনটি?", "Script সহায়ক LLM।"], ["AI voice monetization-safe?", "Policy মেনে ব্যবহার করুন।"], ["Daily upload-এ AI দরকার?", "Consistency-এর জন্য খুব useful।"], ["Budget কম হলে?", "Free stack দিয়ে শুরু করুন।"]],
    outbound: ["YouTube Studio", "https://studio.youtube.com"],
  },
];

function faqSchema(url, faq) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "bn-BD",
    url,
    mainEntity: faq.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

function articleSchema(url, page) {
  return {
    "@context": "https://schema.org",
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

function renderTable(rows) {
  const [head, ...body] = rows;
  return `<div class="seo-table-wrap"><table class="seo-table"><thead><tr>${head.map((x) => `<th>${x}</th>`).join("")}</tr></thead><tbody>${body.map((row) => `<tr>${row.map((x) => `<td>${x}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function renderPage(page) {
  const file = `${page.slug}.html`;
  const url = `https://banglaaiguide.com/${file}`;
  const schema = page.schemaType === "article" ? articleSchema(url, page) : faqSchema(url, page.faq);
  const related = [...linkPool, ...mediumPages.map((p) => [`${p.slug}.html`, p.primary])]
    .filter(([href], idx, arr) => arr.findIndex((x) => x[0] === href) === idx && href !== file)
    .slice(0, 6)
    .map(([href, text]) => `<li><a href="${href}">${text}</a></li>`)
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
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-X760BSGQCC"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-X760BSGQCC');</script>
  <title>${page.title}</title>
  <meta name="description" content="${page.description}" />
  <link rel="canonical" href="${url}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Syne:wght@500;700;800&display=swap" />
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Syne:wght@500;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/style.css" />
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
  <script src="js/seo-pages.js" defer></script>
</head>
<body data-page-slug="${page.slug}">
  <header class="navbar" id="top"><div class="container navbar-inner"><a href="index.html" class="logo" aria-label="বাংলা AI গাইড হোম"><img class="logo-mark" src="/favicon.svg" alt="বাংলা AI গাইড লোগো" width="28" height="28" decoding="async" /><span class="logo-text">বাংলা AI গাইড</span></a><button class="hamburger" id="hamburgerBtn" type="button" aria-expanded="false" aria-controls="mobileMenu" aria-label="মেনু টগল করুন"><span></span><span></span><span></span></button><div class="nav-desktop"><nav class="nav-links" aria-label="প্রধান ন্যাভিগেশন"><a href="index.html#toolsSection">টুলস দেখুন</a><a href="index.html#categoryTabs">ক্যাটাগরি</a><a href="index.html#newsletter">নিউজলেটার</a></nav><a href="submit.html" class="btn btn-primary">টুল সাবমিট করুন</a></div></div><div class="mobile-menu" id="mobileMenu" aria-hidden="true"><a href="index.html#toolsSection">টুলস দেখুন</a><a href="index.html#categoryTabs">ক্যাটাগরি</a><a href="index.html#newsletter">নিউজলেটার</a><a href="submit.html" class="btn btn-primary mobile-cta">টুল সাবমিট করুন</a></div></header>
  <main class="seo-main">
    <article class="container seo-article-page">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">হোম</a><span>&gt;</span><span>${page.primary}</span></nav>
      <h1>${page.h1}</h1>
      ${page.quick.map((x) => `<p class="seo-lead">${x}</p>`).join("")}
      <section class="seo-block"><h2>বাংলাদেশে ব্যবহারযোগ্যতা</h2>${page.use.map((x) => `<p>${x}</p>`).join("")}</section>
      <section class="seo-block"><h2>Payment/Price Context (BDT + bKash)</h2>${page.pay.map((x) => `<p>${x}</p>`).join("")}</section>
      <section class="seo-block"><h2>VPN Requirement Reality</h2>${page.vpn.map((x) => `<p>${x}</p>`).join("")}</section>
      <section class="seo-block"><h2>Step-by-step ব্যবহার পদ্ধতি</h2><ol class="seo-steps">${page.steps.map((x) => `<li>${x}</li>`).join("")}</ol></section>
      <section class="seo-block"><h2>দ্রুত তুলনামূলক টেবিল</h2>${renderTable(page.table)}</section>
      <section class="seo-block"><h2>FAQ</h2>${page.faq.map(([q, a]) => `<article class="seo-faq-item"><h3>${q}</h3><p>${a}</p></article>`).join("")}</section>
      <section class="seo-cta-block"><h2>পরবর্তী ধাপ</h2><p>আরও AI resource দেখতে index-এ যান অথবা নতুন tool submit করুন।</p><div class="seo-cta-actions"><a class="btn btn-primary" data-cluster-cta="index" href="index.html">সব টুল দেখুন</a><a class="btn btn-ghost" data-cluster-cta="submit" href="submit.html">টুল সাবমিট করুন</a><a class="btn btn-ghost" data-outbound-affiliate="true" href="${page.outbound[1]}" target="_blank" rel="nofollow noopener noreferrer">${page.outbound[0]}</a></div></section>
      <section class="seo-block"><h2>Bangladesh AI Resources</h2><ul class="seo-links-list">${related}</ul></section>
    </article>
  </main>
  <footer class="site-footer"><div class="container footer-inner"><p class="footer-brand"><img class="logo-mark" src="/favicon.svg" alt="বাংলা AI গাইড লোগো" width="20" height="20" decoding="async" /><span>????? AI ????</span></p><p>© ২০২৬ বাংলা AI গাইড · বাংলাদেশের জন্য তৈরি</p><nav class="footer-links" aria-label="ফুটার লিংক"><a href="submit.html">টুল সাবমিট</a><a href="index.html#newsletter">বিজ্ঞাপন</a><a href="privacy.html">প্রাইভেসি</a><a href="index.html#newsletter">যোগাযোগ</a></nav></div></footer>
</body>
</html>`;
}

for (const page of mediumPages) {
  fs.writeFileSync(path.join(root, `${page.slug}.html`), renderPage(page), "utf8");
}

console.log(`Generated ${mediumPages.length} medium SEO pages`);


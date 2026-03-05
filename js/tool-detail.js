(() => {
  const data = Array.isArray(window.tools) ? window.tools : (typeof tools !== "undefined" && Array.isArray(tools) ? tools : []);
  const conversionRate = typeof window.USD_TO_BDT === "number" ? window.USD_TO_BDT : (typeof USD_TO_BDT !== "undefined" && typeof USD_TO_BDT === "number" ? USD_TO_BDT : 110);
  const refs = {
    breadcrumb: document.getElementById("breadcrumb"),
    detailContent: document.getElementById("detailContent"),
    detailSeoSection: document.getElementById("detailSeoSection"),
    detailFaqSchema: document.getElementById("detailFaqSchema"),
    relatedGrid: document.getElementById("relatedGrid"),
    detailResourcesGrid: document.getElementById("detailResourcesGrid"),
    hamburgerBtn: document.getElementById("hamburgerBtn"),
    mobileMenu: document.getElementById("mobileMenu"),
  };

  const categoryLabelMap = { llm: "LLM", image: "ইমেজ ও ভিডিও", coding: "কোডিং", productivity: "প্রোডাক্টিভিটি" };
  const baseLinks = [
    { href: "index.html", text: "সব AI টুলস দেখুন" },
    { href: "ai-tools-bdt-price-2026-bangladesh.html", text: "AI tools BDT price 2026" },
    { href: "vpn-chara-ai-tools-bangladesh.html", text: "VPN ছাড়া AI tools Bangladesh" },
    { href: "submit.html", text: "নতুন টুল সাবমিট করুন" },
  ];
  const catLinks = {
    llm: [
      { href: "chatgpt-bangladesh-theke-bebohar.html", text: "ChatGPT Bangladesh guide" },
      { href: "ai-tools-for-freelancers-bangladesh.html", text: "AI tools for freelancers Bangladesh" },
      { href: "best-ai-tools-for-content-creators-bangladesh.html", text: "best AI tools for content creators" },
    ],
    image: [
      { href: "midjourney-bangladesh-free.html", text: "Midjourney Bangladesh free" },
      { href: "ai-tools-for-youtube-bangladesh.html", text: "AI tools for YouTube Bangladesh" },
      { href: "ai-image-generator-free-bangladesh.html", text: "AI image generator free Bangladesh" },
    ],
    coding: [
      { href: "cursor-ai-bangla.html", text: "Cursor AI বাংলা" },
      { href: "best-ai-coding-tools-for-beginners-bangladesh.html", text: "best AI coding tools for beginners" },
      { href: "ai-tools-for-freelancers-bangladesh.html", text: "AI tools freelancer Bangladesh income" },
    ],
    productivity: [
      { href: "bangladeshe-ai-tools-kibhabe-bebohar-korben.html", text: "বাংলাদেশে AI tools কীভাবে ব্যবহার করবেন" },
      { href: "best-ai-tools-for-content-creators-bangladesh.html", text: "AI tools for content creators Bangladesh" },
      { href: "ai-tools-for-freelancers-bangladesh.html", text: "AI tools freelancer Bangladesh income" },
    ],
  };

  const esc = (t) => String(t ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const toSlug = (v) => String(v || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const bnNum = (v) => Number(v).toLocaleString("bn-BD");
  const getToolLandingUrl = (tool) => `https://banglaaiguide.com/?tool=${encodeURIComponent(toSlug(tool.name))}`;
  const getFacebookShareUrl = (tool) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getToolLandingUrl(tool))}`;
  const getWhatsAppShareUrl = (tool) => `https://wa.me/?text=${encodeURIComponent(`${tool.name} — বাংলাদেশ থেকে কাজ করে!\nদেখুন: ${getToolLandingUrl(tool)}\nবাংলা AI গাইডে আরও ১৫০+ টুলস →`)}`;
  const getToolDomain = (tool) => {
    const rawUrl = tool.direct_url || tool.affiliate_url || "";
    try {
      return new URL(rawUrl).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  };
  const getToolLogo = (tool) => {
    if (tool.logo) {
      return tool.logo;
    }
    const domain = getToolDomain(tool);
    return domain ? `https://logo.clearbit.com/${domain}` : "https://logo.clearbit.com/openai.com";
  };
  const getToolLogoFallback = (tool) => {
    if (tool.logo_fallback) {
      return tool.logo_fallback;
    }
    const domain = getToolDomain(tool) || "openai.com";
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
  };
  const renderToolLogo = (tool) => `<img class="tool-logo" src="${esc(getToolLogo(tool))}" alt="${esc(tool.name || "Tool")} logo" width="48" height="48" style="border-radius:10px; object-fit:contain;" onerror="this.onerror=null; this.src='${esc(getToolLogoFallback(tool))}'" loading="lazy" decoding="async" />`;

  function isFullyFree(tool) {
    const raw = String(tool.usdPrice || "").toLowerCase();
    return tool.pricing === "free" || tool.payment === "free" || raw.includes("সম্পূর্ণ ফ্রি") || raw === "free";
  }

  function extractUsdNumber(rawPrice) {
    const m = String(rawPrice).match(/\$(\d+(?:\.\d+)?)/);
    return m ? Number(m[1]) : null;
  }

  function getPriceInfo(tool) {
    const raw = String(tool.usdPrice || "").trim();
    if (isFullyFree(tool)) return { usdLabel: raw || "সম্পূর্ণ ফ্রি", bdtLabel: "৳০ — ফ্রি" };
    if (raw.toLowerCase() === "usage-based") return { usdLabel: raw, bdtLabel: "চাহিদাভিত্তিক" };
    if (/^free\s*\/\s*api paid$/i.test(raw)) return { usdLabel: raw, bdtLabel: "ফ্রি / API পেইড" };
    const usdValue = extractUsdNumber(raw);
    if (usdValue !== null) {
      const bdt = `৳${bnNum(Math.round(usdValue * conversionRate))}`;
      const monthly = /\/mo/i.test(raw) ? "/মাস" : "";
      if (/^free\s*\//i.test(raw)) return { usdLabel: raw, bdtLabel: `ফ্রি / ${bdt}${monthly}` };
      return { usdLabel: raw, bdtLabel: `${bdt}${monthly}` };
    }
    return { usdLabel: raw || "প্রযোজ্য নয়", bdtLabel: raw || "প্রযোজ্য নয়" };
  }

  function getBadges(tool) {
    const bd = tool.works_in_bd ? '<span class="badge badge--accent">✅ BD-তে কাজ করে</span>' : '<span class="badge badge--neutral">❌ BD-তে সীমিত</span>';
    const vpn = tool.no_vpn ? '<span class="badge badge--accent">🔵 VPN লাগে না</span>' : '<span class="badge badge--neutral">⚠️ VPN লাগতে পারে</span>';
    let pay = '<span class="badge badge--neutral">💳 কার্ড</span>';
    if (tool.payment === "bkash") pay = '<span class="badge badge--accent">💚 bKash</span>';
    if (tool.payment === "free") pay = '<span class="badge badge--accent">🆓 ফ্রি</span>';
    return `${bd}${vpn}${pay}`;
  }

  function setMobileMenuOpen(open, o = {}) {
    if (!refs.hamburgerBtn || !refs.mobileMenu) return;
    refs.mobileMenu.classList.toggle("open", open);
    refs.mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
    refs.hamburgerBtn.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
    if (open && o.moveFocus) refs.mobileMenu.querySelector("a,button")?.focus();
    if (!open && o.returnFocus) refs.hamburgerBtn.focus();
  }

  function bindMenuEvents() {
    if (!refs.hamburgerBtn || !refs.mobileMenu) return;
    const mq = window.matchMedia("(max-width: 840px)");
    refs.hamburgerBtn.addEventListener("click", () => setMobileMenuOpen(!refs.mobileMenu.classList.contains("open"), { moveFocus: true }));
    refs.mobileMenu.addEventListener("click", (e) => { if (e.target.closest("a")) setMobileMenuOpen(false); });
    document.addEventListener("click", (e) => {
      if (!refs.mobileMenu.classList.contains("open")) return;
      if (!refs.mobileMenu.contains(e.target) && !refs.hamburgerBtn.contains(e.target)) setMobileMenuOpen(false);
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && refs.mobileMenu.classList.contains("open")) setMobileMenuOpen(false, { returnFocus: true }); });
    const onChange = (e) => { if (!e.matches) setMobileMenuOpen(false); };
    if (typeof mq.addEventListener === "function") mq.addEventListener("change", onChange); else if (typeof mq.addListener === "function") mq.addListener(onChange);
    refs.mobileMenu.setAttribute("aria-hidden", "true");
  }

  async function copyTextToClipboard(text) {
    if (!text) return false;
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(text); return true; } catch {}
    }
    try {
      const t = document.createElement("textarea");
      t.value = text;
      t.setAttribute("readonly", "");
      t.style.position = "absolute";
      t.style.left = "-9999px";
      document.body.appendChild(t);
      t.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(t);
      return ok;
    } catch {
      return false;
    }
  }

  function showCopyTooltip(btn, message) {
    if (!btn) return;
    btn.classList.remove("is-copied");
    btn.setAttribute("data-tooltip", message);
    void btn.offsetWidth;
    btn.classList.add("is-copied");
    if (btn._copyTooltipTimer) clearTimeout(btn._copyTooltipTimer);
    btn._copyTooltipTimer = setTimeout(() => {
      btn.classList.remove("is-copied");
      btn.removeAttribute("data-tooltip");
      btn._copyTooltipTimer = null;
    }, 1800);
  }

  function bindShareEvents() {
    document.addEventListener("click", (e) => {
      const copyBtn = e.target.closest("[data-share-action='copy']");
      if (!copyBtn) return;
      e.preventDefault();
      copyTextToClipboard(copyBtn.getAttribute("data-copy-url") || "").then((ok) => showCopyTooltip(copyBtn, ok ? "লিংক কপি হয়েছে! ✓" : "কপি করা যায়নি"));
    });
  }

  function attachToolLogoHandlers(root = document) {
    root.querySelectorAll(".tool-logo").forEach((img) => {
      if (img.dataset.logoBound === "1") {
        return;
      }
      img.dataset.logoBound = "1";
      img.addEventListener("error", () => {
        const failCount = Number(img.dataset.failCount || "0") + 1;
        img.dataset.failCount = String(failCount);
        if (failCount >= 2) {
          img.style.display = "none";
        }
      });
    });
  }

  function trackClusterCta(pageSlug, target) {
    if (typeof window.gtag === "function") window.gtag("event", "click_cluster_cta", { page_slug: pageSlug, cta_target: target });
  }

  function ensureMetaTag(name, content) {
    if (!content) return;
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", name);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  }

  function ensureCanonical(href) {
    let tag = document.querySelector('link[rel="canonical"]');
    if (!tag) {
      tag = document.createElement("link");
      tag.setAttribute("rel", "canonical");
      document.head.appendChild(tag);
    }
    tag.setAttribute("href", href);
  }

  const LONG_TAIL_SEO_MAP = {
    chatgpt: {
      primaryKeyword: "ChatGPT বাংলাদেশ থেকে ফ্রিতে ব্যবহার করবেন কীভাবে",
      metaDescription: "ChatGPT বাংলাদেশ থেকে ফ্রিতে ব্যবহার করবেন কীভাবে, BDT price, payment, VPN এবং freelancer income workflow বাংলায় জানুন।",
      intentTitle: "ChatGPT বাংলাদেশ থেকে ফ্রিতে ব্যবহার করবেন কীভাবে",
      quickAnswer: ["ChatGPT বাংলাদেশ থেকে ফ্রি প্ল্যানে সরাসরি ব্যবহার করা যায়।", "Freelancer workflow-এ draft, reply, proposal দ্রুত করা যায়।"],
      bdUsage: ["Web/app login করে নিয়মিত ব্যবহার সম্ভব।", "বাংলা prompt-এও ভালো আউটপুট পাওয়া যায়।"],
      paymentContext: ["Free: ৳০", "Plus সাধারণত $20/mo (প্রায় ৳2,200/মাস)", "কার্ড পেমেন্ট প্রধান পদ্ধতি।"],
      vpnContext: ["সাধারণত VPN লাগে না।", "Network issue হলে একই browser/profile ব্যবহার করুন।"],
      steps: ["অ্যাকাউন্ট খুলুন", "ছোট prompt দিয়ে শুরু করুন", "নিয়মিত prompt library বানান", "client work-এ human edit দিন"],
      faq: [
        { q: "ChatGPT বাংলাদেশ থেকে ফ্রিতে ব্যবহার করবেন কীভাবে?", a: "ফ্রি অ্যাকাউন্ট খুলে web/app থেকে সরাসরি ব্যবহার শুরু করুন।" },
        { q: "ChatGPT Plus-এর BDT price কত?", a: "সাধারণত $20/mo, আনুমানিক ৳2,200/মাস।" },
        { q: "AI tools freelancer Bangladesh income বাড়াতে ChatGPT কি সাহায্য করে?", a: "হ্যাঁ, proposal, email, research ও content draft দ্রুত হওয়ায় আয় বাড়াতে সহায়ক।" }
      ],
      incomeAngles: ["Proposal automation", "Client communication speed", "Service delivery time কমানো"],
      youtubeAngles: [],
      internalLinks: [
        { href: "chatgpt-bangladesh-theke-bebohar.html", text: "ChatGPT Bangladesh full guide" },
        { href: "ai-tools-for-freelancers-bangladesh.html", text: "AI tools for freelancers Bangladesh" },
        { href: "bangladeshe-ai-tools-kibhabe-bebohar-korben.html", text: "বাংলাদেশে AI tools tutorial" }
      ]
    },
    claude: {
      primaryKeyword: "Claude AI বাংলায় কীভাবে ব্যবহার করবেন",
      metaDescription: "Claude AI বাংলায় কীভাবে ব্যবহার করবেন, BD setup, BDT context, VPN reality এবং practical freelancing use-case জানুন।",
      intentTitle: "Claude AI বাংলায় কীভাবে ব্যবহার করবেন",
      quickAnswer: ["Claude long-form লেখা ও analysis-এ শক্তিশালী।", "বাংলাদেশ থেকে ফ্রি প্ল্যানে শুরু করা যায়।"],
      bdUsage: ["বাংলা কনটেন্টে ভালো কাজ করে।", "Long document summary-তে দ্রুত ফল দেয়।"],
      paymentContext: ["Free tier আছে", "Pro সাধারণত $20/mo (প্রায় ৳2,200/মাস)", "কার্ডে পেমেন্ট বেশি কমন"],
      vpnContext: ["বেশিরভাগ ক্ষেত্রে VPN লাগে না।", "Login issue হলে browser cache clear করুন।"],
      steps: ["Account খুলুন", "বাংলায় prompt + format লিখুন", "Iterate করুন", "Output human-edit করুন"],
      faq: [
        { q: "Claude AI বাংলায় কীভাবে ব্যবহার করবেন?", a: "স্পষ্ট বাংলা prompt ও কাঙ্ক্ষিত format লিখে শুরু করুন।" },
        { q: "Claude কি বাংলাদেশ থেকে কাজ করে?", a: "সাধারণত হ্যাঁ, account state অনুযায়ী feature পরিবর্তিত হতে পারে।" },
        { q: "Claude দিয়ে আয় করা যায়?", a: "হ্যাঁ, content/research service-এ delivery speed বাড়ে।" }
      ],
      incomeAngles: ["Long-form content service", "Research summary service"],
      youtubeAngles: [],
      internalLinks: [
        { href: "ai-tools-for-freelancers-bangladesh.html", text: "Freelancer AI tools" },
        { href: "best-ai-tools-for-content-creators-bangladesh.html", text: "Creator AI tools" },
        { href: "ai-tools-bangladesh-bengali.html", text: "Bangla AI tools directory" }
      ]
    },
    midjourney: {
      primaryKeyword: "Midjourney Bangladesh card payment",
      metaDescription: "Midjourney Bangladesh card payment, monthly BDT cost, VPN context এবং YouTube creator workflow বাংলায় জানুন।",
      intentTitle: "Midjourney Bangladesh card payment",
      quickAnswer: ["Midjourney সাধারণত paid tool এবং card payment লাগে।", "YouTube thumbnail/visual কাজে খুব কার্যকর।"],
      bdUsage: ["বাংলাদেশ থেকে ব্যবহার করা যায়।", "Prompt quality ভালো হলে output অনেক উন্নত হয়।"],
      paymentContext: ["Basic plan সাধারণত $10/mo (প্রায় ৳1,100/মাস)", "কার্ড পেমেন্ট primary", "bKash direct সাধারণত নেই"],
      vpnContext: ["সাধারণত VPN লাগে না।", "Server load-এ render time বাড়তে পারে।"],
      steps: ["Plan বাছুন", "Prompt টেমপ্লেট বানান", "Multiple output test করুন", "Final image refine করুন"],
      faq: [
        { q: "Midjourney Bangladesh card payment কীভাবে করবেন?", a: "Subscription checkout-এ international-enabled card ব্যবহার করুন।" },
        { q: "Midjourney free কি?", a: "Full free সাধারণত নয়; availability সময়ভেদে বদলাতে পারে।" },
        { q: "AI tools for Bangladeshi YouTubers হিসেবে Midjourney কেন ভালো?", a: "Thumbnail ও concept visual খুব দ্রুত তৈরি হয়।" }
      ],
      incomeAngles: ["Freelance thumbnail pack service"],
      youtubeAngles: ["Thumbnail A/B test", "Faceless channel visual"],
      internalLinks: [
        { href: "midjourney-bangladesh-free.html", text: "Midjourney Bangladesh free guide" },
        { href: "ai-tools-for-youtube-bangladesh.html", text: "AI tools for YouTube Bangladesh" },
        { href: "ai-image-generator-free-bangladesh.html", text: "AI image generator free Bangladesh" }
      ]
    },
    cursor: {
      primaryKeyword: "Cursor AI বাংলাদেশে কীভাবে কাজ করে",
      metaDescription: "Cursor AI বাংলাদেশে কীভাবে কাজ করে, setup, BDT pricing context, VPN এবং coding freelancer workflow জানুন।",
      intentTitle: "Cursor AI বাংলাদেশে কীভাবে কাজ করে",
      quickAnswer: ["Cursor AI coding workflow দ্রুত করে।", "বাংলাদেশ থেকে install করে সরাসরি ব্যবহার করা যায়।"],
      bdUsage: ["Bug fix, refactor, boilerplate-এ দ্রুত কাজ হয়।", "Beginner developer-এর জন্যও practical।"],
      paymentContext: ["Free tier আছে", "Pro $20/mo (প্রায় ৳2,200/মাস)", "কার্ড পেমেন্ট সাধারণত লাগে"],
      vpnContext: ["সাধারণত VPN লাগে না।", "Network/proxy issue হলে settings check করুন।"],
      steps: ["Install করুন", "Project open করুন", "Chat assist দিয়ে ছোট কাজ শুরু করুন", "Test + commit workflow মানুন"],
      faq: [
        { q: "Cursor AI বাংলাদেশে কীভাবে কাজ করে?", a: "Editor install করে account login-এর পর local project-এ AI assist ব্যবহার করা যায়।" },
        { q: "best AI coding tools for beginners তালিকায় Cursor কেন?", a: "IDE-এর ভেতর explain/fix/refactor দেয় বলে শেখা ও speed দুইটাই বাড়ে।" },
        { q: "AI tools freelancer Bangladesh income বাড়াতে Cursor সাহায্য করে?", a: "হ্যাঁ, bug-fix এবং feature delivery দ্রুত হওয়ায় project output বাড়ে।" }
      ],
      incomeAngles: ["Quick bug-fix gigs", "MVP delivery দ্রুত করা"],
      youtubeAngles: [],
      internalLinks: [
        { href: "cursor-ai-bangla.html", text: "Cursor AI বাংলা guide" },
        { href: "best-ai-coding-tools-for-beginners-bangladesh.html", text: "AI coding tools for beginners" },
        { href: "ai-tools-for-freelancers-bangladesh.html", text: "AI tools freelancer Bangladesh income" }
      ]
    },
    elevenlabs: {
      primaryKeyword: "ElevenLabs বাংলা voice generator free",
      metaDescription: "ElevenLabs বাংলা voice generator free options, BD setup, pricing context, এবং YouTube voice workflow বাংলায় জানুন।",
      intentTitle: "ElevenLabs বাংলা voice generator free",
      quickAnswer: ["ElevenLabs বাংলা voiceover তৈরিতে শক্তিশালী।", "ফ্রি usage দিয়ে শুরু করে paid tier-এ scale করা যায়।"],
      bdUsage: ["বাংলাদেশ থেকে web-এ ব্যবহার করা যায়।", "বাংলা voice quality-এর জন্য script formatting জরুরি।"],
      paymentContext: ["Free quota থাকে", "উচ্চ usage-এ paid plan", "USD to BDT conversion ধরে বাজেট করুন"],
      vpnContext: ["সাধারণত VPN লাগে না।", "Export issue হলে retry + browser update দিন।"],
      steps: ["স্ক্রিপ্ট ভাগ করুন", "Voice profile বাছুন", "Pace adjust করুন", "Audio export করে publish করুন"],
      faq: [
        { q: "ElevenLabs বাংলা voice generator free আছে কি?", a: "সাধারণত free usage quota থাকে, heavy use-এ paid tier লাগে।" },
        { q: "AI tools for Bangladeshi YouTubers হিসেবে ElevenLabs কেমন?", a: "Faceless ভিডিও narration দ্রুত তৈরি করা যায়।" },
        { q: "বাংলাদেশে AI দিয়ে আয় করার উপায় হিসেবে voice service কি practical?", a: "হ্যাঁ, voiceover gig, narration এবং short-video service থেকে আয় সম্ভব।" }
      ],
      incomeAngles: ["Voiceover gig package", "Local Bengali narration service"],
      youtubeAngles: ["Faceless ভিডিও narration", "Shorts voice pipeline"],
      internalLinks: [
        { href: "elevenlabs-bangla-voice.html", text: "ElevenLabs বাংলা voice guide" },
        { href: "ai-tools-for-youtube-bangladesh.html", text: "AI tools for YouTube Bangladesh" },
        { href: "free-ai-tools-2026-bangladesh.html", text: "free AI tools 2026 Bangladesh" }
      ]
    },
    "kling-ai": {
      primaryKeyword: "Kling AI Bangladesh review বাংলা",
      metaDescription: "Kling AI Bangladesh review বাংলা: quality, free vs paid, BDT context, VPN requirement এবং YouTube use-case বিশ্লেষণ।",
      intentTitle: "Kling AI Bangladesh review বাংলা",
      quickAnswer: ["Kling AI টেক্সট-টু-ভিডিও কাজে ভালো ফল দেয়।", "বাংলাদেশি creatorদের জন্য short-form ভিডিও workflow-এ useful।"],
      bdUsage: ["বাংলাদেশ থেকে setup ও usage সম্ভব।", "Reference + prompt দিলে output ভালো হয়।"],
      paymentContext: ["Free tier থাকে", "High usage-এ paid USD billing", "কার্ড পেমেন্ট প্রধান"],
      vpnContext: ["সাধারণত VPN লাগে না।", "Queue সময় server load অনুযায়ী বাড়তে পারে।"],
      steps: ["Goal ঠিক করুন", "Prompt + motion নির্দেশনা দিন", "Variations test করুন", "Final cut publish করুন"],
      faq: [
        { q: "Kling AI Bangladesh review বাংলা অনুযায়ী verdict কী?", a: "Quality ভালো, তবে prompt iteration করলে consistency বেশি পাওয়া যায়।" },
        { q: "AI tools for Bangladeshi YouTubers হিসেবে Kling AI কি useful?", a: "হ্যাঁ, short video concept দ্রুত তৈরি করা যায়।" },
        { q: "Kling AI কি ফ্রি?", a: "Limited free usage সাধারণত থাকে; নিয়মিত production-এ paid plan ভালো।" }
      ],
      incomeAngles: ["Short ভিডিও ad creative service"],
      youtubeAngles: ["YouTube shorts visual", "Intro/B-roll style generation"],
      internalLinks: [
        { href: "ai-tools-for-youtube-bangladesh.html", text: "AI tools for YouTube Bangladesh" },
        { href: "ai-image-generator-free-bangladesh.html", text: "AI image generator free Bangladesh" },
        { href: "midjourney-bangladesh-free.html", text: "Midjourney vs alternatives" }
      ]
    },
    gamma: {
      primaryKeyword: "Gamma AI presentation বাংলা tutorial",
      metaDescription: "Gamma AI presentation বাংলা tutorial: BD setup, pricing context, VPN reality এবং freelance deck delivery workflow একসাথে জানুন।",
      intentTitle: "Gamma AI presentation বাংলা tutorial",
      quickAnswer: ["Gamma AI দিয়ে দ্রুত presentation deck বানানো যায়।", "Freelancer-দের client proposal তৈরিতে সময় বাঁচায়।"],
      bdUsage: ["বাংলাদেশ থেকে web-এ ব্যবহার সম্ভব।", "বাংলা কনটেন্ট ইনপুট দিয়ে structure পাওয়া যায়।"],
      paymentContext: ["Basic plan দিয়ে শুরু করা যায়", "Premium feature-এ USD billing", "BDT conversion ধরে service rate ঠিক করুন"],
      vpnContext: ["সাধারণত VPN লাগে না।", "Export/share issue হলে browser permission check করুন।"],
      steps: ["Outline লিখুন", "Slide prompt দিন", "Design customize করুন", "Proofread করে export দিন"],
      faq: [
        { q: "Gamma AI presentation বাংলা tutorial শুরু করব কীভাবে?", a: "ছোট outline দিয়ে শুরু করে slide-by-slide refine করুন।" },
        { q: "Gamma দিয়ে freelancer income বাড়ানো যায়?", a: "হ্যাঁ, pitch deck service দ্রুত deliver করে বেশি client handle করা যায়।" },
        { q: "বাংলাদেশে AI দিয়ে আয় করার উপায় হিসেবে presentation service কেমন?", a: "Startup/SME ক্লায়েন্টদের জন্য high-demand service হতে পারে।" }
      ],
      incomeAngles: ["Pitch deck package", "Monthly presentation support"],
      youtubeAngles: [],
      internalLinks: [
        { href: "bangladeshe-ai-tools-kibhabe-bebohar-korben.html", text: "বাংলাদেশে AI tutorial hub" },
        { href: "ai-tools-for-freelancers-bangladesh.html", text: "AI tools freelancer Bangladesh income" },
        { href: "best-ai-tools-for-content-creators-bangladesh.html", text: "AI tools for content creators" }
      ]
    }
  };

  function fallbackSeo(tool) {
    return {
      primaryKeyword: `${tool.name} বাংলাদেশে কীভাবে ব্যবহার করবেন`,
      metaDescription: `${tool.name} বাংলাদেশে কীভাবে ব্যবহার করবেন, payment, VPN এবং practical use-case বাংলায় জানুন।`,
      intentTitle: `${tool.name} — বাংলাদেশে ব্যবহার গাইড`,
      quickAnswer: [`${tool.name} বাংলাদেশে ব্যবহার করা যায়।`, "শুরুতে ফ্রি/বেসিক usage দিয়ে workflow সেট করুন।"],
      bdUsage: ["বাংলাদেশ থেকে setup ও usage সাধারণত সহজ।", "Prompt/template optimize করলে ভালো output পাওয়া যায়।"],
      paymentContext: ["USD plan থাকলে BDT conversion ধরে বাজেট করুন।", "কার্ড পেমেন্ট বেশি কমন।"],
      vpnContext: ["সাধারণত VPN ছাড়া ব্যবহার করা যায়।", "Region issue হলে browser/network check করুন।"],
      steps: ["Account setup", "Small test use", "Workflow optimize", "Client কাজে ব্যবহার"],
      faq: [
        { q: `${tool.name} বাংলাদেশ থেকে কাজ করে?`, a: "সাধারণভাবে হ্যাঁ, তবে plan/region অনুযায়ী কিছু ফিচার বদলাতে পারে।" },
        { q: `${tool.name} ব্যবহার করতে VPN লাগে?`, a: "বেশিরভাগ ক্ষেত্রে লাগে না।" },
        { q: "বাংলাদেশে AI দিয়ে আয় করার উপায় কী?", a: "নিজের skill অনুযায়ী service package করে freelancing/client কাজ বাড়ানো যায়।" }
      ],
      incomeAngles: ["Service delivery time কমিয়ে আয় বাড়ানো"],
      youtubeAngles: tool.category === "image" ? ["YouTube visual workflow-এ asset তৈরি করা যায়"] : [],
      internalLinks: (catLinks[tool.category] || []).slice(0, 3)
    };
  }

  function seoConfig(tool, slug) {
    return LONG_TAIL_SEO_MAP[slug] || fallbackSeo(tool);
  }

  function mergeLinks(seo, category) {
    const all = [...baseLinks, ...(Array.isArray(seo.internalLinks) ? seo.internalLinks : []), ...(catLinks[category] || [])];
    return all.filter((x, i, a) => x && x.href && a.findIndex((y) => y.href === x.href) === i).slice(0, 6);
  }

  function renderTextBlock(title, rows) {
    if (!Array.isArray(rows) || !rows.length) return "";
    return `<section class="detail-seo-block"><h2>${esc(title)}</h2>${rows.map((r) => `<p>${esc(r)}</p>`).join("")}</section>`;
  }

  function renderStepsBlock(steps) {
    if (!Array.isArray(steps) || !steps.length) return "";
    return `<section class="detail-seo-block"><h2>Step-by-step ব্যবহার গাইড</h2><ol class="detail-seo-steps">${steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol></section>`;
  }

  function renderAnglesBlock(income, yt) {
    const hasIncome = Array.isArray(income) && income.length;
    const hasYt = Array.isArray(yt) && yt.length;
    if (!hasIncome && !hasYt) return "";
    return `<section class="detail-seo-block"><h2>প্র্যাকটিক্যাল ব্যবহার ও আয়ের দিক</h2>${hasIncome ? `<h3>বাংলাদেশে AI দিয়ে আয় করার উপায়</h3><ul class="detail-seo-list">${income.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}${hasYt ? `<h3>AI tools for Bangladeshi YouTubers</h3><ul class="detail-seo-list">${yt.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}</section>`;
  }

  function renderFaqBlock(faq) {
    if (!Array.isArray(faq) || !faq.length) return "";
    return `<section class="detail-seo-block"><h2>প্রশ্নোত্তর (FAQ)</h2><div class="detail-seo-faq">${faq.map((i) => `<article class="detail-seo-faq-item"><h3>${esc(i.q)}</h3><p>${esc(i.a)}</p></article>`).join("")}</div></section>`;
  }

  function renderLinksBlock(links, slug) {
    return `<section class="detail-seo-block"><h2>আরও রিসোর্স</h2><ul class="detail-seo-links">${links.map((l) => `<li><a href="${esc(l.href)}">${esc(l.text)}</a></li>`).join("")}</ul></section><section class="detail-seo-block detail-seo-cta"><h2>আরও টুলস এবং লিস্টিং</h2><p>বাংলাদেশে AI tools, price ও payment context দেখতে হোমপেজে যান অথবা নতুন টুল সাবমিট করুন।</p><div class="detail-seo-cta-actions"><a class="btn btn-primary" href="index.html" data-cluster-cta="index">সব টুলস দেখুন →</a><a class="btn btn-ghost" href="submit.html" data-cluster-cta="submit">টুল সাবমিট করুন →</a></div><p class="detail-seo-note">পেজ স্লাগ: <strong>${esc(slug)}</strong></p></section>`;
  }

  function renderSeoSection(tool, slug, seo) {
    if (!refs.detailSeoSection) return;
    const links = mergeLinks(seo, tool.category);
    refs.detailSeoSection.innerHTML = `<article class="detail-seo-article"><h2 class="detail-seo-intent">${esc(seo.intentTitle)}</h2>${renderTextBlock("Quick answer", seo.quickAnswer)}${renderTextBlock("বাংলাদেশে ব্যবহারযোগ্যতা", seo.bdUsage)}${renderTextBlock("Payment/BDT context", seo.paymentContext)}${renderTextBlock("VPN requirement", seo.vpnContext)}${renderStepsBlock(seo.steps)}${renderAnglesBlock(seo.incomeAngles, seo.youtubeAngles)}${renderFaqBlock(seo.faq)}${renderLinksBlock(links, slug)}</article>`;
  }

  function renderFaqSchema(slug, faq) {
    if (!refs.detailFaqSchema || !Array.isArray(faq) || !faq.length) return;
    refs.detailFaqSchema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      url: `https://banglaaiguide.com/tool-detail.html?tool=${encodeURIComponent(slug)}`,
      inLanguage: "bn-BD",
      mainEntity: faq.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } }))
    });
  }

  function applySeoMeta(slug, seo) {
    document.title = `${seo.primaryKeyword} | বাংলা AI গাইড`;
    ensureMetaTag("description", seo.metaDescription);
    ensureCanonical(`https://banglaaiguide.com/tool-detail.html?tool=${encodeURIComponent(slug)}`);
  }

  function bindClusterCta(pageSlug) {
    document.addEventListener("click", (e) => {
      const cta = e.target.closest("[data-cluster-cta]");
      if (!cta) return;
      const t = cta.getAttribute("data-cluster-cta");
      if (t === "index" || t === "submit") trackClusterCta(pageSlug, t);
    });
  }

  function renderRelatedTools(currentTool) {
    const related = data.filter((t) => t.category === currentTool.category && t.name !== currentTool.name).slice(0, 3);
    if (!related.length) {
      refs.relatedGrid.innerHTML = '<p class="rating">এই ক্যাটাগরিতে আরও টুল যোগ করা হবে।</p>';
      return;
    }
    refs.relatedGrid.innerHTML = related.map((tool) => {
      const detailUrl = `tool-detail.html?tool=${encodeURIComponent(toSlug(tool.name))}`;
      const fb = getFacebookShareUrl(tool);
      const wa = getWhatsAppShareUrl(tool);
      const copyUrl = tool.direct_url || tool.affiliate_url || getToolLandingUrl(tool);
      return `
        <article class="tool-card">
          <div class="tool-header">
            <div class="tool-title-wrap">
              ${renderToolLogo(tool)}
              <h3 class="tool-title">${esc(tool.name)}</h3>
            </div>
            <span class="category-tag">${esc(categoryLabelMap[tool.category] || "অন্যান্য")}</span>
          </div>
          <p class="tool-desc">${esc(tool.description_bn || "")}</p>
          <div class="tool-meta">
            <p class="rating">★ ${Number(tool.rating || 0).toLocaleString("bn-BD", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</p>
            <a class="btn btn-ghost" href="${esc(detailUrl)}">দেখুন →</a>
          </div>
          <div class="share-row" aria-label="শেয়ার অপশন">
            <a class="share-btn" href="${esc(fb)}" target="_blank" rel="noopener noreferrer" aria-label="Facebook এ শেয়ার করুন" title="Facebook এ শেয়ার করুন">f</a>
            <a class="share-btn" href="${esc(wa)}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp এ শেয়ার করুন" title="WhatsApp এ শেয়ার করুন">wa</a>
            <button type="button" class="share-btn" data-share-action="copy" data-copy-url="${esc(copyUrl)}" aria-label="লিংক কপি করুন" title="লিংক কপি করুন">⧉</button>
          </div>
        </article>
      `;
    }).join("");

    attachToolLogoHandlers(refs.relatedGrid);
  }

  function renderDetailResources(tool) {
    if (!refs.detailResourcesGrid) return;
    const shared = [
      { href: "ai-tools-bangladesh-bengali.html", text: "Bangla AI tools directory" },
      { href: "ai-tools-bdt-price-2026-bangladesh.html", text: "AI tools BDT price 2026" },
      { href: "bkash-diye-ai-tools-kena-jay.html", text: "bKash দিয়ে AI tools কেনা যায়" },
      { href: "vpn-chara-ai-tools-bangladesh.html", text: "VPN ছাড়া AI tools Bangladesh" },
    ];
    const selected = catLinks[tool.category] || [];
    refs.detailResourcesGrid.innerHTML = [...selected, ...shared]
      .filter((r, i, a) => a.findIndex((x) => x.href === r.href) === i)
      .slice(0, 6)
      .map((r) => `<a class="resource-card" href="${esc(r.href)}">${esc(r.text)}</a>`)
      .join("");
  }

  function renderNotFound() {
    refs.breadcrumb.innerHTML = '<a href="index.html">হোম</a> <span>/</span> <span>টুল পাওয়া যায়নি</span>';
    refs.detailContent.innerHTML = '<div class="empty-state"><p>দুঃখিত, এই টুলটি পাওয়া যায়নি।</p><a class="btn btn-primary" href="index.html">হোমে ফিরে যান</a></div>';
    refs.relatedGrid.innerHTML = "";
    if (refs.detailSeoSection) refs.detailSeoSection.innerHTML = "";
    if (refs.detailFaqSchema) refs.detailFaqSchema.textContent = "";
  }

  function renderTool(tool) {
    const slug = toSlug(tool.name);
    const seo = seoConfig(tool, slug);
    const categoryLabel = categoryLabelMap[tool.category] || "অন্যান্য";
    const priceInfo = getPriceInfo(tool);
    const rating = Number(tool.rating || 0).toLocaleString("bn-BD", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const verifiedText = esc(tool.verified || "মার্চ ২০২৬");
    const pricingUrl = esc(tool.pricing_url || tool.direct_url || tool.affiliate_url || "#");
    const actionUrl = tool.affiliate_url || tool.direct_url || "#";

    refs.breadcrumb.innerHTML = `<a href="index.html">হোম</a><span>&gt;</span><a href="index.html#categoryTabs">${esc(categoryLabel)}</a><span>&gt;</span><span>${esc(tool.name)}</span>`;
    refs.detailContent.innerHTML = `<div class="tool-header detail-title-row"><div class="tool-title-wrap"><h1 class="detail-title" itemprop="name">${esc(tool.name)}</h1></div><span class="category-tag">${esc(categoryLabel)}</span></div><div class="badges detail-badges">${getBadges(tool)}</div><p class="detail-description" itemprop="description">${esc(tool.description_bn || "")}</p><blockquote class="review-block detail-review"><p>"${esc(tool.review_bn || "রিভিউ শিগগিরই যোগ হবে")}"</p><p class="review-source">— BanglaAIGuide পাঠক</p></blockquote><div class="detail-meta"><div><p class="price">${esc(priceInfo.usdLabel)} | ${esc(priceInfo.bdtLabel)}</p><a class="pricing-link" href="${pricingUrl}" target="_blank" rel="noopener noreferrer">💰 দাম দেখুন</a><span class="verified-date">🗓️ যাচাই: ${verifiedText}</span></div><p class="rating">★ ${rating}</p></div><a class="btn btn-primary detail-cta" href="${esc(actionUrl)}" target="_blank" rel="nofollow noopener noreferrer" data-outbound-affiliate="true">এখনই ব্যবহার করুন →</a><meta itemprop="applicationCategory" content="${esc(categoryLabel)}" /><meta itemprop="operatingSystem" content="Web" /><link itemprop="url" href="${esc(tool.direct_url || actionUrl)}" />`;

    applySeoMeta(slug, seo);
    renderSeoSection(tool, slug, seo);
    renderFaqSchema(slug, seo.faq);
    renderRelatedTools(tool);
    renderDetailResources(tool);
    bindClusterCta(slug);
  }

  function init() {
    bindMenuEvents();
    bindShareEvents();
    if (!Array.isArray(data) || !data.length) return renderNotFound();
    const toolSlug = new URLSearchParams(window.location.search).get("tool");
    if (!toolSlug) return renderNotFound();
    const slug = toolSlug.toLowerCase();
    const tool = data.find((item) => toSlug(item.name) === slug);
    if (!tool) return renderNotFound();
    renderTool(tool);
  }

  init();
})();

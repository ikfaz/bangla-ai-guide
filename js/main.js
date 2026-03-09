(() => {
  const data = Array.isArray(window.tools)
    ? window.tools
    : (typeof tools !== "undefined" && Array.isArray(tools) ? tools : []);

  const conversionRate = typeof window.USD_TO_BDT === "number"
    ? window.USD_TO_BDT
    : (typeof USD_TO_BDT !== "undefined" && typeof USD_TO_BDT === "number" ? USD_TO_BDT : 110);

  const state = {
    searchQuery: "",
    activeCategory: "all",
    paymentFilter: "all",
    bdFilter: "all",
    priceFilter: "all",
    visibleCount: 12,
    language: "bn",
    showcaseMode: "popular",
  };

  const refs = {
    searchInput: document.getElementById("searchInput"),
    categoryTabList: document.getElementById("categoryTabList"),
    resultsCount: document.getElementById("resultsCount"),
    toolsGrid: document.getElementById("toolsGrid"),
    trendingGrid: document.getElementById("trendingGrid"),
    hamburgerBtn: document.getElementById("hamburgerBtn"),
    mobileMenu: document.getElementById("mobileMenu"),
    cookieBanner: document.getElementById("cookieBanner"),
    cookieAcceptBtn: document.getElementById("cookieAcceptBtn"),
    loadMoreBtn: document.getElementById("loadMoreBtn"),
    affiliateDisclaimer: document.getElementById("affiliateDisclaimer"),
    affiliateCloseBtn: document.getElementById("affiliateCloseBtn"),
  };

  const mobileBreakpoint = window.matchMedia("(max-width: 840px)");
  const cookieConsentKey = "banglaAiGuideCookieAccepted";
  const affiliateDisclaimerKey = "banglaAiGuideAffiliateDisclaimerHidden";
  const languagePreferenceKey = "banglaAiGuideLanguage";
  const PAGE_SIZE = 12;
  let searchDebounceTimer = null;
  let renderRequestId = 0;

  const translations = {
    bn: {
      nav_view_tools: "টুলস দেখুন",
      nav_categories: "ক্যাটাগরি",
      nav_newsletter: "নিউজলেটার",
      nav_submit_tool: "টুল সাবমিট করুন",
      affiliate_disclaimer: "⚠️ এই সাইটে কিছু লিংক affiliate — আপনার কোনো অতিরিক্ত খরচ ছাড়াই আমরা কমিশন পেতে পারি।",
      hero_badge: "বাংলাদেশের AI টুল ডিরেক্টরি",
      hero_strip: "বাংলায় কিউরেটেড AI টুলস, রিভিউ, আর ব্যবহার গাইড",
      hero_title: "বাংলাদেশের জন্য দরকারি সব <em>AI টুল</em>, এক জায়গায়",
      hero_subtext: "যে AI টুলগুলো বাংলাদেশ থেকে কাজ করে, যেগুলোর ফ্রি অপশন আছে, আর যেগুলো দিয়ে সত্যি কাজ এগোয়, সেগুলো দ্রুত খুঁজে দেখুন।",
      hero_metric_tools: "কিউরেটেড টুল",
      hero_metric_bd_strong: "BD Ready",
      hero_metric_bd: "বাংলাদেশ থেকে ব্যবহারযোগ্য",
      hero_metric_update_strong: "Weekly",
      hero_metric_update: "রিভিউ আর আপডেট",
      hero_search_placeholder: "টুল খুঁজুন… যেমন: ChatGPT, ভিডিও, কোডিং",
      hero_search_cta: "খুঁজুন",
      hero_browse_cta: "টুলস ব্রাউজ করুন",
      hero_trust_label: "বিশ্বস্ত টুল কাভারেজ",
      category_all: "সব টুলস",
      category_writing: "রাইটিং",
      category_image: "ইমেজ",
      category_video: "ভিডিও",
      category_coding: "কোডিং",
      category_marketing: "মার্কেটিং",
      category_productivity: "প্রোডাক্টিভিটি",
      category_free_tools: "ফ্রি টুলস",
      trending_kicker: "এখন জনপ্রিয়",
      trending_title: "🔥 ট্রেন্ডিং AI টুলস",
      trending_title_short: "জনপ্রিয় টুলস",
      trending_recent: "সদ্য যোগ হয়েছে",
      trending_copy: "এই মুহূর্তে সবচেয়ে বেশি খোঁজা এবং জনপ্রিয় টুলগুলো দেখুন।",
      showcase_categories_title: "সবচেয়ে জনপ্রিয় ক্যাটাগরি",
      showcase_cat_1: "রাইটিং ও এডিটিং",
      showcase_cat_2: "ডিজাইন ও ক্রিয়েটিভ",
      showcase_cat_3: "ভিডিও টুলস",
      showcase_cat_4: "টেকনোলজি ও কোডিং",
      showcase_cat_5: "মার্কেটিং ও গ্রোথ",
      showcase_cat_6: "ওয়ার্কফ্লো অটোমেশন",
      showcase_cat_7: "ফ্রি টুলস",
      showcase_score: "স্কোর",
      showcase_access: "BD",
      filter_payment_title: "পেমেন্ট পদ্ধতি",
      filter_bd_title: "বাংলাদেশ ফিল্টার",
      filter_price_title: "মূল্য (টাকায়)",
      filter_all: "সব",
      filter_payment_bkash: "bKash সাপোর্ট",
      filter_payment_card: "ডেবিট/ক্রেডিট কার্ড",
      filter_payment_free: "সম্পূর্ণ ফ্রি",
      filter_payment_bkash_short: "bKash",
      filter_payment_card_short: "কার্ড",
      filter_payment_free_short: "ফ্রি",
      filter_bd_works: "✅ BD থেকে কাজ করে",
      filter_bd_no_vpn: "🔵 VPN ছাড়া",
      filter_bd_vpn: "⚠️ VPN লাগে",
      filter_bd_works_short: "BD",
      filter_bd_no_vpn_short: "VPN ছাড়া",
      filter_bd_vpn_short: "VPN লাগে",
      filter_price_free: "ফ্রি ৳০",
      filter_price_budget: "বাজেট ৳১-৳৫০০",
      filter_price_mid: "মিড ৳৫০০-৳২০০০",
      filter_price_premium: "প্রিমিয়াম ৳২০০০+",
      filter_price_free_short: "৳০",
      filter_price_budget_short: "৳১-৳৫০০",
      filter_price_mid_short: "৳৫০০-৳২০০০",
      filter_price_premium_short: "৳২০০০+",
      sponsor_title: "এখানে বিজ্ঞাপন দিন",
      sponsor_copy: "প্রতি মাসে ৫০,০০০+ বাংলাদেশি AI ব্যবহারকারীর কাছে পৌঁছান।",
      sponsor_cta: "যোগাযোগ করুন →",
      directory_kicker: "AI ডিরেক্টরি",
      directory_title: "প্রয়োজন, দাম, আর ক্যাটাগরি অনুযায়ী টুল খুঁজুন",
      directory_copy: "সার্চ-ফার্স্ট ডিসকভারি, পরিষ্কার আধুনিক কার্ড, আর বাংলাদেশ-ফ্রেন্ডলি ফিল্টারিং।",
      grid_title: "সব AI টুলস",
      sort_label: "↕ জনপ্রিয়তা অনুযায়ী",
      load_more: "আরও টুলস দেখুন",
      seo_kicker: "ট্রেন্ডিং ক্যাটাগরি",
      seo_title: "ট্রেন্ডিং AI ক্যাটাগরি",
      seo_copy: "বাংলাদেশি ব্যবহারকারীরা এখন যে AI category আর use-case সবচেয়ে বেশি খুঁজছেন, সেগুলো এখানে একসাথে দেখুন।",
      trend_cat_marketing: "মার্কেটিং",
      trend_cat_productivity: "প্রোডাক্টিভিটি",
      trend_cat_design: "ডিজাইন",
      trend_cat_video: "ভিডিও",
      trend_cat_research: "রিসার্চ",
      trend_cat_text_to_image: "টেক্সট-টু-ইমেজ",
      trend_cat_coding: "কোডিং",
      trend_cat_free: "ফ্রি টুলস",
      newsletter_chip: "📬 সাপ্তাহিক নিউজলেটার",
      newsletter_title: "বাংলা AI নিউজলেটারে যোগ দিন",
      newsletter_copy: "বাংলায় নতুন AI টুলস আর টিউটোরিয়াল সবার আগে জানুন।",
      newsletter_placeholder: "আপনার ইমেইল",
      newsletter_cta: "প্রতি সপ্তাহে AI টুলস পান",
      newsletter_note: "ফ্রি নিউজলেটার। নতুন AI tools, বাংলা রিভিউ, আর বাংলাদেশি ব্যবহার টিপস প্রতি সপ্তাহে ইনবক্সে পাবেন।",
      resources_title: "বাংলাদেশ AI রিসোর্সেস",
      resources_intro: "লো আর মিডিয়াম কম্পিটিশন কুয়েরির জন্য আমাদের কিউরেটেড গাইডগুলো নিচে দেখুন।",
      resource_1: "বাংলা AI গাইড (Pillar)",
      resource_2: "AI tools BDT price 2026",
      resource_3: "bKash দিয়ে AI tools কেনা যায়",
      resource_4: "VPN ছাড়া AI tools Bangladesh",
      resource_5: "ChatGPT বাংলাদেশ থেকে ব্যবহার",
      resource_6: "Cursor AI বাংলা",
      resource_7: "ElevenLabs বাংলা ভয়েস",
      resource_8: "Midjourney Bangladesh free",
      resource_9: "বাংলাদেশে AI tools কীভাবে ব্যবহার করবেন",
      resource_10: "AI tools for freelancers Bangladesh",
      resource_11: "best AI tools for content creators",
      resource_12: "free AI tools 2026 Bangladesh",
      resource_13: "AI image generator free Bangladesh",
      resource_14: "best AI coding tools for beginners",
      resource_15: "AI tools for YouTube Bangladesh",
      footer_copy: "© ২০২৬ বাংলা AI গাইড · বাংলাদেশের জন্য তৈরি",
      footer_submit: "টুল সাবমিট",
      footer_ads: "বিজ্ঞাপন",
      footer_privacy: "প্রাইভেসি",
      footer_terms: "শর্তাবলী",
      footer_disclaimer: "ডিসক্লেইমার",
      footer_contact: "যোগাযোগ",
      label_llm: "LLM",
      label_image: "ইমেজ/ভিডিও",
      label_coding: "কোডিং",
      label_productivity: "প্রোডাক্টিভিটি",
      app_llm: "AI চ্যাটবট",
      app_image: "ইমেজ ও ভিডিও AI",
      app_coding: "ডেভেলপার টুল",
      app_productivity: "প্রোডাক্টিভিটি অ্যাপ",
      tag_free: "ফ্রি",
      tag_freemium: "ফ্রিমিয়াম",
      tag_bd_friendly: "বাংলাদেশে ব্যবহারযোগ্য",
      tag_ai_tool: "AI টুল",
      badge_bd_yes: "✅ BD-তে কাজ করে",
      badge_bd_limited: "❌ BD-তে সীমিত",
      badge_vpn_no: "🔵 VPN লাগে না",
      badge_vpn_maybe: "⚠️ VPN লাগতে পারে",
      badge_payment_card: "💳 কার্ড",
      badge_payment_bkash: "💚 bKash",
      badge_payment_free: "🆓 ফ্রি",
      btn_view_tool: "টুল দেখুন",
      btn_visit_tool: "টুলে যান",
      empty_state: "কোনো টুল পাওয়া যায়নি। ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।",
      empty_reset: "সব ফিল্টার রিসেট করুন",
      data_error: "ডেটা লোড হয়নি। `js/tools-data.js` ফাইলটি ঠিকভাবে যুক্ত আছে কি না দেখুন।",
      results_found: "টি টুলস পাওয়া গেছে",
      desc_llm: "লেখা, গবেষণা, আর দৈনন্দিন প্রোডাক্টিভিটির জন্য AI সহকারী।",
      desc_image: "ইমেজ, ডিজাইন, আর ভিডিও ওয়ার্কফ্লোর জন্য AI টুল।",
      desc_coding: "ডেভেলপমেন্ট, ডিবাগিং, আর দ্রুত শিপিংয়ের জন্য AI কোডিং সহকারী।",
      desc_productivity: "অটোমেশন, ডকুমেন্ট, আর টিম ওয়ার্কফ্লোর জন্য AI টুল।",
    },
    en: {
      nav_view_tools: "Browse Tools",
      nav_categories: "Categories",
      nav_newsletter: "Newsletter",
      nav_submit_tool: "Submit Tool",
      affiliate_disclaimer: "⚠️ Some links on this site are affiliate links. We may earn a commission at no extra cost to you.",
      hero_badge: "Bangladesh AI Tool Directory",
      hero_strip: "Curated AI tools, reviews, and practical guides in Bangla",
      hero_title: "Everything you need in <em>AI tools</em> for Bangladesh, in one place",
      hero_subtext: "Quickly find the AI tools that work from Bangladesh, include free options, and genuinely help you get work done.",
      hero_metric_tools: "Curated tools",
      hero_metric_bd_strong: "BD Ready",
      hero_metric_bd: "Usable from Bangladesh",
      hero_metric_update_strong: "Weekly",
      hero_metric_update: "Reviews and updates",
      hero_search_placeholder: "Search tools… e.g. ChatGPT, video, coding",
      hero_search_cta: "Search",
      hero_browse_cta: "Browse Tools",
      hero_trust_label: "TRUSTED TOOL COVERAGE",
      category_all: "All Tools",
      category_writing: "Writing",
      category_image: "Image",
      category_video: "Video",
      category_coding: "Coding",
      category_marketing: "Marketing",
      category_productivity: "Productivity",
      category_free_tools: "Free Tools",
      trending_kicker: "Popular now",
      trending_title: "🔥 Trending AI Tools",
      trending_title_short: "Popular Tools",
      trending_recent: "Recently Added",
      trending_copy: "Explore the most searched and popular tools right now.",
      showcase_categories_title: "Most Popular Categories",
      showcase_cat_1: "Writing & Editing",
      showcase_cat_2: "Design & Creative",
      showcase_cat_3: "Video Tools",
      showcase_cat_4: "Technology & Coding",
      showcase_cat_5: "Marketing & Growth",
      showcase_cat_6: "Workflow Automation",
      showcase_cat_7: "Free Tools",
      showcase_score: "Score",
      showcase_access: "BD",
      filter_payment_title: "Payment Options",
      filter_bd_title: "Bangladesh Filters",
      filter_price_title: "Price (in BDT)",
      filter_all: "All",
      filter_payment_bkash: "bKash Support",
      filter_payment_card: "Debit/Credit Card",
      filter_payment_free: "Completely Free",
      filter_payment_bkash_short: "bKash",
      filter_payment_card_short: "Card",
      filter_payment_free_short: "Free",
      filter_bd_works: "✅ Works from BD",
      filter_bd_no_vpn: "🔵 No VPN",
      filter_bd_vpn: "⚠️ Needs VPN",
      filter_bd_works_short: "BD",
      filter_bd_no_vpn_short: "No VPN",
      filter_bd_vpn_short: "VPN",
      filter_price_free: "Free ৳0",
      filter_price_budget: "Budget ৳1-৳500",
      filter_price_mid: "Mid ৳500-৳2000",
      filter_price_premium: "Premium ৳2000+",
      filter_price_free_short: "৳0",
      filter_price_budget_short: "৳1-৳500",
      filter_price_mid_short: "৳500-৳2000",
      filter_price_premium_short: "৳2000+",
      sponsor_title: "Advertise Here",
      sponsor_copy: "Reach 50,000+ monthly AI users from Bangladesh.",
      sponsor_cta: "Contact Us →",
      directory_kicker: "AI directory",
      directory_title: "Find tools by fit, price, and category",
      directory_copy: "Search-first discovery with clean modern cards and Bangladesh-friendly filtering.",
      grid_title: "All AI Tools",
      sort_label: "↕ Sort by popularity",
      load_more: "Load more tools",
      seo_kicker: "Trending Categories",
      seo_title: "Trending AI Categories",
      seo_copy: "Explore the AI categories and use-cases people in Bangladesh are searching for the most right now.",
      trend_cat_marketing: "Marketing",
      trend_cat_productivity: "Productivity",
      trend_cat_design: "Design",
      trend_cat_video: "Video",
      trend_cat_research: "Research",
      trend_cat_text_to_image: "Text-To-Image",
      trend_cat_coding: "Coding",
      trend_cat_free: "Free Tools",
      newsletter_chip: "📬 Weekly Newsletter",
      newsletter_title: "Join the Bangla AI Newsletter",
      newsletter_copy: "Get the newest AI tools and tutorials in Bangla.",
      newsletter_placeholder: "Your email address",
      newsletter_cta: "Get AI Tools Weekly",
      newsletter_note: "Free newsletter. Get new AI tools, Bangla reviews, and Bangladesh usage tips in your inbox every week.",
      resources_title: "Bangladesh AI Resources",
      resources_intro: "Explore our curated guides targeting low and medium competition search queries.",
      resource_1: "Bangla AI Guide (Pillar)",
      resource_2: "AI tools BDT price 2026",
      resource_3: "Can you buy AI tools with bKash?",
      resource_4: "AI tools in Bangladesh without VPN",
      resource_5: "Use ChatGPT from Bangladesh",
      resource_6: "Cursor AI in Bangla",
      resource_7: "ElevenLabs Bangla voice",
      resource_8: "Midjourney Bangladesh free",
      resource_9: "How to use AI tools in Bangladesh",
      resource_10: "AI tools for freelancers in Bangladesh",
      resource_11: "Best AI tools for content creators",
      resource_12: "Free AI tools 2026 Bangladesh",
      resource_13: "Free AI image generator Bangladesh",
      resource_14: "Best AI coding tools for beginners",
      resource_15: "AI tools for YouTube Bangladesh",
      footer_copy: "© 2026 Bangla AI Guide · Built for Bangladesh",
      footer_submit: "Submit Tool",
      footer_ads: "Advertising",
      footer_privacy: "Privacy",
      footer_terms: "Terms",
      footer_disclaimer: "Disclaimer",
      footer_contact: "Contact",
      label_llm: "LLM",
      label_image: "Image/Video",
      label_coding: "Coding",
      label_productivity: "Productivity",
      app_llm: "AI Chatbot",
      app_image: "Image and Video AI",
      app_coding: "Developer Tool",
      app_productivity: "Productivity Application",
      tag_free: "Free",
      tag_freemium: "Freemium",
      tag_bd_friendly: "Bangladesh Friendly",
      tag_ai_tool: "AI Tool",
      badge_bd_yes: "✅ Works in BD",
      badge_bd_limited: "❌ Limited in BD",
      badge_vpn_no: "🔵 No VPN needed",
      badge_vpn_maybe: "⚠️ May need VPN",
      badge_payment_card: "💳 Card",
      badge_payment_bkash: "💚 bKash",
      badge_payment_free: "🆓 Free",
      btn_view_tool: "View Tool",
      btn_visit_tool: "Visit Tool",
      empty_state: "No tools matched your filters. Try changing the filters and search again.",
      empty_reset: "Reset all filters",
      data_error: "Tool data did not load. Check whether `js/tools-data.js` is linked correctly.",
      results_found: "tools found",
      desc_llm: "AI assistant for writing, research, and everyday productivity.",
      desc_image: "AI tool for image, design, and video workflows.",
      desc_coding: "AI coding assistant for development, debugging, and faster shipping.",
      desc_productivity: "AI tool for automation, documents, and team workflows.",
    },
  };

  function bnNum(value) {
    return Number(value).toLocaleString("bn-BD");
  }

  function localizedNum(value) {
    const locale = state.language === "en" ? "en-US" : "bn-BD";
    return Number(value).toLocaleString(locale);
  }

  function t(key) {
    return translations[state.language]?.[key] || translations.bn[key] || key;
  }

  function getLocalizedCategoryLabel(category) {
    return t(`label_${category}`) || category;
  }

  function getHomepageCategoryLabel(category) {
    return t(`category_${category}`) || getLocalizedCategoryLabel(category) || category;
  }

  function getLocalizedApplicationCategory(category) {
    return t(`app_${category}`) || "AI Application";
  }

  function getGenericToolDescription(tool) {
    return t(`desc_${tool.category}`) || t("tag_ai_tool");
  }

  function getToolCategorySignals(tool) {
    return [
      tool.name,
      tool.category,
      tool.details,
      tool.description_bn,
      tool.review_bn,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  }

  function getHomepageCategory(tool) {
    const rawCategory = String(tool.category || "").toLowerCase();
    const signals = getToolCategorySignals(tool);

    if (rawCategory === "coding") {
      return "coding";
    }

    if (rawCategory === "llm") {
      if (/\bcopy|marketing|ads|email campaign|landing page|content platform|seo/.test(signals)) {
        return "marketing";
      }
      return "writing";
    }

    if (rawCategory === "image") {
      if (/video|text-to-video|image-to-video|animation|editor|gen-2|gen-4|runway|kling/.test(signals)) {
        return "video";
      }
      return "image";
    }

    if (rawCategory === "productivity") {
      if (/marketing|brand voice|campaign|ad copy|content platform|jasper/.test(signals)) {
        return "marketing";
      }

      if (/video|podcast|voice|audio|music|speech|transcription|voiceover|youtube|descript|elevenlabs|otter|suno/.test(signals)) {
        return "video";
      }

      if (/design|presentation|deck|slide|image/.test(signals) && /gamma/.test(signals)) {
        return "productivity";
      }

      return "productivity";
    }

    return rawCategory || "other";
  }

  function getLocalizedToolDescription(tool) {
    if (state.language === "bn") {
      return String(tool.description_bn || "").trim() || getGenericToolDescription(tool);
    }

    const details = String(tool.details || "").trim();
    if (details) {
      const firstSentence = details
        .split(".")
        .map((segment) => segment.trim())
        .find(Boolean);
      if (firstSentence) {
        return `${firstSentence}.`;
      }
    }

    return getGenericToolDescription(tool);
  }

  function applyStaticTranslations(root = document) {
    root.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      const value = t(key);
      if (node.getAttribute("data-i18n-html") === "true") {
        node.innerHTML = value;
        return;
      }
      node.textContent = value;
    });

    root.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      const key = node.getAttribute("data-i18n-placeholder");
      node.setAttribute("placeholder", t(key));
    });

    root.querySelectorAll("[data-i18n-value]").forEach((node) => {
      const key = node.getAttribute("data-i18n-value");
      node.value = t(key);
    });

    document.documentElement.lang = state.language === "en" ? "en" : "bn";
  }

  function syncLanguageUi() {
    document.querySelectorAll("[data-language-toggle]").forEach((button) => {
      const isActive = button.getAttribute("data-language-toggle") === state.language;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function updateHeroMetrics() {
    const countNode = document.getElementById("heroToolCount");
    if (!countNode) {
      return;
    }

    const total = Array.isArray(data) ? data.length : 0;
    countNode.textContent = localizedNum(total);
  }

  function syncShowcaseUi() {
    document.querySelectorAll("[data-showcase-mode]").forEach((button) => {
      const isActive = button.getAttribute("data-showcase-mode") === state.showcaseMode;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function applyLanguage() {
    applyStaticTranslations();
    syncLanguageUi();
    syncShowcaseUi();
    updateHeroMetrics();
    renderTrendingSection();
    render(false);
  }

  function escapeHtml(text) {
    return String(text ?? "")
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

  function isFullyFree(tool) {
    const raw = String(tool.usdPrice || "").toLowerCase();
    return (
      tool.pricing === "free" ||
      tool.payment === "free" ||
      raw.includes("সম্পূর্ণ ফ্রি") ||
      raw === "free"
    );
  }

  function extractUsdNumber(rawPrice) {
    const match = String(rawPrice).match(/\$(\d+(?:\.\d+)?)/);
    return match ? Number(match[1]) : null;
  }

  function formatBdtAmount(amount) {
    return `৳${localizedNum(Math.round(amount))}`;
  }

  function getPriceInfo(tool) {
    const raw = String(tool.usdPrice || "").trim();
    const lowerRaw = raw.toLowerCase();
    const hasMonthly = /\/mo/i.test(raw);
    const isAddon = /add-on/i.test(raw);
    const freeLabel = state.language === "en" ? "Completely free" : "সম্পূর্ণ ফ্রি";
    const freeBdtLabel = state.language === "en" ? "৳0 - Free" : "৳০ — ফ্রি";
    const usageLabel = state.language === "en" ? "Usage based" : "চাহিদাভিত্তিক";
    const freeApiLabel = state.language === "en" ? "Free / API paid" : "ফ্রি / API পেইড";
    const naLabel = state.language === "en" ? "Not specified" : "প্রযোজ্য নয়";
    const monthlySuffix = hasMonthly ? (state.language === "en" ? "/month" : "/মাস") : "";
    const addonSuffix = isAddon ? (state.language === "en" ? " (add-on)" : " (অ্যাড-অন)") : "";

    if (isFullyFree(tool)) {
      return {
        usdLabel: raw || freeLabel,
        bdtLabel: freeBdtLabel,
        paidBdt: 0,
        isFree: true,
      };
    }

    if (lowerRaw === "usage-based") {
      return {
        usdLabel: raw,
        bdtLabel: usageLabel,
        paidBdt: null,
        isFree: false,
      };
    }

    if (/^free\s*\/\s*api paid$/i.test(raw)) {
      return {
        usdLabel: raw,
        bdtLabel: freeApiLabel,
        paidBdt: null,
        isFree: false,
      };
    }

    const usdValue = extractUsdNumber(raw);
    if (usdValue !== null) {
      const bdtValue = usdValue * conversionRate;
      const bdtAmount = formatBdtAmount(bdtValue);

      if (/^free\s*\//i.test(raw)) {
        return {
          usdLabel: raw,
          bdtLabel: `${state.language === "en" ? "Free" : "ফ্রি"} / ${bdtAmount}${monthlySuffix}${addonSuffix}`,
          paidBdt: Math.round(bdtValue),
          isFree: false,
        };
      }

      return {
        usdLabel: raw,
        bdtLabel: `${bdtAmount}${monthlySuffix}${addonSuffix}`,
        paidBdt: Math.round(bdtValue),
        isFree: false,
      };
    }

    return {
      usdLabel: raw || naLabel,
      bdtLabel: raw || naLabel,
      paidBdt: null,
      isFree: false,
    };
  }

  function matchSearch(tool) {
    if (!state.searchQuery) {
      return true;
    }

    const query = state.searchQuery.toLowerCase();
    const haystack = `${tool.name || ""} ${tool.description_bn || ""}`.toLowerCase();
    return haystack.includes(query);
  }

  function matchPayment(tool) {
    if (state.paymentFilter === "all") {
      return true;
    }

    if (state.paymentFilter === "free") {
      return isFullyFree(tool);
    }

    return tool.payment === state.paymentFilter;
  }

  function matchBd(tool) {
    if (state.bdFilter === "all") {
      return true;
    }

    if (state.bdFilter === "works") {
      return tool.works_in_bd === true;
    }

    if (state.bdFilter === "no-vpn") {
      return tool.no_vpn === true;
    }

    if (state.bdFilter === "vpn") {
      return tool.no_vpn === false;
    }

    return true;
  }

  function matchPrice(tool) {
    if (state.priceFilter === "all") {
      return true;
    }

    const info = getPriceInfo(tool);

    if (state.priceFilter === "free") {
      return info.isFree || info.paidBdt === 0;
    }

    if (typeof info.paidBdt !== "number") {
      return false;
    }

    if (state.priceFilter === "budget") {
      return info.paidBdt >= 1 && info.paidBdt <= 500;
    }

    if (state.priceFilter === "mid") {
      return info.paidBdt > 500 && info.paidBdt <= 2000;
    }

    if (state.priceFilter === "premium") {
      return info.paidBdt > 2000;
    }

    return true;
  }

  function applyBaseFilters(tool) {
    return matchSearch(tool) && matchPayment(tool) && matchBd(tool) && matchPrice(tool);
  }

  function matchesVisualCategory(tool, category) {
    if (category === "all") {
      return true;
    }

    const homepageCategory = getHomepageCategory(tool);

    if (category === "writing") {
      return homepageCategory === "writing";
    }

    if (category === "image") {
      return homepageCategory === "image";
    }

    if (category === "video") {
      return homepageCategory === "video";
    }

    if (category === "coding") {
      return homepageCategory === "coding";
    }

    if (category === "marketing") {
      return homepageCategory === "marketing";
    }

    if (category === "productivity") {
      return homepageCategory === "productivity";
    }

    if (category === "free") {
      return isFullyFree(tool);
    }

    return tool.category === category;
  }

  function setMobileMenuOpen(open, options = {}) {
    if (!refs.hamburgerBtn || !refs.mobileMenu) {
      return;
    }

    const { moveFocus = false, returnFocus = false } = options;

    refs.mobileMenu.classList.toggle("open", open);
    refs.mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
    refs.hamburgerBtn.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);

    if (open && moveFocus) {
      const firstFocusable = refs.mobileMenu.querySelector("a, button");
      firstFocusable?.focus();
    }

    if (!open && returnFocus) {
      refs.hamburgerBtn.focus();
    }
  }

  function setCategory(category) {
    state.activeCategory = category || "all";
    resetVisibleCount();
    render();
  }

  function setShowcaseMode(mode) {
    if ((mode !== "popular" && mode !== "recent") || mode === state.showcaseMode) {
      return;
    }

    state.showcaseMode = mode;
    syncShowcaseUi();
    renderTrendingSection();
  }

  function resetVisibleCount() {
    state.visibleCount = PAGE_SIZE;
  }

  function getToolPagePath(slug) {
    return `${encodeURIComponent(slug)}/`;
  }

  function getToolLandingUrl(tool) {
    return `https://banglaaiguide.com/${getToolPagePath(toSlug(tool.name))}`;
  }

  function getFacebookShareUrl(tool) {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getToolLandingUrl(tool))}`;
  }

  function getWhatsAppShareUrl(tool) {
    const shareText = `${tool.name} — বাংলাদেশ থেকে কাজ করে!\nদেখুন: ${getToolLandingUrl(tool)}\nবাংলা AI গাইডে আরও AI টুলস →`;
    return `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  }

  function getToolDomain(tool) {
    const rawUrl = tool.direct_url || tool.affiliate_url || "";
    try {
      const host = new URL(rawUrl).hostname.replace(/^www\./, "");
      return host;
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
    const domain = getToolDomain(tool);
    const fallbackDomain = domain || "openai.com";
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(fallbackDomain)}&sz=64`;
  }

  function renderToolLogo(tool) {
    const name = escapeHtml(tool.name || "Tool");
    return `<img class="tool-logo" src="${escapeHtml(getToolLogo(tool))}" alt="${name} logo" width="48" height="48" style="border-radius:10px; object-fit:contain;" onerror="this.onerror=null; this.src='${escapeHtml(getToolLogoFallback(tool))}'" loading="lazy" decoding="async" />`;
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

  async function copyTextToClipboard(text) {
    if (!text) {
      return false;
    }

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // fallback নিচে আছে
      }
    }

    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "absolute";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(textArea);
      return copied;
    } catch {
      return false;
    }
  }

  function showCopyTooltip(button, message) {
    if (!button) {
      return;
    }

    button.classList.remove("is-copied");
    button.setAttribute("data-tooltip", message);
    // Reflow for retrigger animation each click.
    void button.offsetWidth;
    button.classList.add("is-copied");

    if (button._copyTooltipTimer) {
      clearTimeout(button._copyTooltipTimer);
    }
    button._copyTooltipTimer = setTimeout(() => {
      button.classList.remove("is-copied");
      button.removeAttribute("data-tooltip");
      button._copyTooltipTimer = null;
    }, 1800);
  }

  function hasCookieConsent() {
    try {
      return localStorage.getItem(cookieConsentKey) === "true";
    } catch {
      return false;
    }
  }

  function saveCookieConsent() {
    try {
      localStorage.setItem(cookieConsentKey, "true");
    } catch {
      // Ignore storage errors for privacy-restricted browsers.
    }
  }

  function showCookieBanner() {
    if (!refs.cookieBanner || hasCookieConsent()) {
      return;
    }
    refs.cookieBanner.hidden = false;
  }

  function hideCookieBanner() {
    if (!refs.cookieBanner) {
      return;
    }
    refs.cookieBanner.hidden = true;
  }

  function isAffiliateDisclaimerHidden() {
    try {
      return localStorage.getItem(affiliateDisclaimerKey) === "true";
    } catch {
      return false;
    }
  }

  function saveAffiliateDisclaimerHidden() {
    try {
      localStorage.setItem(affiliateDisclaimerKey, "true");
    } catch {
      // Ignore storage errors.
    }
  }

  function hideAffiliateDisclaimer(savePreference = false) {
    if (!refs.affiliateDisclaimer) {
      return;
    }
    refs.affiliateDisclaimer.hidden = true;
    if (savePreference) {
      saveAffiliateDisclaimerHidden();
    }
  }

  function showAffiliateDisclaimer() {
    if (!refs.affiliateDisclaimer) {
      return;
    }
    refs.affiliateDisclaimer.hidden = isAffiliateDisclaimerHidden();
  }

  function setLoadMoreVisible(visible) {
    if (!refs.loadMoreBtn) {
      return;
    }
    refs.loadMoreBtn.hidden = !visible;
  }

  function getSkeletonCardMarkup() {
    return `
      <article class="tool-card skeleton-card" aria-hidden="true">
        <div class="skeleton-line skeleton-line--chip"></div>
        <div class="skeleton-line skeleton-line--title"></div>
        <div class="skeleton-line skeleton-line--chip"></div>
        <div class="skeleton-line skeleton-line--text"></div>
        <div class="skeleton-line skeleton-line--text"></div>
        <div class="skeleton-line skeleton-line--text short"></div>
        <div class="skeleton-line skeleton-line--meta"></div>
      </article>
    `;
  }

  function showLoadingSkeleton() {
    if (!refs.toolsGrid) {
      return;
    }
    refs.toolsGrid.innerHTML = Array.from({ length: 6 }, () => getSkeletonCardMarkup()).join("");
    setLoadMoreVisible(false);
  }

  function getBadges(tool) {
    const bdBadge = tool.works_in_bd
      ? `<span class="badge badge--accent">${escapeHtml(t("badge_bd_yes"))}</span>`
      : `<span class="badge badge--neutral">${escapeHtml(t("badge_bd_limited"))}</span>`;

    const vpnBadge = tool.no_vpn
      ? `<span class="badge badge--accent">${escapeHtml(t("badge_vpn_no"))}</span>`
      : `<span class="badge badge--neutral">${escapeHtml(t("badge_vpn_maybe"))}</span>`;

    let paymentBadge = `<span class="badge badge--neutral">${escapeHtml(t("badge_payment_card"))}</span>`;
    if (tool.payment === "bkash") {
      paymentBadge = `<span class="badge badge--accent">${escapeHtml(t("badge_payment_bkash"))}</span>`;
    }
    if (tool.payment === "free") {
      paymentBadge = `<span class="badge badge--accent">${escapeHtml(t("badge_payment_free"))}</span>`;
    }

    return `${bdBadge}${vpnBadge}${paymentBadge}`;
  }

  function getShowcaseTools() {
    if (state.showcaseMode === "recent") {
      return [...data].reverse().slice(0, 7);
    }

    return [...data]
      .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0) || String(a.name).localeCompare(String(b.name)))
      .slice(0, 7);
  }

  function getShowcaseTags(tool) {
    const tags = [];

    if (tool.category === "llm") {
      tags.push("#ai-chatbots", "#research");
    } else if (tool.category === "image") {
      tags.push("#image-tools", "#creative");
    } else if (tool.category === "coding") {
      tags.push("#coding", "#developer");
    } else {
      tags.push("#productivity", "#automation");
    }

    if (tool.works_in_bd) {
      tags.push("#bangladesh");
    }

    return tags.slice(0, 3);
  }

  function getShowcaseScore(tool) {
    const rating = Number(tool.rating || 0);
    return Math.round(rating * 1000 + (tool.works_in_bd ? 180 : 80));
  }

  function renderTrendingCard(tool) {
    if (!tool) {
      return "";
    }

    const detailUrl = getToolPagePath(toSlug(tool.name));
    const showcaseTags = getShowcaseTags(tool);
    const score = localizedNum(getShowcaseScore(tool));
    const bdStatus = tool.works_in_bd ? "✓" : "•";

    return `
      <article class="trending-card">
        <div class="trending-card-main">
          <div class="tool-title-wrap">
            <div class="tool-logo-shell">
              ${renderToolLogo(tool)}
            </div>
            <div class="tool-name-block">
              <h3 class="tool-title"><a href="${escapeHtml(detailUrl)}">${escapeHtml(tool.name)}</a></h3>
              <p class="tool-desc">${escapeHtml(getLocalizedToolDescription(tool))}</p>
              <div class="trending-card-tags">
                ${showcaseTags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
              </div>
            </div>
          </div>
          <div class="trending-card-stats">
            <div class="trending-stat-box">
              <span>${escapeHtml(t("showcase_score"))}</span>
              <strong>${score}</strong>
            </div>
            <div class="trending-stat-box trending-stat-box--accent">
              <span>${escapeHtml(t("showcase_access"))}</span>
              <strong>${escapeHtml(bdStatus)}</strong>
            </div>
          </div>
        </div>
        <div class="trending-card-actions">
          <div class="badges">${getBadges(tool)}</div>
          <a class="btn btn-ghost" href="${escapeHtml(detailUrl)}">${escapeHtml(t("btn_view_tool"))}</a>
        </div>
      </article>
    `;
  }

  function renderTrendingSection() {
    if (!refs.trendingGrid) {
      return;
    }

    const showcaseTools = getShowcaseTools();
    refs.trendingGrid.innerHTML = showcaseTools.map((tool) => renderTrendingCard(tool)).join("");
    attachToolLogoHandlers(refs.trendingGrid);
  }

  function renderToolCard(tool) {
    const detailUrl = getToolPagePath(toSlug(tool.name));
    const directUrl = tool.direct_url || tool.affiliate_url || "#";
    const toolName = escapeHtml(tool.name);
    const appCategory = getLocalizedApplicationCategory(tool.category);
    const homepageCategory = getHomepageCategory(tool);
    const score = localizedNum(getShowcaseScore(tool));
    const priceInfo = getPriceInfo(tool);
    const priceLabel = state.language === "en" ? priceInfo.usdLabel : priceInfo.bdtLabel;
    const bdStatusLabel = tool.no_vpn ? t("badge_vpn_no") : t("badge_vpn_maybe");
    const tags = [];
    if (tool.pricing === "free" || isFullyFree(tool)) {
      tags.push(t("tag_free"));
    } else if (String(tool.usdPrice || "").toLowerCase().includes("free")) {
      tags.push(t("tag_freemium"));
    }
    if (tool.works_in_bd) {
      tags.push(t("tag_bd_friendly"));
    }
    if (!tags.length) {
      tags.push(t("tag_ai_tool"));
    }

    return `
      <article class="tool-card" itemscope itemtype="https://schema.org/SoftwareApplication" data-category="${escapeHtml(homepageCategory || "other")}" data-pricing="${escapeHtml(tool.pricing || "unknown")}">
        <div class="tool-card-top">
          <span class="tool-card-category">${escapeHtml(getHomepageCategoryLabel(homepageCategory) || (state.language === "en" ? "Other" : "অন্যান্য"))}</span>
          <span class="tool-card-rating">${score}</span>
        </div>
        <div class="tool-header tool-header-modern">
          <div class="tool-title-wrap tool-title-wrap-modern">
            <div class="tool-logo-shell">
              ${renderToolLogo(tool)}
            </div>
            <div class="tool-name-block">
              <h3 class="tool-title" itemprop="name"><a href="${escapeHtml(detailUrl)}">${toolName}</a></h3>
              <p class="tool-subtitle">${escapeHtml(getHomepageCategoryLabel(homepageCategory) || (state.language === "en" ? "Other" : "অন্যান্য"))}</p>
            </div>
          </div>
        </div>
        <meta itemprop="applicationCategory" content="${escapeHtml(appCategory)}" />
        <meta itemprop="operatingSystem" content="Web" />
        <link itemprop="url" href="${escapeHtml(directUrl)}" />

        <p class="tool-desc" itemprop="description">${escapeHtml(getLocalizedToolDescription(tool))}</p>

        <div class="badges">${tags.map((tag) => `<span class="badge badge--accent">${escapeHtml(tag)}</span>`).join("")}</div>

        <div class="tool-meta-strip">
          <div class="tool-meta-item">
            <span class="tool-meta-label">${escapeHtml(state.language === "en" ? "Pricing" : "প্রাইসিং")}</span>
            <strong>${escapeHtml(priceLabel)}</strong>
          </div>
          <div class="tool-meta-item">
            <span class="tool-meta-label">${escapeHtml(state.language === "en" ? "Access" : "অ্যাক্সেস")}</span>
            <strong>${escapeHtml(bdStatusLabel)}</strong>
          </div>
        </div>

        <div class="tool-card-footer">
          <a class="btn btn-ghost" href="${escapeHtml(detailUrl)}">${escapeHtml(t("btn_view_tool"))}</a>
          <a class="btn btn-primary" href="${escapeHtml(directUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t("btn_visit_tool"))}</a>
        </div>
      </article>
    `;
  }

  function syncSearchParam() {
    if (!window.history || !window.history.replaceState) {
      return;
    }

    const currentUrl = new URL(window.location.href);
    if (state.searchQuery) {
      currentUrl.searchParams.set("q", state.searchQuery);
    } else {
      currentUrl.searchParams.delete("q");
    }
    if (state.activeCategory && state.activeCategory !== "all") {
      currentUrl.searchParams.set("category", state.activeCategory);
    } else {
      currentUrl.searchParams.delete("category");
    }
    if (state.language && state.language !== "bn") {
      currentUrl.searchParams.set("lang", state.language);
    } else {
      currentUrl.searchParams.delete("lang");
    }
    window.history.replaceState({}, "", `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);
  }

  function renderEmptyState() {
    setLoadMoreVisible(false);
    refs.toolsGrid.innerHTML = `
      <div class="empty-state">
        <p>${escapeHtml(t("empty_state"))}</p>
        <button type="button" class="btn btn-primary" id="clearFiltersBtn">${escapeHtml(t("empty_reset"))}</button>
      </div>
    `;

    const clearBtn = document.getElementById("clearFiltersBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        state.searchQuery = "";
        state.activeCategory = "all";
        state.paymentFilter = "all";
        state.bdFilter = "all";
        state.priceFilter = "all";
        resetVisibleCount();
        if (refs.searchInput) {
          refs.searchInput.value = "";
        }
        render();
      });
    }
  }

  function renderStats() {
    return;
  }

  function renderCategoryCounts(baseTools) {
    return;
  }

  function syncActiveUi() {
    document.querySelectorAll(".tab-btn").forEach((tab) => {
      const isActive = tab.getAttribute("data-category") === state.activeCategory;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
      tab.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    document.querySelectorAll("[data-payment]").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-payment") === state.paymentFilter);
    });

    document.querySelectorAll("[data-bd]").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-bd") === state.bdFilter);
    });

    document.querySelectorAll("[data-price]").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-price") === state.priceFilter);
    });
  }

  function performRender() {
    if (!Array.isArray(data) || data.length === 0) {
      refs.resultsCount.textContent = state.language === "en" ? "0 tools found" : "০ টি টুলস পাওয়া গেছে";
      refs.toolsGrid.innerHTML = `<div class="empty-state"><p>${escapeHtml(t("data_error"))}</p></div>`;
      setLoadMoreVisible(false);
      return;
    }

    const baseFiltered = data.filter(applyBaseFilters);
    renderCategoryCounts(baseFiltered);

    const filtered = baseFiltered.filter((tool) => matchesVisualCategory(tool, state.activeCategory));

    refs.resultsCount.textContent = state.language === "en"
      ? `${localizedNum(filtered.length)} ${t("results_found")}`
      : `${localizedNum(filtered.length)} ${t("results_found")}`;
    syncSearchParam();

    if (filtered.length === 0) {
      renderEmptyState();
      syncActiveUi();
      return;
    }

    const visibleTools = filtered.slice(0, state.visibleCount);
    refs.toolsGrid.innerHTML = visibleTools.map((tool) => renderToolCard(tool)).join("");
    setLoadMoreVisible(state.visibleCount < filtered.length);

    syncActiveUi();
    attachToolLogoHandlers(refs.toolsGrid);
  }

  function render(withSkeleton = true) {
    const requestId = ++renderRequestId;
    if (withSkeleton) {
      showLoadingSkeleton();
    }

    window.requestAnimationFrame(() => {
      if (requestId !== renderRequestId) {
        return;
      }
      performRender();
    });
  }

  function bindEvents() {
    const searchParams = new URLSearchParams(window.location.search);
    const queryFromUrl = searchParams.get("q");
    const categoryFromUrl = searchParams.get("category");
    const languageFromUrl = searchParams.get("lang");
    const savedLanguage = window.localStorage?.getItem(languagePreferenceKey);

    if (languageFromUrl === "en" || languageFromUrl === "bn") {
      state.language = languageFromUrl;
    } else if (savedLanguage === "en" || savedLanguage === "bn") {
      state.language = savedLanguage;
    }

    if (queryFromUrl) {
      state.searchQuery = queryFromUrl.trim();
      if (refs.searchInput) {
        refs.searchInput.value = state.searchQuery;
      }
    }
    if (categoryFromUrl) {
      state.activeCategory = categoryFromUrl.trim();
    }

    applyStaticTranslations();
    syncLanguageUi();
    syncShowcaseUi();

    if (refs.searchInput) {
      refs.searchInput.addEventListener("input", (event) => {
        const nextQuery = event.target.value.trim();
        if (searchDebounceTimer) {
          clearTimeout(searchDebounceTimer);
        }
        searchDebounceTimer = setTimeout(() => {
          state.searchQuery = nextQuery;
          resetVisibleCount();
          render();
        }, 300);
      });
    }

    if (refs.categoryTabList) {
      refs.categoryTabList.addEventListener("click", (event) => {
        const button = event.target.closest(".tab-btn");
        if (!button) {
          return;
        }
        setCategory(button.getAttribute("data-category"));
      });

      refs.categoryTabList.addEventListener("keydown", (event) => {
        const currentTab = event.target.closest(".tab-btn");
        if (!currentTab) {
          return;
        }

        const tabs = Array.from(refs.categoryTabList.querySelectorAll(".tab-btn"));
        const currentIndex = tabs.indexOf(currentTab);
        if (currentIndex < 0) {
          return;
        }

        let nextIndex = currentIndex;
        if (event.key === "ArrowRight") {
          nextIndex = (currentIndex + 1) % tabs.length;
        } else if (event.key === "ArrowLeft") {
          nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = tabs.length - 1;
        } else {
          return;
        }

        event.preventDefault();
        const nextTab = tabs[nextIndex];
        nextTab.focus();
        setCategory(nextTab.getAttribute("data-category"));
      });
    }

    document.querySelectorAll("[data-showcase-mode]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        setShowcaseMode(button.getAttribute("data-showcase-mode"));
      });

      button.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") {
          return;
        }

        event.preventDefault();
        setShowcaseMode(button.getAttribute("data-showcase-mode"));
      });
    });

    document.addEventListener("click", (event) => {
      const languageButton = event.target.closest("[data-language-toggle]");
      if (languageButton) {
        const nextLanguage = languageButton.getAttribute("data-language-toggle");
        if ((nextLanguage === "bn" || nextLanguage === "en") && nextLanguage !== state.language) {
          state.language = nextLanguage;
          try {
            window.localStorage?.setItem(languagePreferenceKey, nextLanguage);
          } catch {}
          applyLanguage();
        }
        return;
      }

      const showcaseButton = event.target.closest("[data-showcase-mode]");
      if (showcaseButton) {
        event.preventDefault();
        setShowcaseMode(showcaseButton.getAttribute("data-showcase-mode"));
        return;
      }

      const copyButton = event.target.closest("[data-share-action='copy']");
      if (copyButton) {
        event.preventDefault();
        copyTextToClipboard(copyButton.getAttribute("data-copy-url") || "")
          .then((ok) => showCopyTooltip(copyButton, ok ? "লিংক কপি হয়েছে! ✓" : "কপি করা যায়নি"));
        return;
      }

      const button = event.target.closest(".filter-chip");
      if (!button) {
        return;
      }

      const payment = button.getAttribute("data-payment");
      const bd = button.getAttribute("data-bd");
      const price = button.getAttribute("data-price");
      let shouldRender = false;

      if (payment) {
        state.paymentFilter = payment;
        shouldRender = true;
      }

      if (bd) {
        state.bdFilter = bd;
        shouldRender = true;
      }

      if (price) {
        state.priceFilter = price;
        shouldRender = true;
      }

      if (shouldRender) {
        resetVisibleCount();
        render();
      }
    });

    if (refs.loadMoreBtn) {
      refs.loadMoreBtn.addEventListener("click", () => {
        state.visibleCount += PAGE_SIZE;
        render(false);
      });
    }

    if (refs.hamburgerBtn && refs.mobileMenu) {
      refs.hamburgerBtn.addEventListener("click", () => {
        const nextState = !refs.mobileMenu.classList.contains("open");
        setMobileMenuOpen(nextState, { moveFocus: nextState });
      });

      refs.mobileMenu.addEventListener("click", (event) => {
        const link = event.target.closest("a");
        if (link) {
          setMobileMenuOpen(false);
        }
      });

      document.addEventListener("click", (event) => {
        const isOpen = refs.mobileMenu.classList.contains("open");
        if (!isOpen) {
          return;
        }

        const clickedInsideMenu = refs.mobileMenu.contains(event.target);
        const clickedToggle = refs.hamburgerBtn.contains(event.target);
        if (!clickedInsideMenu && !clickedToggle) {
          setMobileMenuOpen(false);
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && refs.mobileMenu.classList.contains("open")) {
          setMobileMenuOpen(false, { returnFocus: true });
        }
      });

      const onBreakpointChange = (event) => {
        if (!event.matches) {
          setMobileMenuOpen(false);
        }
      };

      if (typeof mobileBreakpoint.addEventListener === "function") {
        mobileBreakpoint.addEventListener("change", onBreakpointChange);
      } else if (typeof mobileBreakpoint.addListener === "function") {
        mobileBreakpoint.addListener(onBreakpointChange);
      }

      refs.mobileMenu.setAttribute("aria-hidden", "true");
    }

    if (refs.cookieAcceptBtn) {
      refs.cookieAcceptBtn.addEventListener("click", () => {
        saveCookieConsent();
        hideCookieBanner();
      });
    }

    if (refs.affiliateCloseBtn) {
      refs.affiliateCloseBtn.addEventListener("click", () => {
        hideAffiliateDisclaimer(true);
      });
    }
  }

  bindEvents();
  renderStats();
  renderTrendingSection();
  render();
  showCookieBanner();
  showAffiliateDisclaimer();
})();


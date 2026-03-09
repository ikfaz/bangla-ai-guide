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
  const PAGE_SIZE = 12;
  let searchDebounceTimer = null;
  let renderRequestId = 0;

  const categoryLabelMap = {
    llm: "LLM",
    image: "ইমেজ/ভিডিও",
    coding: "কোডিং",
    productivity: "প্রোডাক্টিভিটি",
  };

  const applicationCategoryMap = {
    llm: "AI Chatbot",
    image: "Image and Video AI",
    coding: "Developer Tool",
    productivity: "Productivity Application",
  };

  function bnNum(value) {
    return Number(value).toLocaleString("bn-BD");
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
    return `৳${bnNum(Math.round(amount))}`;
  }

  function getPriceInfo(tool) {
    const raw = String(tool.usdPrice || "").trim();
    const lowerRaw = raw.toLowerCase();
    const hasMonthly = /\/mo/i.test(raw);
    const isAddon = /add-on/i.test(raw);

    if (isFullyFree(tool)) {
      return {
        usdLabel: raw || "সম্পূর্ণ ফ্রি",
        bdtLabel: "৳০ — ফ্রি",
        paidBdt: 0,
        isFree: true,
      };
    }

    if (lowerRaw === "usage-based") {
      return {
        usdLabel: raw,
        bdtLabel: "চাহিদাভিত্তিক",
        paidBdt: null,
        isFree: false,
      };
    }

    if (/^free\s*\/\s*api paid$/i.test(raw)) {
      return {
        usdLabel: raw,
        bdtLabel: "ফ্রি / API পেইড",
        paidBdt: null,
        isFree: false,
      };
    }

    const usdValue = extractUsdNumber(raw);
    if (usdValue !== null) {
      const bdtValue = usdValue * conversionRate;
      const bdtAmount = formatBdtAmount(bdtValue);
      const monthlySuffix = hasMonthly ? "/মাস" : "";
      const addonSuffix = isAddon ? " (অ্যাড-অন)" : "";

      if (/^free\s*\//i.test(raw)) {
        return {
          usdLabel: raw,
          bdtLabel: `ফ্রি / ${bdtAmount}${monthlySuffix}${addonSuffix}`,
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
      usdLabel: raw || "প্রযোজ্য নয়",
      bdtLabel: raw || "প্রযোজ্য নয়",
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

    if (category === "writing") {
      return tool.category === "llm";
    }

    if (category === "image" || category === "video") {
      return tool.category === "image";
    }

    if (category === "coding") {
      return tool.category === "coding";
    }

    if (category === "marketing" || category === "productivity") {
      return tool.category === "productivity";
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
      ? '<span class="badge badge--accent">✅ BD-তে কাজ করে</span>'
      : '<span class="badge badge--neutral">❌ BD-তে সীমিত</span>';

    const vpnBadge = tool.no_vpn
      ? '<span class="badge badge--accent">🔵 VPN লাগে না</span>'
      : '<span class="badge badge--neutral">⚠️ VPN লাগতে পারে</span>';

    let paymentBadge = '<span class="badge badge--neutral">💳 কার্ড</span>';
    if (tool.payment === "bkash") {
      paymentBadge = '<span class="badge badge--accent">💚 bKash</span>';
    }
    if (tool.payment === "free") {
      paymentBadge = '<span class="badge badge--accent">🆓 ফ্রি</span>';
    }

    return `${bdBadge}${vpnBadge}${paymentBadge}`;
  }

  function renderTrendingCard(tool) {
    if (!tool) {
      return "";
    }

    const detailUrl = getToolPagePath(toSlug(tool.name));

    return `
      <article class="trending-card">
        <div class="tool-title-wrap">
          <div class="tool-logo-shell">
            ${renderToolLogo(tool)}
          </div>
          <div class="tool-name-block">
            <h3 class="tool-title"><a href="${escapeHtml(detailUrl)}">${escapeHtml(tool.name)}</a></h3>
            <p class="tool-subtitle">${escapeHtml(categoryLabelMap[tool.category] || "অন্যান্য")}</p>
          </div>
        </div>
        <p class="tool-desc">${escapeHtml(tool.description_bn || "")}</p>
        <div class="badges">${getBadges(tool)}</div>
        <a class="btn btn-ghost" href="${escapeHtml(detailUrl)}">View Tool</a>
      </article>
    `;
  }

  function renderTrendingSection() {
    if (!refs.trendingGrid) {
      return;
    }

    const popularTools = [...data]
      .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0) || String(a.name).localeCompare(String(b.name)))
      .slice(0, 6);

    refs.trendingGrid.innerHTML = popularTools.map((tool) => renderTrendingCard(tool)).join("");
    attachToolLogoHandlers(refs.trendingGrid);
  }

  function renderToolCard(tool) {
    const detailUrl = getToolPagePath(toSlug(tool.name));
    const directUrl = tool.direct_url || tool.affiliate_url || "#";
    const toolName = escapeHtml(tool.name);
    const appCategory = applicationCategoryMap[tool.category] || "AI Application";
    const tags = [];
    if (tool.pricing === "free" || isFullyFree(tool)) {
      tags.push("Free");
    } else if (String(tool.usdPrice || "").toLowerCase().includes("free")) {
      tags.push("Freemium");
    }
    if (tool.works_in_bd) {
      tags.push("Bangladesh Friendly");
    }
    if (!tags.length) {
      tags.push("AI Tool");
    }

    return `
      <article class="tool-card" itemscope itemtype="https://schema.org/SoftwareApplication" data-category="${escapeHtml(tool.category || "other")}" data-pricing="${escapeHtml(tool.pricing || "unknown")}">
        <div class="tool-header tool-header-modern">
          <div class="tool-title-wrap tool-title-wrap-modern">
            <div class="tool-logo-shell">
              ${renderToolLogo(tool)}
            </div>
            <div class="tool-name-block">
              <h3 class="tool-title" itemprop="name"><a href="${escapeHtml(detailUrl)}">${toolName}</a></h3>
              <p class="tool-subtitle">${escapeHtml(categoryLabelMap[tool.category] || "অন্যান্য")}</p>
            </div>
          </div>
        </div>
        <meta itemprop="applicationCategory" content="${escapeHtml(appCategory)}" />
        <meta itemprop="operatingSystem" content="Web" />
        <link itemprop="url" href="${escapeHtml(directUrl)}" />

        <p class="tool-desc" itemprop="description">${escapeHtml(tool.description_bn || "")}</p>

        <div class="badges">${tags.map((tag) => `<span class="badge badge--accent">${escapeHtml(tag)}</span>`).join("")}</div>

        <div class="tool-card-footer">
          <a class="btn btn-primary" href="${escapeHtml(directUrl)}" target="_blank" rel="noopener noreferrer">Visit Tool</a>
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
    window.history.replaceState({}, "", `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);
  }

  function renderEmptyState() {
    setLoadMoreVisible(false);
    refs.toolsGrid.innerHTML = `
      <div class="empty-state">
        <p>কোনো টুল পাওয়া যায়নি। ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।</p>
        <button type="button" class="btn btn-primary" id="clearFiltersBtn">সব ফিল্টার রিসেট করুন</button>
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
      refs.resultsCount.textContent = "০ টি টুলস পাওয়া গেছে";
      refs.toolsGrid.innerHTML = '<div class="empty-state"><p>ডেটা লোড হয়নি। `js/tools-data.js` ফাইলটি ঠিকভাবে যুক্ত আছে কি না দেখুন।</p></div>';
      setLoadMoreVisible(false);
      return;
    }

    const baseFiltered = data.filter(applyBaseFilters);
    renderCategoryCounts(baseFiltered);

    const filtered = baseFiltered.filter((tool) => matchesVisualCategory(tool, state.activeCategory));

    refs.resultsCount.textContent = `${bnNum(filtered.length)} টি টুলস পাওয়া গেছে`;
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
    const queryFromUrl = new URLSearchParams(window.location.search).get("q");
    const categoryFromUrl = new URLSearchParams(window.location.search).get("category");
    if (queryFromUrl) {
      state.searchQuery = queryFromUrl.trim();
      if (refs.searchInput) {
        refs.searchInput.value = state.searchQuery;
      }
    }
    if (categoryFromUrl) {
      state.activeCategory = categoryFromUrl.trim();
    }

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

    document.addEventListener("click", (event) => {
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


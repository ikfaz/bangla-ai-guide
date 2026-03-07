(() => {
  const refs = {
    hamburgerBtn: document.getElementById("hamburgerBtn"),
    mobileMenu: document.getElementById("mobileMenu"),
  };
  const seoArticleRoot = document.querySelector(".seo-article-page");
  const fallbackTools = [
    "ChatGPT",
    "Claude",
    "Gemini",
    "Perplexity AI",
    "Midjourney",
    "Cursor",
    "ElevenLabs",
    "Kling AI",
    "Gamma",
    "GitHub Copilot",
    "Runway ML",
    "Bolt.new",
    "v0 by Vercel",
  ];

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

  function bindMenuEvents() {
    if (!refs.hamburgerBtn || !refs.mobileMenu) {
      return;
    }

    const mobileBreakpoint = window.matchMedia("(max-width: 840px)");

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

  function bindOutboundTracking() {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[data-outbound-affiliate='true']");
      if (!link) {
        return;
      }

      if (typeof window.gtag === "function") {
        window.gtag("event", "click_affiliate", {
          event_category: "outbound_affiliate",
          event_label: link.href,
          page_location: window.location.href,
          page_title: document.title,
        });
      }
    });
  }

  function bindClusterCtaTracking() {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[data-cluster-cta]");
      if (!link) {
        return;
      }

      if (typeof window.gtag === "function") {
        window.gtag("event", "click_cluster_cta", {
          page_slug: document.body.getAttribute("data-page-slug") || window.location.pathname,
          cta_target: link.getAttribute("data-cluster-cta") || "unknown",
          page_location: window.location.href,
          page_title: document.title,
        });
      }
    });
  }

  function toSlug(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function addToolEntry(bucket, tokenMap, token, slug) {
    const normalizedToken = String(token || "").trim();
    if (!normalizedToken || !slug) {
      return;
    }
    const tokenLower = normalizedToken.toLowerCase();
    if (tokenLower.length <= 2 && tokenLower !== "v0") {
      return;
    }
    if (tokenMap.has(tokenLower)) {
      return;
    }
    tokenMap.set(tokenLower, true);
    bucket.push({ token: normalizedToken, tokenLower, slug });
  }

  function buildToolEntries() {
    const rawTools = Array.isArray(window.tools)
      ? window.tools
      : fallbackTools.map((name) => ({ name }));
    const entries = [];
    const tokenMap = new Map();

    rawTools.forEach((tool) => {
      const name = String(tool?.name || "").trim();
      if (!name) {
        return;
      }
      const slug = toSlug(name);
      if (!slug) {
        return;
      }

      addToolEntry(entries, tokenMap, name, slug);
      if (/\s+AI$/i.test(name)) {
        addToolEntry(entries, tokenMap, name.replace(/\s+AI$/i, ""), slug);
      }
      if (name === "GitHub Copilot") {
        addToolEntry(entries, tokenMap, "Copilot", slug);
      }
      if (name === "Runway ML") {
        addToolEntry(entries, tokenMap, "Runway", slug);
      }
      if (name === "Bolt.new") {
        addToolEntry(entries, tokenMap, "Bolt", slug);
      }
      if (name === "v0 by Vercel") {
        addToolEntry(entries, tokenMap, "v0", slug);
      }
    });

    return entries.sort((a, b) => b.token.length - a.token.length);
  }

  function isEligibleTextNode(node) {
    if (!node || !node.parentElement) {
      return false;
    }
    const parent = node.parentElement;
    const tag = parent.tagName;
    if (!["P", "LI", "TD"].includes(tag)) {
      return false;
    }
    if (!node.nodeValue || !node.nodeValue.trim()) {
      return false;
    }
    if (parent.closest("a,script,style,code,h1,h2,h3,h4,h5,h6")) {
      return false;
    }
    if (parent.closest(".breadcrumb,.footer-links,.nav-links,.seo-cta-actions")) {
      return false;
    }
    return true;
  }

  function collectTextNodes(root) {
    const nodes = [];
    if (!root) {
      return nodes;
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let current = walker.nextNode();
    while (current) {
      if (isEligibleTextNode(current)) {
        nodes.push(current);
      }
      current = walker.nextNode();
    }
    return nodes;
  }

  function injectInlineToolLinks() {
    if (!seoArticleRoot) {
      return;
    }

    const toolEntries = buildToolEntries();
    if (!toolEntries.length) {
      return;
    }

    const linkedSlugs = new Set();
    const nodes = collectTextNodes(seoArticleRoot);

    nodes.forEach((node) => {
      if (!node.parentNode) {
        return;
      }

      const originalText = node.nodeValue;
      const lowerText = originalText.toLowerCase();

      for (const entry of toolEntries) {
        if (linkedSlugs.has(entry.slug)) {
          continue;
        }
        const index = lowerText.indexOf(entry.tokenLower);
        if (index === -1) {
          continue;
        }

        const matched = originalText.slice(index, index + entry.token.length);
        const before = originalText.slice(0, index);
        const after = originalText.slice(index + entry.token.length);

        const fragment = document.createDocumentFragment();
        if (before) {
          fragment.appendChild(document.createTextNode(before));
        }

        const link = document.createElement("a");
        link.className = "tool-inline-link";
        link.href = `tool-detail.html?tool=${encodeURIComponent(entry.slug)}`;
        link.setAttribute("data-tool-slug", entry.slug);
        link.setAttribute("aria-label", `${matched} বিস্তারিত দেখুন`);
        link.innerHTML = escapeHtml(matched);
        fragment.appendChild(link);

        if (after) {
          fragment.appendChild(document.createTextNode(after));
        }

        node.parentNode.replaceChild(fragment, node);
        linkedSlugs.add(entry.slug);
        break;
      }
    });
  }

  function bindInlineToolLinkTracking() {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a.tool-inline-link[data-tool-slug]");
      if (!link) {
        return;
      }

      if (typeof window.gtag === "function") {
        window.gtag("event", "click_tool_inline_link", {
          tool_slug: link.getAttribute("data-tool-slug"),
          page_slug: document.body.getAttribute("data-page-slug") || window.location.pathname,
          page_location: window.location.href,
        });
      }
    });
  }

  function collectSeoSections(root) {
    if (!root) {
      return [];
    }
    return Array.from(root.querySelectorAll(".seo-block"))
      .map((block, index) => {
        const heading = block.querySelector("h2");
        return heading ? { block, heading, index } : null;
      })
      .filter(Boolean);
  }

  function ensureSectionIds(sectionItems) {
    const used = new Set();
    sectionItems.forEach((item, i) => {
      const base = toSlug(item.heading.textContent || "");
      let id = base || `section-${i + 1}`;
      let step = 2;
      while (used.has(id) || document.getElementById(id)) {
        id = `${base || `section-${i + 1}`}-${step}`;
        step += 1;
      }
      item.id = id;
      item.heading.id = id;
      used.add(id);
    });
  }

  function findFirstDirectParagraph(block) {
    if (!block) {
      return null;
    }
    for (const child of block.children) {
      if (child.tagName === "P") {
        return child;
      }
    }
    return null;
  }

  function applySectionMoodAndTakeaways(sectionItems) {
    sectionItems.forEach((item, index) => {
      item.block.classList.toggle("seo-block--soft", index % 2 === 1);
      const firstParagraph = findFirstDirectParagraph(item.block);
      if (firstParagraph) {
        firstParagraph.classList.add("seo-takeaway");
      }
    });
  }

  function renderStickyToc(root, sectionItems) {
    if (!root || sectionItems.length < 3) {
      return null;
    }

    const nav = document.createElement("nav");
    nav.className = "seo-toc";
    nav.setAttribute("aria-label", "এই আর্টিকেলের সেকশন");

    const list = document.createElement("div");
    list.className = "seo-toc-list";

    sectionItems.forEach((item) => {
      const link = document.createElement("a");
      link.className = "seo-toc-link";
      link.href = `#${item.id}`;
      link.textContent = (item.heading.textContent || "").trim();
      link.setAttribute("data-target-id", item.id);
      list.appendChild(link);
    });

    nav.appendChild(list);

    const leads = root.querySelectorAll(".seo-lead");
    const anchor = leads.length ? leads[leads.length - 1] : root.querySelector("h1");
    if (anchor) {
      anchor.insertAdjacentElement("afterend", nav);
    } else {
      root.insertAdjacentElement("afterbegin", nav);
    }

    return nav;
  }

  function setActiveTocLink(toc, id) {
    if (!toc) {
      return;
    }
    toc.querySelectorAll(".seo-toc-link").forEach((link) => {
      const active = link.getAttribute("data-target-id") === id;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function bindTocActiveState(sectionItems, toc) {
    if (!toc || !sectionItems.length) {
      return;
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          let best = null;
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }
            if (!best || entry.intersectionRatio > best.intersectionRatio) {
              best = entry;
            }
          });
          if (best?.target?.id) {
            setActiveTocLink(toc, best.target.id);
          }
        },
        { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] }
      );
      sectionItems.forEach((item) => observer.observe(item.heading));
      setActiveTocLink(toc, sectionItems[0].id);
      return;
    }

    const onScroll = () => {
      let current = sectionItems[0]?.id;
      sectionItems.forEach((item) => {
        const rect = item.heading.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.35) {
          current = item.id;
        }
      });
      if (current) {
        setActiveTocLink(toc, current);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function getStickyOffset() {
    const navbar = document.querySelector(".navbar");
    const base = navbar ? Math.round(navbar.getBoundingClientRect().height) : 72;
    return base + 12;
  }

  function bindReadingProgress(root) {
    if (!root) {
      return;
    }
    const main = root.closest(".seo-main");
    if (!main) {
      return;
    }

    const progress = document.createElement("div");
    progress.className = "seo-reading-progress";
    const bar = document.createElement("span");
    bar.className = "seo-reading-progress-bar";
    progress.appendChild(bar);
    main.insertBefore(progress, root);

    const setOffsetVar = () => {
      const offset = getStickyOffset();
      document.documentElement.style.setProperty("--seo-sticky-offset", `${offset}px`);
    };

    const updateProgress = () => {
      const articleTop = window.scrollY + root.getBoundingClientRect().top;
      const start = articleTop - getStickyOffset() - 32;
      const end = articleTop + root.offsetHeight - window.innerHeight + 64;
      const range = Math.max(1, end - start);
      const ratio = Math.min(1, Math.max(0, (window.scrollY - start) / range));
      bar.style.width = `${(ratio * 100).toFixed(2)}%`;
    };

    setOffsetVar();
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", () => {
      setOffsetVar();
      updateProgress();
    });
  }

  function initSeoReadingEnhancements() {
    if (!seoArticleRoot) {
      return;
    }
    const sectionItems = collectSeoSections(seoArticleRoot);
    if (!sectionItems.length) {
      return;
    }
    ensureSectionIds(sectionItems);
    applySectionMoodAndTakeaways(sectionItems);
    const toc = renderStickyToc(seoArticleRoot, sectionItems);
    if (toc) {
      bindTocActiveState(sectionItems, toc);
    }
    bindReadingProgress(seoArticleRoot);
  }

  bindMenuEvents();
  bindOutboundTracking();
  bindClusterCtaTracking();
  injectInlineToolLinks();
  bindInlineToolLinkTracking();
  initSeoReadingEnhancements();
})();

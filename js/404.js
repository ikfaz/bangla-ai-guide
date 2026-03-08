(() => {
  const data = Array.isArray(window.tools)
    ? window.tools
    : (typeof tools !== "undefined" && Array.isArray(tools) ? tools : []);

  const refs = {
    toolsGrid: document.getElementById("notfoundToolsGrid"),
    hamburgerBtn: document.getElementById("hamburgerBtn"),
    mobileMenu: document.getElementById("mobileMenu"),
  };

  const categoryLabelMap = {
    llm: "LLM",
    image: "ইমেজ/ভিডিও",
    coding: "কোডিং",
    productivity: "প্রোডাক্টিভিটি",
  };

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
    const shareText = `${tool.name} — বাংলাদেশ থেকে কাজ করে!\nদেখুন: ${getToolLandingUrl(tool)}\nবাংলা AI গাইডে আরও ১৫০+ টুলস →`;
    return `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  }

  function getToolDomain(tool) {
    const rawUrl = tool.direct_url || tool.affiliate_url || "";
    try {
      return new URL(rawUrl).hostname.replace(/^www\./, "");
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
    const domain = getToolDomain(tool) || "openai.com";
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
  }

  function renderToolLogo(tool) {
    return `<img class="tool-logo" src="${escapeHtml(getToolLogo(tool))}" alt="${escapeHtml(tool.name || "Tool")} logo" width="48" height="48" style="border-radius:10px; object-fit:contain;" onerror="this.onerror=null; this.src='${escapeHtml(getToolLogoFallback(tool))}'" loading="lazy" decoding="async" />`;
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
        // fallback below
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

  function getRandomTools(count) {
    const cloned = [...data];
    for (let i = cloned.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
    }
    return cloned.slice(0, Math.min(count, cloned.length));
  }

  function renderRandomTools() {
    if (!refs.toolsGrid) {
      return;
    }

    if (!Array.isArray(data) || data.length === 0) {
      refs.toolsGrid.innerHTML = `
        <div class="empty-state">
          <p>এই মুহূর্তে কোনো টুল দেখানো যাচ্ছে না।</p>
          <a class="btn btn-primary" href="index.html">হোমপেজে ফিরে যান →</a>
        </div>
      `;
      return;
    }

    const randomTools = getRandomTools(3);
    refs.toolsGrid.innerHTML = randomTools.map((tool) => {
      const detailUrl = getToolPagePath(toSlug(tool.name));
      const category = categoryLabelMap[tool.category] || "অন্যান্য";
      const facebookShareUrl = getFacebookShareUrl(tool);
      const whatsAppShareUrl = getWhatsAppShareUrl(tool);
      const copyUrl = tool.direct_url || tool.affiliate_url || getToolLandingUrl(tool);
      return `
        <article class="tool-card">
          <div class="tool-header">
            <div class="tool-title-wrap">
              ${renderToolLogo(tool)}
              <h3 class="tool-title">${escapeHtml(tool.name)}</h3>
            </div>
            <span class="category-tag">${escapeHtml(category)}</span>
          </div>
          <p class="tool-desc">${escapeHtml(tool.description_bn || "")}</p>
          <div class="tool-meta">
            <p class="rating">★ ${Number(tool.rating || 0).toLocaleString("bn-BD", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</p>
            <a class="btn btn-ghost" href="${escapeHtml(detailUrl)}">দেখুন →</a>
          </div>
          <div class="share-row" aria-label="শেয়ার অপশন">
            <a class="share-btn" href="${escapeHtml(facebookShareUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Facebook এ শেয়ার করুন" title="Facebook এ শেয়ার করুন">f</a>
            <a class="share-btn" href="${escapeHtml(whatsAppShareUrl)}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp এ শেয়ার করুন" title="WhatsApp এ শেয়ার করুন">wa</a>
            <button type="button" class="share-btn" data-share-action="copy" data-copy-url="${escapeHtml(copyUrl)}" aria-label="লিংক কপি করুন" title="লিংক কপি করুন">⧉</button>
          </div>
        </article>
      `;
    }).join("");

    attachToolLogoHandlers(refs.toolsGrid);
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

  function bindShareEvents() {
    document.addEventListener("click", (event) => {
      const copyButton = event.target.closest("[data-share-action='copy']");
      if (!copyButton) {
        return;
      }

      event.preventDefault();
      copyTextToClipboard(copyButton.getAttribute("data-copy-url") || "")
        .then((ok) => showCopyTooltip(copyButton, ok ? "লিংক কপি হয়েছে! ✓" : "কপি করা যায়নি"));
    });
  }

  bindMenuEvents();
  bindShareEvents();
  renderRandomTools();
})();

(() => {
  const CONSENT_KEY = "banglaAiGuideConsentV1";
  const LEGACY_ACCEPT_KEY = "banglaAiGuideCookieAccepted";
  const CONSENT_ACCEPTED = "accepted";
  const CONSENT_REJECTED = "rejected";
  const MEASUREMENT_ID = "G-X760BSGQCC";

  function getConsentState() {
    try {
      const value = localStorage.getItem(CONSENT_KEY);
      if (value) {
        return value;
      }
      if (localStorage.getItem(LEGACY_ACCEPT_KEY) === "true") {
        localStorage.setItem(CONSENT_KEY, CONSENT_ACCEPTED);
        return CONSENT_ACCEPTED;
      }
      return null;
    } catch {
      return null;
    }
  }

  function setConsentState(value) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // Ignore private mode storage errors.
    }
  }

  function loadAnalyticsOnce() {
    if (window.__baigGaLoaded) {
      return;
    }
    window.__baigGaLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID);

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  function buildBanner() {
    const banner = document.createElement("aside");
    banner.id = "cookieConsentBanner";
    banner.className = "cookie-banner";
    banner.setAttribute("aria-live", "polite");
    banner.innerHTML = `
      <div class="cookie-banner-inner">
        <p>আমরা আপনার অভিজ্ঞতা উন্নত করতে কুকি ব্যবহার করি।</p>
        <div class="cookie-actions">
          <button type="button" class="btn btn-primary" data-consent-action="accept">ঠিক আছে, মানলাম</button>
          <button type="button" class="btn btn-ghost" data-consent-action="reject">না, ধন্যবাদ</button>
          <a href="privacy.html" class="btn btn-ghost">আরও জানুন</a>
        </div>
      </div>
    `;
    return banner;
  }

  function hideBanner() {
    const banner = document.getElementById("cookieConsentBanner");
    if (banner) {
      banner.remove();
    }
  }

  function showBanner() {
    if (document.getElementById("cookieConsentBanner")) {
      return;
    }
    const banner = buildBanner();
    document.body.appendChild(banner);
    banner.addEventListener("click", (event) => {
      const actionButton = event.target.closest("[data-consent-action]");
      if (!actionButton) {
        return;
      }

      const action = actionButton.getAttribute("data-consent-action");
      if (action === "accept") {
        setConsentState(CONSENT_ACCEPTED);
        loadAnalyticsOnce();
      } else if (action === "reject") {
        setConsentState(CONSENT_REJECTED);
      }
      hideBanner();
    });
  }

  function initConsent() {
    const consentState = getConsentState();
    if (consentState === CONSENT_ACCEPTED) {
      loadAnalyticsOnce();
      return;
    }
    if (consentState === CONSENT_REJECTED) {
      return;
    }
    showBanner();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initConsent, { once: true });
  } else {
    initConsent();
  }
})();

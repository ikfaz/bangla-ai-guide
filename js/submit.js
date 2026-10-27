(() => {
  const refs = {
    form: document.getElementById("toolSubmitForm"),
    success: document.getElementById("submitSuccess"),
    emailDraft: document.getElementById("toolEmailDraft"),
    description: document.getElementById("descriptionBn"),
    descriptionCounter: document.getElementById("descriptionCounter"),
    hamburgerBtn: document.getElementById("hamburgerBtn"),
    mobileMenu: document.getElementById("mobileMenu"),
  };

  const errorMessages = {
    toolName: {
      required: "টুলের নাম লিখুন।",
    },
    websiteUrl: {
      required: "ওয়েবসাইট URL দিন।",
      invalid: "সঠিক URL দিন (যেমন: https://example.com)।",
    },
    category: {
      required: "ক্যাটাগরি নির্বাচন করুন।",
    },
    pricing: {
      required: "প্রাইসিং নির্বাচন করুন।",
    },
    worksInBd: {
      required: "বাংলাদেশে কাজ করে কি না নির্বাচন করুন।",
    },
    vpnRequired: {
      required: "VPN লাগে কি না নির্বাচন করুন।",
    },
    paymentMethod: {
      required: "পেমেন্ট পদ্ধতি নির্বাচন করুন।",
    },
    descriptionBn: {
      required: "বাংলা বর্ণনা লিখুন।",
      maxlength: "বর্ণনা ২০০ অক্ষরের মধ্যে দিন।",
    },
    submitterEmail: {
      invalid: "সঠিক ইমেইল দিন।",
    },
    listingType: {
      required: "লিস্টিং টাইপ নির্বাচন করুন।",
    },
  };

  function bnNum(value) {
    return Number(value).toLocaleString("bn-BD");
  }

  function getErrorNode(fieldName) {
    return document.querySelector(`[data-error-for="${fieldName}"]`);
  }

  function setFieldError(fieldName, message) {
    const node = getErrorNode(fieldName);
    if (!node) {
      return;
    }
    node.textContent = message || "";
  }

  function setAriaInvalid(target, invalid) {
    if (!target) {
      return;
    }
    target.setAttribute("aria-invalid", invalid ? "true" : "false");
  }

  function validateTextField(input) {
    if (!input) {
      return true;
    }

    const fieldName = input.name;
    const rules = errorMessages[fieldName] || {};
    let message = "";

    if (input.required && !input.value.trim()) {
      message = rules.required || "এই ঘরটি পূরণ করুন।";
    } else if (fieldName === "websiteUrl" && input.value.trim()) {
      let isWebUrl = false;
      try { isWebUrl = ["https:", "http:"].includes(new URL(input.value.trim()).protocol); } catch (_) {}
      if (input.validity.typeMismatch || !isWebUrl) {
        message = rules.invalid || "সঠিক URL দিন।";
      }
    } else if (fieldName === "submitterEmail" && input.value.trim()) {
      if (input.validity.typeMismatch) {
        message = rules.invalid || "সঠিক ইমেইল দিন।";
      }
    } else if (fieldName === "descriptionBn") {
      if (input.value.length > 200) {
        message = rules.maxlength || "সর্বোচ্চ ২০০ অক্ষর দিন।";
      }
    }

    setFieldError(fieldName, message);
    setAriaInvalid(input, Boolean(message));
    return !message;
  }

  function validateRadioGroup(groupName) {
    const inputs = Array.from(document.querySelectorAll(`input[name="${groupName}"]`));
    if (inputs.length === 0) {
      return true;
    }

    const checked = inputs.some((input) => input.checked);
    const message = checked ? "" : (errorMessages[groupName]?.required || "এই নির্বাচনটি প্রয়োজন।");

    setFieldError(groupName, message);
    inputs.forEach((input) => setAriaInvalid(input, Boolean(message)));
    return checked;
  }

  function validateForm() {
    if (!refs.form) {
      return false;
    }

    const textAndSelectFields = [
      "toolName",
      "websiteUrl",
      "category",
      "pricing",
      "descriptionBn",
      "submitterEmail",
    ];
    const radioGroups = [
      "worksInBd",
      "vpnRequired",
      "paymentMethod",
      "listingType",
    ];

    let isValid = true;

    textAndSelectFields.forEach((fieldName) => {
      const input = refs.form.elements[fieldName];
      if (!validateTextField(input)) {
        isValid = false;
      }
    });

    radioGroups.forEach((groupName) => {
      if (!validateRadioGroup(groupName)) {
        isValid = false;
      }
    });

    return isValid;
  }

  function updateDescriptionCounter() {
    if (!refs.description || !refs.descriptionCounter) {
      return;
    }
    refs.descriptionCounter.textContent = `${bnNum(refs.description.value.length)}/২০০`;
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

  function bindFormEvents() {
    if (!refs.form || !refs.success || !refs.emailDraft) {
      return;
    }

    const watchedInputs = refs.form.querySelectorAll("input[type='text'], input[type='url'], input[type='email'], select, textarea");
    watchedInputs.forEach((input) => {
      input.addEventListener("blur", () => validateTextField(input));
      input.addEventListener("input", () => {
        validateTextField(input);
        if (input.name === "descriptionBn") {
          updateDescriptionCounter();
        }
      });
      input.addEventListener("change", () => validateTextField(input));
    });

    ["worksInBd", "vpnRequired", "paymentMethod", "listingType"].forEach((groupName) => {
      document.querySelectorAll(`input[name="${groupName}"]`).forEach((radio) => {
        radio.addEventListener("change", () => validateRadioGroup(groupName));
      });
    });

    refs.form.addEventListener("submit", (event) => {
      event.preventDefault();
      refs.success.hidden = true;

      if (!validateForm()) {
        return;
      }

      const fields = refs.form.elements;
      const value = (name) => fields[name]?.value?.trim() || "উল্লেখ করা হয়নি";
      const labels = {
        worksInBd: { yes: "হ্যাঁ", no: "না" },
        vpnRequired: { yes: "হ্যাঁ", no: "না" },
        paymentMethod: { card: "Card", bkash: "bKash", both: "Card ও bKash", not_required: "প্রয়োজন নেই", unknown: "জানি না" },
        listingType: { free: "টুল পর্যালোচনার অনুরোধ", featured: "স্পনসরশিপ সম্পর্কে জানতে চাই" },
      };
      const choice = (name) => labels[name][value(name)] || value(name);
      const body = [
        "টুল পর্যালোচনার জন্য তথ্য / Tool review enquiry",
        "Tool name: " + value("toolName"),
        "Website: " + value("websiteUrl"),
        "Category: " + value("category"),
        "Pricing: " + value("pricing"),
        "USD price: " + value("usdPrice"),
        "Works in Bangladesh: " + choice("worksInBd"),
        "VPN required: " + choice("vpnRequired"),
        "Tool payment method: " + choice("paymentMethod"),
        "Enquiry: " + choice("listingType"),
        "Description: " + value("descriptionBn"),
        "Submitter email: " + value("submitterEmail"),
      ].join("\n");
      refs.emailDraft.href = "mailto:ifale200@gmail.com?subject=" + encodeURIComponent("AI tool review: " + value("toolName")) + "&body=" + encodeURIComponent(body);
      refs.success.hidden = false;
      refs.emailDraft.focus();

      refs.form.querySelectorAll("[aria-invalid='true']").forEach((node) => {
        node.setAttribute("aria-invalid", "false");
      });
      refs.form.querySelectorAll(".field-error").forEach((node) => {
        node.textContent = "";
      });
    });
    const submit = refs.form.querySelector('button[type="submit"]');
    if (submit) submit.disabled = false;
  }

  bindMenuEvents();
  bindFormEvents();
  updateDescriptionCounter();
})();

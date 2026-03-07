(() => {
  const refs = {
    form: document.getElementById("contactForm"),
    success: document.getElementById("contactSuccess"),
    hamburgerBtn: document.getElementById("hamburgerBtn"),
    mobileMenu: document.getElementById("mobileMenu"),
  };

  const errors = {
    name: {
      required: "আপনার নাম লিখুন।",
      min: "নাম কমপক্ষে ২ অক্ষরের হতে হবে।",
    },
    email: {
      required: "ইমেইল ঠিকানা দিন।",
      invalid: "সঠিক ইমেইল ঠিকানা দিন।",
    },
    topic: {
      required: "বিষয় নির্বাচন করুন।",
    },
    message: {
      required: "বার্তা লিখুন।",
      min: "বার্তাটি কমপক্ষে ২০ অক্ষরের হতে হবে।",
    },
  };

  function setError(name, text) {
    const node = document.querySelector(`[data-error-for="${name}"]`);
    if (node) node.textContent = text || "";
  }

  function setInvalid(el, invalid) {
    if (!el) return;
    el.setAttribute("aria-invalid", invalid ? "true" : "false");
  }

  function validateField(input) {
    if (!input) return true;
    const value = input.value.trim();
    let message = "";

    if (input.required && !value) {
      message = errors[input.name]?.required || "এই ঘরটি পূরণ করুন।";
    } else if (input.name === "name" && value.length && value.length < 2) {
      message = errors.name.min;
    } else if (input.name === "email" && value.length && input.validity.typeMismatch) {
      message = errors.email.invalid;
    } else if (input.name === "message" && value.length && value.length < 20) {
      message = errors.message.min;
    }

    setError(input.name, message);
    setInvalid(input, Boolean(message));
    return !message;
  }

  function validateForm() {
    if (!refs.form) return false;
    const fields = ["name", "email", "topic", "message"];
    let valid = true;
    fields.forEach((fieldName) => {
      const input = refs.form.elements[fieldName];
      if (!validateField(input)) valid = false;
    });
    return valid;
  }

  function setMobileMenuOpen(open, options = {}) {
    if (!refs.hamburgerBtn || !refs.mobileMenu) return;

    const { moveFocus = false, returnFocus = false } = options;
    refs.mobileMenu.classList.toggle("open", open);
    refs.mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
    refs.hamburgerBtn.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);

    if (open && moveFocus) refs.mobileMenu.querySelector("a, button")?.focus();
    if (!open && returnFocus) refs.hamburgerBtn.focus();
  }

  function bindMenuEvents() {
    if (!refs.hamburgerBtn || !refs.mobileMenu) return;

    const mobileBreakpoint = window.matchMedia("(max-width: 840px)");

    refs.hamburgerBtn.addEventListener("click", () => {
      const nextState = !refs.mobileMenu.classList.contains("open");
      setMobileMenuOpen(nextState, { moveFocus: nextState });
    });

    refs.mobileMenu.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMobileMenuOpen(false);
    });

    document.addEventListener("click", (event) => {
      if (!refs.mobileMenu.classList.contains("open")) return;
      const clickedInsideMenu = refs.mobileMenu.contains(event.target);
      const clickedToggle = refs.hamburgerBtn.contains(event.target);
      if (!clickedInsideMenu && !clickedToggle) setMobileMenuOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && refs.mobileMenu.classList.contains("open")) {
        setMobileMenuOpen(false, { returnFocus: true });
      }
    });

    const onBreakpointChange = (event) => {
      if (!event.matches) setMobileMenuOpen(false);
    };

    if (typeof mobileBreakpoint.addEventListener === "function") {
      mobileBreakpoint.addEventListener("change", onBreakpointChange);
    } else if (typeof mobileBreakpoint.addListener === "function") {
      mobileBreakpoint.addListener(onBreakpointChange);
    }

    refs.mobileMenu.setAttribute("aria-hidden", "true");
  }

  function bindFormEvents() {
    if (!refs.form) return;

    const fields = refs.form.querySelectorAll("input, select, textarea");
    fields.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => validateField(field));
      field.addEventListener("change", () => validateField(field));
    });

    refs.form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (refs.success) refs.success.hidden = true;
      if (!validateForm()) return;

      if (refs.success) refs.success.hidden = false;
      refs.form.reset();
      refs.form.querySelectorAll("[aria-invalid='true']").forEach((node) => node.setAttribute("aria-invalid", "false"));
      refs.form.querySelectorAll(".contact-error").forEach((node) => {
        node.textContent = "";
      });
    });
  }

  bindMenuEvents();
  bindFormEvents();
})();

(() => {
  const refs = {
    hamburgerBtn: document.getElementById("hamburgerBtn"),
    mobileMenu: document.getElementById("mobileMenu"),
  };

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

  bindMenuEvents();
})();

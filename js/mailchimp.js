(function () {
  const FORM_SELECTOR = "[data-mailchimp-form]";
  const STATUS_MESSAGES = {
    loading: "Submitting...",
    success: "Success. Check your inbox if double opt-in is enabled in Mailchimp.",
    invalid: "Enter a valid email address.",
    failed: "Submission failed. Please try again.",
  };
  const TIMEOUT_MS = 12000;

  function setButtonState(form, busy) {
    const button = form.querySelector('button[type="submit"], input[type="submit"]');
    if (!button) {
      return;
    }

    const isInput = button.tagName === "INPUT";
    if (!button.dataset.originalText) {
      button.dataset.originalText = isInput ? button.value : button.textContent;
    }

    form.setAttribute("aria-busy", busy ? "true" : "false");
    button.disabled = busy;

    if (isInput) {
      button.value = busy ? STATUS_MESSAGES.loading : button.dataset.originalText;
      return;
    }

    button.textContent = busy ? STATUS_MESSAGES.loading : button.dataset.originalText;
  }

  function updateStatus(form, state) {
    const status = form.parentElement.querySelector("[data-mailchimp-status]");
    if (!status) {
      return;
    }

    status.hidden = false;
    status.className = "mailchimp-status";
    status.classList.add("is-" + state);
    status.textContent = STATUS_MESSAGES[state];
  }

  function clearStatus(form) {
    const status = form.parentElement.querySelector("[data-mailchimp-status]");
    if (!status) {
      return;
    }

    status.hidden = true;
    status.className = "mailchimp-status";
    status.textContent = "";
  }

  function initializeForm(form) {
    if (form.dataset.mailchimpReady === "true") {
      return;
    }

    const emailInput = form.querySelector('input[name="EMAIL"]');
    const iframeTarget = form.getAttribute("target");
    const iframe = iframeTarget ? document.querySelector('iframe[name="' + iframeTarget + '"]') : null;
    let didSubmit = false;
    let timeoutId = null;

    form.dataset.mailchimpReady = "true";

    if (emailInput) {
      emailInput.addEventListener("invalid", function () {
        updateStatus(form, "invalid");
      });

      emailInput.addEventListener("input", function () {
        if (emailInput.checkValidity()) {
          clearStatus(form);
        }
      });
    }

    form.addEventListener("submit", function () {
      didSubmit = true;
      clearStatus(form);
      updateStatus(form, "loading");
      setButtonState(form, true);

      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(function () {
        if (!didSubmit) {
          return;
        }

        didSubmit = false;
        setButtonState(form, false);
        updateStatus(form, "failed");
      }, TIMEOUT_MS);
    });

    if (iframe) {
      iframe.addEventListener("load", function () {
        if (!didSubmit) {
          return;
        }

        didSubmit = false;
        window.clearTimeout(timeoutId);
        setButtonState(form, false);
        form.reset();
        updateStatus(form, "success");
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(FORM_SELECTOR).forEach(initializeForm);
  });
})();

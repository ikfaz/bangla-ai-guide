(function () {
  function initializeForm(form) {
    if (form.dataset.mailchimpReady === "true") return;
    form.dataset.mailchimpReady = "true";
    form.target = "_blank";
    form.rel = "noopener noreferrer";
    const status = form.parentElement.querySelector("[data-mailchimp-status]");
    const email = form.querySelector('input[name="EMAIL"]');
    function show(message) {
      if (!status) return;
      status.hidden = false;
      status.className = "mailchimp-status";
      status.textContent = message;
    }
    email?.addEventListener("invalid", function () { show("সঠিক ইমেইল ঠিকানা লিখুন। / Enter a valid email address."); });
    form.addEventListener("submit", function (event) {
      if (!form.checkValidity()) { event.preventDefault(); form.reportValidity(); return; }
      show("Mailchimp-এর নতুন ট্যাবে ফলাফল দেখুন এবং প্রয়োজন হলে ইমেইলে নিশ্চিত করুন। এখানে সাবস্ক্রিপশন নিশ্চিত করা যায়নি। / Complete signup on the Mailchimp page; subscription is not confirmed here.");
    });
  }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-mailchimp-form]").forEach(initializeForm);
  });
})();

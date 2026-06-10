/* ==========================================================================
   APHELION — "Almanac" clickdummy interactions
   Theme toggle (light / dark / system), scroll-reveal, presentational forms,
   mobile drawer Esc-close. Reduced-motion safe. No framework, no build.
   The FOUC preflight runs inline in each <head>; this file wires the controls.
   ========================================================================== */
(function () {
  "use strict";

  var STORE_KEY = "aphelion-theme"; // "light" | "dark" | "system"
  var root = document.documentElement;
  var mq = window.matchMedia("(prefers-color-scheme: dark)");

  function stored() {
    try { return localStorage.getItem(STORE_KEY) || "system"; }
    catch (e) { return "system"; }
  }

  function apply(pref) {
    var dark = pref === "dark" || (pref === "system" && mq.matches);
    root.classList.toggle("dark", dark);
    // reflect pressed state on segmented control
    var btns = document.querySelectorAll(".theme-toggle button[data-theme]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute("aria-pressed", String(btns[i].getAttribute("data-theme") === pref));
    }
  }

  function set(pref) {
    try { localStorage.setItem(STORE_KEY, pref); } catch (e) {}
    apply(pref);
  }

  // wire the segmented control(s)
  function wireToggle() {
    var btns = document.querySelectorAll(".theme-toggle button[data-theme]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        set(this.getAttribute("data-theme"));
      });
    }
    apply(stored());
  }

  // react to OS theme change only while in "system" mode
  mq.addEventListener("change", function () {
    if (stored() === "system") apply("system");
  });

  // ---- scroll reveal (progressive, reduced-motion safe) ----
  // The `js` class on <html> is what arms the hide-then-reveal in CSS. Without
  // it (no-JS / print / a screenshot before JS), content stays fully visible.
  function wireReveal() {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var els = document.querySelectorAll(".reveal");
    function showAll() { for (var i = 0; i < els.length; i++) els[i].classList.add("in"); }

    if (reduce || !("IntersectionObserver" in window)) { showAll(); return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);

    // Safety net: if anything is still hidden after 1.6s (e.g. a tall
    // full-page screenshot that never scrolled), reveal it. Protects the
    // screenshot-diff fidelity gate from trapping content at opacity 0.
    window.setTimeout(showAll, 1600);
  }

  // ---- mobile drawer: Esc closes + focus return ----
  function wireDrawer() {
    var cb = document.getElementById("nav-toggle");
    if (!cb) return;
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && cb.checked) {
        cb.checked = false;
        var trigger = document.querySelector('label[for="nav-toggle"]');
        if (trigger) trigger.focus();
      }
    });
    // close drawer when a link is tapped
    var links = document.querySelectorAll(".mobile-nav a");
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function () { cb.checked = false; });
    }
  }

  // ---- presentational forms (validate + success, no network) ----
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function wireForms() {
    var forms = document.querySelectorAll("form[data-demo]");
    for (var i = 0; i < forms.length; i++) {
      forms[i].addEventListener("submit", function (e) {
        e.preventDefault();
        var form = this;
        var ok = true;

        // clear prior errors
        form.querySelectorAll(".field--error").forEach(function (f) { f.classList.remove("field--error"); });
        form.querySelectorAll(".field__msg.error").forEach(function (m) { m.textContent = ""; m.classList.remove("error"); });

        // validate each [data-validate] control
        form.querySelectorAll("[data-validate]").forEach(function (input) {
          var rule = input.getAttribute("data-validate");
          var field = input.closest(".field");
          var msg = field ? field.querySelector(".field__msg") : null;
          var bad = false, text = "";

          if (rule.indexOf("required") > -1 && !input.value.trim()) {
            bad = true; text = "This field is required.";
          } else if (rule.indexOf("email") > -1 && !isEmail(input.value.trim())) {
            bad = true; text = "Enter a valid email address.";
          }
          if (bad) {
            ok = false;
            if (field) field.classList.add("field--error");
            if (msg) { msg.textContent = text; msg.classList.add("error"); }
            input.setAttribute("aria-invalid", "true");
          } else {
            input.setAttribute("aria-invalid", "false");
          }
        });

        if (!ok) {
          var firstBad = form.querySelector(".field--error input, .field--error textarea");
          if (firstBad) firstBad.focus();
          return;
        }

        // simulate pending → success (client-only)
        var btn = form.querySelector("button[type='submit']");
        if (btn) { btn.setAttribute("aria-disabled", "true"); btn.dataset.label = btn.textContent; btn.textContent = "Sending…"; }
        window.setTimeout(function () {
          form.classList.add("is-sent");
          if (btn) { btn.removeAttribute("aria-disabled"); btn.textContent = btn.dataset.label || "Send"; }
          var live = form.querySelector(".form-success");
          if (live) live.focus && live.focus();
        }, 650);
      });
    }
  }

  function init() {
    wireToggle();
    wireReveal();
    wireDrawer();
    wireForms();
    // stamp current year in footers
    var y = document.querySelectorAll("[data-year]");
    for (var i = 0; i < y.length; i++) y[i].textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();

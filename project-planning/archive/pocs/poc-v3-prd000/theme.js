/* APHELION v3 "Aurora" — POC interactions.
   The FOUC-preflight (data-theme set before paint) lives inline in <head>.
   This file wires the toggle UI, specular tracking, reveals, form, mobile nav. */
(function () {
  "use strict";

  var STORAGE_KEY = "aphelion-theme"; // 'light' | 'dark' | 'system'
  var mql = window.matchMedia("(prefers-color-scheme: dark)");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function stored() {
    try { return localStorage.getItem(STORAGE_KEY) || "system"; } catch (e) { return "system"; }
  }
  function resolve(pref) {
    if (pref === "system") return mql.matches ? "dark" : "light";
    return pref;
  }
  function apply(pref) {
    document.documentElement.setAttribute("data-theme", resolve(pref));
    document.querySelectorAll("[data-theme-btn]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.dataset.themeBtn === pref));
    });
  }
  function setPref(pref) {
    try { localStorage.setItem(STORAGE_KEY, pref); } catch (e) {}
    apply(pref);
  }

  // Build a "glyph + text" form message with safe DOM methods (no innerHTML).
  function setMsg(msgEl, kind, glyph, text) {
    msgEl.className = "form-msg " + kind;
    msgEl.textContent = "";
    var g = document.createElement("span");
    g.className = "glyph";
    g.setAttribute("aria-hidden", "true");
    g.textContent = glyph;
    msgEl.appendChild(g);
    msgEl.appendChild(document.createTextNode(" " + text));
  }

  // react to OS change while in 'system'
  mql.addEventListener("change", function () { if (stored() === "system") apply("system"); });

  document.addEventListener("DOMContentLoaded", function () {
    apply(stored());

    // ---- theme toggle buttons ----
    document.querySelectorAll("[data-theme-btn]").forEach(function (btn) {
      btn.addEventListener("click", function () { setPref(btn.dataset.themeBtn); });
    });

    // ---- mobile nav drawer ----
    var drawer = document.getElementById("mobile-nav");
    var openBtn = document.getElementById("hamburger");
    var closeBtn = drawer && drawer.querySelector(".close");
    var lastFocus = null;
    function openNav() {
      if (!drawer) return;
      lastFocus = document.activeElement;
      drawer.classList.add("open");
      drawer.setAttribute("aria-hidden", "false");
      var first = drawer.querySelector("a, button");
      if (first) first.focus();
      document.addEventListener("keydown", onKey);
    }
    function closeNav() {
      if (!drawer) return;
      drawer.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
      document.removeEventListener("keydown", onKey);
      if (lastFocus) lastFocus.focus();
    }
    function onKey(e) {
      if (e.key === "Escape") { closeNav(); return; }
      if (e.key === "Tab") { // simple focus trap
        var f = drawer.querySelectorAll("a, button");
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    if (openBtn) openBtn.addEventListener("click", openNav);
    if (closeBtn) closeBtn.addEventListener("click", closeNav);
    if (drawer) drawer.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeNav); });

    // ---- cursor-tracked specular highlight (skip when reduced motion / touch) ----
    if (!reduceMotion.matches && window.matchMedia("(hover: hover)").matches) {
      document.querySelectorAll(".glass.interactive").forEach(function (tile) {
        tile.addEventListener("pointermove", function (e) {
          var r = tile.getBoundingClientRect();
          tile.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
          tile.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
        });
      });
    }

    // ---- scroll reveal (stagger handled by inline animation-delay) ----
    if (!reduceMotion.matches && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("tile-reveal"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll("[data-reveal]").forEach(function (el) { io.observe(el); });
    } else {
      document.querySelectorAll("[data-reveal]").forEach(function (el) { el.style.opacity = 1; });
    }

    // ---- newsletter form (presentational) ----
    var form = document.getElementById("subscribe-form");
    if (form) {
      var input = form.querySelector("input");
      var msg = document.getElementById("subscribe-msg");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var val = (input.value || "").trim();
        var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        if (!val) {
          input.setAttribute("aria-invalid", "true");
          setMsg(msg, "error", "✕", "Enter your email to join the manifest.");
        } else if (!ok) {
          input.setAttribute("aria-invalid", "true");
          setMsg(msg, "error", "✕", "That email doesn’t look right.");
        } else {
          input.removeAttribute("aria-invalid");
          setMsg(msg, "success", "✓", "Cleared for boarding. Check your inbox.");
          input.value = "";
        }
      });
    }
  });
})();

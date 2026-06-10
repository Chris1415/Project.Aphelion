/* Aphelion — theme toggle (light / dark / system), persisted, FOUC-safe.
   The FOUC preflight lives inline in each page <head>; this file wires the
   interactive 3-state toggle and keeps it in sync across the page. */
(function () {
  "use strict";
  var KEY = "aphelion-theme"; // "light" | "dark" | "system"

  function stored() {
    try { return localStorage.getItem(KEY) || "system"; } catch (e) { return "system"; }
  }
  function systemPref() {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  function resolve(choice) {
    return choice === "system" ? systemPref() : choice;
  }
  function apply(choice) {
    var root = document.documentElement;
    // data-theme carries BOTH the literal choice (system) and resolved value.
    // We set the resolved value so token overrides apply, and remember the
    // raw choice in a separate attribute for the toggle UI + system tracking.
    root.setAttribute("data-theme", choice === "system" ? "system" : choice);
    if (choice === "system") {
      // map the system media-query path: tokens for system are handled by
      // the @media(prefers-color-scheme) rule in CSS, so just mark it.
      root.setAttribute("data-resolved", resolve("system"));
    } else {
      root.setAttribute("data-resolved", choice);
    }
    syncButtons(choice);
  }
  function syncButtons(choice) {
    var groups = document.querySelectorAll("[data-theme-toggle]");
    groups.forEach(function (g) {
      g.querySelectorAll("button[data-theme-choice]").forEach(function (b) {
        var on = b.getAttribute("data-theme-choice") === choice;
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
    });
  }
  function set(choice) {
    try { localStorage.setItem(KEY, choice); } catch (e) {}
    apply(choice);
  }

  // react to OS changes while on "system"
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: light)");
    var onChange = function () { if (stored() === "system") apply("system"); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  document.addEventListener("DOMContentLoaded", function () {
    apply(stored());
    document.querySelectorAll("[data-theme-toggle] button[data-theme-choice]")
      .forEach(function (b) {
        b.addEventListener("click", function () {
          set(b.getAttribute("data-theme-choice"));
        });
      });
  });

  window.AphelionTheme = { set: set, get: stored };
})();

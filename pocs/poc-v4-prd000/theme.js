/* Chromatica theme controller — three-state (light / dark / system), persisted, FOUC-safe.
   The FOUC preflight runs inline in <head>; this file wires the visible toggle.
   data-theme on <html> = "light" | "dark"; localStorage key "aphelion-theme" = "light" | "dark" | "system". */
(function () {
  'use strict';
  var KEY = 'aphelion-theme';
  var mql = window.matchMedia('(prefers-color-scheme: dark)');

  function stored() {
    try { return localStorage.getItem(KEY) || 'system'; } catch (e) { return 'system'; }
  }
  function resolve(pref) {
    return pref === 'system' ? (mql.matches ? 'dark' : 'light') : pref;
  }
  function apply(pref) {
    document.documentElement.setAttribute('data-theme', resolve(pref));
    document.documentElement.setAttribute('data-theme-pref', pref);
  }
  function setPref(pref) {
    try { localStorage.setItem(KEY, pref); } catch (e) {}
    apply(pref);
    syncButtons(pref);
  }
  function syncButtons(pref) {
    var btns = document.querySelectorAll('[data-theme-set]');
    btns.forEach(function (b) {
      var on = b.getAttribute('data-theme-set') === pref;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  // React to OS changes while in system mode.
  mql.addEventListener('change', function () {
    if (stored() === 'system') apply('system');
  });

  document.addEventListener('DOMContentLoaded', function () {
    syncButtons(stored());
    document.querySelectorAll('[data-theme-set]').forEach(function (b) {
      b.addEventListener('click', function () { setPref(b.getAttribute('data-theme-set')); });
    });

    // Mobile nav drawer
    var burger = document.querySelector('[data-nav-toggle]');
    var drawer = document.querySelector('[data-nav-drawer]');
    if (burger && drawer) {
      var open = function () {
        drawer.classList.add('is-open');
        burger.setAttribute('aria-expanded', 'true');
        var first = drawer.querySelector('a, button');
        if (first) first.focus();
      };
      var close = function () {
        drawer.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
      };
      burger.addEventListener('click', function () {
        drawer.classList.contains('is-open') ? close() : open();
      });
      drawer.addEventListener('click', function (e) {
        if (e.target.closest('a') || e.target.hasAttribute('data-nav-close')) close();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
      });
    }

    // Newsletter presentational form
    var nl = document.querySelector('[data-newsletter]');
    if (nl) {
      var input = nl.querySelector('input[type="email"]');
      var msg = nl.querySelector('[data-nl-msg]');
      nl.addEventListener('submit', function (e) {
        e.preventDefault();
        var v = (input.value || '').trim();
        var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        if (!ok) {
          input.setAttribute('aria-invalid', 'true');
          msg.textContent = '✕  Enter a valid email to receive transmissions.';
          msg.className = 'nl-msg is-error';
          return;
        }
        input.removeAttribute('aria-invalid');
        msg.textContent = '✓  Telemetry uplink confirmed. Welcome aboard.';
        msg.className = 'nl-msg is-success';
        nl.classList.add('is-sent');
        input.value = '';
      });
      input.addEventListener('input', function () {
        if (input.value.trim() === '') { msg.textContent = ''; msg.className = 'nl-msg'; }
      });
    }

    // Reduced-motion-guarded anamorphic flare drift (decorative; CSS handles statics)
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      document.documentElement.setAttribute('data-motion', 'on');
    }
  });
})();

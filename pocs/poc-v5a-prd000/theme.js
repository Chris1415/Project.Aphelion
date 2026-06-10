/* ===========================================================================
   APHELION — "Lumen" (v5a) interaction layer
   - 3-state theme (light / dark / system) persisted to localStorage + data-theme
   - mobile drawer with focus trap + Esc + return-focus
   - scroll-reveal via IntersectionObserver (drives clip-path masks + fade/rise)
   - hero scroll parallax + ken-burns (rAF), ALL gated by prefers-reduced-motion
   The FOUC preflight that sets data-theme before paint lives inline in <head>.
   =========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var STORE = 'aphelion-theme';
  var ORDER = ['light', 'dark', 'system'];
  var ICON = { light: '☀', dark: '☾', system: '◐' };
  var mqDark = window.matchMedia('(prefers-color-scheme: dark)');
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  function stored() {
    try { return localStorage.getItem(STORE); } catch (e) { return null; }
  }
  function resolve(pref) { return pref === 'system' ? (mqDark.matches ? 'dark' : 'light') : pref; }

  function apply(pref) {
    root.setAttribute('data-theme', resolve(pref));
    root.setAttribute('data-theme-pref', pref);
    var icon = document.querySelector('[data-theme-icon]');
    var text = document.querySelector('[data-theme-text]');
    if (icon) icon.textContent = ICON[pref];
    if (text) text.textContent = pref.charAt(0).toUpperCase() + pref.slice(1);
    var btn = document.querySelector('.theme-toggle');
    if (btn) btn.setAttribute('aria-label', 'Theme: ' + pref + '. Activate to change.');
  }

  function currentPref() { return stored() || 'system'; }
  apply(currentPref());

  // react to OS theme change only while in 'system'
  mqDark.addEventListener('change', function () {
    if (currentPref() === 'system') apply('system');
  });

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var next = ORDER[(ORDER.indexOf(currentPref()) + 1) % ORDER.length];
        try { localStorage.setItem(STORE, next); } catch (e) {}
        apply(next);
      });
    }

    /* ---- Mobile drawer ---------------------------------------------------- */
    var menuBtn = document.querySelector('.menu-toggle');
    var drawer = document.querySelector('.mobile-nav');
    var scrim = document.querySelector('.nav-scrim');
    var closeBtn = document.querySelector('.mn-close');
    var lastFocus = null;

    function focusables() {
      return drawer ? drawer.querySelectorAll('a[href], button') : [];
    }
    function openDrawer() {
      if (!drawer) return;
      lastFocus = document.activeElement;
      drawer.classList.add('open');
      if (scrim) scrim.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
      var f = focusables(); if (f.length) f[0].focus();
    }
    function closeDrawer() {
      if (!drawer) return;
      drawer.classList.remove('open');
      if (scrim) scrim.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
      if (lastFocus) lastFocus.focus();
    }
    if (menuBtn) menuBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (scrim) scrim.addEventListener('click', closeDrawer);
    if (drawer) {
      drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeDrawer); });
    }
    document.addEventListener('keydown', function (e) {
      if (!drawer || !drawer.classList.contains('open')) return;
      if (e.key === 'Escape') { closeDrawer(); return; }
      if (e.key === 'Tab') {
        var f = focusables(); if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    /* ---- Scroll reveal (drives fade/rise AND clip-path masks) ------------- */
    var revealEls = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    }

    /* ---- Newsletter form (presentational validation) ---------------------- */
    var form = document.querySelector('.nl-form');
    if (form) {
      var emailInput = form.querySelector('input[type="email"]');
      var errEl = form.parentElement.querySelector('.field-error');
      var successEl = document.querySelector('.nl-success');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var val = (emailInput.value || '').trim();
        var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        if (!ok) {
          emailInput.setAttribute('aria-invalid', 'true');
          if (errEl) { errEl.hidden = false; errEl.textContent = val ? 'Enter a valid email address.' : 'Email is required.'; }
          emailInput.focus();
          return;
        }
        emailInput.removeAttribute('aria-invalid');
        if (errEl) errEl.hidden = true;
        form.hidden = true;
        if (successEl) { successEl.hidden = false; successEl.focus && successEl.focus(); }
      });
      emailInput.addEventListener('input', function () {
        if (emailInput.getAttribute('aria-invalid') === 'true') {
          emailInput.removeAttribute('aria-invalid');
          if (errEl) errEl.hidden = true;
        }
      });
    }

    /* ---- Hero scroll parallax + ken-burns (rAF, reduced-motion gated) ----- */
    var heroPhoto = document.querySelector('.hero-photo');
    var heroMesh = document.querySelector('.hero .mesh');
    var ticking = false;
    function onScroll() {
      if (mqReduce.matches) return;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () {
          var y = window.scrollY || window.pageYOffset;
          if (heroPhoto) heroPhoto.style.transform = 'translate3d(0,' + (y * 0.28) + 'px,0)';
          if (heroMesh) heroMesh.style.transform = 'translate3d(0,' + (y * 0.14) + 'px,0)';
          ticking = false;
        });
      }
    }
    if (!mqReduce.matches) {
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
    // if user flips reduced-motion on, freeze the parallax transforms
    mqReduce.addEventListener('change', function () {
      if (mqReduce.matches) {
        if (heroPhoto) heroPhoto.style.transform = '';
        if (heroMesh) heroMesh.style.transform = '';
      }
    });
  });
})();

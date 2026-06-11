/* ===========================================================================
   APHELION — "Pulse" (v5c) interaction layer
   Theme tri-state (light/dark/system) + the v5c signature effects:
   3D tilt cards, cursor-reactive hero glow, scroll-progress aurora, scroll
   reveals, mobile drawer, presentational newsletter states.
   All motion effects bail out under prefers-reduced-motion.
   (The FOUC preflight runs inline in <head>; this file is deferred.)
   =========================================================================== */
(function () {
  'use strict';

  var STORAGE_KEY = 'aphelion-theme';
  var root = document.documentElement;
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---- THEME (light / dark / system) ----------------------------------- */
  function stored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function resolve(pref) {
    if (pref === 'light' || pref === 'dark') return pref;
    return media.matches ? 'dark' : 'light';
  }
  function apply(pref) {
    root.setAttribute('data-theme', resolve(pref));
    var icon = pref === 'system' ? '◐' : pref === 'dark' ? '☾' : '☀';
    var label = pref.charAt(0).toUpperCase() + pref.slice(1);
    document.querySelectorAll('[data-theme-icon]').forEach(function (el) { el.textContent = icon; });
    document.querySelectorAll('[data-theme-text]').forEach(function (el) { el.textContent = label; });
    var btn = document.querySelector('.theme-toggle');
    if (btn) btn.setAttribute('aria-label', 'Theme: ' + label + '. Click to change.');
  }
  function currentPref() { return stored() || 'system'; }

  apply(currentPref());
  media.addEventListener('change', function () {
    if (currentPref() === 'system') apply('system');
  });

  var order = ['light', 'dark', 'system'];
  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = order[(order.indexOf(currentPref()) + 1) % order.length];
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
      apply(next);
    });
  }

  /* ---- MOBILE NAV DRAWER ------------------------------------------------ */
  var scrim = document.querySelector('.nav-scrim');
  var drawer = document.querySelector('.mobile-nav');
  var openBtn = document.querySelector('.menu-toggle');
  var closeBtn = document.querySelector('.mn-close');
  var lastFocus = null;

  function openNav() {
    lastFocus = document.activeElement;
    drawer.classList.add('open'); scrim.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    var first = drawer.querySelector('a, button');
    if (first) first.focus();
    document.addEventListener('keydown', onKey);
  }
  function closeNav() {
    drawer.classList.remove('open'); scrim.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', onKey);
    if (lastFocus) lastFocus.focus();
  }
  function onKey(e) {
    if (e.key === 'Escape') { closeNav(); return; }
    if (e.key !== 'Tab') return;
    var f = drawer.querySelectorAll('a, button');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  if (openBtn) openBtn.addEventListener('click', openNav);
  if (closeBtn) closeBtn.addEventListener('click', closeNav);
  if (scrim) scrim.addEventListener('click', closeNav);
  if (drawer) drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });

  /* ---- SCROLL-PROGRESS AURORA ------------------------------------------ */
  var aurora = document.querySelector('.scroll-aurora');
  function updateAurora() {
    if (!aurora || reduceMotion.matches) return;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? window.scrollY / h : 0;
    aurora.style.setProperty('--scroll', Math.min(1, Math.max(0, p)).toFixed(4));
  }

  /* ---- SCROLL REVEALS --------------------------------------------------- */
  var reveals = document.querySelectorAll('[data-reveal]');
  if (reduceMotion.matches) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- CURSOR-REACTIVE HERO GLOW --------------------------------------- */
  var hero = document.querySelector('.hero');
  var glow = document.querySelector('.cursor-glow');
  if (hero && glow && !reduceMotion.matches) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      glow.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(2) + '%');
      glow.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(2) + '%');
    });
  }

  /* ---- 3D TILT CARDS ---------------------------------------------------- */
  function bindTilt() {
    if (reduceMotion.matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch
    document.querySelectorAll('.tilt').forEach(function (card) {
      var rect;
      card.addEventListener('pointerenter', function () { rect = card.getBoundingClientRect(); });
      card.addEventListener('pointermove', function (e) {
        if (!rect) rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        var max = 9; // degrees
        card.style.transform =
          'rotateY(' + (px * max).toFixed(2) + 'deg) rotateX(' + (-py * max).toFixed(2) + 'deg)';
      });
      card.addEventListener('pointerleave', function () {
        rect = null; card.style.transform = '';
      });
    });
  }
  bindTilt();

  /* respond to a runtime reduced-motion change (e.g. OS toggle) */
  reduceMotion.addEventListener('change', function () {
    if (reduceMotion.matches) {
      document.querySelectorAll('.tilt').forEach(function (c) { c.style.transform = ''; });
      if (aurora) aurora.style.setProperty('--scroll', '0');
    }
  });

  /* ---- SCROLL listener (aurora) ---------------------------------------- */
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    window.requestAnimationFrame(function () { updateAurora(); ticking = false; });
  }, { passive: true });
  updateAurora();

  /* ---- NEWSLETTER (presentational states: empty/error/success) --------- */
  var form = document.querySelector('.nl-form');
  if (form) {
    var input = form.querySelector('.input');
    var errEl = form.parentElement.querySelector('.field-error');
    var okEl = form.parentElement.querySelector('.nl-success');
    var valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = (input.value || '').trim();
      var bad = !valid.test(v);
      input.setAttribute('aria-invalid', bad ? 'true' : 'false');
      errEl.classList.toggle('is-hidden', !bad);
      if (bad) {
        errEl.textContent = v ? 'Enter a valid email address.' : 'Email is required.';
        okEl.classList.add('is-hidden'); input.focus(); return;
      }
      okEl.classList.remove('is-hidden');
      form.classList.add('is-hidden');
    });
    input.addEventListener('input', function () {
      if (input.getAttribute('aria-invalid') === 'true') {
        input.setAttribute('aria-invalid', 'false');
        errEl.classList.add('is-hidden');
      }
    });
  }

  /* graceful image fallback: if a portal photo fails, drop it so the CSS
     mesh fallback shows through */
  document.querySelectorAll('.portal img').forEach(function (img) {
    img.addEventListener('error', function () { img.style.display = 'none'; });
  });
})();

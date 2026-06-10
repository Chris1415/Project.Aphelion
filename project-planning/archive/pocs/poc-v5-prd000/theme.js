/* Nebula Drift — theme cycler (light / dark / system).
   Mirrors the FOUC preflight in <head>: data-theme on <html>, localStorage key 'aphelion-theme'.
   Plain DOM; the head-app port swaps this for the useSyncExternalStore provider. */
(function () {
  var KEY = 'aphelion-theme';
  var order = ['system', 'light', 'dark'];
  var labels = { system: 'System', light: 'Light', dark: 'Dark' };
  var icons = { system: '◐', light: '☀', dark: '☾' };

  function stored() {
    try { return localStorage.getItem(KEY) || 'system'; } catch (e) { return 'system'; }
  }
  function systemDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function resolve(mode) {
    return mode === 'system' ? (systemDark() ? 'dark' : 'light') : mode;
  }
  function apply(mode) {
    document.documentElement.setAttribute('data-theme', resolve(mode));
    document.documentElement.setAttribute('data-theme-mode', mode);
    var btns = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-label', 'Theme: ' + labels[mode] + ' (click to change)');
      var ic = btns[i].querySelector('[data-theme-icon]');
      var tx = btns[i].querySelector('[data-theme-text]');
      if (ic) ic.textContent = icons[mode];
      if (tx) tx.textContent = labels[mode];
    }
  }

  function cycle() {
    var cur = stored();
    var next = order[(order.indexOf(cur) + 1) % order.length];
    try { localStorage.setItem(KEY, next); } catch (e) {}
    apply(next);
  }

  // React to OS theme changes while in 'system' mode.
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onChange = function () { if (stored() === 'system') apply('system'); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  document.addEventListener('DOMContentLoaded', function () {
    apply(stored());
    var btns = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < btns.length; i++) btns[i].addEventListener('click', cycle);

    // Mobile nav drawer (focus-trapped, Esc to close).
    var menuBtn = document.querySelector('[data-menu-toggle]');
    var drawer = document.querySelector('[data-mobile-nav]');
    var scrim = document.querySelector('[data-nav-scrim]');
    function closeNav() {
      if (!drawer) return;
      drawer.classList.remove('open');
      if (scrim) scrim.classList.remove('open');
      if (menuBtn) { menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.focus(); }
    }
    function openNav() {
      if (!drawer) return;
      drawer.classList.add('open');
      if (scrim) scrim.classList.add('open');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
      var first = drawer.querySelector('a, button');
      if (first) first.focus();
    }
    if (menuBtn) menuBtn.addEventListener('click', function () {
      drawer && drawer.classList.contains('open') ? closeNav() : openNav();
    });
    if (scrim) scrim.addEventListener('click', closeNav);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) closeNav();
    });
    if (drawer) drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });

    // Newsletter — presentational validation + success toggle (ADR-0006).
    var nlForm = document.querySelector('[data-newsletter]');
    if (nlForm) {
      var nlInput = nlForm.querySelector('input[type="email"]');
      var nlErr = nlForm.querySelector('[data-nl-error]');
      var nlOk = document.querySelector('[data-nl-success]');
      nlForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var v = (nlInput.value || '').trim();
        var valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
        if (!valid) {
          nlInput.setAttribute('aria-invalid', 'true');
          if (nlErr) { nlErr.hidden = false; nlInput.setAttribute('aria-describedby', 'nl-error'); }
          nlInput.focus();
          return;
        }
        nlInput.removeAttribute('aria-invalid');
        if (nlErr) nlErr.hidden = true;
        nlForm.hidden = true;
        if (nlOk) { nlOk.hidden = false; nlOk.focus && nlOk.focus(); }
      });
      nlInput.addEventListener('input', function () {
        if (nlInput.getAttribute('aria-invalid') === 'true') {
          nlInput.removeAttribute('aria-invalid');
          if (nlErr) nlErr.hidden = true;
        }
      });
    }

    // Scroll reveal (skipped entirely under reduced-motion).
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var reveals = document.querySelectorAll('[data-reveal]');
    if (reduce || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      reveals.forEach(function (el) { io.observe(el); });
    }
  });
})();

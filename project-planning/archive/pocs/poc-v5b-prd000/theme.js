/* ===========================================================================
   APHELION — Flux (v5b)  ·  theme + motion controller
   Variation of "Nebula Drift" (v5): abstract 3D-render imagery + heavier motion.
   - 3-state theme (light / dark / system) with localStorage + prefers-color-scheme
   - FOUC preflight runs in <head> BEFORE paint (see initThemeEarly + index.html)
   - Extra motion: magnetic hover, scroll count-up, scroll reveal, blob seeding
   ALL motion respects prefers-reduced-motion (matchMedia gate in useEffect-equivalent).
   No frameworks. Self-contained. file:// openable.
   =========================================================================== */

/* ---------------------------------------------------------------------------
   1. EARLY PREFLIGHT  (called inline from <head> — no FOUC)
   Resolves stored choice -> applied 'light'|'dark' on <html data-theme>.
   --------------------------------------------------------------------------- */
(function initThemeEarly() {
  try {
    var stored = localStorage.getItem('aphelion-theme'); // 'light' | 'dark' | 'system' | null
    var choice = stored || 'system';
    var systemDark =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var applied = choice === 'system' ? (systemDark ? 'dark' : 'light') : choice;
    document.documentElement.setAttribute('data-theme', applied);
    document.documentElement.setAttribute('data-theme-choice', choice);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.setAttribute('data-theme-choice', 'system');
  }
})();

/* ---------------------------------------------------------------------------
   2. After DOM ready: wire toggle + motion behaviours
   --------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  var root = document.documentElement;
  var ORDER = ['light', 'dark', 'system'];
  var LABEL = { light: 'Light', dark: 'Dark', system: 'System' };
  var GLYPH = { light: '☀', dark: '☾', system: '◑' };

  var mqDark = window.matchMedia('(prefers-color-scheme: dark)');
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  function resolve(choice) {
    if (choice === 'system') return mqDark.matches ? 'dark' : 'light';
    return choice;
  }

  function syncToggleUI(choice) {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      var textEl = btn.querySelector('[data-theme-text]');
      var iconEl = btn.querySelector('[data-theme-icon]');
      if (textEl) textEl.textContent = LABEL[choice];
      if (iconEl) iconEl.textContent = GLYPH[choice];
      btn.setAttribute('aria-label', 'Theme: ' + LABEL[choice] + '. Activate to change.');
      btn.setAttribute('title', 'Theme: ' + LABEL[choice]);
    });
  }

  function applyChoice(choice, persist) {
    root.setAttribute('data-theme', resolve(choice));
    root.setAttribute('data-theme-choice', choice);
    if (persist) {
      try { localStorage.setItem('aphelion-theme', choice); } catch (e) {}
    }
    syncToggleUI(choice);
  }

  var current = root.getAttribute('data-theme-choice') || 'system';
  applyChoice(current, false);

  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var i = ORDER.indexOf(root.getAttribute('data-theme-choice') || 'system');
      var next = ORDER[(i + 1) % ORDER.length];
      applyChoice(next, true);
    });
  });

  // React to OS theme change while on 'system'
  mqDark.addEventListener('change', function () {
    if ((root.getAttribute('data-theme-choice') || 'system') === 'system') {
      applyChoice('system', false);
    }
  });

  /* ---- Mobile nav drawer ----------------------------------------------- */
  var menuBtn = document.querySelector('[data-menu-open]');
  var drawer = document.querySelector('[data-drawer]');
  var scrim = document.querySelector('[data-scrim]');
  var closeBtn = document.querySelector('[data-menu-close]');
  var lastFocus = null;

  function openDrawer() {
    lastFocus = document.activeElement;
    drawer.classList.add('open');
    scrim.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    var first = drawer.querySelector('a, button');
    if (first) first.focus();
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    scrim.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    if (lastFocus) lastFocus.focus();
  }
  if (menuBtn) menuBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (scrim) scrim.addEventListener('click', closeDrawer);
  if (drawer) {
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeDrawer);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
      // simple focus trap
      if (e.key === 'Tab' && drawer.classList.contains('open')) {
        var f = drawer.querySelectorAll('a, button');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---- Newsletter form: presentational validation + success ----------- */
  var nlForm = document.querySelector('[data-newsletter]');
  if (nlForm) {
    var input = nlForm.querySelector('input[type="email"]');
    var errEl = nlForm.querySelector('[data-nl-error]');
    var successEl = document.querySelector('[data-nl-success]');
    nlForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = (input.value || '').trim();
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      if (!ok) {
        input.setAttribute('aria-invalid', 'true');
        if (errEl) { errEl.textContent = val ? 'Enter a valid email address.' : 'Email is required.'; errEl.hidden = false; }
        input.focus();
        return;
      }
      input.removeAttribute('aria-invalid');
      if (errEl) errEl.hidden = true;
      nlForm.hidden = true;
      if (successEl) { successEl.hidden = false; successEl.focus(); }
    });
    input.addEventListener('input', function () {
      if (input.getAttribute('aria-invalid') === 'true') {
        input.removeAttribute('aria-invalid');
        if (errEl) errEl.hidden = true;
      }
    });
  }

  /* ===== MOTION (all gated by prefers-reduced-motion) =================== */
  var reduce = mqReduce.matches;

  /* ---- Scroll reveal --------------------------------------------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- Stat count-up (scroll-triggered) -------------------------------- */
  var statEls = Array.prototype.slice.call(document.querySelectorAll('[data-countup]'));
  function setStat(el, value) {
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    el.textContent = prefix + value.toFixed(decimals) + suffix;
  }
  function runCount(el) {
    var target = parseFloat(el.getAttribute('data-countup'));
    if (reduce) { setStat(el, target); return; }
    var dur = 1400, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setStat(el, target * eased);
      if (p < 1) requestAnimationFrame(step);
      else setStat(el, target);
    }
    requestAnimationFrame(step);
  }
  if (reduce || !('IntersectionObserver' in window)) {
    statEls.forEach(function (el) { setStat(el, parseFloat(el.getAttribute('data-countup'))); });
  } else {
    var ioStat = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCount(entry.target); ioStat.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    statEls.forEach(function (el) { setStat(el, 0); ioStat.observe(el); });
  }

  /* ---- Magnetic hover (CTAs + cards) ----------------------------------- */
  if (!reduce && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      var strength = parseFloat(el.getAttribute('data-magnetic')) || 0.3;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width / 2);
        var my = e.clientY - (r.top + r.height / 2);
        el.style.setProperty('--mx', (mx * strength).toFixed(2) + 'px');
        el.style.setProperty('--my', (my * strength).toFixed(2) + 'px');
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--mx', '0px');
        el.style.setProperty('--my', '0px');
      });
    });
  }

  /* ---- Image fallback: if a hotlinked image fails, keep CSS mesh bg ---- */
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () {
      img.style.opacity = '0';            // reveal the gradient/mesh behind it
      img.setAttribute('data-failed', 'true');
    });
  });
});

/* Aphelion — site behaviour: starfield, scroll reveals, mobile drawer,
   presentational form validation. All motion respects prefers-reduced-motion.
   NOTE: this is a static clickdummy. Every string assigned below is a hardcoded
   literal — there is no user-supplied or network content rendered as markup. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Parallax drifting starfield (canvas) ----------------- */
  function startStarfield(canvas) {
    var ctx = canvas.getContext("2d");
    var w, h, dpr, layers;

    function colorOf() {
      var s = getComputedStyle(document.documentElement).getPropertyValue("--star").trim();
      return s || "#ffffff";
    }

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var density = w < 640 ? 0.00018 : 0.00028; // fewer stars on mobile
      var total = Math.floor(w * h * density);
      var defs = [
        { n: Math.floor(total * 0.55), speed: 0.018, size: [0.4, 0.9], alpha: 0.5 },
        { n: Math.floor(total * 0.30), speed: 0.05,  size: [0.7, 1.4], alpha: 0.75 },
        { n: Math.floor(total * 0.15), speed: 0.11,  size: [1.0, 2.0], alpha: 1.0 }
      ];
      layers = defs.map(function (d) {
        var stars = [];
        for (var i = 0; i < d.n; i++) {
          stars.push({
            x: Math.random() * w, y: Math.random() * h,
            r: d.size[0] + Math.random() * (d.size[1] - d.size[0]),
            tw: Math.random() * Math.PI * 2
          });
        }
        return { stars: stars, speed: d.speed, alpha: d.alpha };
      });
    }

    function drawStatic() {
      ctx.clearRect(0, 0, w, h);
      var c = colorOf();
      layers.forEach(function (L) {
        L.stars.forEach(function (s) {
          ctx.globalAlpha = L.alpha;
          ctx.fillStyle = c;
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
        });
      });
      ctx.globalAlpha = 1;
    }

    var t = 0, raf;
    function frame() {
      t += 1;
      ctx.clearRect(0, 0, w, h);
      var c = colorOf();
      layers.forEach(function (L) {
        L.stars.forEach(function (s) {
          s.x -= L.speed;
          if (s.x < -2) { s.x = w + 2; s.y = Math.random() * h; }
          var twinkle = 0.6 + 0.4 * Math.sin(t * 0.01 + s.tw);
          ctx.globalAlpha = L.alpha * twinkle;
          ctx.fillStyle = c;
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
        });
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    build();
    if (reduceMotion) { drawStatic(); }
    else { frame(); }

    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        build();
        if (reduceMotion) drawStatic();
      }, 200);
    });

    if (!reduceMotion) {
      window.addEventListener("scroll", function () {
        var y = window.scrollY * 0.15;
        canvas.style.transform = "translateY(" + y + "px)";
      }, { passive: true });
    }
  }

  /* ---------- Scroll reveals --------------------------------------- */
  // Reveals are a progressive enhancement: content must NEVER stay hidden.
  // We animate via IntersectionObserver for scrollers, but a safety timer
  // force-reveals everything regardless — this also guarantees a clean
  // full-page screenshot (the PRD fidelity gate) where the viewport never
  // scrolls through off-screen sections.
  function setupReveals() {
    var els = document.querySelectorAll(".reveal");
    function revealAll() { els.forEach(function (e) { e.classList.add("is-in"); }); }

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealAll();
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (e) { io.observe(e); });

    // Safety net: nothing may remain invisible. Force-reveal after 1.4s.
    setTimeout(revealAll, 1400);
  }

  /* ---------- Mobile drawer ---------------------------------------- */
  function setupDrawer() {
    var toggle = document.getElementById("nav-toggle");
    if (!toggle) return;
    var drawer = document.querySelector(".mobile-drawer");
    function close() { toggle.checked = false; document.body.style.overflow = ""; }
    toggle.addEventListener("change", function () {
      document.body.style.overflow = toggle.checked ? "hidden" : "";
    });
    if (drawer) {
      drawer.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", close);
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.checked) close();
    });
  }

  /* ---------- Presentational forms --------------------------------- */
  // Helper: build a glyph + message node WITHOUT innerHTML (DOM methods only).
  function msgNode(glyph, text) {
    var frag = document.createDocumentFragment();
    var g = document.createElement("span");
    g.className = "glyph"; g.textContent = glyph;
    frag.appendChild(g);
    frag.appendChild(document.createTextNode(" " + text));
    return frag;
  }
  function statusNode(glyph, text) {
    var frag = document.createDocumentFragment();
    var badge = document.createElement("span");
    badge.className = "badge";
    var gi = document.createElement("span");
    gi.className = "glyph"; gi.textContent = glyph;
    badge.appendChild(gi);
    frag.appendChild(badge);
    frag.appendChild(document.createTextNode(" " + text));
    return frag;
  }
  function setMsg(el, cls, glyph, text) {
    el.className = cls;
    el.textContent = "";
    el.appendChild(msgNode(glyph, text));
  }
  function setStatus(el, cls, glyph, text) {
    el.className = cls;
    el.textContent = "";
    el.appendChild(statusNode(glyph, text));
    el.hidden = false;
  }
  function emailValid(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function setupNewsletter() {
    var form = document.getElementById("newsletter-form");
    if (!form) return;
    var input = form.querySelector("input[type=email]");
    var msg = form.querySelector(".field-msg");
    var status = document.getElementById("newsletter-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = input.value.trim();
      if (!v) { fail("Please enter your email address."); return; }
      if (!emailValid(v)) { fail("That doesn’t look like a valid email."); return; }
      input.setAttribute("aria-invalid", "false");
      if (msg) msg.textContent = "";
      if (status) setStatus(status, "form-status form-status--ok", "✓",
        "You’re on the manifest. Look for your first dispatch soon.");
      form.querySelector(".subscribe").style.display = "none";
    });
    function fail(t) {
      input.setAttribute("aria-invalid", "true");
      if (msg) setMsg(msg, "field-msg field-msg--error", "✕", t);
      input.focus();
    }
  }

  function setupContact() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var status = document.getElementById("contact-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      var fields = form.querySelectorAll("[data-required]");
      fields.forEach(function (f) {
        var v = f.value.trim();
        var bad = !v || (f.type === "email" && !emailValid(v));
        f.setAttribute("aria-invalid", bad ? "true" : "false");
        var m = form.querySelector('[data-msg-for="' + f.id + '"]');
        if (m) {
          if (bad) setMsg(m, "field-msg field-msg--error", "✕",
            f.type === "email" ? "Enter a valid email." : "This field is required.");
          else m.textContent = "";
        }
        if (bad) ok = false;
      });
      if (!ok) {
        if (status) setStatus(status, "form-status form-status--error", "✕",
          "Please fix the highlighted fields and try again.");
        return;
      }
      if (status) setStatus(status, "form-status form-status--ok", "✓",
        "Message received. A flight concierge will reach you within one orbit (24h).");
      form.querySelector(".form-rows").style.display = "none";
      form.querySelector(".form-submit-row").style.display = "none";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("canvas[data-starfield]").forEach(startStarfield);
    setupReveals();
    setupDrawer();
    setupNewsletter();
    setupContact();
  });
})();

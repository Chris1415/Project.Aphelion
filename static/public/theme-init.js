/* ===========================================================================
   APHELION — Theme preflight (FOUC-safe)
   Ported from pocs/poc-v5b-prd000/theme.js § "1. EARLY PREFLIGHT"
   Runs parser-blocking from <head> via <script src="/theme-init.js"> (NOT async/defer).
   Resolves stored choice → applied 'light'|'dark' on <html data-theme> BEFORE paint.
   =========================================================================== */
(function initThemeEarly() {
  try {
    var stored = localStorage.getItem('aphelion-theme'); // 'light' | 'dark' | 'system' | null
    var choice = stored || 'system';
    var systemDark =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var applied = choice === 'system' ? (systemDark ? 'dark' : 'light') : choice;
    document.documentElement.setAttribute('data-theme', applied);
    document.documentElement.setAttribute('data-theme-choice', choice);
  } catch (e) { void e; // silences unused-var in older tooling
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.setAttribute('data-theme-choice', 'system');
  }
})();

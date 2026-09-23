/*
 * Demo-balk voor de GitHub Pages-versie van dit project.
 * Laat zien dat het een demo is met voorbeelddata, geeft eventuele inloggegevens
 * en een knop om de voorbeelddata te resetten. Instellingen via data-attributen op de <script>-tag.
 */
(function () {
  var s = document.currentScript;
  var home = (s && s.getAttribute('data-home')) || '../../';
  var hint = (s && s.getAttribute('data-hint')) || '';
  var KEY = 'demo-banner-collapsed';

  function reset() {
    if (!confirm('Alle voorbeelddata terugzetten naar de beginstand?')) return;
    try {
      Object.keys(localStorage).forEach(function (k) { localStorage.removeItem(k); });
      sessionStorage.clear();
    } catch (e) {}
    location.hash = '';
    location.reload();
  }

  function build() {
    var collapsed = false;
    try { collapsed = sessionStorage.getItem(KEY) === '1'; } catch (e) {}

    var css = document.createElement('style');
    css.textContent =
      '.demo-bar{position:fixed;left:12px;bottom:12px;z-index:2147483000;font:13px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;' +
      'background:#111827;color:#f9fafb;border-radius:12px;box-shadow:0 6px 24px rgba(0,0,0,.25);max-width:calc(100vw - 24px);}' +
      '.demo-bar__in{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;padding:10px 14px;}' +
      '.demo-bar b{color:#a5b4fc;font-weight:600}' +
      '.demo-bar a,.demo-bar button{font:inherit;color:#f9fafb;background:rgba(255,255,255,.1);border:0;border-radius:8px;padding:4px 10px;cursor:pointer;text-decoration:none}' +
      '.demo-bar a:hover,.demo-bar button:hover{background:rgba(255,255,255,.2)}' +
      '.demo-bar .demo-bar__hint{color:#d1d5db}' +
      '.demo-bar.is-min .demo-bar__full{display:none}' +
      '.demo-bar:not(.is-min) .demo-bar__pill{display:none}';
    document.head.appendChild(css);

    var bar = document.createElement('div');
    bar.className = 'demo-bar' + (collapsed ? ' is-min' : '');
    bar.setAttribute('role', 'note');
    bar.innerHTML =
      '<div class="demo-bar__in demo-bar__full">' +
        '<span><b>Demoversie</b> · draait zonder server, met voorbeelddata in je browser</span>' +
        (hint ? '<span class="demo-bar__hint">' + hint + '</span>' : '') +
        '<a href="' + home + '">← Portfolio</a>' +
        '<button type="button" data-act="reset">Reset data</button>' +
        '<button type="button" data-act="min" aria-label="Minimaliseren">–</button>' +
      '</div>' +
      '<div class="demo-bar__in demo-bar__pill"><button type="button" data-act="max"><b>Demo</b> ⓘ</button></div>';
    bar.addEventListener('click', function (e) {
      var act = e.target && e.target.closest && e.target.closest('[data-act]');
      if (!act) return;
      var a = act.getAttribute('data-act');
      if (a === 'reset') reset();
      if (a === 'min' || a === 'max') {
        var min = a === 'min';
        bar.classList.toggle('is-min', min);
        try { sessionStorage.setItem(KEY, min ? '1' : '0'); } catch (e) {}
      }
    });
    document.body.appendChild(bar);
  }

  // Externe afbeeldingen die niet (meer) laden vervangen door een nette placeholder.
  var PLACEHOLDER = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">' +
    '<rect width="400" height="300" fill="#f3f4f6"/>' +
    '<g fill="none" stroke="#9ca3af" stroke-width="8" stroke-linejoin="round"><rect x="140" y="95" width="120" height="100" rx="10"/>' +
    '<path d="M150 180l35-40 30 30 20-20 25 30"/></g><circle cx="235" cy="125" r="10" fill="#9ca3af"/>' +
    '<text x="200" y="235" font-family="system-ui,sans-serif" font-size="16" fill="#6b7280" text-anchor="middle">Afbeelding niet beschikbaar</text></svg>');
  document.addEventListener('error', function (e) {
    var t = e.target;
    if (t && t.tagName === 'IMG' && !t.getAttribute('data-fallback')) {
      t.setAttribute('data-fallback', '1');
      t.src = PLACEHOLDER;
    }
  }, true);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();

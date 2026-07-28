/*
 * Adds a "Load next 10" bar under Google's results. Each click fetches the next
 * page, lifts its #rso block and appends it, up to 100. Stops if Google shows a
 * captcha.
 *
 * Same-origin fetch from a google.com page, so no permissions are needed.
 */
(function () {
  var MAX = 100;               // stop at ~100 results, like the old &num=100
  var STEP = 10;
  var loadedTo = R100.currentStart(location.href) + STEP; // results already on this page
  var busy = false;

  var rso = document.querySelector('#rso');
  if (!rso) return;            // not a normal results page

  var style = document.createElement('style');
  style.textContent =
    '.r100-bar{display:flex;flex-direction:column;align-items:center;gap:8px;margin:26px 0 40px;font:14px system-ui,sans-serif}' +
    '.r100-btn{padding:11px 26px;border:1px solid #dadce0;border-radius:20px;background:#fff;color:#1a73e8;font-weight:600;cursor:pointer}' +
    '.r100-btn:hover{background:#f8faff;box-shadow:0 1px 3px rgba(0,0,0,.1)}' +
    '.r100-btn:disabled{opacity:.6;cursor:default}' +
    '.r100-note{color:#70757a;font-size:12.5px}' +
    '@media (prefers-color-scheme:dark){.r100-btn{background:#202124;color:#8ab4f8;border-color:#3c4043}.r100-note{color:#9aa0a6}}';
  document.head.appendChild(style);

  var bar = document.createElement('div');
  bar.className = 'r100-bar';
  var btn = document.createElement('button');
  btn.className = 'r100-btn';
  var note = document.createElement('div');
  note.className = 'r100-note';
  bar.appendChild(btn); bar.appendChild(note);
  rso.parentNode.insertBefore(bar, rso.nextSibling);

  function label() { btn.textContent = 'Load results ' + (loadedTo + 1) + '–' + (loadedTo + STEP) + ' ↓'; }
  label();

  btn.addEventListener('click', async function () {
    if (busy || loadedTo >= MAX) return;
    busy = true; btn.disabled = true; note.textContent = 'loading…';
    try {
      // fetch exactly start=loadedTo (page 1 shows 0-9, so loadedTo starts at 10)
      var u = new URL(location.href); u.searchParams.set('start', String(loadedTo));
      var resp = await fetch(u.toString(), { credentials: 'include' });
      // A real block redirects to /sorry/ or returns 429. The HTML scan is a
      // weak fallback.
      var blocked = resp.status === 429 || (resp.redirected && /\/sorry\//.test(resp.url));
      var html = await resp.text();
      var next = R100.extractResults(html);
      var kids = next ? Array.prototype.slice.call(next.children) : [];
      var hasResults = kids.some(function (k) { return k.querySelector && k.querySelector('h3'); });
      if (!hasResults) {
        if (blocked || R100.looksBlocked(html)) note.textContent = 'Google asked for a captcha. Open the next page normally to continue.';
        else { note.textContent = 'No more results.'; btn.style.display = 'none'; }
        return;
      }
      kids.forEach(function (n) { rso.appendChild(document.importNode(n, true)); });
      loadedTo += STEP;
      note.textContent = 'showing ' + loadedTo + ' results';
      if (loadedTo >= MAX) { btn.style.display = 'none'; note.textContent = loadedTo + ' results, the old 100.'; }
      else { label(); }
    } catch (e) {
      note.textContent = 'Could not load the next page.';
    } finally {
      busy = false; btn.disabled = false;
    }
  });
})();

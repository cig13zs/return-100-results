/*
 * Return 100 Results — core logic.
 *
 * Google disabled &num=100 in 2025, so you can't get 100 results on one page
 * anymore. Page-by-page pagination (&start=10,20,…) still works, so this
 * restores the *effect*: fetch the next page and append its results inline,
 * up to 100, giving one long scrollable list again.
 *
 *   nextPageUrl(href, step) -> URL for the next page (pure, tested)
 *   extractResults(htmlString) -> the #rso results block from a fetched page
 *   looksBlocked(htmlString) -> true if Google served a captcha/sorry page
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.R100 = factory();
}(typeof self !== 'undefined' ? self : this, function () {

  // Increment the &start offset, preserving the query and every other param.
  function nextPageUrl(href, step) {
    step = step || 10;
    var u = new URL(href, 'https://www.google.com');
    var start = parseInt(u.searchParams.get('start') || '0', 10) || 0;
    u.searchParams.set('start', String(start + step));
    return u.pathname + '?' + u.searchParams.toString();
  }

  function currentStart(href) {
    var u = new URL(href, 'https://www.google.com');
    return parseInt(u.searchParams.get('start') || '0', 10) || 0;
  }

  // Google shows a captcha/"unusual traffic" interstitial when it thinks you're
  // a bot. Detect it so we stop cleanly instead of appending garbage.
  function looksBlocked(html) {
    return /\/sorry\/index|detected unusual traffic|id="recaptcha"/i.test(html);
  }

  // Pull the organic-results container (#rso) out of a fetched results page.
  // Browser-only (needs DOMParser); returns an element or null.
  function extractResults(html, DOMParserImpl) {
    var P = DOMParserImpl || (typeof DOMParser !== 'undefined' ? DOMParser : null);
    if (!P) return null;
    var doc = new P().parseFromString(html, 'text/html');
    return doc.querySelector('#rso');
  }

  return { nextPageUrl: nextPageUrl, currentStart: currentStart, looksBlocked: looksBlocked, extractResults: extractResults };
}));

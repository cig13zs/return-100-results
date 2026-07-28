/*
 * Core logic. &num=100 is gone but &start= pagination still works, so we fetch
 * the next page and append its results inline.
 *
 *   nextPageUrl(href, step)    -> URL for the next page
 *   extractResults(htmlString) -> the #rso block from a fetched page
 *   looksBlocked(htmlString)   -> true on a captcha / sorry page
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

  // Detect the "unusual traffic" interstitial so we stop instead of appending
  // its markup as results.
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

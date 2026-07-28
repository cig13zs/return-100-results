/*
 * Covers pagination and block detection. The fetch/parse/append path is checked
 * in the browser against live Google. Run: node core.test.js
 */
var assert = require('assert');
var R = require('./extension/core.js');

// nextPageUrl: bump &start by step, keep the query and other params.
assert.strictEqual(R.nextPageUrl('/search?q=cats', 10), '/search?q=cats&start=10');
assert.strictEqual(R.nextPageUrl('/search?q=cats&start=10', 10), '/search?q=cats&start=20');
assert.strictEqual(R.nextPageUrl('/search?q=a+b&hl=en&start=30', 10), '/search?q=a+b&hl=en&start=40');

// currentStart: read the offset, default 0.
assert.strictEqual(R.currentStart('https://www.google.com/search?q=x'), 0);
assert.strictEqual(R.currentStart('https://www.google.com/search?q=x&start=40'), 40);

// looksBlocked: catch Google's captcha / unusual-traffic interstitials.
assert.strictEqual(R.looksBlocked('<html>we have detected unusual traffic</html>'), true);
assert.strictEqual(R.looksBlocked('<form action="/sorry/index">'), true);
assert.strictEqual(R.looksBlocked('<div id="recaptcha"></div>'), true);
// must NOT false-positive on a normal results page that merely embeds a recaptcha script token
assert.strictEqual(R.looksBlocked('<div id="rso"><div class="g">result</div></div><script>grecaptcha</script>'), false);

console.log('ok, pagination and block-detection checks passed');

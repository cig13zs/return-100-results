const assert = require('assert');
const fs = require('fs');
const path = require('path');

const manifest = JSON.parse(fs.readFileSync('extension/manifest.json', 'utf8'));
const popup = fs.readFileSync('extension/popup.html', 'utf8');

assert.strictEqual(manifest.manifest_version, 3);
assert.match(popup, /<html lang="en">/);
assert.match(popup, /name="viewport"/);
assert.match(popup, /name="description"/);
assert.match(popup, /<title>Return 100 Results<\/title>/);
assert.ok(!/<button\b(?![^>]*\btype=)/i.test(popup));
for (const iconPath of new Set([
  ...Object.values(manifest.icons || {}),
  ...Object.values((manifest.action && manifest.action.default_icon) || {}),
])) {
  assert.ok(fs.existsSync(path.join('extension', iconPath)), 'manifest icon is missing: ' + iconPath);
}
for (const script of manifest.content_scripts.flatMap(entry => entry.js || [])) {
  assert.ok(fs.existsSync(path.join('extension', script)), 'content script is missing: ' + script);
}

console.log('ok, Return 100 Results package checks passed');

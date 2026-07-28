# Return 100 Results

Google disabled 100 results per page (`&num=100`) in 2025. This loads the next
pages inline so you can browse about 100 results as one long list again, without
clicking through pages 2, 3 and 4.

[![Ko-fi](https://img.shields.io/badge/Ko--fi-buy_me_a_coffee-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/jju1s)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Tests](https://img.shields.io/github/actions/workflow/status/cig13zs/return-100-results/test.yml?style=flat-square&label=tests)](https://github.com/cig13zs/return-100-results/actions)

**[cig13zs.github.io/return-100-results](https://cig13zs.github.io/return-100-results/)**

`&num=100` was how you got a hundred results on one page, which mattered for
research, SEO work and comparing a lot of sources at once. Google capped it at
ten. Page-by-page pagination (`&start=`) still works, so this restores the same
workflow: a "Load next 10" button under the results that fetches the next page
and stitches it inline, up to a hundred.

It loads one page per click rather than a burst, so Google doesn't flag it as a
bot. If Google does show a captcha it stops and tells you to open the next page
normally.

## No server, no tracking

It re-fetches Google's own next results page from your browser, same origin, and
appends it. No third-party connection, no analytics, and no `permissions` key in
the manifest. It runs on Google search pages only.

## Install

Not on the Chrome Web Store yet, so load it unpacked. Chrome, Edge, Brave,
Opera.

1. Download the latest zip from [Releases](https://github.com/cig13zs/return-100-results/releases) and unzip it.
2. Open `chrome://extensions`, turn on Developer mode.
3. Load unpacked, then pick the `extension` folder.
4. Search Google and scroll to the button under the results.

## Files

```
extension/
  manifest.json   MV3, runs only on google search pages
  core.js         nextPageUrl() + extractResults() + block detection
  content.js      adds the button, fetches and appends the next page, stops at ~100
  popup.html      toolbar popup
  icons/
core.test.js      node core.test.js
```

```bash
node core.test.js
```

Checked against live Google: the next page fetches, its `#rso` block is lifted
and appended, and a real captcha is detected via the response redirect rather
than a brittle HTML scan.

## Limits

One click at a time, up to about 100. Auto-blasting ten pages at once is exactly
what trips Google's bot detection.

Depends on Google keeping `&start=` pagination. If that goes too, no client-side
tool can bring 100 results back, because the results wouldn't exist to fetch.

Covers the main Google TLDs. Add a line to the manifest for others.

## More tools

- [Carryover](https://github.com/cig13zs/carryover), AI chat context transfer for ChatGPT, DeepSeek and Grok
- [Invisibles](https://github.com/cig13zs/invisibles), reveal and strip hidden Unicode from text
- [Rinse](https://github.com/cig13zs/rinse), see the GPS in a photo and wash it off
- [Return Google Cache](https://github.com/cig13zs/return-google-cache), put the Cached link back on Google results

Not affiliated with Google. MIT licensed. [Ko-fi](https://ko-fi.com/jju1s).

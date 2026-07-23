# Return 100 Results

Google disabled **100 results per page** (`&num=100`) in 2025. This loads the next pages inline so
you can browse ~100 results as one long list again — no clicking through pages 2, 3, 4.

[![Ko-fi](https://img.shields.io/badge/Ko--fi-buy_me_a_coffee-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/jju1s)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Tests](https://img.shields.io/github/actions/workflow/status/cig13zs/return-100-results/test.yml?style=flat-square&label=tests)](https://github.com/cig13zs/return-100-results/actions)

**[cig13zs.github.io/return-100-results](https://cig13zs.github.io/return-100-results/)**

For years, `&num=100` gave you a hundred results on one page — the backbone of research, SEO, and
comparing a lot of sources at once. Google capped it at ten. Page-by-page pagination (`&start=…`)
still works, so this restores the *experience*: a **Load next 10 ↓** button under the results that
fetches the next page and stitches it inline, up to a hundred.

## Gentle by design

It loads **one page per click**, not a burst, so Google doesn't flag it as a bot. If Google ever
does show a captcha, it stops and tells you to open the next page normally — it never hammers.

## No server, no tracking

It re-fetches Google's own next results page from your own browser (same-origin) and appends it. It
opens no third-party connection, has no analytics, and declares no `permissions` key — it runs only
on Google search pages.

## Install

Not on the Chrome Web Store yet — load it unpacked (Chrome, Edge, Brave, Opera):

1. Download the latest zip from [Releases](https://github.com/cig13zs/return-100-results/releases) and unzip it.
2. Open `chrome://extensions`, turn on **Developer mode**.
3. **Load unpacked** → pick the `extension` folder.
4. Search Google, scroll to the button under the results.

## How it's built

```
extension/
  manifest.json   MV3, runs only on google search pages
  core.js         nextPageUrl() + extractResults() + block detection — browser + Node
  content.js      adds the button, fetches + appends the next page, stops at ~100
  popup.html      toolbar popup
  icons/
core.test.js      node core.test.js
```

```bash
node core.test.js
```

Verified against live Google: the next page fetches, its `#rso` block is lifted and appended, and a
real captcha is detected via the response redirect (not a brittle HTML scan).

## Limits

- **~100, one click at a time.** That's deliberate — auto-blasting ten pages at once is exactly what
  trips Google's bot detection. Slow and quiet beats fast and captcha'd.
- **Depends on Google keeping `&start=` pagination.** If Google removes that too, no client-side tool
  can bring 100 results back — the results would simply not exist to fetch.
- **Covers the main Google TLDs;** add a line to the manifest for others.

MIT licensed. Do what you like with it.

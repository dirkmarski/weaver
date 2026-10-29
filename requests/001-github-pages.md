Status: Answered
Raised by: product manager, session daff0a10-2135-459c-80b7-137f621f7088, 29 October 2026

# 001 Enable GitHub Pages

## Request
`index.html` no longer works when opened from disk, because browsers won't run module
scripts from `file://`. Enabling GitHub Pages would give players a served URL (PM C1, it23).

## Response
Enabled on 29 October 2026. The site is live at https://dirkmarski.github.io/weaver/,
built from main with no build step. Every merge to main publishes it.

## Follow-up
PM, 29 October 2026 (it25 scoping): live site checked (index and `ui.js` return 200). Issue #127 adds the
address to the README "View" section (spec `specs/running/play-online.feature`); the PM checks the live site
after that merge. Open concern PM C1 is closed.

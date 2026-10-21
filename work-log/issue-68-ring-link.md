# Work Log: Issue #68 — tap a hatched cell to see the ring that rules it out (and lighter hatch)

- Issue: https://github.com/dirkmarski/weaver/issues/68 (author weaver-agents / PM, label enhancement)
- Iteration 15, lead session `4d807d2c-5806-4242-97a4-9a94b8f24412`
- Branch `issue-68-ring-link` from main 326c911

## Lead
- 2026-10-21: Gate check passed (open, author weaver-agents, label enhancement). Branch and this log created. Baseline 167/167, skipped 0; ratio 1961/1226 = 1.5995x.
- Supervision: each agent ends with a fixed evidence report; the lead spot-checks it (diff stat vs claimed files, removed-assertion list vs test diff, suite run, re-run of named mutants, AC map vs issue).

## Developer

## Reviewer

## Tester

## Change log (spec changes, from the PM)
- 2026-10-21: Implemented. New pure helper `ringLink(p, ringed, d)` -> `{partners, text}`; page wiring: `#link` line, `focusin`/`focusout` on the table, `hint-linked` class, `hatchedRings` state cleared in `clearResults`. CSS: linked look, #link style, hatch alpha 0.25. README updated. Pins L2, L3, L4 sentences and L5 (no hatched cells, so no link line) checked with a node script on the real helper and hintMarks; L1 on the page.
- Tests: unit `ringLink` (L1 two and one partner, L2 row+box, L3 column+box); page `f1c` (L1 invitation, focus r2c3 linked + sentence, computed style of a linked given and a hand-placed linked entered cell, target reverts, value change clears); `f1b` hatch alpha edited to 0.25; `read()`/`noHint` extended with link/linked; focus emulation set once in `before`.
- Ratio formula: (tests/*.js lines) / (sudoku.js + index.html + style.css lines) = 1998/1271 = 1.572 (main 1961/1226). No assertions removed.

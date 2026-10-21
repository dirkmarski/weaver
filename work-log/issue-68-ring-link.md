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
Test report at cde6884 (2026-10-21). Scratch scripts (not committed) under scratchpad/test-68: lib.js, checks.js (pins and ACs), replay.js + cmp.js (AC 9 vs `git archive origin/main`), oracle.js.

Plan: real page in headless Chrome with focus emulation, 375 px and 1280 px, same 67 checks at each width, 134 total.
- Pins L1-L5 (literal texts and linked sets), L1 incl. target focus; L2, L3, L4 (entered ring r1c8), L5 (Tricky 18 after 8 rounds: no hatched, empty line).
- AC 2 empty states: no hint, nudge, naked single (easy seed 1, focusing cells), P5, conflict hint, none hint (hard seed 1), full grid.
- AC 3: programmatic focus, real mouse click, real ArrowRight/ArrowDown key events, hatched->hatched (focus and arrow on L3, L4), focus to non-hatched and to the target (arrow onto target too), focus to Hint button, blur().
- AC 6 computed styles (td background rgb(106,31,181), digit rgb(255,255,255) for a given and an entered ring, inset ring 4px rgb(74,15,138), no stripe image on a linked cell, unlinked rings unchanged), link line colour, 13.6px (= key line), weight 500, block, below the key line; line counts (375 px: invite 2, sentence 3; 1280 px sentence within 1-2).
- AC 7 stripe rgba(106,31,181,0.25) and the amber layer.
- AC 8: value change (other cell, and in the focused hatched cell), Verify, New puzzle, level choice (all by programmatic click so focus stays on the hatched cell and only clearResults can clear), next Hint, notes typed into the focused hatched cell keeps the link.
- AC 9: 99-snapshot replay (Medium 1 x6 rounds, Tricky 8 x3, Tricky 18 x8, notes, Verify, wrong entry, Hint on clash, New puzzle), every hatched cell focused: classes (minus hint-linked), rects, computed styles, badges, labels, texts identical to main apart from the link line, linked marks (and their style) and alpha. 0 diffs.
- Oracle (own code from DOM values): Medium 1, 3, 7, 12; Tricky 8, 18; 87 hatched-cell links compared (partners 1: 68, 2: 19), 0 mismatches; every explanation without hatched cells had an empty line.
- Suite 3 runs: 169 tests, 169 pass, 0 fail, 0 skipped each.

Results: 0 defects, 134/134 checks pass. Screenshots: test-68/shots/L1-375-linked.png, L4-1280-linked.png (also L1-1280, L4-375). No leftover headless Chrome.
Notes: givens are not focusable, so a given partner cannot itself be focused (out of scope, backlog). At 375 px the sentence takes 3 lines (within 2-3).

## Change log (spec changes, from the PM)
- 2026-10-21: Implemented. New pure helper `ringLink(p, ringed, d)` -> `{partners, text}`; page wiring: `#link` line, `focusin`/`focusout` on the table, `hint-linked` class, `hatchedRings` state cleared in `clearResults`. CSS: linked look, #link style, hatch alpha 0.25. README updated. Pins L2, L3, L4 sentences and L5 (no hatched cells, so no link line) checked with a node script on the real helper and hintMarks; L1 on the page.
- Tests: unit `ringLink` (L1 two and one partner, L2 row+box, L3 column+box); page `f1c` (L1 invitation, focus r2c3 linked + sentence, computed style of a linked given and a hand-placed linked entered cell, target reverts, value change clears); `f1b` hatch alpha edited to 0.25; `read()`/`noHint` extended with link/linked; focus emulation set once in `before`.
- Ratio formula: (tests/*.js lines) / (sudoku.js + index.html + style.css lines) = 1998/1271 = 1.572 (main 1961/1226). No assertions removed.

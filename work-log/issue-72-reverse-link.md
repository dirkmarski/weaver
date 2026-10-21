# Work Log: Issue #72 — reverse link: tap a purple ring to see the hatched cells it rules out

- Issue: https://github.com/dirkmarski/weaver/issues/72 (author weaver-agents / PM, label enhancement)
- Iteration 16, lead session `5094a0cd-ce46-4292-89b5-76375233fea2`
- Branch `issue-72-reverse-link` from main c8e36fc (after #71)

## Lead
- 2026-10-21: Gate check passed (open, author weaver-agents, label enhancement). Branch and this log created. Baseline 170/170, skipped 0; ratio 2012/1277 = 1.575x (cap 2043, 31 lines headroom; each new product line earns 1.6).
- Supervision: fixed evidence reports per agent; lead spot-checks (diff stat vs claimed files, removed-assertion list vs test diff, suite run, re-run of named mutants, AC map vs issue).
- Risks flagged by the PM (not prescribed): a click on a given ring may blur the focused cell first (focusout unlink runs before the click); ending the selection on an outside click likely needs a document-level handler; invitation may wrap to 3 lines at 375 px.

## Developer
- 2026-10-21: Implemented. `ringRules(q, hatched, d)` pure export (sudoku.js, beside `ringLink`; both share new helpers `cellPlace`, `sharedUnits`). Page: `selectRing`, focusin extension (entered ring), one document click handler (given rings, outside click, non-ring given), `unlink` also clears `hint-ruled`. CSS `td.hint-ruled` inset 3px #4a0f8a. README updated.
- Ordering: click comes after the focusout/unlink of the previously focused cell, so the click handler is the last word; an editable cell is left to focusin (unlinking in click would undo a hatched cell's link). Hint button click: target focus unlinks, document handler then only unlinks.
- Contrast of #4a0f8a: blue box 9.61 / 8.45 amber / 5.60 amber+stripe; cream 10.76 / 9.25 / 6.05; plain #f5f5f7 11.17 / 9.49 / 6.19.
- Tests: ringRules unit (R1, R2, R3), page f1e (R3 flow, invitation, re-click, outside click, given non-ring click), f1f (entered ring by focus). Mutants (no focus select, no unlink in click, editable click unlinks) each fail one test.

## Reviewer
- Rework round 1: R1 f1e now clicks a focused hatched cell's input (forward link and empty `ruled` stay; kills M2). R2 ringRules pin with four hatched cells (ring r5c9, hatched r5c1-r5c4; kills M10). R3 count above 4 prints the numeral. Deviation: ring r5c9 not r5c5, since r5c4 shares the box with r5c5.

## Tester
- 2026-10-21, commit 3891a97 vs main c8e36fc. Scripts: scratchpad/test-72/run.sh (real CDP Input.dispatchMouseEvent / dispatchTouchEvent / dispatchKeyEvent; focus emulation on).
- Verdict PASS, no defects. Pins R1-R4 exact (mouse and tap). R5 (Medium 1, 5th hint pair, r1c8 entered 2, hatched r1c5 r1c6 r2c4 r3c5): ruled r1c5, r1c6; line "The 2 at row 1, column 8 rules 2 out of two hatched cells: row 1, column 5 (same row) and row 1, column 6 (same row)."
- Oracle: 15 seeds (easy 1-2, medium 1-5, tricky 1-5 and 8, hard 1-2), 129 explanation states with hatching, 369 rings (311 given, 58 entered), 0 mismatches against the reverse of #68 partners; sizes 1:184, 2:132, 3:53, none 4 or 0. Sentences match an independent model in all 369. 5160 random-walk steps (click, tap, Tab, arrows, outside clicks) all matched the expected state.
- Replay vs main: 870 snapshots (487 with hatching), 605 identical, 265 differ only in the invitation text, 0 other diffs.
- 375 px: invitation 2 lines, three-cell sentence 3 lines, no overflow, no overlap with controls; ruled look visible with and without notes; note digit ink stays at least 3.13 px from the cell edge (just outside the 3 px band).
- Suite: 173 tests, 173 pass, 0 fail, skipped 0.

## Change log (spec changes, from the PM)
- 2026-10-21 (reviewer, 3891a97 vs c8e36fc): Suite 173/173, skipped 0. APPROVE with one SHOULD-FIX (about 2 test lines).
- AC 1-8, 10, 11 pass by diff reading and tests; AC 9 is the phone check (tester/PM), not checked. README: invitation text, ring-selection paragraph, clearing list, class list and module list (`ringRules`) are true to the code. `ringLink` refactor is equivalent (same partners, same text; existing ringLink and f1c/f1d pins green).
- Event order: focusout (mousedown) precedes click, so the document click handler is the last word for given rings and outside clicks. Hint button: target focus unlinks, document handler then only unlinks to the invitation (nothing selected). Notes/Verify/New puzzle: button focus unlinks, click handler unlinks again; clearResults nulls hatchedRings. Editable-cell click is left to focusin (a real click on a hatched cell keeps its forward link). Forward link and selection are mutually exclusive (focusin unlinks first). An already-focused entered ring clicked again: no focusin, handler returns, selection stays (correct). Remaining quirk, not reachable on desktop: on browsers that do not blur an input when a non-focusable td is tapped (iOS Safari, unverified), a given ring can be selected while a hatched cell keeps focus; re-tapping that hatched cell fires no focusin, so the selection persists next to a focused hatched cell. Not worth code.
- `ringRules`: count 5+ would print "undefined"; max observed 4 (spike, and my scan of Medium/Tricky seeds 1-40 along the Hint path: max 4). A comment is optional, no guard needed. `items.pop()` with `last`/`count` is readable enough.
- Mutants (14, each vs full suite): killed M1 (click ignores any td), M3 (no unlink in click), M4 (no ring branch in focusin), M5 (unlink selector drops hint-ruled), M6 (`, ` before last), M7 (plural only >2), M8 (word off by one), M9 (unit order reversed), M11 (focusout no-op), M12 (focusin no hatched guard), M13 (click on table). Survivors: M2 (click handler without the editable-cell exemption) is reachable on every desktop click on a hatched cell (focusin links, click then unlinks) and no test uses a real click on an editable cell; M10 (cap 3 cells) is reachable (a four-cell ring exists once in spike S1) and no test pins four; M14 (`closest('td')`) is equivalent (one table in the page).

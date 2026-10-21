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

## Tester

## Change log (spec changes, from the PM)

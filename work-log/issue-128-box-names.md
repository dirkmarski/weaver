# #128: Shorter box names: name a box by its position

Issue: https://github.com/dirkmarski/weaver/issues/128. Branch: `issue-128-box-names` (PM spec 5f34492 first).

## Lead
- Lead Claude Opus 5.5, session 226c8fac-a151-4b1c-af1a-02f108c103b5 (new lead run in the same session). 2026-11-02.
- Gate ok: open, author weaver-agents (PM), iteration 25 item 3 of 3. Fresh start (no log, no PR). Requests: none raised by the lead.
- Merged main f5f1266 into the branch at 353f373. Red run (AC1) on 353f373: 229 tests, 222 pass, 7 fail, 0 skipped; all 7 are the changed scenarios (pointing-hidden-unit.feature lines 22 and 44; own-pointing-claiming.feature 5 messages), each failing on its message assertion (actual "the box of rows ...", expected position names); no undefined or ambiguous step. No new step texts, so no part A: `spec-implementation/` stays 483.
- Baseline: `tests/` 2469, product 1553 (`cat *.js index.html style.css package.json`), ratio 1.590x, cap 2484 (15 lines headroom).
- Plan: one developer run (texts.js `boxName` to position names, U+2011 always, drop the dash parameter; callers in hints.js and rewards.js; one unit test for all nine names; adapt existing text assertions; README templates), then reviewer, tester (AC4 layout at 360x740 and 1280x900 before/after), lead check, PR, PM acceptance with personas (AC6).
- Scope notes: key lines and "in the box"/"that box" unchanged; the amber-area tables in own-step-marks.feature keep their range notation (not a player text, PM).

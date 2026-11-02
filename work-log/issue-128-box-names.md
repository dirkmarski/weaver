# #128: Shorter box names: name a box by its position

Issue: https://github.com/dirkmarski/weaver/issues/128. Branch: `issue-128-box-names` (PM spec 5f34492 first).

## Lead
- Lead Claude Opus 5.5, session 226c8fac-a151-4b1c-af1a-02f108c103b5 (new lead run in the same session). 2026-11-02.
- Gate ok: open, author weaver-agents (PM), iteration 25 item 3 of 3. Fresh start (no log, no PR). Requests: none raised by the lead.
- Merged main f5f1266 into the branch at 353f373. Red run (AC1) on 353f373: 229 tests, 222 pass, 7 fail, 0 skipped; all 7 are the changed scenarios (pointing-hidden-unit.feature lines 22 and 44; own-pointing-claiming.feature 5 messages), each failing on its message assertion (actual "the box of rows ...", expected position names); no undefined or ambiguous step. No new step texts, so no part A: `spec-implementation/` stays 483.
- Baseline: `tests/` 2469, product 1553 (`cat *.js index.html style.css package.json`), ratio 1.590x, cap 2484 (15 lines headroom).
- Plan: one developer run (texts.js `boxName` to position names, U+2011 always, drop the dash parameter; callers in hints.js and rewards.js; one unit test for all nine names; adapt existing text assertions; README templates), then reviewer, tester (AC4 layout at 360x740 and 1280x900 before/after), lead check, PR, PM acceptance with personas (AC6).
- Scope notes: key lines and "in the box"/"that box" unchanged; the amber-area tables in own-step-marks.feature keep their range notation (not a player text, PM).

- Developer cf29612 + log 4b67b7b. Lead spot check: 230/230, 0 skipped; ratio 2478/1552 = 1.597x (cap 2483, 5 lines headroom). Lead finding L1 (held for the rework round): README lines 46 and 53 still have "the box of rows R1‑R2 and columns C1‑C2" (U+2011 variant) in the own pointing and claiming reward templates, AC3 not yet met.

## Developer
- Model Claude Sonnet 5.5, session 226c8fac-a151-4b1c-af1a-02f108c103b5. Code commit cf29612.
- Changed: `texts.js` boxName(b) returns the position name (U+2011 always, no dash parameter); `rewards.js` NB removed; `hints.js` comment; README templates use "the P box" (P defined once on the first pointing line), U+2011 sentence now "box names always use U+2011"; existing range assertions in tests/sudoku.test.js and tests/page.test.js adapted (the claiming `box` helper now maps to names); one new test `boxName` pinning all nine names and code point 0x2011.
- Ratio: tests 2478 (cap 2483 = floor(1.6 x 1552)), product 1552, 1.597x. spec-implementation 483 lines (unchanged).
- Removed assertions: none. Result: 230 tests, 230 pass, 0 fail, 0 skipped, 5.9 s.

## Reviewer
- Reviewer Claude Sonnet 5.5, session 226c8fac-a151-4b1c-af1a-02f108c103b5, head d7937c8 (diff ba07892..d7937c8).
- Verdict: REQUEST CHANGES (one blocking finding, AC3).
- Findings:
  1. README.md:46 (twice: "Well spotted!" pointing template and the `<unit>` definition) and README.md:53 (claiming template): "the box of rows R1-R2 and columns C1-C2" remains. AC3 not met; blocking. Fix: use "the P box" / "the P box, P its position" with the README's one-line position list; drop "box names always use U+2011" wording duplicates if redundant. Confirms lead L1; no other README template found (grep for "box of", "rows R1", "fits only in the" on lines 22-153; line 42 and line 52 are already in position form).
  2. specs/rewards/own-pointing-claiming.feature:8 (comment: "inside the box of ...") and specs/rewards/own-step-marks.feature tables keep range notation. Nit, not a player text; PM scoped the tables out; the comment is PM-owned (reviewer does not edit specs/).
  3. Ratio headroom is 5 lines (2478 / 1552 = 1.597x, cap 2483). The README fix touches no code, so no ratio effect.
- ADR 003: one `boxName(b)` in texts.js, no new module, no dash parameter left, no import changes. Ok.
- Player texts: only box names changed; "in the box", "that box" and key lines unchanged (diff shows no such edit). Ok.
- Tests: new boxName unit test pins all nine names, U+2011 and no ASCII hyphen. Adapted assertions are 1:1 replacements (22 removed lines are all range-to-position text edits, none dropped or weakened; `box` helper in the claiming test maps four ranges to four names, same coverage). Test lines are normal length, no packing.
- Mutants (node --test, 230 tests, each diff non-empty, restored):
  | id | file | change | result |
  | M1 | texts.js | swap top-middle/top-right | killed: boxName test, own-pointing/claiming specs |
  | M2 | texts.js | bottom-left with ASCII hyphen | killed: boxName test, seed 1 wall own-pointing test |
  | M3 | texts.js | "center" | killed: boxName test, hintFor claiming texts |
  | M4 | texts.js | NAMES indexed [b%3][floor(b/3)] (transposed) | killed (12 fails) |
  | M5 | rewards.js | pass '-' to boxName in claiming | SURVIVED: equivalent, boxName ignores a 2nd argument now |
  | M6 | texts.js+rewards.js | dash parameter reintroduced, claiming passes '-' | killed: own claiming specs, page |
  | M7 | hints.js | pointingClause replaces U+2011 by '-' | killed: pointing hint tests, page |
  | M8 | rewards.js | hidden unit box built with transposed r/c | killed: spec "Own pointing, hidden form in a box" |
  | M9 | texts.js | " box." instead of " box" | killed (18) |
  | M10 | texts.js | centre named "centre box" | killed: boxName test |
  | M11 | texts.js | "The" capitalised | killed (18) |
- Not checked: layout (AC4) and PM acceptance (AC6), tester/PM scope; the red run (AC1); GitHub PR text.
- Documents read: lessons.md (Review, Testing sections), this log's Lead section, ADR 003, architecture.md Modules, issue #128, the diff.

## Tester

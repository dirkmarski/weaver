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
- Rework r1 (031d624): README lines 46 and 53 reward templates and the <unit> definition now say "the P box" instead of the range form; nothing else changed; 230 pass, 0 skipped.

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
- Tester: Claude Sonnet 5.5 (claude-sonnet-5-5), session 226c8fac-a151-4b1c-af1a-02f108c103b5. Tree: detached e3992b4 (code cf29612); main f5f1266 for comparison. Scratch: `/tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/226c8fac-a151-4b1c-af1a-02f108c103b5/scratchpad/test-128` (README.md there).
- Verdict: pass (AC4 layout and AC2 page behaviour). Two infos below; the known README finding L1 is not a layout matter.
- Findings:
  1. Layout, hard criteria: in 16 states (8 states x 360x740 and 1280x900, mobile emulation set before load, real CDP input) there is no horizontal overflow, no clipping of #status or #key, the button row top is unchanged (517.7 at 360, 729.8 at 1280), 0 console or network problems on both trees, and no position name breaks across lines (Range rects per character). Control: main's ranges split in 4 of the 16 states.
  2. Info (AC4 "expected higher" is only partly met): the #111 D10 pointing hidden box case (Tricky seed 4 after 3 hint fills, spec position row 4, column 3 = 5) is identical on main and branch at 360x740: 10 lines, `#status` bottom 748.5 (document), invitation bottom 738.5, scrollY 74, grid top 5.8. The shorter names save no line in that text (10 lines both), so the grid top stays at the 5.8 px floor (not lower; "at least 5.8" holds). At 1280x900 the same case is unchanged (7 lines, scrollY 78, grid top 28.8). Backlog item 3 therefore still has no room at 360x740 in this case. A second box case (seed 2 after 21 fills, middle-left then centre) drops 9 to 8 lines at 360 but its scroll comes from focusing the target cell (scrollY 74, grid top 5.8 on both), not from the text.
  3. Lines gained: longest own pointing hidden reward (seed 39, two boxes, 276 chars on main, 243 on branch; #108's 269-char case is the same kind): 7 lines on main, 6 on branch at 360x740, `#status` bottom 715.5 -> 694.5 (spare 24.5 -> 45.5); 2 lines at 1280 on both. Claiming Hint step 1 (Tough seed 1): 7 -> 6 lines at 360. Seed 8 stage 2 at 1280x900: 5 -> 4 lines, stage 3 scrollY 78 -> 57, grid top 28.8 -> 49.8 (Next step bottom 930 -> 909). Seed 1 stages 2 and 3 are unchanged on both viewports (names appear only as "top-right box" in a wrapped line).
  4. Page texts: every text names its box by position with U+2011 (check by code point on the real page: rewards "top‑right ... middle‑right", Hint step 1 claiming "top‑middle", hint steps "top‑left/middle‑left", "middle‑left/centre"); no ASCII hyphen next to a position name, no range form left in any page text (`grep 'box of rows'` in product code is empty). Names match the board geometry (hand-derived list in facts.md).
  5. Mutants (product code, Python-applied, reverted, worktree clean): M-A rewards.js cell-unit box named by the confined box (res.box) -> page oracle FAIL (top-right twice); M-B hints.js step-3 box index transposed (seed 4: top-middle for middle-left) -> FAIL. Both killed by the page oracle; they are not new gaps (the reviewer's unit and spec runs cover these).
  6. Info: stage 3 invitation bottom is 738.5 at 360x740 (1.5 px spare) in every invitation-driven case on both trees, unchanged by this issue. At 1280x900 stage-2 Next step sits at 909 (seed 1) below the fold (desktop scrolls), unchanged.
- Measurements (Tricky unless noted; main -> branch; px; lines = #status line boxes; key = #key bottom in view; sy = scrollY; grid = grid top in view; button row top identical in all rows):
  | state | viewport | lines | #status bottom (doc) | key | sy | grid |
  | seed 1 stage 2 | 360x740 | 5 -> 5 | 658.5 -> 658.5 | 705.3 -> 705.3 | 0 -> 0 | 79.8 -> 79.8 |
  | seed 1 stage 3 | 360x740 | 9 -> 9 | 730.5 -> 730.5 | 738.5 -> 738.5 | 56 -> 56 | 23.8 -> 23.8 |
  | seed 8 stage 2 | 360x740 | 5 -> 5 | 658.5 -> 658.5 | 705.3 -> 705.3 | 0 -> 0 | 79.8 -> 79.8 |
  | seed 8 stage 3 | 360x740 | 7 -> 7 | 694.5 -> 694.5 | 738.5 -> 738.5 | 20 -> 20 | 59.8 -> 59.8 |
  | D10 box case (seed 4 + 3 fills) | 360x740 | 10 -> 10 | 748.5 -> 748.5 | 738.5 -> 738.5 | 74 -> 74 | 5.8 -> 5.8 |
  | box case 2 (seed 2 + 21 fills) | 360x740 | 9 -> 8 | 730.5 -> 712.5 | 672.5 -> 654.5 | 74 -> 74 | 5.8 -> 5.8 |
  | longest own reward (seed 39) | 360x740 | 7 -> 6 | 715.5 -> 694.5 | 733.1 -> 712.1 | 0 -> 0 | 79.8 -> 79.8 |
  | claiming Hint step 1 (Tough seed 1) | 360x740 | 7 -> 6 | 715.5 -> 694.5 | 733.1 -> 712.1 | 0 -> 0 | 79.8 -> 79.8 |
  | seed 1 stage 2 / 3 | 1280x900 | 4 -> 4 / 6 -> 6 | 864.6 / 906.6 same | 913 / 899.2 same | 0 / 57 same | 106.8 / 49.8 same |
  | seed 8 stage 2 / 3 | 1280x900 | 5 -> 4 / 7 -> 6 | 885.6 -> 864.6 / 927.6 -> 906.6 | 934 -> 913 / 899.2 same | 0 / 78 -> 57 | 106.8 / 28.8 -> 49.8 |
  | D10 box case | 1280x900 | 7 -> 7 | 927.6 same | 899.2 same | 78 same | 28.8 same |
  | box case 2 | 1280x900 | 7 -> 7 | 927.6 same | 867.2 -> 888.2 | 78 -> 57 | 28.8 -> 49.8 |
  | longest reward / claiming step 1 | 1280x900 | 2 -> 2 | 822.6 same | 840.2 same | 0 | 106.8 |
- Suite on e3992b4: `node --test` 230 tests, 230 pass, 0 fail, skipped 0, 5.3 s.
- Screenshots: `/tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/226c8fac-a151-4b1c-af1a-02f108c103b5/scratchpad/test-128/shots/` (branch-/main-<state>-<viewport>-view|full.png); `facts.md` there names the box each message shows and where it is on the board (for the PM personas).
- Not tested: personas and AC6 (PM), real device or touch input, widths other than 360 and 1280 (375x812 not repeated), Tough/Hard hint walks beyond the states above, README text (AC3, finding L1 is the lead's), AC1/AC2 unit and spec runs beyond one `node --test`, ratio (AC5).
- Documents read: process.md "Test strategy applied" (~12 lines) and lessons.md Testing/Tooling, architecture.md Tests, product.md Known product gaps (each ~10-20 lines, for method, layout facts and tooling rules); this log's Lead section (~10 lines); issue #128 (AC); work-log issue-111 and issue-108 lines named in the brief (~15 lines, for the D10 and 269-char cases); specs/rewards/own-pointing-claiming.feature (read for the two-box case); test-126 scratch README and lib.mjs/shots.mjs (reuse). governance/LOG.md not read.

## Lead review
- 2026-11-02, head c9b5432 (code cf29612 + README rework 031d624). Review e3992b4 request changes (finding 1 = L1, README 46/53; 11 mutants, 10 killed, M5 equivalent). Test 19051db pass (AC4 table, code points, 2 page mutants killed). One rework round: developer 031d624 replaced the three README range phrases with "the P box"; `grep 'box of rows\|R1.R2' README.md` empty. README-only, so no reviewer/tester re-run: lead re-check.
- Lead re-check: 230/230, 0 skipped; ratio 2478/1552 = 1.597x (cap 2483); `spec-implementation/` 483 (unchanged, no runner change). Diff 19051db..c9b5432: README 2+/2-, log 1+. Re-ran the tester's `layout.mjs` (branch, c9b5432) + `report.py` + `codepoints.py` from the tester worktree (start 13:18:48, output 13:19:35): both PASS lines.
- Concern for PM acceptance (tester finding 2): AC4 "D10 grid top at least 5.8 px (expected higher)": 5.8 -> 5.8, 10 -> 10 lines; the position names save no line in that text. The hard criterion holds; the expectation does not. Backlog item 3 (say why the unit's other cells are out) still has no room at 360x740 in that case. Gains elsewhere: longest own reward 7 -> 6 lines (715.5 -> 694.5), claiming Hint step 1 7 -> 6 lines, Tricky seed 8 at 1280 one line fewer.
- Wiki kept correct: product.md (box-name form, D10 figure note, longest own reward), architecture.md (sizes, ratio).

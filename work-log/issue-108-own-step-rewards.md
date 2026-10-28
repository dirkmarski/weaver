# #108 Own pointing and claiming rewards state every step

Issue: https://github.com/dirkmarski/weaver/issues/108. Branch `issue-108-own-step-rewards`.

## Lead
- Lead Claude Opus 5.5, session d2424c00-a6fb-45e6-86ab-53111ee2576f. Gate passed (open, PM-authored, it22 item 2). Fresh start: branch held only the PM spec 3a20022.
- Merged main (ac40aa5, #110 runner) into the branch: c746a63. Red run (AC1): specs 9 run, 5 pass, 4 fail; the 4 failures are exactly the 4 scenarios of `specs/rewards/own-pointing-claiming.feature`, each on `the message reads` (feature :23, :40, :57, :74), with actual = today's "..., so row R, column C is V." text. No undefined or ambiguous steps (every step text already exists in `spec-implementation/steps/own-singles.js`). Full suite 202 run, 198 pass, 4 fail, 0 skipped, 3.9 s. Output: session scratchpad `lead-108/red-specs.txt`, `red-full.txt`.
- Baseline ratio: product 1484 (sudoku.js 1285 + index.html 46 + style.css 153), tests/ 2374 (cap 1.6x = 2374.4). spec-implementation/ 303 lines (measured apart, PM D2/D5).
- Plan: developer changes the own pointing/claiming texts in `sudoku.js` (lines ~660-667; `classifyEntry` exposes form and unit from `singleAfterStep`), README texts, and adapts the 6 unit assertions of the old texts in `tests/sudoku.test.js` (+1 in page.test.js if it pins one); no new step file expected (no step text may be redefined). Removals listed with the covering scenario, mutant-confirmed by reviewer and tester. Then reviewer, then tester (independent red/green, mutants on `sudoku.js`, layout at 360x740 and 375x812 at the pointing-hidden position, >=8 px spare, button row fixed). Then lead check, PR with test summary report, PM acceptance with personas (gate mean >=4.0 over 12, no case <3.5).
- Rule for all agents: `specs/` is PM-only, never edited, not even in a worktree copy or temp copy.

## Developer
- Developer Claude Sonnet 5.5, session d2424c00-a6fb-45e6-86ab-53111ee2576f. Code commits 8df2a46 (change) and a6430cb (wrap 3 over-long test lines to the file's longest).
- `sudoku.js`: `classifyEntry` pointing/claiming results now carry `form` ('naked'|'hidden') and, for hidden, `unit` (kind) from `singleAfterStep`; `creditEntry` builds the two-sentence texts (naked: "so D cannot go in row R, column C. That leaves V as the only digit there."; hidden: "so D cannot go anywhere else in <line L | that box>. That leaves row R, column C as the only cell in <unit> where D fits."). Counts, colour, single and hinted texts unchanged. README lines 44 and 51 updated.
- Specs: 9 run, 9 pass (the 4 scenarios green). Full: 202 run, 202 pass, 0 fail, 0 skipped, 3.8 s. No change to spec-implementation/ (303 lines) or specs/.
- Ratio: product 1491 (sudoku.js 1292), tests/ 2376, 1.594x (cap 2385.6).
- Removed: tests/sudoku.test.js creditEntry own claiming test, old line 1395 (Tough seed 1 r1c5 = 7 own pointing text), covered by scenario "Own pointing, naked form". Adapted (not removed): old-text assertions at sudoku.test.js 1011, 1012, 1238, 1392, 1393 and page.test.js 293 (new texts); classifyEntry deepStrictEqual shapes at 1017, 1021, 1022, 1025, 1387-1388 gained `form`/`unit`.
- Not tested by me: layout at 360x740/375x812 (tester), persona rating (PM).

## Reviewer

## Tester

## Lead review

## Lead: acceptance and merge

# Work Log: Iteration 13 (product manager)

- PM: product-manager agent (Claude Opus 5.5), launched by the lead in session `5034fe53-a839-46a5-807a-40a5b44d5158`
- Run type: "Deliver the next iteration"; branch `iteration-13`; baseline main 4217479 (166/166 tests)
- Scratch: /private/tmp/claude-502/-Users-dirk-Code-weaver-team/5034fe53-a839-46a5-807a-40a5b44d5158/scratchpad/pm-it13/ (not in the repo)
- Rules followed: governance/LOG.md not read; the work log was not read beyond the lead's it13 log header (status check) and the end of the it12 product log (ratio and candidate list cross-check).

## Status check (restart safety)
- 2026-10-21: No it13 product log existed; no open issues or PRs. Fresh scoping, not a resume.

## Inputs
- memory/wiki/backlog.md (top: Tricky practice density, spike first), memory/wiki/product.md, README.md, product-strategy.md (teach progressively, reward learning), test-strategy.md.
- Ratio at 4217479: tests 1871 / product 1193 lines = 1.57x.

## Spike: Tricky practice density (2026-10-21, code at 4217479)
Scripts (scratch, not in the repo): spike.js, prefer.js, gen.js, pin.js in the pm-it13 scratch folder. "Tricky seed N" = generatePuzzle('tricky', { rng: seededRng(N) }) = the page with Math.random = seededRng(N) (the page tests' seeding). A "useful" pointing step = one whose target cell is not already a naked or hidden single.
1. Baseline, Hint followed entry by entry (seeds 1-100): pointing steps per puzzle {1: 84, 2: 14, 3: 2}; first pointing hint after hinted entry p10/p50/p90 = 8/17/23 (of about 53 empties). Generation p50/p90/max 30/107/136 ms, none capped. Matches the it12 finding: Hint-followers see one pointing lesson, late.
2. Yet a useful pointing step is available in about 15.5 of 53 states per puzzle (29%), the first one at entry p50 3, p90 13; every puzzle has at least one.
3. Option "denser puzzles" (retry generation until the condition holds, 1 s cap, seeds 1-50/1-30):
   - at least 2 pointing steps: p50/p90/max 364/865/1007 ms, 3 of 50 fail inside 1 s. Too slow and unreliable.
   - at least 3: 25 of 30 fail. Not feasible.
   - a useful pointing step in the starting grid: p50/p90/max 122/317/507 ms, 0 fail.
   - first useful pointing within the first 5 hinted entries: p50/p90/max 96/215/307 ms, 0 fail.
4. Option "Hint prefers pointing on Tricky" (Hint teaches a useful pointing step whenever one exists, else singles as today), seeds 1-300: pointing lessons per full Hint-follow p10/p50/p90 = 2/4/6 (min 1); first at entry p50 5, p90 14, max 28; never stuck (0/300). Reasoning check: placing correct digits only adds eliminations, so singles-plus-pointing stays sufficient; Hint can never reach "none" on Tricky.
5. Pins (Tricky, 4217479):
   - seed 1 (27 givens) starting grid: today Hint nudges the hidden single row 1, column 9 = 1 (in its row). The first useful pointing step: box rows 1-3/columns 7-9, digit 2 only in row 1, naked form, target row 1, column 5 = 7 (only 2 or 7 fitted). It is also what findPointing returns there.
   - seed 2 (28 givens) starting grid: no useful pointing step. findPointing returns box 2 (rows 1-3/columns 4-6), digit 4 in row 3, hidden form, target row 3, column 4 = 4, but that cell is already a single, so it must not be taught as pointing; Hint stays on the hidden single row 2, column 9 = 3.
   - seed 5 (27 givens) starting grid: no useful pointing step; Hint stays on the hidden single row 1, column 1 = 7 (in its box).

## Decision D1: Hint prefers pointing on Tricky (issue 1)
- Choose the Hint preference over denser puzzles: 4x the pointing lessons (median 1 -> 4), first one much earlier (median entry 17 -> 5), no generation cost, no change to the puzzles. Denser generation is too slow for "2+ steps" (finding 3).
- Scope: Tricky only. Easy/Medium have no pointing; Hard is about techniques beyond pointing (left as is; candidate later).
- Keep "early first pointing" generation (finding 3, last two bullets) as a contingent follow-up: decide after it13 acceptance whether the late tail (p90 entry 14) still matters to personas.

## Decision D2: second issue = pointing explanation quick wins (issue 2)
- With about 4x the pointing explanations after D1, the two weak points it12 personas named matter more: the ring clause and the faint strike. Both are small and testable, and they fit the "1-2 issues" sizing. Chosen over slip and wording items (lower value for the main goal: teaching).
- Wording check (2026-10-21, user-a and user-c, description only, no files or scripts): the current clause rated 2/5 by both. Both picked "Ds already placed that keep D out of the box's other cells" (4/5 with one ring, 5/5 with three), with the singular form for one ring. The "row, column and box" option was read as too broad.
- PM adjustment: in the hidden form a ring may rule out only a cell of U (reason cells b), so "the box" alone would be wrong there. The hidden form says "of the box and of row/column N", or "of both boxes" when U is a box. Uniform phrasing "the other cells of the box". "an 8" for D = 8.
- Strike feasibility (headless Chrome at 4217479): the chip padding box is 11.4 x 16.8 px at 375 px and 15.4 x 16.8 px at 1280 px. The 8% band is about 1.5/1.8 px thick; a 12% band gives about 2.3/2.7 px. #8a8a8a = 3.4:1 against white; #595959 is about 7:1. Criteria: at least 2 px and at least 4.5:1.
- Pins (starting grids, Tricky seeds 1, 76, 8, 44; ring cells by hintMarks at 4217479; findPointing equals the first useful step there, so the pins are valid after #60).

## Issues raised (2026-10-21)
- #60 "Tricky: Hint prefers a useful pointing step over singles" (enhancement). Deliver first.
- #61 "Pointing explanation: clearer ring clause and a legible strike on the struck badge" (enhancement). Deliver after #60.
- Checked: AC 5 of #60, seeds 3000-3002 under the preference give 2/4/4 pointing hints.

## Assumptions and concerns
- A1: Preferring pointing on every Tricky Hint may feel pointing-heavy (median 4, p90 6 per puzzle out of about 53 entries). Singles remain the majority of hints. Persona acceptance checks this; a cap (for example prefer pointing only while the pointing count is below the singles count) is the fallback.
- A2: Players who rarely click Hint still meet pointing late; the "early first pointing" generation filter (p90 215 ms) is the contingent follow-up.
- C1: Ratio headroom is small: 1.6x of 1193 product lines is 1909 test lines (38 above today). Both issues require adapting tests over adding new ones. A trim item is added if 1.6x is passed.
- Evidence is still simulated only (GitHub Pages not confirmed).

## Acceptance plan
- Per issue: check the ACs against the PR (pins and helper outputs via a scratch script), then 2-3 personas play Tricky in headless or real Chrome without helper scripts, solvers, source, README or LOG.md. For #60: do they meet pointing hints early and often, and is it too much? For #61: do they read the key line correctly with 1 and several rings, and is the strike visible at 375 px?

## Candidate list (PM, ordered, after scoping it13)
1. (it13) #60 Tricky Hint prefers useful pointing; then #61 ring clause and legible strike.
2. Pointing reach follow-ups (contingent on #60 acceptance): early first pointing via generation (first useful step within 5 hinted entries: p50/p90/max 96/215/307 ms, 0 fails in 50); a cap on the preference if it feels heavy; the same preference on Hard.
3. Explanation depth: show or name which cells a ring rules out; show why the naked-form target has only D or X; a key line for the hidden single; minimal rings; a clearer first-click case signal.
4. Slip follow-ups (it11, small, wording-led): extra-clash sentence pointing at the outlines; a partial-fix message; two-unit clash naming; "clear your own number" when the pair includes a given; explain "counted"/"stays uncounted" and judge an overwrite; a marker on entries made during a clash; Hint/Verify naming one pair at a time.
5. Small wording items: shared "not counted" ending; re-entering a hint-credited cell says "on your own"; "(see below)" in the finish text; fold away definitions once learned; heavy naked-single digit list.
6. Mobile and long-term: 375 px level buttons; hint badge at 320 px; long messages and key line on a phone; a middle hint level; progress across puzzles.
7. Claiming, then pairs, each with its own level (personas rank last).
Watch: test-to-product ratio 1.57x at 4217479; a trim item is added if it passes 1.6x.
Not wanted: instant red on a wrong entry (it10); counting entries made during a clash (it11); retroactive counting after a fix (it11).

## Acceptance of #60 (PR #62, head 5f13f84dd7160d322f5b89450a6dd3ce64dfce65), 2026-10-21
- Read only: the issue log's Lead section (work-log/issue-60-tricky-prefers-pointing.md at 5f13f84) and the PR body. governance/LOG.md not read.
- Own detached worktree: scratchpad/pm-it13/wt-acc-60 at 5f13f84. Baseline sudoku.js at 4217479 extracted to scratchpad/pm-it13/old/.
- node --test: 168 pass, 0 fail, 0 skipped. Ratio: tests 1932 / product 1210 = 1.597x (matches the PR).
- Independent check (scratch acc60.js, oracle = the spike's usefulPointing from spike.js, not the product code):
  - Pins: seed 1 grid identical to the AC 1 string (27 givens); new nudge = pointing, box rows 1-3/columns 7-9, digit 2 in row 1, naked, r1c5 = 7; explain text and key line as today. Seed 2: findPointing = box 2, digit 4, row 3, hidden, r3c4 = 4; useful = null; Hint = hidden single r2c9 = 3, identical to 4217479. Seed 5: hidden single r1c1 = 7 (box), identical.
  - Following Hint on Tricky seeds 1-150 and 3000-3002 (Tricky preference, each hinted digit entered via creditEntry): 0 mismatches against the oracle (pointing states) and against 4217479 (non-pointing states), 0 stuck, all "Well done! You applied pointing" texts and +1 hint counts correct. Pointing per puzzle p10/p50/p90 = 2/4/6, min 1, max 9. Seeds 3000-3002: 2/4/4.
  - Generation: 153/153 Tricky puzzles identical to 4217479.
  - Easy/Medium/Hard: 8804 hintFor comparisons (40 seeds each, follow Hint, both steps) identical to 4217479.
- Page play-through (scratch play60.js, headless Chrome, real index.html): Tricky seed 7, 25 hinted entries: first hint a hidden single (no useful step at the start), pointing at entries 2, 8, 9, 22; each with the key line on the second click, "Well done! You applied pointing" and the pointing count +1; singles alternate as before. Medium seed 3, 8 hints: sequence identical to 4217479 (h, n, h, n, ...), no pointing.
- Persona check launched (user-a, user-b, user-c; prompt scratchpad/pm-it13/acc60-prompt.txt; tool scratchpad/pm-it13/play/play.js only) on concern A1 (pointing load).

### Persona check (user-a seed 1, user-b seed 7, user-c seed 12; about 31 entries each; all three confirmed: only play.js and its screenshots; no source, README, LOG.md, work logs, helper scripts or solvers; user-c used a one-line shell alias to call play.js, harmless)
- Pointing hints met: A 5 (first at entry 0, then 10, 14, 23, 24); B 3 (entries 1, 8, 9); C 4 (entries 17, 18, 19, 25).
- Pointing load: 3/5 from all three ("about right", "never felt drilled"). Understanding at the end: 4/5 from all three; each named a concrete case where the second-click marks and key line made it click. B then found a follow-on cell alone.
- Comments: A found opening a fresh puzzle with pointing steep (visible singles were passed over) and two pointing steps in a row dense. A also read the existing "(the box has no other empty cells)" case as "really just a single". That is #45 behaviour, not changed by #60. B and C said the first click is thin (B saw no marks; the tint is light) or too long (C). B and C noticed the same pointing fact reused 2-3 times in a row ("samey"; C suggested "same 9 as before").

## Decision D3: #60 accepted at 5f13f84dd7160d322f5b89450a6dd3ce64dfce65 (2026-10-21)
- ACs 1-11 all pass (per-AC summary in the PR #62 comment). Gates: tester PASS, reviewer approve after one rework round, lead delta re-check.
- A1 (pointing load) not confirmed: 3/5 from all three, so no cap. Keep the cap as a fallback only.
- No spec change to #60.

## Decision D4: ratio headroom goes to #61 (2026-10-21)
- 1.597x leaves about 4 lines. #61 AC 9 is changed to "at most 1.6x". Room may come only from removing redundant assertions in the test files it touches, each listed with the test that still covers it, and the tester confirms coverage of #45/#56/#60/#61. Recorded in #61's Change log, with an issue comment. I chose this over a separate trim item: the issue that consumes the headroom pays for it, and the iteration stays at two issues.
- #61 pins re-checked against #60's final behaviour (5f13f84): seeds 1, 76, 8 and 44 give exactly the listed steps, targets, forms, units and ring cells (2, 1, 3 and 2 rings). No other change to #61.

## Candidate list changes (after #60 acceptance)
- Item 2 (pointing reach): early first pointing via generation stays contingent. B and C met pointing early or mid-game; the late tail is still real (C: entry 17). A's "don't open with pointing" (1 of 3) is the opposite pull, so neither direction is warranted now; watch.
- Item 3 (explanation depth), added: a stronger first-click signal for pointing (B, C; merges with "a clearer first-click case signal"); say when the same pointing fact gives another cell ("same 9 as before", B, C); the "(the box has no other empty cells)" case reads like a single (A).
- Item 2: "prefer pointing" on Hard unchanged as a candidate.

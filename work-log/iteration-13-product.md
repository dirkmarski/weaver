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

# Work Log: Iteration 10 (product manager)

- Product manager: weaver-agents (product-manager agent, Claude Opus 5.5), session `0245eb9f-91d7-4bfe-b523-bbf5b80a2438`
- Run type: "Deliver the next iteration" (scoping run)
- Branch: `iteration-10` (worktree scratchpad/wt-iteration-10)
- Lead work log: `work-log/iteration-10.md`
- PM scratch: scratchpad/pm-proto10/ (not in the repo)

## Status
- [x] Context read: memory/README.md, wiki index, product, backlog, lessons (Scoping); iteration 9 PM log and its candidate list; product strategy, test strategy (both unchanged); README; hint and marks code in sudoku.js; index.html; style.css.
- [x] `governance/LOG.md` NOT read (Dirk's rule).
- [x] Data look at the pointing walls (Tricky seeds 1-10).
- [x] Persona review of a text/picture mock-up (A, B, C).
- [x] Scope decided.
- [x] Issues raised: #45, #46 (label enhancement). Bodies: scratchpad/pm-proto10/issue-pointing-hint.md, issue-clash.md.
- [x] Log committed and pushed.

## Starting point (2026-10-20)
Iteration 9 closed (#42 merged); main at 0f1fa1c, 143 tests. No open issues or PRs. Top of my list: pointing hint clarity (C typed the pointing digit into a cell that takes another digit, it9). Third: live feedback on a clashing entry (B and C asked in it8 and it9).

## Progress
- 2026-10-20: context read; log opened.
- 2026-10-20: data look (scratchpad/pm-proto10/walls.js; Tricky seeds 1-10, follow Hint, print each pointing wall). 12 pointing walls: 5 naked form (the answer is NOT the pointing digit: the confusing case), 7 hidden form. 2 of 12 are "trivial" confinements (all empty box cells on one line: seeds 4, 8). The confined cells are always 2 cells; cells the digit is removed from: 1-3 per wall. Pinned examples: seed 1 hint 13 (naked, box rows 7-9 x cols 1-3, digit 1, column 3, confined r7c3 r8c3, removed r2c3 r3c3, target r3c3 = 7); seed 3 hint 20 (hidden, same box, digit 1, row 9, confined r9c1 r9c2, removed r9c4 r9c5, target r5c5 = 1 in column 5).
- 2026-10-20: mock-up (scratchpad/pm-proto10/mock.md): Part 1 pointing hint (first-click text T1/T2/T3 for the naked form; marks M1/M2/M3 for confined `?1` and removed `x1` cells; hidden form H1/H2 with the unit tinted); Part 2 clash on entry (K1 message, K2 message + red, K3 today). Sent to A, B, C (read only; no code, scripts or solvers).
- 2026-10-20: persona A (mock-up only): T3 ("says outright that 1 is out of that cell"; T1 "is what made me type 1"); M2 (marks on both clicks give too much away; `?1` matters more, `x1` "nice but noisy"); H2; still confusing: naked answer is another digit, hidden answer is the pointing digit; wants the text to signal the case; tiny corner marks may be hard to read. K1 (K2 "a bit loud", takes away the Verify step); a clash is "a fact about the board", not the answer. Part 1 matters more.
- 2026-10-20: persona C (mock-up only): T2 (T3 "makes me hunt"; T2's "rules out 1 for" needs a second read); M2, `?1` if only one, both fine on click 2; H2; same case-signal wish; small grey marks may be hard to see. K1 (K2 "a bit like auto-checking"; K3 "silly because the app already knows"); not the answer. Part 1 matters more.
- 2026-10-20: persona B (mock-up only): T3; M1 (both marks; "M2 is a fair compromise if the first click stays a nudge"); H2, and for the hidden form "the digit 1 has only one place left in column 5" (case signal); `x1` must not look like own notes; rings plus marks may be cluttered. K1, K2 close second (would keep red tied to Verify); not the answer. Part 2 "a little" more, but "if only one, Part 1"; ship both.
- 2026-10-20: pinned values checked with sudoku.js on main (scratchpad/pm-proto10/walls.js, testwalls.js; data only, not a test oracle): seed 1 hint 13 and seed 3 hint 20 confined/removed cells; WALL_ROW confined [0,1] removed [4,5]; WALL_COL (hidden, unit row 4) confined [11,20] removed [29]. Clash pins on a fresh Tricky seed 1 (all three cells empty, digits as stated; today they get text (a)). My first clash pin (8 at r2c1) came from the wall grid, not the fresh puzzle; caught and replaced before the issue was raised.

## Decision: iteration 10 scope (2026-10-20)
TWO small issues, in sequence (both touch README and sudoku.js):
1. **#45 Pointing hint: say what the step does to the target, tint the hidden-form unit, mark confined and removed cells.** Top of the list; the it9 failure (C typed the pointing digit) is a teaching failure, and 2 of 3 personas rate it the more important part.
   - Naked first click: T3 (A, B), worded plainly per C ("That means D cannot go in row R, column C, and only one other digit fits there now.").
   - Hidden first click: H2 with B's case signal ("Then look at U: D now has only one place left there."), unit tinted on both clicks (3/3). This names D for the hidden form on the first click; I accept that because all three asked for the case to be explicit, and the learner still has to see why.
   - Marks on the second click only (M2: A, C; B accepts). Both `?D` (confined) and struck `xD` (removed); rings unchanged.
2. **#46 Say why an entry is not counted when it clashes.** K1, 3/3, neutral, no red. Very small (one text branch in creditEntry). Decision against #31: naming a rule clash is a rule fact, not a correctness reveal; #31's rule (never say whether a digit is right) stands. Text pinned; unit order row, column, box (the natural reading order for "already in this cell's ..."; the hidden-single order box-row-column is about where a digit goes, not about a clash).
Not chosen: rings on relevant digits only, trivial confinements, Tricky density, Hint preferring pointing, small wording items, claiming/pairs, mobile.

## Assumptions
- Persona review of a mock-up fixes wording and marks well enough; readability of the corner marks is checked at acceptance in screenshots (incl. 375 px).
- The page's Hint at Tricky seed 1 hint 13 and seed 3 hint 20 hits the pinned pointing walls (as in the it9 acceptance, which followed the page's Hint).
- Two issues are within "small": #46 is a one-branch text change.

## Concerns
- Clutter on the second click (B): amber, tint, purple rings, dashed outlines and struck digits together. If the screenshots look busy, the fix is a follow-up on rings (already a candidate), not a blocker.
- `xD` could be mistaken for a user's note (B); criterion 4 requires it not to look like one.
- Hidden-form first click now names the digit; this makes the nudge stronger than the hidden-single nudge. Watch at acceptance whether it feels like giving the answer.
- Personas are LLM simulations, not real users (GitHub Pages still unconfirmed).

## Acceptance approach
- #45: criteria 1-8 on the real page (headless Chrome, seeded Math.random), Tricky seeds 1 and 3 following the page's Hint; screenshots of both clicks in both forms, also at 375 px; README diff read; one persona plays both walls (first click, try the answer, second click). No PM oracles.
- #46: the three pinned entries plus one entry into a broken grid on the real page; README diff; a brief persona check.
- Both: suite fast, no sweeps, test lines about 1x product lines.

## Next-iteration candidates (ordered, after scoping iteration 10)
1. Pointing visuals v2: rings only on the relevant digits (B: clutter); avoid trivial confinements as the example (2/12 walls in seeds 1-10). Revisit after #45 acceptance.
2. Tricky practice density: at least 2 pointing steps per Tricky puzzle (measure generation time first; seeds 1-10 had 12 walls, so most puzzles have one). Hint preferring pointing on Tricky (B, it9) may go with this.
3. Small wording: re-entry of a hint-credited cell says "on your own" while the count stays "with a hint"; finish text "(see below)"; fold away grey definitions once learned (C).
4. Claiming, then pairs, each with its level.
5. Mobile layout (2x2 level buttons at 375 px), a middle hint level, progress across puzzles.
Delivered or in flight and gone from this list: pointing hint clarity (#45), clash feedback (#46).

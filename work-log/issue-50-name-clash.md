# Work Log: Issue #50, after a slip, name the clashing cells in the entry text and in Hint

- Issue: https://github.com/dirkmarski/weaver/issues/50 (raised by product-manager, session 544de00f-db0c-4fd3-8425-f2e90d4ada4d)
- Iteration 11, issue 1 of 2 (#51 follows after this merges)
- Branch: `issue-50-name-clash` (from main 1464355)
- Lead: weaver-agents (lead agent, Claude Opus 5.5), session 544de00f-db0c-4fd3-8425-f2e90d4ada4d

## Lead
- 2026-10-20: Gate check PASS: OPEN, author weaver-agents (the PM), label `enhancement`.
- Interpretation L0: the extra sentence ("Other numbers break the rules too...") is added to texts 2 (entry during a clash) and 3 (Hint), not to text 1 (the entry clashes itself). Pinned example 6 settles this: four cells clash there and text 1 has no extra sentence. Passed to the developer and recorded here.
- The test-ratio guide (about 1.18x, guide ~1x) asks for existing test blocks to be extended.
- Developer round 1 launched.
- Developer round 1 (head 572cd18): lead check PASS. The diff was read in full. 143/143 in about 0.61 s. Pinned examples re-run: 7/7. `findConflicts` includes givens, and the box cells in `UNITS` are in reading order, so P and Q follow the definition.
  - L1 (for review): the README says "the cells Verify flags, givens included", but Verify turns only the player's values red. Wording to be judged by the reviewer.
- Review and test round 1 launched in parallel, in detached worktrees wt-50-review and wt-50-test.

## Developer

- Added `firstHolder(cells, p, digit)` (first of row, column, box holding the digit in another cell, first holder in reading order) and `namedClash(grid)` -> `{phrase, extra}` (exported) in `sudoku.js`; `notCounted` and `hintFor` both use them. `notCounted` order is now: own clash, broken grid, not a technique.
- Hint conflict text is plain: `render()` set class `fail` for kind `conflict`; now the class is always `''`. `kind` stays `conflict`.
- Extra sentence on text 2 and 3 only (lead note L0).
- Tests extended in place (hint conflict test, `creditEntry (c)`, `(b)`, pointing/classify tests); `fives()` helper builds two- and three-clash grids. 143 tests, about 0.6 s.
- Pinned examples 7/7 by a Node script and on the real page (headless, seed 1); example 3 also checked for no red class and no highlights.
- README updated (Hint, not-counted texts, named clash, summary sentence, Files).

## Review

---

## Test

Tester round 1, session 544de00f-db0c-4fd3-8425-f2e90d4ada4d, code head 572cd18 (worktree at b045256). governance/LOG.md and other work logs not read.

### Plan
Real page in headless Chrome (seeded Math.random, Tricky seed 1 = game A, Medium seed 2 = game B). Golden path = the 7 pins. Edge cases chosen on purpose (no sweeps). One small independent oracle (own implementation of the issue definition, not product code) on 8 hand-made slip sets over 2 seeds. Screenshots at 375 px. `node --test`.

Tool (scratchpad, reusable): `/private/tmp/claude-502/-Users-dirk-Code-weaver-team/544de00f-db0c-4fd3-8425-f2e90d4ada4d/scratchpad/ts50/`. Set `WT=<worktree>` to serve another tree (default wt-50-test). `node pins.js` (7 pins + hint class/colour/highlights), `node edges.js` (edge cases), `node oracle_run.js` (oracle), `node verify_shots.js` and `node shots.js` (verify flags, 375 px screenshots), `node board.js A|B [moves]` (print board/status). Moves: `rRcC=D` (0 = clear), `hint`, `verify`, `notes`. Modules: `page.js` (run/play/snap), `oracle.js`.

### Results
- Pins 1-7: PASS, character for character (pin 7 compared as prefix "Well spotted! ... row 7, column 2 is 9."). Pin 3: status class "" (not fail/ok), computed colour rgb(29,29,31) (body text; red is rgb(179,38,30)), no cell carries a hint/clash class or data-d.
- Edge cases:
  - Column partner: 5 at r2c1 (box also holds 5 at r1c3) gives text 1 naming the column, r8c1 (PASS). Hint then names P=r1c3, Q=r2c1, box, with the extra sentence (three clashing cells), as the definition says (PASS). Column-named Hint cases on seeds A and B also PASS in the oracle.
  - Row partner (pin 4) and box partner (pin 1, pin 3) PASS.
  - Two vs three clashing cells: pin 2 (two, no extra), pin 5 (three, extra on text 2), Hint with two (A r6c3=6) no extra, with three (A r2c1=5) extra; pin 6 has four clashing cells and text 1 has no extra sentence: PASS.
  - Hint after fix: clear the slip, Hint gives a normal hidden-single hint with highlights: PASS.
  - Notes-on typing during a clash: status unchanged (still the earlier text), no new judgement, tally unchanged: PASS.
  - Overwrite (6 to 7) and clear during a clash: status becomes empty, no new message: PASS.
  - Tally unchanged while a clash lasts (1 naked single on your own before; slip, three further entries and Hint leave it as is): PASS.
  - Full-grid broken (solution everywhere, last cell wrong): "Every cell is filled, but some numbers break the rules. Click Verify to see which." class fail, red: PASS. Hint on that full broken grid shows text 3 (plain, named); main did the same ordering (conflict before everything), so unchanged in kind.
  - Verify: 6 at r4c1 clashing with given 6 at r5c3 flags only r4c1 (input.conflict); two player 6s flag only those two; status "Mistakes found..." red: PASS.
- Oracle: 8 slip sets (A: r2c1=5; r6c3=6; r9c1=4+r3c1=6; r2c1=5+r9c1=4; B: r1c1=2; r3c9=6; r1c2=8; r1c1=2+r9c2=7). Hint text equals oracle in 8/8 (P, Q, U, extra rule). Text 2 for a follow-up entry (r7c2=9) equals oracle on the first 3 sets (3/3). PASS.
- Screenshots (375 px): ts50/hint_conflict_375.png (3 lines, plain colour), ts50/text2_375.png (6 lines, as accepted), ts50/text2_extra_375.png (7 lines with extra sentence, no horizontal overflow, scrollWidth 375). Readable; the extra-sentence case is one line above the accepted ~6.
- `node --test`: 143 tests, 143 pass, 0 fail, duration about 0.63 s.

### Criteria
1 PASS (pins 1, 4, 6; E1 column over box). 2 PASS (pin 6). 3 PASS (pins 2, 5; counts and tally unchanged). 4 PASS on the page and via oracle for row, column, box partners; both-column-and-box (column named, E1) and row-and-box (row named, pin 4/B r1c1) observed. The unit tests for criterion 4 were not reviewed by me beyond their passing run. 5 PASS. 6 PASS. 7 PASS (pin 7 reward; not-a-technique text path not changed, 143 tests pass). 8 PASS. 9 PASS. 10 not assessed by me beyond noting the lead's L1 (README says Verify cells "givens included" while Verify reds only player values), left to the reviewer. 11 not assessed (reviewer); suite green.

### Defects
None found (no D ids). Observation only: Hint on a completely filled but broken grid shows the named text 3, not the full-grid text; same precedence as on main.

### Script expectations
No expectation of mine was wrong in the product comparisons. Two script mistakes of mine, fixed: I first tried to type into a given cell (r6c1), and my first screenshots were cut at 900 px height, so I re-took them full height.

---

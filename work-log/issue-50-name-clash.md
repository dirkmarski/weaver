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
- Round 1 outcome:
  - Review (f29b027): APPROVE with changes; S1, S2, N1, N2.
  - Test (e1c04c3, merged in 3c1595b): criteria 1-9 PASS on the real page, no defects.
  - The lead re-ran the S2 mutant (Q = last holder, `.pop()`) on a scratch copy: 143/143 pass, so it survives and the gap is confirmed.
- Round 2 scope (README and tests only):
  - S1: the README wording, using the reviewer's replacement.
  - S2: an added assertion for two holders in the winning unit.
  - N1 is accepted: the Hint class is UI wiring with no Node test, and the tester's real-page check of pin 3 (class "", computed colour not red) covers it.
  - N2 is for the lead's wiki refresh at the iteration close.
- Re-check (delta, since no behaviour changes): the lead re-runs the S2 mutant, the suite and the pins script; the reviewer does a delta re-review of S1 and S2. The tester's page run still stands, because no product file changes.

## Developer

- Added `firstHolder(cells, p, digit)` (first of row, column, box holding the digit in another cell, first holder in reading order) and `namedClash(grid)` -> `{phrase, extra}` (exported) in `sudoku.js`; `notCounted` and `hintFor` both use them. `notCounted` order is now: own clash, broken grid, not a technique.
- Hint conflict text is plain: `render()` set class `fail` for kind `conflict`; now the class is always `''`. `kind` stays `conflict`.
- Extra sentence on text 2 and 3 only (lead note L0).
- Tests extended in place (hint conflict test, `creditEntry (c)`, `(b)`, pointing/classify tests); `fives()` helper builds two- and three-clash grids. 143 tests, about 0.6 s.
- Pinned examples 7/7 by a Node script and on the real page (headless, seed 1); example 3 also checked for no red class and no highlights.
- README updated (Hint, not-counted texts, named clash, summary sentence, Files).
- Round 2: README clash wording (S1); added a three-in-a-row hint assert so the Q-last-holder mutant (`.pop()`) is killed (S2). 143 tests, about 0.65 s; pins 7/7.

## Review

Reviewer round 1, head reviewed 572cd18 (worktree at b045256). I did not read governance/LOG.md or other work logs.

Verdict: APPROVE with changes (no Must-fix).

Checked and correct
- Data flow `findConflicts` -> `namedClash`/`firstHolder` -> `notCounted`/`hintFor` -> `render()` follows the definition: P = first conflict (reading order, givens included), Q = first other holder of E in the first of row, column, box that has one; P before Q always (Q is searched in P's own units, so Q is later in reading order only if P is first clashing cell; any earlier holder would itself clash and come first).
- Order in `notCounted`: own clash, then broken grid, then not a technique. Text 2 returns early, tally and credited untouched (creditEntry builds them from the inputs; test asserts kind/tally/credited). Extra sentence on texts 2 and 3 only, not text 1 (L0, example 6).
- Hint: kind stays `conflict`, class now always `''` (plain). The only other uses of kind `conflict` are `completionFor` (full-grid text, still red via `done.kind === 'solved' ? 'ok' : 'fail'`, line 767) and the `.conflict` CSS class for Verify flags: unchanged.
- No stale old texts ("Fix them first", "Some numbers break the rules, so it is not counted") remain in README or sudoku.js.

Findings
- S1 (Should-fix) README L1 wording is false. In the named-clash bullet, "(the cells Verify flags, givens included)" is wrong: Verify's conflicts list contains givens, but only the player's values get the red `conflict` class (`inputs[r][c]` is null for givens, sudoku.js ~925), and README line 26 area says red flags are on the player's values. Replace with: "(the cells that share a digit with another cell of their row, column or box, givens included; Verify turns only your own values red)".
- S2 (Should-fix, test gap) Mutant "Q = last holder instead of first" (`.filter(...)[0]` -> `.pop()`) survives. No test has two holders of E in the winning unit besides P (criterion 1 and 4 say "first cell in reading order"). Add to the hint conflict test, in place: `assert.strictEqual(hintFor(fives([1, 1], [1, 3], [1, 9]), 1).text, HINT(named('row', 1, 3), true))` (3 clashing cells in a row, Q must be column 3, not 9). Optionally one text-1 case is not possible (two holders means a broken grid) beyond that: the same assert covers `firstHolder` since text 1 shares it.
- N1 (Nit) The class change in `render()` (`status.className = ''`) is not covered by a Node test (UI code); mutant restoring `fail` for conflict survives. Expected per test strategy; the tester's real-page check of example 3 covers it. No action beyond the tester confirming not red.
- N2 (Nit) memory/wiki/product.md (lines 43 and 52) still describes the old order and the old (b) text. Lead to refresh at iteration close (proposed wiki change, not done by me): order is now (1) own clash with the holder named, (2) broken grid with the named clash and "Change or clear one of them first...", (3) not a technique; Hint conflict text is named and plain; add `namedClash` and `firstHolder` to architecture.md.

Code quality: concise, `firstHolder` and `cellName` shared by both texts, no duplication; comments accurate. Minor: the comment says Q "comes later in reading order", which holds by construction (see above).

Mutants (applied in my worktree only, each reverted; sudoku.js restored, verified with cmp)
| Mutant | Result |
|---|---|
| firstHolder unit order reversed (box, column, row) | killed (5 fail) |
| row/box swapped (box, column, row via [2,1,0]) | killed (5) |
| column/box swapped ([0,2,1]) | killed (2) |
| extra sentence threshold `> 2` -> `>= 2` | killed (2) |
| `> 2` -> `> 3` | killed (3) |
| P = last conflict instead of first | killed (3) |
| own-clash and broken-grid checks reordered | killed (3) |
| Q = last holder (`.pop()`) | SURVIVES (S2) |
| `x !== p` dropped | killed (3) |
| extra sentence also on text 1 | killed (4) |
| Hint class back to `fail` for conflict | SURVIVES (UI, N1) |
| extra sentence dropped from Hint | killed (1) |
| extra sentence dropped from text 2 | killed (2) |
| P and Q swapped in the phrase | killed (3) |

Criteria coverage in tests: 2 (CLASH wins over broken grid, killed by reorder), 4 (column+box and row+box adjacent precedence, row-only, column-only, box-only, first-P-regardless-of-digit), 5 (exactly 2 vs 3, in hint and text 2), 3 (tally/credited unchanged). `node --test`: 143 tests, 143 pass, about 0.63 s.

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

## Lead (round 2 and PR)
- Developer round 2 (04869eb): README S1 wording and one added assertion for S2. No product file changed (`git diff 572cd18 04869eb -- sudoku.js index.html style.css` is empty).
- Delta re-check by the lead:
  - suite 143/143 in about 0.61 s;
  - the S2 mutant (`[0]` to `.pop()` in `firstHolder`) on a scratch copy: 142 pass, 1 fail, so it is KILLED;
  - the tester's page pins (ts50/pins.js, WT=wt-50): 7/7 PASS, with the Hint class "" and no marks.
- Decision: the lead did the delta re-review instead of the reviewer. The round touches one README sentence and one assertion, and the only check the reviewer asked for (the mutant) was re-run.
- N3 (nit, folded into #51): the new README sentence repeats itself ("clashes if its digit also appears in another cell... (the cells that share a digit with another cell...)"). Proposed for #51, which rewrites this section: "...in another cell of its row, column or box (givens included; Verify turns only your own values red)."
- Gate: ready for PM acceptance at head 04869eb plus this log commit.

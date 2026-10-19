# Work Log: Iteration 1 (product manager)

- Product manager: weaver-agents (product-manager agent, Claude Opus 5.5), session `469a4b87`
- Run type: "Deliver the next iteration" (first iteration run)
- Branch: `iteration-1`
- Lead work log: `work-log/iteration-1.md`

## Status
- [x] Context read: product strategy, development practices, charter, README, issues #1/#3/#5/#7, prior work logs, governance/LOG.md
- [x] Scope decided (one issue)
- [x] Issue raised: #9 "Pencil-mark notes in empty cells" (https://github.com/dirkmarski/weaver/issues/9)
- [x] Delivery by the lead (developer, reviewer, tester): PR #10, code head ae7fe66
- [x] User acceptance by the product manager against #9's acceptance criteria: ACCEPTED (2026-10-19)
- [ ] Iteration closed: waiting only on the lead merging PR #10 (which closes #9). No other work belongs in iteration 1.

## Starting point (2026-10-19)
The static sudoku page has a difficulty prompt (Easy/Medium/Hard) and generates unique puzzles at run time; per #7/D9, each level needs a technique the level below does not. Players can enter digits, Verify by the rules (conflicts shown in red) and start a New puzzle. No open issues, all PRs merged. There was no product work log yet, so this is a fresh start.

## Options considered
1. **Pencil-mark notes (candidates).** This is the biggest gap in actually playing the harder levels. Hard is now guaranteed not solvable by naked plus hidden singles, so a player needs candidates, and today they would need paper. It is a self-contained UI change with no generator impact.
2. **Arrow-key navigation between cells.** Small, but a convenience and not a blocker.
3. **Keep progress across reloads / confirm before New puzzle discards work.** Valuable, but lower value than being able to play Hard at all.
4. **Publish the site (e.g. GitHub Pages) so real users can test it.** This fits the strategy's "early user testing" best. But weaver-agents only has WRITE permission on the repo, and enabling Pages needs admin rights in the repo settings, so the team cannot finish this alone. Raised as a concern below instead.
5. Timer, completion celebration, second game. These are polish or a new direction, and premature while the core sudoku loop is still missing a standard player tool.

## Decision
Iteration 1 delivers **one issue: pencil-mark notes (#9)**. Rationale:
- It completes the core play loop that #7 opened up. Generated Medium/Hard puzzles have little user value if players cannot work candidates on the page.
- It is a small, testable increment. It is pure UI plus a little pure state logic, and it does not touch generation.
- One issue keeps the first iteration run small, so the new PM -> lead -> PM acceptance flow can be tested with little risk.

## Product decisions settled in the issue (P1-P11)
Notes toggle button (`Notes: Off/On`, aria-pressed, Off on each new puzzle). Typing a digit in notes mode toggles the note in an empty cell only. Notes sit in fixed 3x3 positions and do not change the cell size. Entering a value removes the cell's notes. Backspace/Delete in notes mode clears the cell's notes. Verify ignores notes entirely. Note edits do not clear Verify results, but value edits still do. New puzzle discards notes. Invalid input is rejected in notes mode too. The accessible name includes the notes.

## Out of scope (explicit in the issue)
Auto-candidates, auto-removing peer notes, conflict highlighting of notes, hints, a toggle shortcut, arrow-key navigation, persistence, undo, mobile layout work, and generator changes.

## Quality gates required
Developer unit tests (pure, exported note logic) and README. Reviewer (correctness, formatting, conciseness). Tester (headless browser walkthrough of every acceptance criterion on Easy and Hard, measured cell-size stability, screenshots in the scratchpad). PM user acceptance before close.

## Assumptions
- "Early user testing" can only mean PM acceptance from the tester's browser evidence and screenshots for now, because there is no published site and no access to real users.
- The current 56px cells are large enough for a 3x3 grid of note digits. If they are not readable, the developer may adjust the note font size but not the cell size. Any cell-size change would be a scope change to raise with the PM.
- The chosen behaviours (no auto-removal from peers, notes not restored after clearing a value) follow common minimal sudoku apps. They are the simplest consistent rules, and later iterations can refine them from feedback.

## Concerns and ambiguities
- **No route to real users.** The strategy asks for early user testing, but the site is not published. GitHub Pages (or similar) needs a repo admin setting that weaver-agents does not have (viewerPermission: WRITE; Pages API returns 404). Flagged for Dirk. Once Pages is enabled, a small deploy issue would be a good next-iteration candidate.
- Candidates for later iterations: arrow-key navigation, auto-removing peer notes, saving progress, confirming before New puzzle discards work.

## Progress
- 2026-10-19: Scope decided, issue #9 raised, work log written and pushed on `iteration-1`. Handed back to the lead for delivery. Next PM step: user acceptance of #9 when the lead reports delivery.
- 2026-10-19: **User acceptance of #9: ACCEPTED** (comment: https://github.com/dirkmarski/weaver/issues/9#issuecomment-6257187584).
  - Basis: PR #10 at code head ae7fe66, the round-3 tester report (95/95 browser checks on Easy and Hard, 0 console errors), the round-3 reviewer APPROVE, the screenshots issue9-r3-*.png in the session scratchpad, my own `node --test` run (56/56 pass), and my read of the sudoku.js diff and README.
  - AC1-AC13 and P1-P11 are all met. Notes are readable at 13px #626262, which meets AA contrast. Cell size is unchanged with 0/1/9 notes.
  - Gate history: round 1 passed with should-fix items, which were reworked. Round 2 found blocking defect D1 (Verify threw on given cells, a regression from the rework). It was fixed with a regression test, and round 3 passed. The gates did their job. Lesson: refactors of UI glue need a UI-shaped unit test, not only pure-input tests.
- **Decision A1:** with Notes on, Backspace/Delete on a cell with a value clears the value, as in normal mode. Players can remove a wrong value without switching modes. It is documented in the README.
- **Decision A2:** in normal mode, Backspace/Delete on a notes-only cell keeps its notes. Normal mode acts on values only. We will revisit if user feedback disagrees.
- **Iteration 1 status:** complete once the lead merges PR #10. Nothing else is in scope.

## Next-iteration candidates (for the next PM run; not yet decided)
1. **Publish the site (GitHub Pages)** so real users can test it. This is still blocked on a repo admin setting (concern above). It is the top candidate if Dirk enables Pages, because it directly serves the strategy's "early user testing".
2. **Arrow-key navigation between cells.** Notes make keyboard play more frequent, so moving with the mouse between cells is now the main friction.
3. **Keyboard shortcut for the Notes toggle** (e.g. N or Space). It is small and pairs with item 2.
4. **Auto-remove peer notes when a value is entered.** This is a common convenience, but it changes the P5 rules, so it should be decided after feedback.
5. **Confirm before New puzzle discards work / keep progress across reloads.** Losing notes is now a bigger loss.
6. Revisit A2 (normal-mode Backspace on a notes-only cell) only if feedback shows confusion.

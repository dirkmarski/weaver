# Work Log: Iteration 2 (product manager)

- Product manager: weaver-agents (product-manager agent, Claude Opus 5.5), session `7e37b5e2`
- Run type: "Deliver the next iteration" (second iteration run)
- Branch: `iteration-2`
- Lead work log: `work-log/iteration-2.md`

## Status
- [x] Context read: product strategy (unchanged since iteration 1), development practices, charter, README, iteration 1 logs (lead and PM), issue #9, current UI code (keydown wiring, givens are not inputs)
- [x] Pages re-checked: still not enabled (API 404), weaver-agents still WRITE only
- [x] Scope decided (one issue)
- [x] Issue raised: #12 "Keyboard play: arrow-key movement and N shortcut for Notes" (https://github.com/dirkmarski/weaver/issues/12)
- [x] Delivery round 1 by the lead: PR #13, code head 4813e5a (test PASS, review APPROVE)
- [x] User acceptance by the product manager: round 1 NOT ACCEPTED (2 small changes), round 2 ACCEPTED (code head 883ccb3)
- [x] Follow-up raised: #14 (README "How to play" accuracy, docs only)
- [ ] PR #13 merged and #12 closed (lead)
- [ ] Iteration closed

## Starting point (2026-10-19)
main has generated puzzles (Easy/Medium/Hard), digit entry, Verify, New puzzle and pencil-mark notes (#9, accepted in iteration 1). No open issues or PRs. The product strategy is unchanged: small increments, early user testing.

## Options considered
(The iteration 1 next-iteration candidates, re-ranked.)
1. **Publish the site (GitHub Pages).** Still the best fit for "early user testing", but still blocked: Pages is not enabled and needs admin rights that weaver-agents lacks. Not schedulable. Concern carried forward for Dirk.
2. **Arrow-key navigation + N shortcut for Notes.** Notes made keyboard play common. Moving between cells and toggling Notes now need the mouse, which is the main friction. These are small, self-contained UI changes with no generator impact, and they are easy to test with real key events. Together they make one coherent outcome: "solve a whole puzzle from the keyboard".
3. **Auto-remove peer notes on value entry.** Changes P5 from #9. This should be decided with user feedback, which we cannot get yet. Deferred.
4. **Confirm before New puzzle / keep progress across reloads.** Valuable, since losing notes is now a bigger loss. But persistence is a bigger change (storage format, restore rules). Strong candidate for iteration 3.
5. Timer, celebration, second game: still premature.

## Decision
Iteration 2 delivers **one issue: #12, keyboard play (arrow keys + N shortcut)**. Rationale: it removes the biggest remaining friction in the core loop that #9 opened up. It is a small, testable UI increment with a pure helper that can be unit tested. It keeps the same one-issue rhythm that worked in iteration 1. Options 2 and 3 from the iteration 1 candidate list are merged into one issue because they deliver one user outcome and would conflict if built in parallel (both change the same keydown handler).

## Product decisions settled in the issue (K1-K8)
Arrow keys move to the nearest editable cell in that direction. Givens are skipped and stay unfocusable. No wrapping: at an edge or with only givens beyond, the focus stays put. Arrows never change values/notes/Verify results/Notes mode, and the caret default is suppressed. N/n (no modifiers) in a cell toggles Notes like the button, keeps focus and types nothing. The Notes button gets a tooltip naming N, and the README documents both. Everything else is unchanged. The next-cell rule is a pure exported helper.

## Out of scope (explicit in the issue)
Wrapping, Home/End/PageUp/PageDown, Ctrl+arrow; focusable givens, row/column/box or same-digit highlighting; other shortcuts (including Space); peer-note auto-removal, auto-candidates, hints; persistence, confirm on New puzzle, undo; mobile/touch and number pads; generator/Verify changes.

## Quality gates required
Developer: unit tests (next-cell helper: all directions, skipping givens, edges, only givens left, a cell surrounded by givens) and README. Reviewer: correctness, formatting, conciseness; trace each key from keydown to its effect; confirm existing digit/Backspace/paste paths are unchanged. Tester: headless browser walkthrough with real key events on Easy and Hard, a full keyboard-only session, screenshots in the scratchpad, and the full walkthrough repeated every rework round. PM user acceptance before close.

## Assumptions
- Skipping givens (rather than making them focusable) is the simplest rule consistent with today's markup, where givens are plain cells and not inputs. Focusable givens would be a larger change (they would need read-only handling and a new accessible name). Revisit if feedback asks for it.
- No wrapping is the least surprising behaviour for a minimal app and is simple to test. Revisit on feedback.
- N is safe as a shortcut because letters are already rejected in cells, so no input is lost. The shortcut only works while a cell has focus. Other focus targets (buttons) keep their normal behaviour, which avoids clashing with button activation keys.
- "Early user testing" still means PM acceptance from the tester's evidence, as in iteration 1.

## Concerns and ambiguities
- **No route to real users (carried over).** Pages is still not enabled (API 404). weaver-agents has WRITE only. This needs Dirk. Until then, product decisions (no wrap, skip givens, P5) rest on PM judgement rather than user feedback.
- The keydown handler gets more branches. The reviewer should keep it concise and make sure digit/Backspace/paste behaviour is unchanged (the iteration 1 D1 regression came from a refactor of this kind of glue code).
- Screen readers: arrow keys in a text input normally move the caret. Suppressing that is fine for single-character cells, but it is an assumption without user feedback.

## Progress
- 2026-10-19: Scope decided, issue #12 raised, work log written and pushed on `iteration-2`. Handed back to the lead for delivery. Next PM step: user acceptance of #12 when the lead reports delivery.

- 2026-10-19: User acceptance round 1 of #12 (PR #13, code head 4813e5a): **NOT ACCEPTED**. Comment: https://github.com/dirkmarski/weaver/issues/12#issuecomment-6257570750
  - Evidence checked: tester report test-12-r1.md (PASS on Easy/Medium/Hard, real key events, 329 arrow-target checks, 0 console errors), review review-12-r1.md (APPROVE, nits only), and the diff (sudoku.js nextCell + keydown branches, index.html title, README, tests). `node --test` run by the PM in a detached worktree on bfb11ff: 62/62 pass. Screenshots looked at (easy focus after skip, hard Notes On) and they match.
  - AC1-AC9 met. AC10 is partly met (see R2).
  - **Decision on N auto-repeat (lead's open question): fix it in #12.** If N is held, Notes flips with every repeat, and the mode it ends in depends on how long the key was held. That goes against K5 ("exactly like clicking the button": one press, one toggle) and can quietly break the AC6 keyboard loop. The fix is a one-condition change on the N path only. The cost is one rework round, which is acceptable for a defect in the core interaction this iteration exists to deliver. Arrow auto-repeat stays (holding an arrow to travel is wanted).
  - R1: ignore repeated keydown for N (`e.repeat`). Still preventDefault and type nothing, but do not toggle.
  - R2: README says arrows move to the "nearest empty cell". That is wrong, because cells that hold a player value are also targets. Reword it to "nearest cell that is not a given".
  - Other review nits (1, 3, 4, 6) accepted as they are. Nit 5 (split the long README bullet) is optional.
  - Rework gates: developer makes only R1 and R2. The reviewer checks that the repeat check is on the N path only. The tester repeats the full walkthrough, adds a held-N check (toggles once, nothing typed, focus kept) and a held-arrow check (still moves), and checks the README.
  - Iteration status: **not complete**. Iteration 2 is complete when round 2 is accepted by the PM and PR #13 is merged.

- 2026-10-19: User acceptance round 2 of #12 (PR #13, code head 883ccb3, branch head ac108a5): **ACCEPTED**. Comment: https://github.com/dirkmarski/weaver/issues/12#issuecomment-6257618631
  - Evidence checked: diff 883ccb3 (the `e.repeat` check is on the N branch only, and preventDefault is kept), README sub-bullets, tester test-12-r2.md (PASS AC1-AC10 on all three levels; held N 199 checks with a negative control; held arrows 764; own-value targets 592; 0 console errors), review review-12-r2.md (APPROVE). Screenshot issue12-r2-hard-after-holding-N.png looked at. `node --test` run by the PM in a detached worktree on ac108a5: 62/62 pass.
  - **Decision on the README audit items: none of them blocks #12. All three go to follow-up #14** (https://github.com/dirkmarski/weaver/issues/14, docs only).
    - Item 1 (Verify empty count shown only without mistakes) and item 2 (Notes-Off Backspace keeps notes on a notes-only cell, A2) predate #12 and are out of its scope.
    - Item 3 ("letters ... rejected" vs N) was introduced by #12, but it is cosmetic. The same section documents N explicitly, so a user is not misled. One more full rework and test round is not worth that cost. It is bundled into #14 so the section gets fixed in one pass.
  - Assumption: a README-only issue is still worth a full reviewer and tester pass, because the README is the only user guide and the earlier errors came from text that nobody checked against behaviour. The gates in #14 are kept light (check each changed claim).
  - Iteration status: **iteration 2 is complete once PR #13 is merged** (and #12 closed). #14 is not part of iteration 2. It is a candidate for iteration 3 and can be bundled with the next feature issue.

## Next-iteration candidates (not yet decided)
1. Publish the site (GitHub Pages), if Dirk enables it. A small deploy issue.
2. Keep progress across reloads and/or confirm before New puzzle discards work.
3. Auto-remove peer notes when a value is entered (after feedback).
4. Highlight the focused cell's row/column/box or same digits.
5. Revisit A2 (normal-mode Backspace on a notes-only cell) only on feedback.
6. #14: README "How to play" accuracy (docs only, small). Already raised; schedule it in iteration 3.

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
- [ ] Delivery by the lead (developer, reviewer, tester)
- [ ] User acceptance by the product manager against #12's acceptance criteria
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

## Next-iteration candidates (not yet decided)
1. Publish the site (GitHub Pages), if Dirk enables it. A small deploy issue.
2. Keep progress across reloads and/or confirm before New puzzle discards work.
3. Auto-remove peer notes when a value is entered (after feedback).
4. Highlight the focused cell's row/column/box or same digits.
5. Revisit A2 (normal-mode Backspace on a notes-only cell) only on feedback.

# Work Log: Iteration 17 (lead)

- Lead: weaver-agents lead agent (Claude Opus 5.5, claude-opus-5-5), session `cb27eb6b-ad9f-4cda-935d-15975e0cc9a8`
- Scope (PM, work-log/iteration-17-product.md): #76, #77, #78 in sequence. This session was asked to deliver #76.

## #76
- 2026-10-21: started fresh from main 897c762. Per-issue log: work-log/issue-76-link-under-grid.md.
- Developer 8c6e944 (4lh reserve, +18 test lines, ratio at the cap) -> rework 1 1c7c312 (f1e block +10 lines, ratio 1.594x).
- PM decision 1: 4lh over 3lh (R3 is 4 lines at 360 px content width; the suite's mobile:false 375 px override has a 15 px scrollbar). Lead error: the figure "buttons bottom 783" given to the PM measured only row 1 of the wrapped buttons; the tester caught New puzzle clipped at 375x812 (783-818). PM decision 2: B2 (link margin-top 0.25rem, `#buttons { margin-top: 0.5rem }`) -> rework 2 905364b.
- Reviewer APPROVE x2 (16 mutants), tester FAIL (AC5) then PASS (real input, replay 570 steps 0 diffs). Lead spot checks: suite, 3lh mutant, screenshot, re-run of phone.js.
- PR #79, PM ACCEPT at 60c5024 (personas: together 5/5/5, buttons still 5/5/5, mis-tap 4/4/4, discover 3/4/3). Merged e1dd667 (merge commit). Issue closed.
- Product 1313, tests 2091, ratio 1.5925x, headroom 9 (cap 2100). 173 tests (153 unit, 20 page).
- Open for #77/#78: f1e now has a 375 px block at its end; PM backlog adds wrapped button row (New puzzle, mis-tap, clipped at 360x800), ring discovery cue, vertical centring on tall windows (C1), explanation below the fold (~822 px).

## #77
- Per-issue log: work-log/issue-77-pointing-steps.md. Developer ce2a2f3 (conclusion + 3 numbered steps, `#status.steps` pre-line/left/36rem for pointing explanations only); rework 1 README two words ("below the buttons"), lead-checked.
- Reviewer APPROVE (9 mutants; survivors: class on every explain kind, max-width not pinned; accepted by the PM). Tester PASS (768-status replay vs main, 11 intended diffs).
- PR #80, PM ACCEPT at 74d9695 (personas: follow 4/4/4 both forms; phone readability naked 3/3/3, hidden 4/4/4; top complaint: board and explanation not visible together on a phone). Merged bf475be. Product 1315, tests 2101.

## #78
- Per-issue log: work-log/issue-78-ruled-badge.md. Developer 356a879 (ruled cells: purple struck D badge in D's note slot instead of the inset 3 px border; `data-d` set in `selectRing`, removed in `unlink`).
- Two lead runs stopped before reviewer/tester reported because they were launched in the background and the lead handed back early; the third run re-ran them in the foreground, one at a time. Reviewer APPROVE, tester AC1-AC9 PASS (real CDP input, 375 and 1280 px).
- PR #81, PM ACCEPT at c898a06 (no new persona round; the mock-up scored 4-5/5 at scoping). Merged 3d831d1.

## Close (2026-10-21, closing lead run, same session id)
- iteration-17 branch merged into main (merge commit); the add/add conflict on iteration-17-product.md resolved to main's version (a superset: the iteration-17 copy held only the older candidate list lines).
- Final: product 1319, tests 2110, ratio 1.600x, cap floor(1.6 x 1319) = 2110, headroom 0. 173 tests (153 unit, 20 page). Suite on main after the merge: node --test 173 pass, 0 fail, 0 skipped (3.1 s).
- Carry to it18 (PM list): mobile first, top candidate board and explanation visible together on a phone; then explanation depth (tap-to-reveal steps, shorter naked step 3, non-breaking spaces against short tails). Watch: edge-digit ruled badges at 375 px not pinned; CSS mutants surviving (#77 class on every explain kind, max-width); key line does not mention the ruled badge.
- Memory: WIP rewritten, backlog snapshot refreshed from the PM's it17 list, lessons merged (foreground agents), wiki facts updated for #76-#78.
- Housekeeping: session scratchpad worktrees (wt-main-78, wt-review-78, wt-test-78) removed; merged local issue/iteration/scratch branches deleted. The untracked repo `scratchpad/` (PM it17 briefs, scripts, screenshots) left out of the commit: scratch material, not memory.

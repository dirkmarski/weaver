# Work Log: Iteration 18 (lead)

- Lead: weaver-agents lead agent (Claude Opus 5.5, claude-opus-5-5), session `28d2788e-8588-47d1-8000-5904c97e526f`
- Scope (PM, work-log/iteration-18-product.md): #83, #84, #85 in sequence. This session was asked to deliver #83 only.
- Branch decision: no `iteration-18` branch this time. The lead log, the PM log and the issue logs travel on the issue branches and reach main with each issue PR, so every log file stays on one branch line (it17 lesson). The PM log was uncommitted on main's working tree; it is committed on issue-83-square-cells.

## #83
- 2026-10-22: gate check passed (open, authored by weaver-agents/PM, enhancement). Fresh start from main 7fdc9a2 (no branch, PR or log existed). Per-issue log: work-log/issue-83-square-cells.md.
- Developer 0d613aa: td width/height `calc((100vw - 32px) / 9 - 2px)` below 560 px, chips flush top/bottom via --tx/--ty, `body { align-items: flex-start }` below 560 (AC6: page shifted 1.9 px on Hint otherwise), td line-height 0 + input min-height (360 px floor). f4 extended, f4/f1e moved to mobile:true. Product 1324, tests 2114, cap 2118. Suite 173/173, skipped 0.
- Lead check: classic-scrollbar windows 500-559 px: no horizontal scroll, cells ~1.7 px taller than wide. Two questions to the PM: Q1 top alignment (overlaps #84) -> accepted in #83 below 560 px; Q2 scrollbar case -> accepted limit, backlog. AC1/AC6 text amended, Change log added (PM 0587923).
- Reviewer (3c7fe0b): REQUEST CHANGES R1 (grid width unpinned, `-60px` mutant survived); 20 mutants; changed assertions confirmed. Tester (c0b0ac7, e88c91d): AC1-AC9 PASS, replay 1600 steps 0 diffs (375 touch, 1280 mouse), AC4 189 injected combos x 2 widths + 177 real chips, 1280 screenshot byte-identical, #status 179 px higher at 375x812.
- Rework 1 (329a97c, tests only): f4 pins the grid span at 375 px and squareness at 360 and 375 px. Lead delta re-check (tests-only round): suite 173/173, skipped 0; mutants `-60px`, drop td line-height 0, drop input height rule all killed by f4. Product 1324, tests 2117, cap 2118.
- Note for the PM: the amended AC1 limit says "up to 2 px"; the tester measured 1.67 px typical, 2.67 px worst cell (thick-border cells) at 500-559 px classic scrollbar.

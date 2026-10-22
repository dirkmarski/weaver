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
- PM ACCEPT on code head fcabe1f; PM log commit c220c99 (logs only, lead-checked `git diff --stat fcabe1f c220c99`). AC1 limit reworded by the PM (2.7 px on thick-border cells). Persona check folded into #84's round.
- Before the merge: lead log, WIP and wiki (product mobile facts per the PM's note, architecture sizes/f4, process branch rule, lessons mobile:true) committed on the issue branch; logs/memory only after the accepted code head. Merge with that head sha.
- Memory note for the closing lead: the PM had to read the it17 product log (178 lines) for layout figures; a "mobile layout facts" line is now in wiki/product.md. The tester's script usage lived only in its report; ask testers to leave a short usage note in their scratch dir.

## #84
- 2026-10-22: new lead run (same session id) after #83 merged as a45b784. Gate check passed (open, PM-authored). Fresh start: branch issue-84-phone-buttons from a45b784. Per-issue log: work-log/issue-84-phone-buttons.md. Ratio 2117/1324, headroom 1.
- Developer f6dfaed/e429342/7cce946: New puzzle in `#level` after `#level-text`, play buttons flex row 12 px gaps, top alignment in the base rule; f1e extended; 3 unit-test lines removed. Lead R1: the 10th-row removal unguarded the outer `grid.length !== 9` (mutant survived); rework 2197782 restores it in one line. Tests 2118 = cap.
- Reviewer APPROVE (a842c22), tester PASS AC1-AC9 (1916941), removals confirmed by both. Lead re-run 172/172 skipped 0. PR #87.
- PM ACCEPT at 2197782 (c72758c). Personas: thumb 5/5/5, findability 4/4/4, chips 3/3/3 (backlog). Merged with a merge commit.
- Memory note for the closing lead: the tester left a usage README in $WEAVER_SCRATCHPAD/test-84 (reused by the PM: worked). Developer's ratio line in the issue log said 2117 (stale after rework); the lead section has the correct 2118.

## #85
- 2026-10-22: new lead run (same session id) after #84 merged as 638c0fa. Gate check passed (open, PM-authored). Fresh start: branch issue-85-compact-top from 638c0fa. Per-issue log: work-log/issue-85-compact-top.md. Ratio 2118/1324, headroom 0.
- Developer 63fe51e/03ed19b: 4 CSS lines below 560 px (h1 1.4rem, caption 0.8rem + padding 0.25rem, #level and #status margins), f1e grid top <= 88. Grid top 106.8 -> 79.8; 360x740 seed 8 status bottom 736.5. AC3 clarified by the PM (D8: board digits excluded). Reviewer APPROVE (b7f9fbb), tester PASS (58ca5c0). Product 1328, tests 2119, cap 2124.
- PM ACCEPT at 03ed19b (6fe78f8). AC6 deviation D9 (360x740 personas avg 3.67 over both seeds; seed 8 4.33). PR #88 merged with a merge commit.
- Memory note for the closing lead: the wiki is under memory/wiki (I looked for wiki/product.md first); the tester's test-85 README worked for the lead re-check. The inherited measure.js 'Enter on focused button' probe prints false on main too: fix or drop it in the scripts.

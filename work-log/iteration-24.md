# Iteration 24: lead log

Lead: Claude Opus 5.5 (claude-opus-5-5), session c62cf25c-8b8e-4cda-905a-5ce306a4299f. Scope: #121 (ADR 002 local run), then #122 (own reward marks). Branch rule: logs travel on the issue branches (process.md conventions).

## #121
- 2026-10-29 gate ok (open, PM author); baseline 222 pass + 2 undefined new scenarios; ratio 1.586x (2431/1533).
- 2026-10-29 part A e8f52d3 (steps/driver), lead red run + 3 mutants; part B 95efb97 (README View +2 lines).
- Review 179f480 changes needed (orphan server on helper SIGTERM); test 1c02053 pass (fresh clone 5/5, pixel 4/4). Rework r1 34948a3, lead re-check (paired mutant). PR #123 opened.
- PM accepted (c0dd056, D5-D6); merged PR #123 at the branch head with a merge commit.

## #122
- 2026-10-29 gate ok (open, PM author); main 96aee52 merged into the branch (fbf1dce); baseline 224 pass + 5 undefined new scenarios; ratio 1.586x (2431/1533).

- Part A be27e6a; PM Q1 (D7) spec 9beabb2 made scenario 5 red; lead red run 5/5 on assertions. Part B a67c5dc, a2a6f64. Review 63d077e approve (2 should, 2 nit); test f4b5385 pass. Rework r1 365c800, lead re-check (paired mutant, tester scripts re-run).

- PM accepted (529c3ff, D8; M 4.25 / L 4.00, targets 3.75 / 3.5); merged PR #124 at the branch head with a merge commit.

## Memory notes for the closing lead
- #122: own pointing/claiming rewards carry `marks` (`creditEntry(...).marks` from `hintmarks.js` `rewardMarks`); ui.js `showRewardMarks` reuses Hint classes and `clearResults`. Update architecture.md "Exports"/product.md "Rewards and counts". Ratio now 2472/1564 = 1.581 (cap 2502, about 30 lines headroom); spec-implementation 483. Tester scripts for page marks: session scratch `test-122/` (README).
- spec-implementation now has a process-level driver (`drivers/local-run.js`, `--crawl` helper since steps are synchronous); it owns port 8000 during the spec run, so a dev server on 127.0.0.1:8000 makes `node --test` fail (clear message).

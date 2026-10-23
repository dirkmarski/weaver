# Work Log: Iteration 20 (lead)

- Lead: weaver-agents lead agent (Claude Opus 5.5, claude-opus-5-5), session `541fd2f9-8dfe-4936-a1b6-0c535e8f682f`
- Scope (PM, work-log/iteration-20-product.md): #96 then #97 in sequence. This run delivers #96 only (#97 is a separate lead run, per the PM).
- Branches: logs travel on the issue branches (it18 rule). The PM log was uncommitted on main's working tree; committed on issue-96-step2-struck-cells (22c2b09).

## #96
- 2026-10-23: gate check passed (open, authored by weaver-agents/PM, label enhancement, no comments). Fresh start from main 8ed9eee (no branch, PR or issue log existed). Baseline 173/173, skipped 0; ratio 2187/1371, cap 2193, headroom 6. Per-issue log: work-log/issue-96-step2-struck-cells.md.
- 2026-10-23: developer (71a9612 code/tests/README, 7fc0cf8 log): 174/174, skipped 0, ratio 2204/1379 (headroom 2.4). Removed the #90 f1a stage-3 `#status <= 740` assertion (seed 8 status bottom 757.5 at 360x740). Spike seed 38 did not reproduce; pinned seeds 33/7/12 instead.
- 2026-10-23: PM decision (option A, issue #96 Change log 1): stage-3 whole-text fit not required in #96 (moved to #97 AC5/AC9); rename f1a; seeds 33/7/12 accepted for AC4.
- 2026-10-23: reviewer approve (f6cea9b, 12/12 mutants killed); tester PASS AC1-AC8 (866b8c5; fit 738.9/740 and 753.9/812 on seeds 1, 8, 33, 7, 12). Rework 1 (tests-only): f1a renamed (4bb5f52, log 46adb89); lead delta re-check (suite, mutant, tester scripts re-run).
- 2026-10-23: PM accepted at 612287a (AC1-AC9; personas 5/5/5). Merged PR #98 with a merge commit at the log-only head after it. Worktrees removed.
- Memory notes for the closing lead: (1) a re-run of a tester script needs its worktree (default ROOT ../wt-test); removing it before the lead re-run left stale output that looked like a pass: check the output timestamp (already a lesson; it recurred). (2) PM spike walks can differ from the page walk (seed 38 / seeds 33-7-12: unit walk calls hintFor without level); specs that name "seed N after k hints" should say which walk. (3) Stage-2 button spare at 360x740 is 1.1 px on all pointing seeds; stage-3 #status is 17.5-38.5 px below the fold until #97.

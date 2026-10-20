# Work Log: Iteration 10 (lead)

- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `0245eb9f-91d7-4bfe-b523-bbf5b80a2438`
- Run type: "Deliver the next iteration"
- Iteration branch: `iteration-10` (holds the iteration work logs and the memory updates; merged by PR at the end)
- Product manager work log: `work-log/iteration-10-product.md`
- Iteration files are edited in the worktree `<session scratchpad>/wt-iteration-10`.
- Session scratchpad: /private/tmp/claude-502/-Users-dirk-Code-weaver-team/0245eb9f-91d7-4bfe-b523-bbf5b80a2438/scratchpad

## Gate check
- 2026-10-20: Invoked to deliver the next iteration. Restart procedure (memory/README.md) followed: WIP says "no active run"; GitHub agrees (no open issues or PRs; main at 0f1fa1c = PR #44, the iteration-9 logs). There is no iteration-10 log, so this is a fresh start, not a resume.
- No changes by Dirk to `.claude/` or `governance/` since af8d50a (memory architecture, already applied in it9). governance/LOG.md not read, per the standing convention.
- Baseline on main: 143/143 tests, about 0.61 s.

## Plan
1. The PM decides the iteration scope from memory/wiki/backlog.md and its live list (with personas as needed) and writes the issue(s).
2. Per issue: gate check, branch `issue-N-<slug>`, per-issue log, developer, then reviewer and tester in parallel (proportionate), lead check, PR merged with a merge commit (no squash). The flow is in memory/wiki/process.md.
3. The PM accepts; the lead closes the iteration (wiki, WIP, log) and merges the iteration PR.

## Conventions
- Commits and PRs: `[<agent>][session 0245eb9f-91d7-4bfe-b523-bbf5b80a2438] <message> (#N)`. Each agent adds a co-author trailer naming its own model and version.
- No agent reads governance/LOG.md.
- After merging main into iteration-10, use `git pull --no-rebase`, never `--rebase` (it9 lesson).

## Progress
- Iteration branch, worktree and this log created.
- PM (product-manager agent) launched to scope iteration 10 (backlog snapshot + live list; personas and spike at its discretion).
- PM (Claude Opus 5.5) scoped two issues, delivered in sequence (PM log 10ae4d6):
  - #45 "Pointing hint: say what the step does to the target, tint the hidden-form unit, mark confined and removed cells" (first);
  - #46 "Say why an entry is not counted when it clashes with a digit in its row, column or box" (second; both touch README and sudoku.js).
  - The wording and marks were pre-reviewed by personas A, B and C on a mock-up. No spec questions are open.
- Gate check: #45 and #46 are OPEN, by weaver-agents, label `enhancement`. PASS.
- Decision D1: two issues is acceptable for "small": #46 is one text branch. They are delivered strictly in sequence; #46 branches from main after #45 merges.
- Decision D2: for #45 the tester's real-page check (screenshots, 375 px) is the main gate for the marks, because UI wiring has no repo tests.
- #45: branch issue-45-pointing-hint-marks (45f3e38), developer round 1 launched.
- #45 developer round 1 (Claude Sonnet 5.5) done, code head 332ef04: 143/143, about 0.6 s; sudoku.js +14, style.css +18, tests +7 lines. Lead check PASS with points L1-L4 (see the issue log). Review and test round 1 launched in parallel, each in its own detached worktree (wt-45-review, wt-45-test). The lead pre-created separate log sections so their pushes merge cleanly.
- #45 round 1:
  - Review: APPROVE with S1-S3 and nits N1, N2.
  - Test: criteria 1-5 PASS on the real page, including clearing with the marks showing; D1 is a low cosmetic defect (the badge covers pencil note 3).
  - Round 2: S1, S2, S3 and N1. D1 is accepted as a known limitation and flagged to the PM. The re-check is delta-scaled. Developer round 2 launched.
- #45 round 2 (code 579c1db): delta re-review APPROVE, smoke re-test PASS, lead check PASS (the lead re-ran the S1 mutant: killed). PR #47 opened (head 63c13de). Handed to the PM for acceptance, with D1 flagged.
- #45 ACCEPTED by the PM (no conditions, head 63c13de; PR #47 issuecomment-6283379837). The lead verified the hand-off on GitHub, added a log-only commit, and merged with a merge commit: 9b5779d (parents 0f1fa1c, 76289d3). #45 closed. main: 143/143.
- #46 started: branch issue-46-clash-message from main 9b5779d (log adc9506); developer round 1 launched.
- #46 developer round 1 (Claude Sonnet 5.5) done, code head c4b48f4: 143/143, sudoku.js +7, tests +7. Lead check PASS with L1 (the column-before-box order is probably untested). Review and test round 1 launched in parallel.
- #46 round 1:
  - Review: APPROVE with S1 (L1 confirmed: the column-before-box mutant survived) and nit N1 (README "matches the solution").
  - Test: 35/35 page checks PASS, no defects.
- #46 round 2 (378bd85; tests and README only, product code identical to c4b48f4): S1 assertion and N1 wording. The lead verified the diff and the suite (143/143). The delta re-review is running. No tester re-run, because the product code is unchanged.
- #46 round 2 delta re-review APPROVE (e78e488); lead check round 2 PASS. PR #48 opened (head 4be2898). Handed to the PM for acceptance.
- #46 ACCEPTED by the PM (no conditions, head 4be2898; PR #48 issuecomment-6283519624; the first lookup of the comment got an HTTP 502, and the retry showed author weaver-agents and ACCEPTED). The lead verified the hand-off, added a log-only commit (9df6a1d) and merged with a merge commit: eed18f3 (parents 9b5779d, 9df6a1d). #46 closed. main: 143/143, about 0.59 s.
- The PM confirmed that iteration 10 is complete from the product side.
- Close-out: main merged into iteration-10 with `--no-ff` (b676032; no `pull --rebase` afterwards, per the it9 lesson).
- Memory closed for the iteration:
  - wiki refreshed: product (#45 and #46 behaviour, gaps), architecture (sizes, `confined`/`removed`, marks wiring, `notCounted` order), process (parallel worktrees), lessons (it10), backlog (the PM's end-of-it10 list), index snapshot;
  - WIP reset to "no active run".

## Outcome and lessons
- Delivered:
  - #45, the pointing hint:
    - the naked-form nudge says what the step does to the target;
    - the hidden-form nudge names and tints the unit;
    - the second click marks the confined and removed cells.
    - Persona C's it9 failure (typing the pointing digit) did not recur.
  - #46: a neutral clash text that names the first of row, column, box holding the digit. It sits between texts (b) and (a). #31 still holds.
- Code: sudoku.js 900 -> 929, style.css 94 -> 112, tests 1075 -> 1093 lines; 143 tests (unchanged count), about 0.59 s. The test ratio fell from 1.21x to 1.18x.
- Rounds: two per issue. Round 2 was always small: tests, README, a behaviour-neutral split or a comment, re-checked by delta.
- Lesson 1: the lead's own pre-review spotting of gaps (L1/L2 on both issues) was confirmed both times by reviewer mutants (#45 S1, #46 S1). Giving the reviewer the suspected mutant up front made the review faster and sharper.
- Lesson 2: parallel review and test in separate detached worktrees, with pre-created log sections, merged cleanly twice (one auto-merge and one keep-both conflict that the tester resolved correctly).
- Lesson 3: a test-and-README-only rework round needs no tester re-run once `git diff <code commit> <head>` shows the product files untouched (#46 round 2; the PM used the same check).
- Lesson 4 (PM): mock-up choices can shift in play. The personas rejected red at the mock-up, but in play all three asked for a subtle marker.
- Concerns for Dirk:
  - All user evidence is still simulated (GitHub Pages unconfirmed).
  - Test ratio 1.18x, above the ~1x guide but falling.
  - Text (b) after a slip confuses personas: it predates this iteration and is now the top candidate.
- Accepted limitation: D1, the pointing badge covers pencil note 3 while the hint shows. A fix idea is in backlog candidate 2.

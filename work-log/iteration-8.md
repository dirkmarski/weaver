# Work Log: Iteration 8 (lead)

- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `46a62a2f-31a7-4db9-8c77-8e3d5044bf18`
- Run type: "Deliver the next iteration"
- Iteration branch: `iteration-8` (holds the iteration work logs and is merged by PR at the end)
- Product manager work log: `work-log/iteration-8-product.md`
- The iteration logs are edited in the worktree `<session scratchpad>/wt-iteration-8`.
- Session scratchpad: /private/tmp/claude-502/-Users-dirk-Code-weaver-team/46a62a2f-31a7-4db9-8c77-8e3d5044bf18/scratchpad

## Gate check
- 2026-10-20: Invoked to deliver the next iteration. Iteration 7 is closed and merged (#30, #31, #34). No open issues or PRs. There is no iteration-8 log, so this is a fresh start (not a resume).
- New since iteration 7 (Dirk):
  - daa3c5a, a governance/LOG.md entry titled "Log that testing grows out of proportion to the product". The lead still does not read LOG.md, and only the commit title is used.
  - 6807c23, "Add test strategy": `governance/context/test-strategy.md`. Testing is planned like development, weighed for pros and cons and maintained. It is reasonable: golden path, edge cases and error conditions, **no brute-forcing across all values**. There are three levels. Developers do unit tests (developer.md), the tester tests the product (tester.md), and the PM does acceptance testing, "sufficient testing to accept the feature" (product-manager.md).
- Measured: tests are about 2,025 lines (tests/sudoku.test.js 1125, tests/frozen-sudoku-e81999c.js 752, tests/generator.test.js 121, tests/fixture.js 27), against about 912 lines of product code (sudoku.js 781, index.html 37, style.css 94). Iteration 7 used oracle sweeps of 230k to 4.1M checks and mutation sweeps of 33 mutants. These conflict with the new strategy.
- Decision (lead): the carried lessons on "the tester computes expected values independently" and "the reviewer mutation-checks every guard clause" are re-scoped to fit the strategy:
  - The tester designs a test plan (golden path, edge cases, error conditions) and runs targeted checks. There are no exhaustive or brute-force oracle sweeps.
  - The reviewer may do a few targeted mutation spot checks on risky logic, not sweeps.
  - The PM accepts on sufficient evidence (persona sessions plus a check of the acceptance criteria), with no multi-million-check oracles.
  - A test-suite right-sizing (for example removing the frozen oracle) is a PM scoping decision. The lead raises it with the PM as candidate tech debt.

## Plan
1. The PM decides the iteration scope (with the simulated users) and writes the issue(s). The PM is told about the test strategy.
2. For each issue: gate check, branch `issue-N-<slug>`, a per-issue work log, then developer (unit tests per strategy), then reviewer and tester in parallel (tester: a proportionate test plan), then lead check, then a PR merged with a merge commit (no squash).
3. The PM does acceptance and decides when the iteration is done.

## Conventions
- Commits and PRs: `[<agent>][session 46a62a2f-31a7-4db9-8c77-8e3d5044bf18] <message> (#N)`. Each agent adds a co-author trailer naming its own model and version.
- No agent reads governance/LOG.md.

## Progress
- Iteration branch, worktree and this log created. PM launched to decide the scope.

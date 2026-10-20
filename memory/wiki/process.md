# Process: how the team works

Charter: `governance/CHARTER.md`. The agents build the site; Dirk (human) owns agent definitions (`.claude/`), product context (`governance/context/`) and the charter, and steers only through those. No human writes, alters or reviews code.

## Run types
- "Deliver the next iteration": the PM decides the scope and writes the issues, the lead delivers them, the PM accepts.
- "Complete task #N": the lead delivers one issue Dirk wrote.
- A later session resumes unfinished work from GitHub and the work log.

## Roles (`.claude/agents/`)
- lead: plans, delegates, runs gates, opens PRs, merges. Keeps the lead work log.
- product-manager: scopes, writes issues, runs acceptance (criteria, short play-through, personas), keeps the product log and candidate list.
- developer: implements and writes unit tests. reviewer: reads for correctness, README truth, targeted mutation spot checks. tester: test plan and real-page checks.
- user-a/b/c: simulated user personas used by the PM at scoping and acceptance. assistant: general-purpose helper.
- Models come from the `model:` frontmatter in `.claude/agents/*.md`: lead and PM `opus`; developer, reviewer, tester, assistant and user-a/b/c `sonnet`. Each agent states its own exact model and version in its commit trailer.

## Conventions
- Issues and PRs on GitHub. Issues carry the label `enhancement`.
- Branches: `issue-N-<slug>` per issue; `iteration-N` holds the iteration work logs and is merged by PR at close.
- Merge with a merge commit, never squash (individual commits are kept).
- Commit/PR title: `[<agent>][session <full session id>] <message> (#N)`. Each agent adds a co-author trailer naming its own model.
- `main` changes only by pull request.
- Work log: `work-log/iteration-N.md` (lead), `iteration-N-product.md` (PM), `issue-N-<slug>.md` per issue.
- No agent reads `governance/LOG.md` (Dirk's log); pass this rule to every agent.

## Per-issue flow
1. Gate check: issue is open and authored by Dirk Marski or weaver-agents (the PM); otherwise abandon. Iteration issues carry `enhancement`.
2. Branch, per-issue log.
3. Developer (code, unit tests, README).
4. Reviewer and tester in parallel; hold rework until both have reported (one rework round). Each gets its own detached worktree on the issue branch; the lead pre-creates their log sections (it10).
5. Lead check (read the diff, run tests, re-run key mutants).
6. PR opened; PM acceptance on a stated head commit.
7. Lead verifies the PM hand-off on GitHub (head, comment), then merges with a merge commit.
- Issues are delivered in sequence to avoid README/`sudoku.js` conflicts; wording nits go into the next issue touching that section.
- Open spec questions go to the PM before development.

## Test strategy applied (`governance/context/test-strategy.md`)
- Three levels: developer unit tests, tester product tests, PM acceptance. Golden path, edge cases, error conditions; no brute force across all values.
- Developer: targeted unit tests; a rule -> test mapping when restructuring.
- Tester: a test plan plus real-page checks on a few fixed seeds, small independent oracles on 4-5 seeds at most.
- Reviewer: 6-13 targeted mutation spot checks on risky logic, not sweeps.
- PM: acceptance criteria one by one, short play-through, personas for user-facing changes.
- Guide: test lines about 1x product lines; suite under 3 s.

## Rework re-checks
- Rounds that touch only tests, comments or README: delta re-review (re-run the specific mutant) and a suite plus smoke re-test.
- Rounds that change behaviour: full re-review and re-test.

## Development practices (`governance/context/development-practices.md`)
Unit tests for all code; clean legible formatting; refactor to keep the code base concise.

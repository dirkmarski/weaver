# Process: how the team works

Charter: `governance/CHARTER.md`. The agents build the site; Dirk (human) owns agent definitions (`.claude/`), product context (`governance/context/`) and the charter, and steers only through those. No human writes, alters or reviews code.

## Run types
- "Deliver the next iteration": the PM decides the scope and writes the issues, the lead delivers them, the PM accepts.
- "Complete task #N": the lead delivers one issue Dirk wrote.
- A later session resumes unfinished work from GitHub and `memory/wip/current.md`. The work log is not read unless specifically needed (Dirk's rule, 1464355, it11).

## Roles (`.claude/agents/`)
- lead: plans, delegates, runs gates, opens PRs, merges. Keeps the lead work log.
- product-manager: scopes, writes issues, runs acceptance (criteria, short play-through, personas), keeps the product log and candidate list.
- developer: implements and writes unit tests. reviewer: reads for correctness, README truth, targeted mutation spot checks. tester: test plan and real-page checks.
- user-a/b/c: simulated user personas used by the PM at scoping and acceptance. assistant: general-purpose helper.
- Models come from the `model:` frontmatter in `.claude/agents/*.md`: lead and PM `opus`; developer, reviewer, tester, assistant and user-a/b/c `sonnet`. Each agent states its own exact model and version in its commit trailer.

## Conventions
- Issues and PRs on GitHub. Issues carry the label `enhancement`.
- Branches: `issue-N-<slug>` per issue; since it18 the lead, PM and issue logs travel on the issue branches and reach main with each issue PR (no `iteration-N` branch; one branch line per log file). The closing lead uses a short `iteration-N-close` branch for wiki/WIP/close-log changes only.
- Merge with a merge commit, never squash (individual commits are kept).
- Commit/PR title: `[<agent>][session <full session id>] <message> (#N)`. Each agent adds a co-author trailer naming its own model.
- `main` changes only by pull request.
- Work log: `work-log/iteration-N.md` (lead), `iteration-N-product.md` (PM), `issue-N-<slug>.md` per issue.
- No agent reads `governance/LOG.md` (Dirk's log); pass this rule to every agent.
- Agents running Chrome or temp files use explicit private temp dirs under the session scratchpad (`/tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/<session>/scratchpad` since 9c5542b) and never `rm -rf` a possibly unset variable (it13 incident); pass this rule in prompts.
- Merge commits made by agents carry the `[<agent>][session <id>]` prefix too; give the message in the prompt (it14).
- Agent and persona briefs are files in the session scratchpad with literal absolute paths; the prompt is one line pointing at the brief. Never rely on `$WEAVER_SCRATCHPAD` inside an agent: a persona could not resolve it (echo denied, it19).
- Every agent prompt ends with a fixed-format evidence report (commits, files changed, tests incl. skipped, ratio, AC -> evidence map, removed assertions, what was NOT tested, deviations, LOG.md confirmation); the lead spot-checks it rather than reading transcripts or logs (lead.md supervisor strategy, it15).
- Agents read the wiki and WIP, not the work log, unless specifically needed. Reviewers and testers read only the Lead section of the issue log. The PM scopes from `memory/wiki/backlog.md` and leaves an up-to-date ordered list at the end of its product log for the lead's snapshot.

## Per-issue flow
1. Gate check: issue is open and authored by Dirk Marski or weaver-agents (the PM); otherwise abandon. Iteration issues carry `enhancement`.
2. Branch, per-issue log.
3. Developer (code, unit tests, README).
4. Reviewer, then tester, one at a time in the foreground; hold rework until both have reported (one rework round). Each works in its own detached worktree on the issue branch (lead pre-creates their log sections, it10) and commits only its log entry; the lead fast-forwards the issue branch to each sha (`git merge --ff-only`), so there are no agent merge commits (it19). If an agent must merge, give it the tagged `-m` message.
5. Lead check (read the diff, run tests, re-run key mutants).
6. PR opened; PM acceptance on a stated head commit. A PM rejection leads to a rework round with the spec change recorded in the issue Change log, then the re-check level below, then re-acceptance of the affected criteria (it13 #61).
7. Lead verifies the PM hand-off on GitHub (head, comment), then merges with a merge commit (`gh api -X PUT .../pulls/N/merge -f merge_method=merge -f sha=<accepted head>`, so the merge fails if the head moved).
- Issues are delivered in sequence to avoid README/`sudoku.js` conflicts; wording nits go into the next issue touching that section.
- Open spec questions go to the PM before development; questions found later go to the PM too, and the PM records each decision in the issue body's Change log and comments on the issue (it12 Q1-Q3).

## Test strategy applied (`governance/context/test-strategy.md`)
- Three levels: developer unit tests, tester product tests, PM acceptance. Golden path, edge cases, error conditions; no brute force across all values.
- Developer: targeted unit tests, plus page tests in `tests/page.test.js` for UI wiring and CSS (#55); a rule -> test mapping when restructuring.
- Tester: a test plan plus real-page checks on a few fixed seeds (scratch scripts may reuse `tests/chrome.js`; leave a `README.md` in the scratch folder: setup (incl. the `tmp/`/`shots/` dirs scripts expect and which scripts need a git tree rather than an archive export), env vars, one line per script and its pass line, so the lead, PM and the next tester can re-run it; it18 #84/#85, it19), small independent oracles on 4-5 seeds at most, numeric measurements and screenshots for visual changes.
- Reviewer: 6-13 targeted mutation spot checks on risky logic, not sweeps.
- PM: acceptance criteria one by one, short play-through, personas for user-facing changes (on-screen screenshots, run in the foreground before deciding). Click/tap behaviour is checked with real CDP input by the tester and the PM.
- Guide: test lines about 1x product lines (1.595x at the it19 close, 2187/1371, cap 2193, because of the page harness). PM rule (it13): at most 1.6x; an issue that would pass it adapts rather than adds tests and may remove only redundant assertions in the files it touches, each listed in the PR with the test that still covers it and confirmed by reviewer and tester, never one an AC explicitly requires, and no line packing (it14); otherwise a trim item comes first. The suite under 10 s (about 3 s with Chrome). Page evidence must show skipped = 0.

## Rework re-checks
- Rounds that touch only tests, comments or README: delta re-review (re-run the specific mutant) and a suite plus smoke re-test.
- Rounds that change behaviour (product, CSS or test-harness behaviour): re-review and re-test of the delta in full.
- Exception (it16 #72): a one-expression product change on a path not reached in practice may be re-checked by the lead (whole delta read, mutants and the tester's saved scripts re-run), logged as a deviation.

## Development practices (`governance/context/development-practices.md`)
Unit tests for all code; clean legible formatting; refactor to keep the code base concise.

## Work-log entry format (keep entries short; history only)
- Lead log `iteration-N.md`: header (lead model, session id, scope, branch rule), then per issue one dated bullet each for gate/baseline ratio, developer shas, review/test verdicts, rework, acceptance + merge, and "Memory notes for the closing lead".
- Issue log `issue-N-<slug>.md`: title line, issue link and branch, then sections `## Lead` (gate, baseline ratio, plan), `## Developer`, `## Reviewer`, `## Tester` (model, session, head, verdict, numbered findings, not tested), `## Lead review`, `## Lead: acceptance and merge`. Reviewers and testers read only `## Lead`.
- PM log `iteration-N-product.md`: status, direction, evidence, decisions, issues, then per acceptance a section, ending with the ordered backlog the lead snapshots into `memory/wiki/backlog.md`.

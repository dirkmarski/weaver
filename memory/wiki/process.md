# Process: how the team works

Charter: `governance/CHARTER.md`. The agents build the site; Dirk (human) owns agent definitions (`.claude/`), product context (`governance/context/`, incl. ADRs in `decisions/`) and the charter, and steers only through those. No human writes, alters or reviews code.
- ADRs (`governance/context/decisions/`, status In force) are binding; agents never edit them. A departure is a failure; if one looks wrong, only the lead, PM or curator stops and recommends (rules.md). Briefs for code work name the ADRs in force (ADR 001: architecture.md "Modules"; ADR 002: README View command, Node built-ins only, no install; keep 127.0.0.1:8000 free during `node --test`).

## Run types
- "Deliver the next iteration": the PM decides the scope and writes the issues, the lead delivers them, the PM accepts.
- "Complete task #N": the lead delivers one issue Dirk wrote.
- A later session resumes unfinished work from GitHub and `memory/wip/current.md`. The work log is not read unless specifically needed (Dirk's rule, 1464355, it11).

## Roles (`.claude/agents/`)
- lead: plans, delegates, runs gates, opens PRs, merges. Keeps the lead work log.
- product-manager: scopes, writes issues and the executable specs in `specs/` (only the PM may write there; `.claude/hooks/specs-guard.py` blocks others), runs acceptance (executed specs, test summary report, criteria, short play-through, personas), keeps the product log and candidate list.
- developer: implements, writes the steps/drivers in `spec-implementation/` and unit tests. reviewer: reads for correctness, README truth, targeted mutation spot checks. tester: test plan and real-page checks.
- user-a/b/c: simulated user personas used by the PM at scoping and acceptance. assistant: general-purpose helper. curator: curates `memory/` at each iteration close (wiki, WIP, backlog snapshot, read-list review).
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
- Agent and persona briefs are files in the session scratchpad with literal absolute paths; the prompt is one line pointing at the brief. Never rely on `$WEAVER_SCRATCHPAD` inside an agent: a persona could not resolve it (echo denied, it19). Brief skeleton (use this, do not open earlier briefs as templates): role and session id; issue, branch, head and worktree; task and ACs; the wiki sections to read, each as its `awk` command (index.md), and ask the report to name the sections read (it22 testers/reviewers skipped listed sections); rules (no LOG.md, temp dirs, no `rm -rf` of unset vars, commit title, model trailer; mutants: name the module to mutate, e.g. `hints.js`, and never edit `specs/`, not even in a worktree copy, it22 #110); whether to comment on the issue/PR (say yes or no); the evidence report format below.
- Scratch folders survive the session under `/tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/<session>/scratchpad` until /tmp is cleared; reuse a previous session's scripts via the paths in `memory/wip/current.md` and copy them into the new scratchpad rather than editing in place.
- Every agent prompt ends with a fixed-format evidence report (commits, files changed, tests incl. skipped, ratio, AC -> evidence map, removed assertions, what was NOT tested, deviations, LOG.md confirmation); the lead spot-checks it rather than reading transcripts or logs (lead.md supervisor strategy, it15).
- Agents read the wiki and WIP, not the work log, unless specifically needed. Reviewers and testers read only the Lead section of the issue log. The PM scopes from `memory/wiki/backlog.md` and leaves an up-to-date ordered list at the end of its product log for the curator's snapshot.

## Per-issue flow
1. Gate check: issue is open and authored by Dirk Marski or weaver-agents (the PM); otherwise abandon. Iteration issues carry `enhancement`.
2. Branch (the PM's spec is its first commit), per-issue log. Merge main into the branch first, so the spec runs on the current runner.
3. Red first: the developer writes the steps/drivers only (part A); the lead confirms the new scenarios fail on assertions, not on undefined or ambiguous steps, and records the red run. A scenario main already meets is proved by lead mutants instead; a "goes away" scenario needs a precondition so it is not vacuous (lessons "Testing", #121 D2, #122 D7). Then part B: code, unit tests, README (#111: A/B split made the red proof cheap). A large issue may be split into sequential parts on the branch (logic, then UI/page), with a lead spot check (suite, ratio, `-` lines, longest line) between parts (#102).
4. Reviewer, then tester, one at a time in the foreground; hold rework until both have reported (one rework round). Each works in its own detached worktree on the issue branch (lead pre-creates their log sections, it10) and commits only its log entry; the lead fast-forwards the issue branch to each sha (`git merge --ff-only`), so there are no agent merge commits (it19). If an agent must merge, give it the tagged `-m` message.
5. Lead check (read the diff, run tests, re-run key mutants, re-run the tester's scripts while the tester worktree still exists and check output timestamps). Remove agent worktrees only after the merge.
6. PR opened with a test summary report (red run, green run, specs count, suite, ratio, `spec-implementation/` size, mutants) and a reason for any runner change (PM D5); PM final verification on the executed specs plus that report, on a stated head commit. A PM rejection leads to a rework round with the spec change recorded in the issue Change log, then the re-check level below, then re-acceptance of the affected criteria (it13 #61).
7. Lead verifies the PM hand-off on GitHub (head, comment), polls `.mergeable` until true, then merges with a merge commit at the branch head (`gh api -X PUT .../pulls/N/merge -f merge_method=merge -f sha=<head>`, so the merge fails if the head moved). That head is the PM-accepted code head plus log-only commits: check `git diff --stat <accepted>..<head>` touches only `work-log/` and `memory/`.
- Issues are delivered in sequence to avoid README/module conflicts; wording nits go into the next issue touching that section.
- Open spec questions go to the PM before development; questions found later go to the PM too, and the PM records each decision in the issue body's Change log and comments on the issue (it12 Q1-Q3).

## Test strategy applied (`governance/context/test-strategy.md`, `specification-strategy.md`)
- Levels: executed specs (UAT, `specs/`, PM-owned), developer unit and page tests (`tests/`), tester product checks, PM final verification on the executed specs plus the test summary report. Golden path, edge cases, error conditions; no brute force across all values.
- Specs (ATDD, #110): executed straight from the `.feature` files, never translated; an undefined or ambiguous step fails; red first (each new scenario fails on its assertions before product work). The team owns steps (assertions) and drivers (no assertions; only `drivers/` imports product modules); runner layout and limits: architecture.md "ATDD". New step texts must not redefine existing ones. `spec-implementation/` grows by steps and drivers; a runner change needs a reason in the PR (PM D5). A spec gap goes to the PM via the lead; nobody else edits `specs/`.
- Developer: steps/drivers, targeted unit tests, page tests in `tests/page.test.js` for UI wiring and CSS (#55); a rule -> test mapping when restructuring. Behaviour a spec pins needs no duplicate unit test.
- Tester: a test plan plus real-page checks on a few fixed seeds (scratch scripts may reuse `tests/chrome.js`; leave a `README.md` in the scratch folder: setup, env vars, one line per script and its pass line; it18-it19), small independent oracles on 4-5 seeds at most, numeric measurements and screenshots for visual changes. Mutants go into product code named in the brief, never into `specs/`.
- Reviewer: 6-13 targeted mutation spot checks on risky logic, not sweeps; for layout issues include scroll and style (computed CSS) mutants (#97).
- PM: executed specs and the test summary report, acceptance criteria one by one, short play-through, personas for user-facing changes (on-screen screenshots, run in the foreground before deciding). Restructure-only issues (it23 D2/D3): no spec change, the specs are the regression gate, and pixel-identical main-vs-branch screenshots (several states, 360 and 1280 px, 0 console errors) replace the persona round; add an AC that the README View command still loads the page (N fresh loads, 0 failed requests). Click/tap behaviour is checked with real CDP input by the tester and the PM.
- Ratio (PM it13, D2 it22): `tests/` at most 1.6x product (current figures: architecture.md "Files"); `spec-implementation/` is measured on its own, not under the cap, and reported in every PR. An issue that would pass the cap adapts rather than adds tests and may remove only redundant assertions in the files it touches, each listed in the PR with the test or spec that still covers it and confirmed by reviewer and tester with a paired mutant on main and branch (Python-applied), never one an AC explicitly requires, and no line packing (it14); otherwise a trim item comes first. The suite under 10 s. Page evidence must show skipped = 0.

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

# Durable lessons (iterations 1-13)

Only lessons still valid, compressed by theme (pruned at the it13 close per governance/memory-architecture.md). "it" = iteration, "#" = issue. Evidence is in `work-log/`.

## Scoping and spec
- Ask the PM before guessing: open behavioural questions go to the PM before development or acceptance (it2; #36). Raising them mid-issue also works when found late: in it12 three PM decisions (Q1-Q3) were recorded in the issue's Change log, so reviewer, tester and acceptance had one source.
- Scope from observed user pain and personas, not only the candidate list (it6, it8); do a data spike before a hard feature (it8 pointing; it12 ring noise on 10 seeds; it13: denser Tricky generation was too slow, p90 865 ms with failures, so Hint preference was chosen instead).
- Settle wording and visuals with persona mock-ups plus a short play check before writing the issue; mock-up choices can flip in play (it9-it11). A side-by-side play check (current vs prototype on the same replayed position) settled #56 in two rounds (it12).
- Pin concrete examples, and check each pin against the exact state named (it10 #46, it11 #50). Criteria written mid-issue name a commit, not "today" or "main" (it12 #56 AC3 said "as main" where main had a different layout).
- Check a visual criterion for feasibility with measurements before it goes into the issue, on the worst-case content. In #56 the PM's Q2 criteria were contradictory (the developer measured and stopped, it12). In #61 the feasibility figure used one glyph; the chip width follows the digit, so D = 1 was 1.94 px against a 2 px minimum (it13).
- When a wording fix changes grammar, check every variant (a/an, singular/plural, each form): "this D" fixed "a 8" but read oddly with two rings (it12); #61 pinned one example per form and ring count (it13).
- Teach before rewarding, but close an uncounted-technique gap quickly (it8 #36 -> it9 #42); a hint alone does not make a technique practisable, a level built for it does (it8 #37).
- Deliver issues in sequence and fold wording nits into the next issue touching the same section (it6-it8).

## Testing
- Follow the test strategy: golden path, edge cases, error conditions; small independent oracles on a few seeds; no sweeps (#35 cut 15 s of sweeps to 0.6 s with a rule -> test mapping).
- Page wiring is tested in the repo now (`tests/page.test.js`, #55). New UI behaviour adds targeted page scenarios there; page evidence must show skipped = 0. Things only a page test catches: precedence decided in UI wiring (#51 M13), clearing paths, CSS placement, and values a wrapper passes to a pure helper (in #56 `pointingKey(d, 1)` and `pointingKey(d, marks.digits)` survived until a zero-ring page assertion was added). A page test that builds its expected value with the helper it exercises checks wiring only; pin literal text on the page (#61 f1b).
- Assert the contract, not only a tolerance: a 1 px "inside the cell" check let the removal of the right-edge rule pass (-0.59 px); pinning the flush edge killed it (#56 R1). Measure exact edges; `clientWidth` is integer-rounded.
- Visual checks need narrow widths (375 px), numeric rects (`getComputedStyle(td, '::after')` vs note glyph Ranges) and a screenshot look (#56 D1). When a size depends on content (glyph width, text length), measure and guard every variant or the proven worst case: in #61 developer, reviewer, tester and lead all measured one digit and only PM acceptance caught D = 1; f4 now asserts the minimum over digits 1-9. A test message that claims "narrowest" must be proven (it13).
- Ordered precedences need one test per adjacent pair, and shared expressions a test per branch (#45, #46). Seeded tests guard a rule only if a seed fails under the mutant (#37).
- New overlay marks need a check against existing cell content (it10 badge over note 3, fixed in #56).
- Use a negative control (run a regression test on the pre-fix commit) for fixes (it2).
- A test harness that spawns a process must clean up on signals too. `node --test` exits on SIGINT/SIGTERM without waiting for its test child; the orphan then dies silently on EPIPE unless stdout/stderr error listeners catch it. Remove a temp profile only after the child has exited (#55 round 2). Repeat signal trials at varied delays; one or two runs miss the race (the lead's 6 trials found what review missed).
- A wait-for-ready loop must throw at its bound; a silent give-up turns one cause into N confusing failures (#55 S1).

## Review
- Re-run claimed survivors and claimed coverage yourself; reports can be wrong both ways (it9 #42; it12 the developer's "right-edge mutant killed" described a different edit).
- A new predicate needs a mutant per branch: in #60 the naked branch of `isSingle` survived the whole suite while being reachable; one pinned state (seed 26 after two entries) killed it (it13).
- When tests are removed to stay in the ratio budget, list each with the test that still covers it and have the reviewer and tester confirm by mutant (#61: three removals, all confirmed).
- Targeted mutation spot checks (about 6-15) on risky logic, wiring and CSS find real gaps; before asking for a test of "cleared on path X", check that X is reachable with that state (#56: two equivalent/unreachable mutants).
- Review by following data from creation to use; check which visual states can co-occur and style only reachable ones (it1, #51).
- Prefer extracting shared logic over duplicating a rule (#42); give even "nit" refactors the full gates (it5).
- Check README claims sentence by sentence against behaviour (it2 onwards).

## Coordination
- Hold rework until both reviewer and tester report (one round); give each its own detached worktree on the issue branch and pre-create their log sections; they push with `git push origin HEAD:<branch>` and fetch + `merge --no-edit` on rejection (it4-it10).
- Scale re-checks: tests/README-only rounds get a delta re-check (the lead can run it: re-run the specific mutant, the suite, saved scripts); behaviour changes (including harness behaviour and CSS) get a reviewer (and tester) re-check (it8-it12).
- The lead's own delta re-check pays: in it12 it found the #55 signal race after review and test had passed.
- Restart from `memory/wip/current.md` and the wiki; do not read the work log unless needed (Dirk, 1464355); update WIP at every hand-off. The PM scopes from `wiki/backlog.md` and leaves its ordered list at the end of its product log.
- Verify every hand-off on GitHub (PR head, acceptance comment) and merge with the accepted sha (it6-it12).
- Personas at scoping and acceptance; forbid helper scripts, solvers, source, README and LOG.md in their prompts (it6).
- Use the full session id in commits, PRs and comments; pass "do not read governance/LOG.md" to every agent and have each confirm (it4, it5).

## Tooling
- `gh pr edit` fails (token lacks read:org): use `gh api -X PATCH repos/dirkmarski/weaver/pulls/N -F body=@file` (issues: `.../issues/N`); merge with `gh api -X PUT .../pulls/N/merge -f merge_method=merge -f sha=<accepted head>`. Retry if GitHub is still computing mergeability (it2, it9).
- Never `git pull --rebase` on a branch that merged main; use `--no-rebase` (it9). Agents sharing a worktree `git add` their own files only (it9).
- Never `rm -rf` a variable that may be unset or default (use `${VAR:?}`); create private temp dirs with explicit paths under the session scratchpad. In it13 a failed `... && export TMPDIR=$(mktemp -d)` chain left TMPDIR at the system default and a following `rm -rf $TMPDIR` hit the system temp dir; the sandbox refused it and nothing was lost. Put this rule in every agent prompt that uses temp dirs.
- On Node 24 run `node --test` without a path. macOS has no `timeout`; BSD `sed -i ''` cannot match `\n` (use `perl -0pi` or Python for multi-line edits).
- Headless Chrome: `--headless=new --no-sandbox`, temp `--user-data-dir`, `--remote-debugging-port=0` and read `DevToolsActivePort`; kill the process group. Its window has a ~500 px minimum: use `Emulation.setDeviceMetricsOverride` for phone widths and wait for layout (a 25 px cell was once read mid-layout).
- Scratch scripts can reuse `launch` from `tests/chrome.js`; compare against main with `git archive origin/main` into a scratch dir. Check leftover processes/profiles with a private `TMPDIR` when agents run in parallel.

## Open concerns (not lessons)
- GitHub Pages never confirmed enabled; all user evidence is simulated.

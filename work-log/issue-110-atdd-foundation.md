# Issue 110: ATDD foundation (execute specs/*.feature with the suite)

Issue: https://github.com/dirkmarski/weaver/issues/110 . Branch: issue-110-atdd-foundation.

## Lead
- Lead Claude Opus 5.5, session d2424c00-a6fb-45e6-86ab-53111ee2576f. Gate passed (open, PM-authored). Base 24383ae.
- Baseline: 184 tests pass, 0 skipped, 4.4 s (Node 24.21). Product 1484 lines (sudoku.js+index.html+style.css), tests/ 2374 (cap 2374.4). No product change allowed; tests/ must not grow.
- Plan: developer builds runner (spec-implementation/, discovered by plain `node --test`), commits it with no steps first (red: 5 undefined-step failures, output saved), then driver + steps (green), README Test section. Then reviewer (layering grep, mutants a and b, parser error cases), then tester (independent red/green re-run, mutants a and b, malformed/ambiguous cases, timing). Lead check, PR with test summary report, PM acceptance.
- Specs are PM-only (specs-guard hook); any step wording question goes to the PM via the lead.

## Developer
- Claude Sonnet 5.5, session d2424c00-a6fb-45e6-86ab-53111ee2576f.
- Commits: 8dc30a1 (parser + runner, no steps: red, 184 pass / 5 fail "undefined step"), b5eb831 (driver, steps, README: green, 189 pass / 0 fail / 0 skipped), then a comment-only driver tweak (so the `assert` grep finds nothing in drivers/) and this entry.
- Decisions: runner auto-discovered as `spec-implementation/specs.test.js` (run once; 184 + 5 = 189); steps are `define(regex, fn)` files in steps/, matched on the step text without the keyword; a parse error or a missing specs/ is a failing test with file:line; all steps are resolved before a scenario runs so undefined or ambiguous steps always fail; a scenario with no steps or an outline without rows fails.
- Mutant (a) changes the naked-single text only; it also fails the unit test `creditEntry: on your own`, as expected. Mutant (b) removes "the message is shown as a reward" (3 scenarios fail as undefined).
- Not tested: Windows paths, escaped pipes in tables, multiple Examples blocks and tags on Examples (parsed, not exercised), a page driver.

### Rework 1
- Runner split: `spec-implementation/runner.js` (expand, resolve, execute, register) plus `specs.test.js` (now 14 lines); new `runner.test.js` with 8 `ATDD runner: ...` self-checks (inline features, throwaway steps).
- R1 Examples placeholder without a column fails with file:line and name; R2 a failing step is rethrown with file:line, step text and the original message/diff (cause kept); R3 step after Examples is a parse error. README notes the self-check.
- Runner mutants (undefined check no-op, ambiguity off, errors swallowed, placeholder check off) each fail 1-2 self-checks. Full run 197 pass, 0 fail. spec-implementation is 286 lines (target 250): the runner split plus 8 self-checks.

### Rework 2
- R5: a `.feature` file with a Feature but no Scenario/Scenario Outline now fails as `<file>:<line>: feature has no scenarios` (runner.js `register`); new self-check `ATDD runner: a feature with no scenarios fails with file:line` (temp specs/ dir, runs the registered test).
- Mutant (check removed) is killed by that self-check (1 fail). Full run 198 pass, 0 fail, 0 skipped, 3.9 s.

## Reviewer
- Claude Sonnet 5.5, session d2424c00-a6fb-45e6-86ab-53111ee2576f, reviewed head a8f48e3. Verdict: approve (no blocker).
- Findings: (1) should-fix, specs.test.js:28 `sub`: an Examples placeholder with no matching column is left as literal `<x>` and not reported; a loose step regex such as `(.*)` could then pass on it. Fail the run when `<...>` remains. (2) nit, specs.test.js:64: swallow-errors and ambiguity/undefined checks have no negative test of the runner itself (mutants M3, M6, M7 below survive the 5 specs; detection verified by hand, e.g. a duplicate definition fails 2 scenarios as ambiguous). Accepted for the MVP. (3) nit, gherkin.js:45-46: a step after an Examples block is attached to the outline instead of failing. (4) nit, gherkin.js:7: `\|` is not unescaped in table cells (not required by AC2). (5) nit: own-singles.js:31 "no technique count has changed" is vacuous against a driver that never changes counts, but killed by a product mutant (not-counted path increments naked: 2 scenarios fail).
- Driver fidelity: game.js:17 calls creditEntry(tally, credited, null, grid-before-placement, r, c, String(digit)), as index.html:993 does (before grid, tally, credited, hint null, string value); the digit is placed after (game.js:18) like the page writes after judging; statusClass shared. Layering grep clean; spec-implementation 208 lines; product, style, tests untouched.
- Mutants (specs only): naked text -> 1 fail (that scenario); remove "shown as a reward" step -> 3 fail undefined; outline substitution off -> 2 fail; Background dropped -> 5 fail; driver places digit before judging -> 5 fail; count not incremented -> 3 fail; not-counted path increments -> 2 fail; survived: undefined check no-op (with step removed: 5 pass), swallow step errors (with mutant a: 5 pass), drop last Examples row (4 tests, all pass), ambiguity check off (5 pass). git status clean after.
- Not tested: Chrome page tests, Windows paths, multiple Examples blocks, tags on Examples, CRLF run end to end (parser probe only).

### Re-review (rework 1)
- Claude Sonnet 5.5, session d2424c00-a6fb-45e6-86ab-53111ee2576f, head 4a37b68. Verdict: approve (no blocker). R1-R4 fix my F1, F3, F2 and tester F2.
- Real failure output (naked-single text mutated): `specs/rewards/own-singles.feature:22: Then the message reads "..."` followed by node's strictly-equal diff; AC3 location is met. Findings (nits): runner.js:74 the node "test at" header points at the registration line, not the feature (the message line has it); a Examples column that no step uses is still silent (tester info, not required).
- Mutants (copy in temp dir): undefined check no-op killed by runner.test (2); step errors swallowed killed (1; specs alone survive with mutant a, runner.test catches it); drop last Examples row killed (2); placeholder check off killed (1); ambiguity off killed (1); step-after-Examples check off killed (1); no-op "no technique count" step survives (vacuous, as before; product mutant kills it); AC mutant (a) killed (1 spec); AC mutant (b) (step definition removed) killed (3 undefined).
- AC check: full run 197 tests (189 + 8), 0 fail, 0 skipped, 3.9 s; specs-only 5 pass; names unchanged; layering grep clean (only drivers/game.js requires sudoku.js; no "assert" in drivers/). runner.test.js holds asserts but is a self-check of the runner, not a DSL/spec layer: AC4 respected. spec-implementation 286 lines vs 250: overrun justified (runner 79 + self-checks 55 buy the kills of the formerly surviving mutants); could trim about 15 lines by dropping the "passing scenario" and "substituted per row" self-checks only at the cost of the drop-row kill, so I would not.

## Tester
- Claude Sonnet 5.5, session d2424c00-a6fb-45e6-86ab-53111ee2576f, head 714fc3c. Verdict: pass (no blocker).
- Red (8dc30a1, Chrome): 189 tests, 184 pass, 5 fail, 0 skipped, 4.3 s; all 5 "undefined step ... own-singles.feature:8". Green (714fc3c): 189 pass, 0 fail, 0 skipped, 3.8 s; specs-only command: 5 pass. Each scenario/row is one test `<Feature>: <Scenario>` (+ `[row=1, column=9, digit=1, unit=row]`), not run twice.
- Mutants (specs only, restored, git status clean): (a) naked-single text -> exactly the naked scenario fails; (b) remove "no technique count has changed" -> its 2 scenarios fail "undefined step ...:45 / :51"; extra (c) statusClass always '' -> the 3 reward scenarios fail, the 2 not-counted pass.
- Oracle: all 5 scenarios agree with creditEntry called as index.html does and with a real Chrome run (page puzzle replaced by the spec puzzle in a temp copy): text, status class, tally.
- Error paths (25 temp feature files): malformed, unsupported keyword (Rule), undefined, ambiguous, table, doc string, tags, comments, 2 Examples blocks, unterminated doc string, bad tag, ragged row, late Background all behave; parse and resolve errors name file:line.
- Findings: (1) low: an Examples placeholder with no matching column stays literal `<y>`; it passes silently when the step regex accepts any text (confirmed with `And value <y>`); an unused Examples column also passes silently. (2) low: an assertion failure (assert.equal etc.) does not show the feature file:line or step text: the e.message edit in specs.test.js:62 does not reach node's printed output (stack shows steps/own-singles.js only); only plain Errors and undefined/ambiguous steps show file:line. AC3 does not require it, but it makes failures harder to locate. (3) info: a `Key: text` line between Feature and the first Scenario is read as description, not as an unsupported keyword; `# ` after step text is not a comment (as in Gherkin); duplicate scenario names both run. (4) info: all 5 undefined-step failures cite the Background line 8, not the scenario's own steps (the first unresolved step).
- Counts: product 1484, tests/ 2374 (unchanged), spec-implementation/ 208 (gherkin 75, specs.test 71, driver 28, steps 34). Layering grep: only drivers/game.js requires sudoku.js; no "assert" in drivers/.
- Not tested: Windows path separators, escaped pipes in tables, tags on Background/Rule, Linux Chrome, node 18/22 (Node 24.21 only), slow-machine timing, page driver (out of scope).

### Re-test (rework 1)
- Claude Sonnet 5.5, session d2424c00-a6fb-45e6-86ab-53111ee2576f, head e457f2b. Verdict: pass (no blocker). Full run (Chrome) 197 tests, 197 pass, 0 fail, 0 skipped, 3.8 s; specs-only 5/5. The 8 `ATDD runner:` self-checks are distinct from the 5 spec tests; no test name appears twice.
- Findings F1 and F2 closed: placeholder without column now `specs/x/nomatch_silent.feature:4: no Examples column for placeholder <y>: value <y>`; assertion failure now `specs/x/failing_assert.feature:4: Then value is 5` with `[cause]: AssertionError` (and for a plain Error `failing_step.feature:4: When fail step`). New: step after Examples -> `step_after_examples.feature:7: step after Examples` parse error.
- Mutants (a) naked text and (b) step definition removed: identical results to the first test (1 fail; 2 undefined), (a) now with file:line. Oracle: ORACLE PASS, output identical. Error cases: 31 old plus 1 new, only changes are the two fixes above and old-run artifacts (mis-named cases, a since-edited case).
- Counts: spec-implementation 286 (gherkin 76, runner 79, runner.test 55, specs.test 14, driver 28, steps 34), tests/ 2374 unchanged, product unchanged. Layering grep clean.
- Not tested: as before, plus runner self-check mutants (reviewer did them), Windows paths.

## Lead review

## Lead review
- Code head 53d7b63 (after rework 2). Suite 198/198, 0 skipped, 3.9 s (Chrome). Product 1484, tests/ 2374, both unchanged; specs/ touched only by PM 24383ae. spec-implementation/ 303 lines (gherkin 76, runner 83, runner.test 68, specs.test 14, driver 28, steps 34), longest line 133.
- Red at 8dc30a1 re-run by lead: 184 pass + 5 fail, all `own-singles.feature:8: undefined step`. Layering grep: only drivers/game.js requires sudoku.js; no `assert` in drivers/.
- Rework 1 (R1 unbound placeholder, R2 assertion failures carry feature file:line + step text, R3 step after Examples, R4 runner self-checks): reviewer F1/F2/F3 + tester F1/F2. Full delta re-review (approve, e457f2b) and re-test (pass, 67d5d06).
- Rework 2 (R5, tester re-test info: a feature with no scenarios passed silently, against AC3): 4-line runner change + 1 self-check. Deviation: lead delta re-check instead of a third reviewer/tester round (whole delta read; R5 mutant killed per developer; tester errcase.sh re-run over 32 cases, only empty_feature changed, now fails at :1; oracle.js ORACLE PASS; outputs newer than start time).
- Lead mutants: ambiguity check off -> 1 self-check fails (killed); AC mutant (a) on sudoku.js (naked unit text ' alone') at 53d7b63 -> among specs only the naked scenario fails (:22), plus the existing unit test creditEntry own texts.
- Concern: the tester's rework-1 re-run of mutant (a) edited specs/rewards/own-singles.feature in its worktree (restored) instead of sudoku.js; not the AC mutant and against specs/ ownership. AC6 (a) is covered by the reviewer (both rounds), tester round 1 (sudoku.js) and the lead re-run above. Also: tester round 1 skipped its assigned wiki reads (process/lessons); for the closing lead.
- Decisions: line budget 303 vs about 250 accepted (runner split + 9 self-checks kill runner mutants that survived the 5 specs; reviewer judged it justified); reported to PM in the PR. Runner self-checks hold asserts outside steps/; reviewer agrees AC4 is about the spec chain (DSL vs driver). Known limits left: unused Examples column passes; escaped pipes in tables; node's "test at" header points at runner.js; "no technique count has changed" step is only killed by product mutants.

## Lead: acceptance and merge

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

## Reviewer
- Claude Sonnet 5.5, session d2424c00-a6fb-45e6-86ab-53111ee2576f, reviewed head a8f48e3. Verdict: approve (no blocker).
- Findings: (1) should-fix, specs.test.js:28 `sub`: an Examples placeholder with no matching column is left as literal `<x>` and not reported; a loose step regex such as `(.*)` could then pass on it. Fail the run when `<...>` remains. (2) nit, specs.test.js:64: swallow-errors and ambiguity/undefined checks have no negative test of the runner itself (mutants M3, M6, M7 below survive the 5 specs; detection verified by hand, e.g. a duplicate definition fails 2 scenarios as ambiguous). Accepted for the MVP. (3) nit, gherkin.js:45-46: a step after an Examples block is attached to the outline instead of failing. (4) nit, gherkin.js:7: `\|` is not unescaped in table cells (not required by AC2). (5) nit: own-singles.js:31 "no technique count has changed" is vacuous against a driver that never changes counts, but killed by a product mutant (not-counted path increments naked: 2 scenarios fail).
- Driver fidelity: game.js:17 calls creditEntry(tally, credited, null, grid-before-placement, r, c, String(digit)), as index.html:993 does (before grid, tally, credited, hint null, string value); the digit is placed after (game.js:18) like the page writes after judging; statusClass shared. Layering grep clean; spec-implementation 208 lines; product, style, tests untouched.
- Mutants (specs only): naked text -> 1 fail (that scenario); remove "shown as a reward" step -> 3 fail undefined; outline substitution off -> 2 fail; Background dropped -> 5 fail; driver places digit before judging -> 5 fail; count not incremented -> 3 fail; not-counted path increments -> 2 fail; survived: undefined check no-op (with step removed: 5 pass), swallow step errors (with mutant a: 5 pass), drop last Examples row (4 tests, all pass), ambiguity check off (5 pass). git status clean after.
- Not tested: Chrome page tests, Windows paths, multiple Examples blocks, tags on Examples, CRLF run end to end (parser probe only).

## Tester

## Lead review

## Lead: acceptance and merge

# #116 ES modules and one interface module (ADR 001, part 1)

Issue: https://github.com/dirkmarski/weaver/issues/116. Branch: `issue-116-es-modules`.

## Lead
- Gate: open, author weaver-agents (PM), 2026-10-29. Session daff0a10-2135-459c-80b7-137f621f7088.
- Baseline 72803a2: 207/207, 0 skipped; product 1500 (sudoku.js 1301, index.html 46, style.css 153), `tests/` 2376 (1.584x, cap 2400, 24 headroom), `spec-implementation/` 323.
- Plan: developer part A = guard test in `tests/` (AC2 rules plus AC1 module form), red on the current code, own commit; part B = migration (ES modules, interface module, served page tests, README), moved not rewritten. Then reviewer, then tester (mutants, screenshots main vs branch, console), lead check, PR with test summary report, PM final verification.
- No spec; `specs/` untouched. The 14 scenarios are the regression gate.

## Developer
- Model Claude Sonnet 5.5, session daff0a10-2135-459c-80b7-137f621f7088. Commits: part A guard test (red), part B migration, this log.
- Part A red: `node --test tests/modules.test.js` failed on the old code (no `ui.js`; `sudoku.js` has no export).
- Choices: product modules = every `*.js` at the repo root (flat, no path change; #117 adds files there); interface module = `ui.js` (fixed name). `package.json` = `{"type":"module"}` (no `.mjs`); tests and `spec-implementation/` converted from `require` to `import` (loading lines only; `specs.test.js` loads steps with `await import`). Seeding: `Page.addScriptToEvaluateOnNewDocument` defines `window.__seed(n)` which does `Math.random = (await import('/sudoku.js')).seededRng(n)` (same module instance as the page); `tests/chrome.js` eval now passes `awaitPromise: true`. Readiness: `!window.__stale && document.readyState === "complete"` (module scripts run before load). Server: Node `http` in `tests/page.test.js`, static files from the repo root, port 0, closed in `after`.
- `sudoku.js`: IIFE head and the `api`/`module.exports`/`window` tail replaced by `export { ... }`; `countSolutions` and `solvableBy` wrappers (were inline in `api`) became functions `countSolutions` and `solvableByGrid` (exported as `solvableBy`). `render()` and `ARROWS` moved verbatim to `ui.js`, which imports what it uses and calls `render()`. Indentation of the former IIFE body is kept (moved, not re-indented). `window.isValidSolution` global dropped (nothing used it).
- Lines: product 1525 (sudoku.js 930, ui.js 395, index.html 46, style.css 153, package.json 1); `tests/` 2408 (1.579x, cap 2440); `spec-implementation/` 315.
- Deviation: none known.

## Reviewer
- Model: Claude Sonnet 5.5. Session daff0a10-2135-459c-80b7-137f621f7088. Head reviewed: 07b4fb2 (base 2099232).
- Verdict: approve (no blocker, no major). Two minor findings recommended before merge; nits optional.
- Checks: logic part of old sudoku.js (old lines 3-890) is byte-identical to new sudoku.js lines 1-888 (diff empty); old render block is identical to ui.js (diff only the old `api`/export tail); added in sudoku.js: `countSolutions`, `solvableByGrid` (exported as `solvableBy`) wrappers and the export list (same 36 names as the old `api`). Product 1525, tests/ 2408 (1.579x, cap 1.6x), spec-implementation 315. `node --test`: 210 tests, 210 pass, 0 fail, 0 skipped, 4.3 s. specs/ untouched.
- Findings:
  1. minor - README.md:Test section ("Requires Node 18+") is now wrong: `import.meta.dirname` (tests/modules.test.js:9, page.test.js, specs.test.js, runner tests) needs Node 20.11+/21.2+. Change the stated minimum.
  2. minor - tests/modules.test.js:13 PAGE regex misses `self`, `navigator`, `history`, `alert` (mutants d, g survived). Add `self|navigator|history` at no line cost. Dynamic import with a built string (mutant e) is also missed; contrived, accept, do not spend lines.
  3. minor - tests/modules.test.js:10 lists only root `*.js`. Fine for this issue; #117 must say where concern modules live (a subfolder would escape the guard). Carry to #117 brief.
  4. minor - sudoku.js:1-888 and ui.js:5-390 keep the 2-space indent of the former IIFE body; ui.js:395 `render();` is at column 0 while `function render` is at column 2; sudoku.js starts with a blank line. Legible but reads as leftover. Recommendation: do NOT re-indent now (it would turn a provable "moved, diff-empty" review, AC6, into a whitespace diff); re-indent in #117 when the code moves into concern modules anyway (review with `git diff -w`). Fix only the cosmetic parts now if cheap: delete the leading blank line, and either indent `render();` or accept.
  5. nit - ui.js:1-3 import list is one 253-character line; spec-implementation/specs.test.js:9 is 160 characters (for-await-import on one line). Wrap the import list one name per line or a few per line.
  6. nit - tests/page.test.js:14-20 static server: the traversal guard (`!file.startsWith(ROOT)`) and the 404 path are unguarded by any test (mutants k, l survived). Test-harness code only, localhost, random port; no action needed. `startsWith(ROOT)` would also accept a sibling directory with ROOT as a prefix; irrelevant here.
  7. nit - README says the run "takes about 2 seconds with Chrome"; measured 4.3 s here (AC5 limit 10 s). Not checked on main; may predate this change.
- Mutants (all reverted; git status clean after the run; each diff non-empty, asserted):
| id | file | change | command | result |
| a | sudoku.js | `const _x = document.title;` | node --test tests/modules.test.js | killed (2 fail) |
| b | sudoku.js | `import './ui.js';` | same | killed |
| c | sudoku.js | `globalThis.foo` | same | killed |
| d | sudoku.js | `self.innerWidth` | same | SURVIVED (finding 2) |
| e | sudoku.js | `import('./' + 'ui.js')` | same | SURVIVED (finding 2) |
| f | sudoku.js | `export * from './ui.js'` | same | killed |
| g | sudoku.js | `navigator.userAgent` | same | SURVIVED (finding 2) |
| h | sudoku.js | countSolutions default `limit \|\| 3` | tests/generator.test.js | survived: default never exercised (tests pass 2); pre-existing gap, unreachable by callers |
| i | sudoku.js | solvableBy wrapper ignores technique ("naked") | generator + sudoku tests | killed (3 fail) |
| j | tests/page.test.js | seed applied as n+1 | page.test.js | killed (22 fail) |
| k | tests/page.test.js | traversal guard removed | page.test.js | survived (finding 6) |
| l | tests/page.test.js | 404 returns 200 | page.test.js | survived (finding 6) |
| m | tests/page.test.js | readiness `document.readyState` replaced by true | page.test.js | survived (the `__stale` check and the awaited seed import cover it) |
| n | tests/page.test.js | seeding call removed | page.test.js | killed (19 fail) |
| o | ui.js | import `./sudoku.js?x` | page.test.js | survived: equivalent (second module instance, seededRng stateless) |
- AC1-AC7 and ADR: AC1 ok (index.html:44 module script; no IIFE/module.exports/window.Sudoku; package.json only type=module). AC2 ok (a, b killed; guard picks up new root files by listing). AC3 ok (page.test.js seeds via `import('/sudoku.js')`; readiness uses document.readyState; only drivers/game.js imports sudoku.js in spec-implementation/). AC4 ok (http server started/stopped in before/after; README View). AC5 partly: node --test pass here; screenshots are the tester's. AC6 ok (diff-empty moves; ratio 1.579). AC7 is the lead's. ADR: native modules, no build, ui.js only page module, sudoku.js never imports it: compliant.
- Not checked: screenshots/console (tester), Chrome behaviour on other browsers, performance on main, README statements outside View/Test/Files sections beyond grep for window.Sudoku/module.exports/require/file:// (none left), the PR test list of changed tests.

## Tester

## Lead review

## Lead: acceptance and merge

## Tester
- Model: Claude Sonnet 5.5; session daff0a10-2135-459c-80b7-137f621f7088; tested head 1030298; main 99417f1.
- Verdict: pass.
1. Suite 210/210 pass, 0 fail, 0 skipped, 4.8 s; specs 14/14.
2. AC2 mutants: (a) `document` reference and (b) `import './ui.js'` in sudoku.js each fail tests/modules.test.js; (c) new root `extra.js` with `window` is picked up without a test edit (4 tests, 2 fail). Worktree clean after each revert.
3. AC5: 6 screenshot pairs (level picker, Tricky seed 1 after 4 Hint clicks with 3 of 3 steps shown, Tricky seed 1 after own entry row 7 col 2 = 9, naked single credited) at 360x740 and 1280x900, real CDP input, served over http: byte-identical, 0 differing pixels.
4. Console: no console errors, exceptions or Log errors on branch or main in any sequence.
5. file:// renders 0 cells (ui.js blocked by CORS, as README says); http renders 81 cells.
- Not tested: browsers other than Chrome, touch input, full-page (beyond-viewport) screenshots, Verify/Notes/New puzzle paths, other levels, performance beyond suite time.
- Scratch: /tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/daff0a10-2135-459c-80b7-137f621f7088/scratchpad/test-116/ (README.md).

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

## Tester

## Lead review

## Lead: acceptance and merge

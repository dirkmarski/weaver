# #117 One module per concern for the logic (ADR 001, part 2)

Issue: https://github.com/dirkmarski/weaver/issues/117. Branch: `issue-117-module-per-concern`.

## Lead
- Gate: open, author weaver-agents (PM), label enhancement, 2026-10-29. Session daff0a10-2135-459c-80b7-137f621f7088 (new lead run in the same session; #116 merged as PR #118, main bfd7b54).
- Baseline bfd7b54: 210/210, 0 skipped, 4.2 s; product 1527 (sudoku.js 929, ui.js 398, index.html 46, style.css 153, package.json 1), `tests/` 2408 (1.577x, cap 2443), `spec-implementation/` 316.
- Plan: developer part A = extend the guard (`tests/modules.test.js`): README module list = the root product `*.js` files, one concern line each; import graph acyclic; no re-export (`export ... from`). Red on the current code (README has no module list); own commit; lead confirms red. Part B = split `sudoku.js` per concern at the repo root (guard discovery unchanged), moved not rewritten, re-indent former IIFE bodies, dead code removed, tests change imports only, README. Then reviewer, tester (screenshots main vs branch, console, guard mutants on a new module), lead check, PR with test summary report, PM final verification.
- No spec (PM D2); `specs/` untouched; the 14 scenarios are the regression gate.
- Part A a3ea93f (developer, Sonnet 5.5): guard +16 lines (README `## Modules` list = root `*.js`; acyclic imports; no `export ... from`). Red confirmed by the lead: `node --test tests/modules.test.js` 4 pass, 1 fail (test 4, README list [] vs [sudoku.js, ui.js]).
- Decision (lead, assumption for PM check): `cellPlace` in sudoku.js is a byte-identical duplicate of `cellName`; part B may keep one and drop the other (listed in the PR as dead code), the only allowed body edit besides imports/exports/indent.

## Developer
- Claude Sonnet 5.5, session daff0a10-2135-459c-80b7-137f621f7088. Part B commit da7d554 (split) plus this log commit.
- Split sudoku.js (removed) into 10 modules, PM map unchanged: board 71, validation 68, clashes 32, entry 48, techniques 152, hints 167, hintmarks 87, rewards 137, completion 20, generation 155; ui.js 400 (imports only).
- Moved, not rewritten: declarations dedented by 2 (also ui.js); exports are one `export { ... }` block per module. Parity: `dev-117/parity.py` 64 of 66 declarations identical, 2 differ only by `cellPlace` -> `cellName` (ringLink, ringRules), `cellPlace` removed.
- Shared helpers exported by the module that owns them: board (units, masks, spotsFor, firstHolder, cellName), hints (boxName, andList, struckCells, aDigit), techniques (claimingSteps, pointingSteps, singleAfterStep), clashes (namedClash). Private: firstTarget, isSingle, pointingHint, claimingHint, pointingClause, sharedUnits, notCounted, FIXED_TEXT, search, shuffle, defaultRng, TIME_CAP_MS.
- Dead code: only `cellPlace` (duplicate of `cellName`); no other unused declaration, export or import (`dev-117/deadcheck.py`).
- Tests: only imports change (named imports; `S.x` call sites rewritten to `x` where S spanned modules; generator.test.js keeps `S` for generation.js). The seeding import points to generation.js. Guard: `board.js` in the file check, and the IIFE-wrapper test now flags a closing `})();` only at the end of the file (it matched the legitimate `var UNITS = (function () {...})();` initialisers at column 0 once dedented).
- Results: node --test 221/221, 0 skipped, 4.3 s; specs 14/14. Lines: product js 1337, tests/ 2439, spec-implementation/ 317; with html/css (1537) tests/ is 1.587x.
- Deviations: the guard IIFE edit above (beyond the filename edit allowed); the comment that preceded `cellPlace` went with it, so `sharedUnits` has none.

## Reviewer

## Tester

## Lead review

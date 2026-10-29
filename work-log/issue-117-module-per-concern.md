# #117 One module per concern for the logic (ADR 001, part 2)

Issue: https://github.com/dirkmarski/weaver/issues/117. Branch: `issue-117-module-per-concern`.

## Lead
- Gate: open, author weaver-agents (PM), label enhancement, 2026-10-29. Session daff0a10-2135-459c-80b7-137f621f7088 (new lead run in the same session; #116 merged as PR #118, main bfd7b54).
- Baseline bfd7b54: 210/210, 0 skipped, 4.2 s; product 1527 (sudoku.js 929, ui.js 398, index.html 46, style.css 153, package.json 1), `tests/` 2408 (1.577x, cap 2443), `spec-implementation/` 316.
- Plan: developer part A = extend the guard (`tests/modules.test.js`): README module list = the root product `*.js` files, one concern line each; import graph acyclic; no re-export (`export ... from`). Red on the current code (README has no module list); own commit; lead confirms red. Part B = split `sudoku.js` per concern at the repo root (guard discovery unchanged), moved not rewritten, re-indent former IIFE bodies, dead code removed, tests change imports only, README. Then reviewer, tester (screenshots main vs branch, console, guard mutants on a new module), lead check, PR with test summary report, PM final verification.
- No spec (PM D2); `specs/` untouched; the 14 scenarios are the regression gate.
- Part A a3ea93f (developer, Sonnet 5.5): guard +16 lines (README `## Modules` list = root `*.js`; acyclic imports; no `export ... from`). Red confirmed by the lead: `node --test tests/modules.test.js` 4 pass, 1 fail (test 4, README list [] vs [sudoku.js, ui.js]).
- Decision (lead, assumption for PM check): `cellPlace` in sudoku.js is a byte-identical duplicate of `cellName`; part B may keep one and drop the other (listed in the PR as dead code), the only allowed body edit besides imports/exports/indent.
- Part B da7d554 (+ log 01babbc), lead spot check: 19 files; parity.py (dev-117) 64/66 identical, ringLink/ringRules differ only cellPlace->cellName, cellPlace removed, ui.js identical after dedent; `node --test` 221/221, 0 skipped, 4.4 s; product 1537, tests/ 2439 (1.587x); tests diff: 9 assert lines changed, all `S.x`->`x` or guard edits, none removed. Guard IIFE-close regex now end-of-file only (board.js initialisers) - reviewer to mutant. Lines >120: 77, all pre-existing (old 86).
- Reviewer 810dbf4 (ff): approve, 4 minor + 2 nit; f2 guard mutant survived (finding 4). Tester 2b87313 (ff): pass, 8/8 pairs 0 px, 0 console errors, mutants a/b/c killed, 13 files 200.
- Defect found from the tester's caveat (lead repro, `$S/lead-117/repro/`): README View says `python3 -m http.server`; with it (Python 3.14, macOS) the branch page fails to start 3/6 loads (ERR_CONNECTION_RESET on hints.js/hintmarks.js, ui.js never runs); main 6/6. Cause: listen queue 5 vs Chrome's parallel module requests; with `request_queue_size=64` branch 8/8. Player-facing regression on the documented path; to PM for a decision (README View change), with reviewer finding 1 (hint-text helpers in hints.js).

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
- Model Sonnet 5.5, session daff0a10-2135-459c-80b7-137f621f7088, head 52cd648 (code da7d554), base bfd7b54. Verdict: APPROVE with minors (no blocker, no major).
- Evidence: `node --test` 221/221, 0 skipped, 4.4 s; specs/ untouched; parity.py re-run 64/66 identical, 2 differ only cellPlace->cellName, cellPlace removed, ui.js identical after dedent. parity.py is sound for bodies: it compares full declaration text, so an edited body prints DIFF (it flagged the 2 expected ones); it covers sudoku.js up to line 892 and the ui.js body, not the new export/import lines (checked by hand, deadcheck.py: no unused import, no unused export except the `solvableByGrid as solvableBy` alias, a false positive).
Findings
1. minor, hints.js:16-42,164-167 (used by rewards.js:7, hintmarks.js:3): `boxName`, `andList`, `struckCells`, `aDigit` are hint-text helpers exported from hints.js and consumed by two other modules, so hints.js is both "which hint" and the shared text library; rewards depends on hints only for them. One concern per module is arguable; they were one file before. Recommend: leave (README says "and the hint texts") or note in the PR as a PM decision; a `text.js` module is optional, not required by the AC.
2. minor, techniques.js:4 "---- Hints: naked and hidden singles ----", rewards.js:9 "---- Rewards: ...", generation.js:5 "---- Generator ---", entry.js:10 "---- Pencil-mark notes ----", board.js:16 "---- Units and peers": leftover section banners from the single file; the techniques one names the wrong module. Recommend drop or reword (comments only).
3. minor, board.js:3-14: `firstHolder` and `cellName` sit above the "Units and peers" banner, so the banner no longer heads the file; reorder or reword with finding 2.
4. minor, tests/modules.test.js:22-23 (guard): the changed IIFE regex lost coverage. Mutant f2 (open indented, close `})();` at column 0, `export` after it) now survives; the old `^\}\s*\)\s*\(\s*\)` killed it. Cause: close pattern only at EOF. Recommend restoring the column-0 close alternative while still allowing `var X = (function () {...})();` (indented close). `!function(){}()` at EOF also survives (f3; pre-existing).
5. nit, README.md Modules lines: label repeated ("- `validation.js`: validation: ..."), 10 of 11 lines. Reads as a doubled label; drop the second word or make it a sentence. The guard regex needs only `: \S`.
6. nit, generation.js:153,155: `solvableByGrid as solvableBy` alias is the pre-existing export shape (moved, not new); fine.
7. nit, rewards.js:3 imports 9 names from board.js: all used (deadcheck), only a long line (>120, pre-existing style).
No cycle: board<-validation(none)<-clashes<-hints<-hintmarks/rewards<-ui; ui imported by none.
Mutants (modules.test.js unless noted; each reverted, status clean)
| id | file | change | result |
| a | completion.js | `document.title` | killed |
| b | completion.js | `import './ui.js'` | killed |
| b2 | clashes.js | `import('./ui.js')` dynamic | killed |
| c | validation.js | imports clashes.js (cycle) | killed |
| d | completion.js | `export * from './board.js'` | killed |
| d2 | completion.js | `export { cellName } from` | killed |
| e | README.md | completion.js line removed | killed |
| h | README.md | line for nonexistent ghost.js | killed |
| g | extra.js | new root module, no README line | killed |
| i | completion.js | `globalThis.x = 1` | killed |
| f1 | completion.js | `(function () {` at col 0 + `})();` EOF | killed |
| f2 | completion.js | indented open, close col 0, export after | SURVIVED (finding 4) |
| f3 | completion.js | `!function () {` ... `}();` EOF | SURVIVED (pre-existing) |
| m1-m2 | hints.js, board.js | `aDigit` 8->7; `cellName` row +1 removed (full suite) | killed |
AC map: AC1 ok with findings 1-3 (each module matches its line; no re-export; tests, driver, ui import from owners); AC2 ok (acyclic, guard mutants killed; f2 note); AC3 ok (imports/exports minimal, cellPlace the only dead code removed); AC4 ok (bodies unchanged, tests change only imports, `S.x`->`x`, the page seed script path '/generation.js', one comment sudoku.js->ui.js, guard additions; specs/ untouched; 221/221, 0 skipped, 4.4 s); AC5: product 1537 (board 71, validation 68, clashes 32, entry 48, techniques 152, hints 167, hintmarks 87, rewards 137, completion 20, generation 155, ui 400, index.html 46, style.css 153, package.json 1), tests/ 2439, spec-implementation/ 316, ratio 1.587 <= 1.6. ADR 001: one concern per module (finding 1 aside), ES modules, only ui.js touches the page, no wrappers: ok.
Formatting: former IIFE 2-space offset gone; lines >120: 77 in total, none new by count (old 86 per lead). README claims about sudoku.js replaced.
Not checked: screenshots/console (tester), PR text, page behaviour beyond the suite, per-line count of long lines by file.

## Tester
- Model Sonnet 5.5, session daff0a10-2135-459c-80b7-137f621f7088, head 810dbf4 (main bfd7b54). Verdict: PASS, no defects.
1. `node --test`: 221 tests, 221 pass, 0 fail, 0 skipped, 4.3 s. Specs alone: 14/14, 0 skipped.
2. AC4: main vs branch over http, real CDP input, seed 1, states picker, hint3, entry, verify (clash by a given, Notes On, notes 3 and 7, Verify clicked; exercises clashes, entry, validation, completion, hintmarks) at 360x740 and 1280x900: 8 pairs byte-identical, 0 differing pixels; page text/status/tally/scroll height equal. Console errors/exceptions 0 on all 16 runs.
3. AC2 mutants on completion.js (and a new root module), all reverted, git status clean: (a) `typeof document` appended: rc 1, 2 fail; (b) `import './ui.js'`: rc 1, killed by "imports ui.js" and "import cycle completion.js -> ui.js -> completion.js"; (c) new root extra.js with `window`: rc 1, 15 tests, 3 fail, no test edit. Baseline rc 0.
4. Network: all 13 files (index.html, style.css, 11 modules) served 200, 0 non-200 in the server log. file:// 0 cells (CORS block of ui.js), http 81 cells.
Note: python http.server dropped module bursts (ERR_CONNECTION_RESET, test-server backlog 5, not product); runs use scripts/serve.mjs.
Not tested: other browsers, touch input, real-device phone, mutants beyond the AC2 guard, visual states beyond the four.
Scratch: /tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/daff0a10-2135-459c-80b7-137f621f7088/scratchpad/test-117/ (README.md)
Read: process.md "Test strategy applied", lessons.md "Testing" and "Tooling", this log "Lead", #116 tester README.

## Lead review

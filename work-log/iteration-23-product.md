# Iteration 23: product (PM)

PM: claude-opus-5-5, session daff0a10-2135-459c-80b7-137f621f7088. Started 2026-10-29.

## Status
- Scoping done 2026-10-29. Issues, in order: #116, then #117. No specs (D2). This log travels on branch `issue-116-es-modules`. Next: the lead delivers #116, then #117. The PM does final verification on the executed specs, the test summary reports and the screenshot parity.

## Direction
- ADR 001 (ES modules, one per concern; In force, issued 29 Oct 2026, commit 99417f1) says existing code is brought in line "in the next iteration, before any new product feature". So it23 is the ADR migration only. The backlog's item 1 (grid highlight of the cells a text names) moves to it24.

## Evidence
- main 99417f1: `node --test` 207/207, 0 skipped, 3.8 s. Product 1500 lines (sudoku.js 1301: an ES5 IIFE holding the logic plus `render()` at lines 895-1282, about 390 lines; exports through `module.exports` and `window.Sudoku`), `tests/` 2376 (1.584x, 24 lines of headroom), `spec-implementation/` 323.
- `file://` spike (`$WEAVER_SCRATCHPAD/pm-it23/filespike/`): a `<script type="module">` that imports `./m.js` does not run when loaded from `file://` in headless Chrome. Over http (`python3 -m http.server`) it does. Effect: the README "Open index.html" path ends, and page tests (they navigate to `file://` today, `tests/page.test.js:47`) must serve over http.
- Today's tests break under ES modules in three places: `require('../sudoku.js')` (tests and `drivers/game.js:4`); the page-test seeding extracts `seededRng` by regex from the source (`page.test.js:17`); the page readiness check uses `window.Sudoku` (`page.test.js:51`).

## Decisions
- D1: it23 = #116 (native ES modules, one interface module, served page tests), then #117 (logic split into one module per concern). Reason: the ADR timing is binding. Two issues keep each PR reviewable and leave behaviour parity checkable after each step. #116 alone is not ADR-complete (the logic stays one module); the iteration closes only after #117.
- D2: no new or changed spec. Both issues change no behaviour, and the specs describe behaviour, not structure. The 14 scenarios are the regression gate. ADR compliance is checked by a structural guard test in `tests/` (#116 AC2), mutant-confirmed, plus reviewer checks.
- D3: no persona round. Nothing changes on screen. Pixel-identical screenshots, main vs branch, on 3 states at 2 sizes stand in for the user check.
- D4: my reading of the ADR scope "load the product only through its modules": no test extracts product source text (the regex seeding goes), and no product code sets globals for tests (`window.Sudoku` goes).
- D5: I proposed a module map in #117 (11 concerns, including the interface). The team may adjust it with reasons. No catch-all re-export module, because it would hold no concern.

## Concerns and assumptions
- C1 (user impact of ADR 001): opening `index.html` from disk stops working, so the page must be served. Not a reason to stop: the ADR is clear and can be met. There are no real users (GitHub Pages is not enabled, backlog "Open concerns"). Recommendation for Dirk: enable GitHub Pages so players have a served URL.
- C2: the ADR does not define how fine "one concern" is. #117 gives my map; if Dirk wants a different granularity, a clarifying ADR would settle it.
- C3: memory predates ADR 001. architecture.md says "Plain ES5-style JS in an IIFE"; the wiki index points to `governance/memory-architecture.md`, which moved to `governance/context/`. Curator at the it23 close.
- A1: a `package.json` with only `"type": "module"` (no dependencies, no scripts) is not a build step. The `.mjs` extension is the team's alternative.
- Ratio risk: the served-page helper and the guard test add lines to `tests/`, which has 24 lines of headroom. Import/export lines raise product lines and so the headroom. If the cap binds, the existing removal rule applies.

## Issues
1. #116 ES modules and one interface module (ADR 001, part 1).
2. #117 One module per concern for the logic (ADR 001, part 2).

## Backlog (PM, after it23 scoping)
1. it23: #116, #117 (ADR 001; no new feature before both merge).
2. it24 candidate: highlight on the grid the cells a reward or hint names (wiki backlog item 1). Persona A/B first, then the spec.
3. Then `memory/wiki/backlog.md` items 2-10 unchanged.

## Acceptance #116 (PR #118)
- 2026-10-29, PM claude-opus-5-5. Verdict: accepted on c3fefb8. Not merged (lead). Comment: https://github.com/dirkmarski/weaver/pull/118#issuecomment-6484805986
- Own run in a detached worktree at c3fefb8: `node --test` 210/210, 0 skipped, 4.8 s; specs 14/14; `specs/` unchanged vs 99417f1. Greps: no IIFE wrapper, `module.exports`, `require` or `window.Sudoku` in product; only `ui.js` touches `document`/`window`; `sudoku.js` imports nothing; `package.json` = `{"type":"module"}`.
- AC1-AC7 all pass. AC5: lead's c3fefb8 shots, 6/6 pairs byte-identical (cmp), 0 console errors in 12 captures. I viewed 2 shots (hint3 360, entry 1280) and found them correct. AC6: 1527 / 2408 (1.577x).
- Note: `tests/modules.test.js` reads product source as text. I accept this under AC3 because it is a static structure check (the AC2 guard), not code extraction.
- Carried to #117: re-indent, guard discovery limited to root `*.js`. ADR 001 is not complete until #117 merges (D1).

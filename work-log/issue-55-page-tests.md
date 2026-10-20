# Work Log: Issue #55 Page tests in the repo (headless Chrome from node --test)

- Issue: https://github.com/dirkmarski/weaver/issues/55 (author weaver-agents / PM, label enhancement, open)
- Branch: `issue-55-page-tests` (from main 9e54939)
- Iteration: 12. Session `4ecb9163-8db9-4624-9aa5-9c6e3ff52aab`.

## Lead
- 2026-10-20: Gate check passed: issue open, authored by weaver-agents (PM), labelled enhancement. Delivered first in it12; #56 builds on it.
- Environment: Node v24.21.0; Google Chrome at /Applications/Google Chrome.app. Node 24 has a global WebSocket.
- Reading of the issue (for reviewer and tester):
  - No product change at all: index.html, style.css and sudoku.js behaviour untouched; no test hook in product code. Tests read the DOM only.
  - Seeding: Math.random replaced before page scripts run (e.g. CDP Page.addScriptToEvaluateOnNewDocument) with mulberry32 identical to seededRng; asserted once against generatePuzzle('tricky', {rng: seededRng(N)}).
  - Skip must be visible (node:test skip with reason), never a silent pass.
  - One Chrome per file; cleanup of process and temp profile on failure paths.
  - Total `node --test` under 10 s; report figure. Keep the harness lean (test ratio already ~1.15x).
  - Mutants (i)-(iv) in requirement 8 are the tester's acceptance evidence.
- 2026-10-20: Developer launched on #55 (worktree wt-55). Brief: spec is the issue; Node built-ins only; visible skip; one Chrome per file with cleanup; seeding assertion; DOM-only reads, no product change; lean; 3 timing runs; self-check mutants (i)-(iv); stop and ask on spec conflicts.

- 2026-10-20: Developer delivered cb2d63c: tests/chrome.js (78), tests/page.test.js (263, 10 tests), README. Lead check: 157/157 pass, 2.0-2.4 s wall over two runs; no Chrome process left. Product files unchanged (diff stat).
- Lead decision L1 (spec reading): requirement 7f "Hint, both clicks, on a pointing step: ... classes present" is read as "after both clicks", matching the README: the first click shows target and area; confined, removed, ring and data-d appear on the explain (second click). Not a scope change; told to the PM at acceptance.
- Points passed to the reviewer: regex extraction of seededRng from sudoku.js (indentation-dependent; seeding assertion is the guard); page-load wait loop gives up silently after 2 s; `read()` returns an unused-looking `html` field; mutants (iii) and (iv) each rest on one test; test ratio 1.15x -> 1.45x (inherent to a harness with no product change; PM accepted the harness scope knowing the ratio).
- Reviewer and tester launched in parallel, each in its own detached worktree on issue-55-page-tests (wt-55-review, wt-55-test).

## Developer
- Files: `tests/chrome.js` (77 lines: Chrome lookup, launch, minimal DevTools client over global WebSocket/fetch), `tests/page.test.js` (about 265 lines, 10 page tests); README Test section and Files list. `index.html`, `style.css`, `sudoku.js` unchanged.
- Seeding: the injected script (`Page.addScriptToEvaluateOnNewDocument`) is built from the `seededRng` source text taken from `sudoku.js` by regex, so mulberry32 is not copied by hand. The page runs `Math.random = seededRng(n)` via a test-only `window.__seed` set by that injected script (no product hook). One seeding test compares the page's Tricky puzzle (read from the given cells) with `generatePuzzle('tricky', {rng: seededRng(5)}).puzzle`.
- Each test navigates to a fresh page (cheap), seeds, and clicks a level. Scenario data (which cell, which digit) is computed in Node from the same seeded puzzle with the exported helpers; the page is driven only with keydown events on the cell input and clicks, and read only from the DOM.
- Skip: `CHROME_PATH` (only that path is tried when set), else usual macOS/Linux paths; `WEAVER_NO_CHROME=1` forces the skip; also skipped without a global WebSocket (Node < 22). Each page test is reported as `skipped` with the reason.
- Cleanup: Chrome is started in its own process group and the group is killed (SIGKILL) and the temp profile removed in `after`, on launch failure, and in a `process.on('exit')` fallback. Checked with a deliberately failing test: no Chrome process and no `weaver-chrome-*` temp directory left.
- Spec readings: the pointing marks `hint-confined`/`hint-removed`/`data-d` appear on the second click only (README: "on a pointing explain only"); the first click shows target and area. Scenario e uses an overwrite (a clash can only end by clear or overwrite) on an already full grid.
- Figures: `node --test` 157 tests (147 before + 10 page tests), about 2.0 s with Chrome (3 runs: 2.06, 2.03, 2.02 s wall), 0.63 s before. Test code 1322 -> 1662 lines against 1149 product lines (1.15x -> 1.45x).
- Mutant self-check (reverted, never committed): (i) killed by e; (ii) killed by c/d; (iii) killed by f; (iv) killed by f. Each run: 1 fail, no failure at the tip.

## Reviewer
(pending)

---

## Tester
(pending)

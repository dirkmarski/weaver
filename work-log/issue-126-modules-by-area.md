# #126 Modules by game area (ADR 003)

Issue: https://github.com/dirkmarski/weaver/issues/126. Branch: `issue-126-modules-by-area`.

## Lead
- Gate: open, author weaver-agents (PM), label enhancement, 2026-11-02. Lead session 226c8fac-a151-4b1c-af1a-02f108c103b5 (Claude Opus 5.5).
- Baseline main 68829d7: 230/230, 0 skipped, 6.3 s; product 1565 (12 root `*.js` 1365, index.html, style.css, package.json), `tests/` 2472 (1.580x, cap 2504), `spec-implementation/` 483.
- Module map: the PM's map is accepted as the ADR 003 reading. Checked: `rewardMarks` uses only `board.js` (no helper shared with the hint marks), so it moves to `rewards.js` without a new shared module; `checking.js` = `validation.js` (leaf) + `clashes.js` (imports board), imported by hints, rewards, completion, ui; graph stays acyclic (rewards -> hints -> checking). No alternative raised.
- Red/parity approach (restructure, it23 #117 precedent, PM D2/D3): no spec change; the 21 scenarios are the regression gate. Part A = guard to ADR 003 + README "## Modules" to the target map; red = guard fails on the old tree (README list != root `*.js`). Part B = moves (functions unchanged), imports, README Files, tests/drivers import from the new owners. Then reviewer, tester (parity script, pixel 360x740/1280x900 on 3 states, 10 fresh loads), lead check, PR, PM verification.
- Part A c324b7d (developer): guard names ADR 003, README "## Modules" = target map. Red confirmed by the lead (detached worktree at c324b7d): `node --test tests/modules.test.js` 14 pass, 1 fail (README list vs root `*.js`).
- Part B 3c7f44a, lead spot check: 12 files (+169/-186); tests/ diff = import lines + 2 guard wording lines, no assertion changed; spec-implementation/ unchanged (driver already imported from hints/rewards). Lead re-ran parity (`$S/dev-126/parity.mjs`, main 68829d7 vs branch): PASS, 68/68 declarations identical, 53/53 exports present. Suite 228/228, 0 skipped, 5.6 s: 230 -> 228 because the per-file guard test runs once per root module (12 -> 10), not a removal. Sizes: product 1553, tests/ 2469 (1.590x), spec-implementation/ 483.

## Developer
- Claude (developer agent), session 226c8fac-a151-4b1c-af1a-02f108c103b5. Part A c324b7d, part B 3c7f44a. Parity script and output: scratchpad `dev-126/` (parity.mjs, README.md, parity.out). Comment-only edits outside moved headers: rewards.js header and line 66 ("the rewardMarks result").

## Reviewer
- Claude Sonnet 5.5 (reviewer agent), session 226c8fac-a151-4b1c-af1a-02f108c103b5. Head reviewed 7e64546 (diff 68829d7..7e64546). Verdict: approve.
- Findings:
  1. nit: `hints.js` (before the moved block, ~line 141) and `rewards.js` (before `rewardMarks`) have two blank lines where the files use one. Cosmetic, no action needed.
  2. nit: README "## Files" `tests/sudoku.test.js` line says "validation/verify/..." as a topic word, not a file name; no stale `validation.js`, `clashes.js` or `hintmarks.js` anywhere outside work-log/ and memory/ (grep clean).
  3. info: the guard checks README names = root `*.js` only; "player words" and the "used by" claims are not machine-checked. Checked by hand against the imports: board used by checking, hints, rewards, techniques, generation; techniques by hints, rewards, generation; texts by hints, rewards. All correct. Graph acyclic (checking -> board; hints -> checking; rewards -> hints, checking).
- Restructure check: besides the developer's parity script, a multiset of every non-comment, non-import/export line over all root `*.js` is identical on main and branch (1027 lines, same md5). Comment diff is only the six module headers and one `rewardMarks` comment. Exports: no new names; `namedClash` is now exported from checking.js, as before from clashes.js. tests/ diff is import lines and 2 guard wording lines; spec-implementation/ and specs/ untouched. Suite 228/228, 0 skipped.
- Mutants (worktree only, reverted; `node --test tests/modules.test.js`): hints.js imports ui.js KILLED; `document.` in checking.js KILLED; checking.js -> hints.js cycle KILLED; `export { hintFor } from` in rewards.js KILLED; README texts.js line renamed KILLED; `window.` in board.js KILLED. Each diff was non-empty.
- Not checked: screenshots/pixel parity (tester), 10 fresh loads (tester), specs run, ratio beyond lead's figures, wiki architecture.md update (lead at merge).

## Tester
- Model Claude Sonnet 5.5, session 226c8fac-a151-4b1c-af1a-02f108c103b5. Head tested f55452a (detached worktree). Verdict: PASS.
1. `node --test`: 228 tests, 228 pass, 0 fail, 0 skipped (5.8 s). Specs `node --test spec-implementation/specs.test.js`: 21/21, 0 skipped.
2. Pixel parity main 68829d7 vs branch, real CDP mouse/key input, Tricky seeds, caret hidden by an injected style on both sides: a (Hint stage 3, seed 1) 360x740 and 1280x900 diff 0/0; b (own pointing reward with marks, seed 2) 0/0; c (Verify with red clash, seed 1) 0/0. 6/6 pairs identical, 0 console errors per load. State checks on the page: a 8 hint-marked cells, b 3 marked cells, c 1 conflict input and status class fail.
3. Fresh loads of the README View server on the branch (serve(port) of tools/serve.js): 10/10 fresh-profile loads, 0 failed requests, 0 console errors, level picker shown and Easy board of 81 cells rendered.
4. Sizes: product 1553, tests/ 2469 (1.590x, cap 1.6x), spec-implementation/ 483. Matches the lead's figures.
5. Mutants (worktree only, reverted): `rewardMarks` key text "amber" -> "ambar" in rewards.js: state b differs (520 px at 360, 1839 px at 1280), a and c 0. `hintKey` text "dashed" -> "dashee" in hints.js: state a differs (1615, 2977 px), b and c 0. Both detected, each only in its own state.
- Not tested: audio or other browsers; touch input; states beyond the three (claiming hints, Notes, completion); behaviour on Hard or other seeds; the PR text.
- Scratch: /tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/226c8fac-a151-4b1c-af1a-02f108c103b5/scratchpad/test-126/ (README.md lists the scripts and pass lines).

## Lead review

## Lead: acceptance and merge

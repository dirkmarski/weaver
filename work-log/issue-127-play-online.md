# #127: README names the online address to play

Issue: https://github.com/dirkmarski/weaver/issues/127. Branch: `issue-127-play-online`.

## Lead
- 2026-11-02 (lead session 226c8fac-a151-4b1c-af1a-02f108c103b5, same session as #126, new lead run): gate ok (open, author weaver-agents/PM). Requests: none raised by the lead. PM spec a28930c; main 67027a1 merged in at 466e57e.
- Red run on 466e57e (`node --test spec-implementation/specs.test.js`): 22 specs, 21 pass, 1 fail, 0 skipped. The new scenario fails on its assertion (`local-run.js` step "it gives the address": "the section does not give the address \"https://dirkmarski.github.io/weaver/\""), not undefined or ambiguous. No new step needed (reuses `local-run.feature` steps), so no part A.
- Plan: developer edits README "View" only (online address first, local-run text kept: command, Node 22 or newer, `http://localhost:8000`). Ratio unaffected (README is not product code). Then reviewer, tester (README checks + mutants on README in a worktree), lead check, PR, PM acceptance (AC4 live site after merge).
- Note: the step is a substring check, so "names the address first" (AC3) is checked by review/test, not by the spec.

## Developer
Model Sonnet 5.5, session 226c8fac-a151-4b1c-af1a-02f108c103b5. README View now opens with the online address, then keeps the local-run text. No code, spec or step changes. Full suite 229/229 pass; specs 22/22 expected pass (see report).

## Reviewer
Model Sonnet 5.5 (claude-sonnet-5-5), session 226c8fac-a151-4b1c-af1a-02f108c103b5. Head reviewed f00e189. Verdict: approve.
1. (nit) The sentence "opening `index.html` from disk no longer works" is kept from the old text; "no longer" now reads slightly oddly beside the new first sentence but is unchanged and correct. No action.
2. (info) Diff is README "View" only (plus log files); no js, spec or step change; no new root `*.js` (ADR 003); one command, Node built-ins only, Node 22 or newer and `http://localhost:8000` kept (ADR 002). `specs/running/local-run.feature` has no diff vs main.
Tests: `node --test` 229 total, 229 pass, 0 fail, 0 skipped; specs file 22/22.
Not checked: the live site (AC4, PM), the rendering of the README on GitHub, mutants (tester).

## Tester
- 2026-11-02 (tester, Sonnet 5.5, session 226c8fac-a151-4b1c-af1a-02f108c103b5), head f00e189 (tree 5526818). Verdict: PASS.
- Runs: `node --test` 229 tests, 229 pass, 0 fail, 0 skipped; specs run 22, 22 pass, 0 fail, 0 skipped (play-online and local-run both pass).
- README mutants (specs run): a address removed, killed; b address moved to "How to play", killed; c1 http instead of https, killed; c2 no /weaver/, killed; c3 no trailing slash, killed; d1 command line removed, killed (local-run); d2 Node/localhost sentence removed, killed; d3 "Node 22 or newer" -> "Node", killed; d4 localhost address removed, killed. README restored after each.
- Findings: 1. (info) Mutant e, address moved to the end of the View section, survives: the step is a substring check within the section, so "first" (AC3) rests on reading; read: the address opens the View section, then the local-run text, command `node tools/serve.js`, "Node 22 or newer", `http://localhost:8000` kept.
- Serve check: `node tools/serve.js`, GET http://localhost:8000/ gave 200, stopped, port free. Live site (information): `curl -sI https://dirkmarski.github.io/weaver/` HTTP/2 200 (may serve old main; PM AC4 after merge).
- Not tested: live site content (Hint on Tricky), rendering of the README on GitHub. Scratch: scratchpad/test-127.

## Lead review
- 2026-11-02 head 2dd45e0 (code head f00e189). Diff 466e57e..HEAD: README.md 1 line (View first sentence), work-log only otherwise; no js/spec/step change; no assertion removed. Green: `node --test` 229/229, 0 skipped; specs 22/22, 0 skipped. Lead re-ran tester mutant b (address moved to "How to play") at 12:52, after the tester outputs (12:51): play-online fails, 21/22. ADR 002 (one command, built-ins, Node 22, localhost) and ADR 003 (no new root js) hold. Ratio unchanged (no product or test code).
- Findings accepted as is: reviewer nit "no longer works" (kept wording, correct); tester mutant e (address moved later in View survives: the step is a substring check, so "first" in AC3 rests on review and test reading, both confirmed). Developer entry says "22/22 expected"; the actual run was 22/22 (developer report, reviewer, tester, lead).

## Lead: acceptance and merge

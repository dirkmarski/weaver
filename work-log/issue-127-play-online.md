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

## Tester

## Lead review

## Lead: acceptance and merge

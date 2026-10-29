# Issue #121: Run weaver locally with one documented command (ADR 002)

Issue: https://github.com/weaver-agents/weaver/issues/121 . Branch: `issue-121-local-run` (PM spec 794ebf7, PM log 3b824f5).

## Lead
- Lead: Claude Opus 5.5 (claude-opus-5-5), session c62cf25c-8b8e-4cda-905a-5ce306a4299f. Fresh start (no earlier lead run for #121).
- Gate (2026-10-29): issue open, author weaver-agents (PM). ADRs in force: 001 (modules), 002 (local run).
- Baseline: branch = main e5028f3 + spec + PM log (no main merge needed). Suite 224: 222 pass, 2 fail (new scenarios, undefined steps). Ratio `tests/` 2431 / product 1533 (root js 1334 + html 46 + css 153) = 1.586x, cap 2452. `spec-implementation/` 317, `tools/` 32.
- Plan: part A developer: steps + a driver for `specs/running/local-run.feature` (child process `node tools/serve.js`, port 8000 or a free one, always stopped). Lead red run: scenario 1 fails on assertion, scenario 2 passes, then 2 lead mutants make scenario 2 fail (package.json `dependencies`; serve.js non-`node:` import or a missing module response). Part B: README "## View" only. Then reviewer, tester (fresh clone x5, pixel parity 360x740/1280x900), PR, PM.
- Expectations: nothing added to `tests/` (AC6); `tools/serve.js` unchanged unless the driver needs it (not product).
- Red run (lead, part A e8f52d3, `node --test spec-implementation/specs.test.js`): 16 specs, 15 pass; scenario 1 fails on the assertion `the section does not say "Node 22+" or "Node 22 or newer"`; scenario 2 passes (130 ms). Mutants (lead, reverted, git clean): (a) package.json `dependencies: left-pad` -> scenario 2 fails `package.json lists packages`; (b1) serve.js `import express from 'express'` -> fails in the When step (`the command exited with code 1 before it listened`, ERR_MODULE_NOT_FOUND); (b2) serve.js 404 on `rewards.js` -> fails `files not served with 200...` naming `/rewards.js`. Outputs: lead scratch `lead-121/{red-run,mut-a,mut-b1,mut-b2}.txt`.
- Lead notes on part A: runner unchanged (steps are sync, so the driver re-runs itself as a `--crawl` helper via execFileSync with try/finally kill). Readiness keys on the `Serving ` stdout line of serve.js. Edge: if execFileSync's 30 s timeout kills the helper, its server child may outlive it (helper `finally` does not run on SIGTERM); asked the reviewer to judge.

## Developer
- Model Claude Sonnet 5.5, session c62cf25c-8b8e-4cda-905a-5ce306a4299f. Part A: steps/local-run.js, drivers/local-run.js (spec-implementation 317 -> 433 lines; tests/ untouched).
- Runner steps are synchronous, so the driver runs start+crawl+stop in a helper process of itself (`--crawl`, try/finally kill); no runner change. Port 8000 busy: fails with a clear message.
- Result: scenario 1 fails on the missing Node version; scenario 2 passes; mutants (package.json dependency, non-node: import, 404 on hints.js) each fail scenario 2 on an assertion.

## Reviewer

## Tester

## Lead review

## Lead: acceptance and merge

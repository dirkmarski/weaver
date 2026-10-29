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
- Rework r1: helper now stops the server on SIGTERM/SIGINT and bounds each fetch to 5 s; importsOf also finds dynamic import(). Proofs: orphan on 8000 before, none after; lodash dynamic import fails scenario 2.
- Model Claude Sonnet 5.5, session c62cf25c-8b8e-4cda-905a-5ce306a4299f. Part A: steps/local-run.js, drivers/local-run.js (spec-implementation 317 -> 433 lines; tests/ untouched).
- Runner steps are synchronous, so the driver runs start+crawl+stop in a helper process of itself (`--crawl`, try/finally kill); no runner change. Port 8000 busy: fails with a clear message.
- Result: scenario 1 fails on the missing Node version; scenario 2 passes; mutants (package.json dependency, non-node: import, 404 on hints.js) each fail scenario 2 on an assertion.
- Part B: README View now states the command, Node 22+ with nothing to install, and http://localhost:8000; full node --test 224 pass, 0 skipped.

## Reviewer
- Reviewer: Claude Sonnet 5.5 (claude-sonnet-5-5), session c62cf25c-8b8e-4cda-905a-5ce306a4299f. Head reviewed: 53616d2. Verdict: changes needed (one should-fix, rest nits); no ADR departure.
- Suite: `node --test spec-implementation/specs.test.js` 16 tests, 16 pass, 0 skipped.
- Findings:
  1. should: orphan server on helper SIGTERM (reproduced: `--crawl` helper sent SIGTERM left `node tools/serve.js` listening on 8000). Fix: in the helper add SIGTERM/SIGINT handlers that `child.kill()` then exit; add `AbortSignal.timeout(5000)` to `fetch` so the helper ends before the 30 s kill.
  2. nit: package-facts import regex is line-anchored and static only; `await import('lodash')` in ui.js survives (mutant). Either extend the regex or accept (the crawl still catches missing relative modules).
  3. nit: README address on the new line is unguarded (`localhost:3000` there survives) because the older code line already holds the address; AC2 still met.
  4. nit: step "it says the command needs Node 22 or newer" matches the text anywhere in the section (a negated sentence would pass).
  5. nit: port 8000 fixed; a second concurrent run or a running dev server fails the scenario with a clear message (out of scope per issue).
- Mutants: 12 run (README x3, package.json, serve.js x4, index.html x2, ui.js x3); survivors: README address, dynamic import.
- Not checked: browser rendering, fresh clone, pixel parity (tester).

## Tester
- Tester: Claude Sonnet 5.5 (claude-sonnet-5-5), session c62cf25c-8b8e-4cda-905a-5ce306a4299f. Head 179f480. Verdict: pass.
- AC4: fresh clone of origin branch (179f480, no node_modules, package.json no dependencies), `node tools/serve.js` from the clone root, `http://localhost:8000` in headless Chrome, 5 fresh-profile loads: 13 files all 200, 0 failed requests, 0 console errors, 81 cells after choosing a level; port 8000 free afterwards. Node v24.21.0.
- AC5: main e5028f3 vs branch, level Tricky seed 1, states hint3 and entry, 360x740 and 1280x900, 2 shots per side per size: 4 pairs byte-identical, 0 differing pixels, 0 console errors.
- AC3/AC6: `node --test` 224 tests, 224 pass, 0 fail, 0 skipped, 4.24 s; specs 16/16 (0.19 s). `tests/` unchanged vs main (empty diff), 2431 lines / product 1533 = 1.586x (cap 1.6x). `spec-implementation/` 433 lines (main 317, +116).
- Cleanup: nothing listens on 8000 after the spec run. With a 127.0.0.1:8000 listener held, the spec fails in about 140 ms: "the command exited with code 1 before it listened (port 8000 is already in use; stop what uses it)".
- Findings: 1. With a 0.0.0.0:8000 listener held, the spec passes (the server binds 127.0.0.1:8000 beside it): not a defect, the busy-port message appears only for a clash on 127.0.0.1. 2. The README command line includes a trailing comment; run without the comment.
- Not tested: Windows/Linux, Node 22.x (only 24.21.0), browsers other than Chrome, a busy port with IPv6 listener, the 30 s driver timeout orphan path.

## Lead review
- Read the full diff (spec-implementation 2 files, README +2 lines). Review r1 (179f480): changes needed, finding 1 should (orphan server on helper SIGTERM; reproduced by the reviewer), 2-5 nits. Test r1 (1c02053): pass (fresh clone 5/5 loads, 13 files 200, 0 failed requests, 0 console errors; 4 pixel pairs identical; 224/224; ratio 1.586x).
- Rework r1 (34948a3): finding 1 fixed (SIGTERM/SIGINT handlers kill the server, fetch 5 s timeout; developer before/after lsof proof); finding 2 fixed (dynamic `import()` seen). Nits accepted: 3 (README address guarded by the code-block line already; AC2 met), 4 (step as strict as its text), 5 (fixed port 8000, out of scope). Tester findings accepted: 0.0.0.0 listener coexists with the 127.0.0.1 bind (no clash, fetch reaches our server); trailing `# then visit` comment in the View command line is pre-existing text (AC2: no other README change) -> PM watch.
- Lead re-check (driver-only, behaviour-neutral: lead re-check instead of tester re-run): suite 224/224 skipped 0, 4.27 s; paired mutant `import('lodash')` in an unexecuted serve.js function: head fails `imports that are neither relative nor node: built-ins`, 1c02053 passes 16/16. Port 8000 free afterwards. `spec-implementation/` 436 (+119), `tests/` unchanged. ADR 001/002: no departure.

## Lead: acceptance and merge
- PM ACCEPTED on c0dd056 (code head 34948a3; PR #123 comment 6486572290; PM log 1220032, D5 keep `# then visit` comment, D6 nits accepted). Delta 34948a3..head is work-log/memory only. Merged with a merge commit at the branch head (sha pinned).

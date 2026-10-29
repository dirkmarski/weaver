# Issue #121: Run weaver locally with one documented command (ADR 002)

Issue: https://github.com/weaver-agents/weaver/issues/121 . Branch: `issue-121-local-run` (PM spec 794ebf7, PM log 3b824f5).

## Lead
- Lead: Claude Opus 5.5 (claude-opus-5-5), session c62cf25c-8b8e-4cda-905a-5ce306a4299f. Fresh start (no earlier lead run for #121).
- Gate (2026-10-29): issue open, author weaver-agents (PM). ADRs in force: 001 (modules), 002 (local run).
- Baseline: branch = main e5028f3 + spec + PM log (no main merge needed). Suite 224: 222 pass, 2 fail (new scenarios, undefined steps). Ratio `tests/` 2431 / product 1533 (root js 1334 + html 46 + css 153) = 1.586x, cap 2452. `spec-implementation/` 317, `tools/` 32.
- Plan: part A developer: steps + a driver for `specs/running/local-run.feature` (child process `node tools/serve.js`, port 8000 or a free one, always stopped). Lead red run: scenario 1 fails on assertion, scenario 2 passes, then 2 lead mutants make scenario 2 fail (package.json `dependencies`; serve.js non-`node:` import or a missing module response). Part B: README "## View" only. Then reviewer, tester (fresh clone x5, pixel parity 360x740/1280x900), PR, PM.
- Expectations: nothing added to `tests/` (AC6); `tools/serve.js` unchanged unless the driver needs it (not product).

## Developer

## Reviewer

## Tester

## Lead review

## Lead: acceptance and merge

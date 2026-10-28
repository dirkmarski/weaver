# Issue 110: ATDD foundation (execute specs/*.feature with the suite)

Issue: https://github.com/dirkmarski/weaver/issues/110 . Branch: issue-110-atdd-foundation.

## Lead
- Lead Claude Opus 5.5, session d2424c00-a6fb-45e6-86ab-53111ee2576f. Gate passed (open, PM-authored). Base 24383ae.
- Baseline: 184 tests pass, 0 skipped, 4.4 s (Node 24.21). Product 1484 lines (sudoku.js+index.html+style.css), tests/ 2374 (cap 2374.4). No product change allowed; tests/ must not grow.
- Plan: developer builds runner (spec-implementation/, discovered by plain `node --test`), commits it with no steps first (red: 5 undefined-step failures, output saved), then driver + steps (green), README Test section. Then reviewer (layering grep, mutants a and b, parser error cases), then tester (independent red/green re-run, mutants a and b, malformed/ambiguous cases, timing). Lead check, PR with test summary report, PM acceptance.
- Specs are PM-only (specs-guard hook); any step wording question goes to the PM via the lead.

## Developer

## Reviewer

## Tester

## Lead review

## Lead: acceptance and merge

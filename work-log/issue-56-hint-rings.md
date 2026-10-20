# Work Log: Issue #56 Hint explanation: relevant rings, key line, badge in its note slot

- Issue: https://github.com/dirkmarski/weaver/issues/56 (author weaver-agents / PM, label enhancement, open)
- Branch: `issue-56-hint-rings` (from main f55b6a8, which includes #55's page harness)
- Iteration: 12. Session `4ecb9163-8db9-4624-9aa5-9c6e3ff52aab`.

## Lead
- 2026-10-20: Gate check passed: issue open, authored by weaver-agents (PM), labelled enhancement. Delivered after #55 (merged f55b6a8).
- Reading of the issue (for reviewer and tester):
  - Second-click (`explain`) only: ring filter (`hintMarks().digits`), key line (pointing explain only, pure helper), badge in D's note slot (CSS), box-case parenthesis. First click, reward texts, counts, hint order and `findPointing` results unchanged.
  - Pins P(1), P(3), P(4), P(8), P(10), H(1)-H(3) are the acceptance values; on a mismatch between a pin and the rule, stop and ask the PM (via lead).
  - Expected changes to existing `digits` assertions must be listed by the developer.
  - Page tests for the key line and badge go into tests/page.test.js (#55 harness); page evidence must show skipped = 0 (PM condition at #55 acceptance). Keep the harness lean (ratio ~1.45x; PM trims past ~1.6x).
  - Badge: 375 px and 900 px screenshot check by the tester, with notes set in a confined cell.
  - Mutants in AC7 are the minimum targeted set.
- Carry-forward nits from #55 (L4, tests/chrome.js: `watchdog` declaration order, dead `gone` check): not in scope here unless the developer touches tests/chrome.js anyway.
- 2026-10-20: Developer launched on #56 (wt-56). Brief: issue is the spec; stop on pin/rule mismatch; key line via clearResults; badge CSS-only if possible; list changed digits assertions; page tests lean with skipped = 0; self-run AC7 mutants.

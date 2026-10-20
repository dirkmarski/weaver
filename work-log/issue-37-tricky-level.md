# Work Log: Issue #37, New level Tricky (lead)

- Lead: weaver-agents (Claude Opus 5.5), session `46a62a2f-31a7-4db9-8c77-8e3d5044bf18`
- Branch: `issue-37-tricky-level` from main 12f4a63 (after the #36 merge). Worktree: `<session scratchpad>/wt-37`.
- Gate: OPEN, author weaver-agents (PM, iteration 8), label enhancement. PASS.
- Folded in (PM comment on #37): README N5 (the "with a hint" bullet wording) and dropping "two" from the Hint intro sentence. Both are acceptance points under "README accurate".
- Lead note: "solvable by singles plus pointing" must use the same findPointing as Hint. Then "following Hint never shows none" follows, because every placement is a sound deduction.

## Progress
- 2026-10-20: Branch and log created. Developer round 1 launched.
- Developer round 1 (Claude Sonnet 5.5): 44bff76 (sudoku.js, index.html), 095755a (tests) and f86f2c5 (README, with N5 and "two" fixed). Tricky band 27-31.
  - Measurement (n=50 per level): Tricky max 207 ms, average 45.7 ms, 0 capped. Hard (now excluding pointing) max 27 ms, 0 capped.
  - Tests 130 -> 136, 0.22 s -> 0.56 s.
  - Tricky seeds 1-4 each contain exactly one pointing hint (seed 1: the 13th hint, r3c3=7, naked form; seed 3: the 20th hint, r5c5=1, hidden form).
- Lead check: PASS. solvableBy 'pointing' calls findPointing (the same as Hint) only when no single made progress, which matches Hint's condition. LEVELS are wired tricky beyond singles and hard beyond pointing. 136/136 tests pass.
  - Product points for the PM: (1) a Tricky puzzle needs exactly ONE pointing step in the sampled seeds; (2) the Tricky band 27-31 overlaps Hard 22-29 at 27-29.
- Reviewer and tester launched in parallel.

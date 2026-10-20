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
- Tester round 1 (Claude Sonnet 5.5): PASS at b5920c6 (comment 6280662168), no defects. UI: four levels, labels, New puzzle; click-to-render at most 106 ms. Tricky seeds 1-4 followed by Hint to the end: one pointing hint each, never 'none', valid solutions. An independent candidate-set solver (5 seeds per level) confirms Tricky stalls on singles and is solved with pointing, and Hard stalls with pointing. Timing on 10 seeds: Tricky max 77 ms, 0 capped. 375 px: no horizontal scroll, and the Hard button wraps to a second row (for the PM to judge visually).
- Reviewer round 1 (Claude Sonnet 5.5): APPROVE at b5920c6 (comment 6280668742). No B findings. 6 mutation spot checks, 5 killed. S1: the mutant "Hard beyond back to 'singles'" survives, because the 10 Hard test seeds yield no pointing-solvable puzzle even under the mutant (10 of 60 seeds would). N1: README Files says 'pointing' repeats "until the grid is full" (more exact: "or no step is left").
- Lead decision: round 2 for S1 and N1. For S1, prefer a behavioural guard (Hard test seeds, still at most 10, of which at least one fails under the mutant) over a config-only assertion. Round 2 is tests and README only, so the re-check is proportionate: the reviewer re-runs the S1 mutant and checks the delta, and the tester re-runs the suite and the delta check.
- Developer round 2 (Claude Sonnet 5.5): 7dde9ba (comment 6280684659). Hard test seeds are now 1-10 (under the mutant, seeds 3 and 8 give pointing-solvable puzzles). A config assertion was added, and the README N1 is fixed. sudoku.js is unchanged. 137/137 tests pass.
- Lead check: PASS. The lead re-ran the mutant hard.beyond='singles': 2 tests fail (behavioural plus config), and the revert is clean.
- Re-test round 2 (Claude Sonnet 5.5): PASS (comment 6280694733). The product files are unchanged against the tested b5920c6. 137/137 tests pass in about 0.59 s. At most 10 seeds per level.
- Re-review round 2 (Claude Sonnet 5.5): APPROVE, no findings. S1 is confirmed resolved (the behavioural test fails under the mutant). N1 is literally true. PR opened for PM acceptance.
- PR #40: **PM ACCEPTED** at 542a5db with no conditions (comment 6280786479), verified on GitHub by the lead. Personas B and C: Tricky feels like the next step after Medium, and both explained pointing. Lead points judged: one pointing step per puzzle is enough to meet the technique but not to practise it (a later candidate); the givens overlap is acceptable; the 375 px wrap is acceptable (a mobile candidate). Merged with a merge commit (no squash).

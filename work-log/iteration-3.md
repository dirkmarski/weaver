# Work Log: Iteration 3 (lead)

- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `6ec914a0`
- Run type: "Deliver the next iteration"
- Iteration branch: `iteration-3` (holds the iteration work logs and is merged by PR at the end)
- Product manager work log: `work-log/iteration-3-product.md`

## Gate check
- 2026-10-19: Invoked to deliver the next iteration. Iteration 2 is closed and merged (#13, #15). No open PRs. Open issue: #14 (docs, raised by the PM and carried as an iteration-3 candidate). There is no iteration-3 log, so this is a fresh start.
- **Direction change:** Dirk updated the product strategy in commit 25f6735. The new aim is to teach solving techniques progressively and to reward learning and applying them, with solving as a secondary goal. The PM has to re-rank the candidates against this aim.
- GitHub Pages is still not enabled (API 404).

## Plan
1. The PM decides the iteration scope against the new strategy and writes the issue(s).
2. For each issue: gate check, branch `issue-N-<slug>`, a per-issue work log, then developer, then reviewer and tester in parallel, then lead check, then a PR merged with a merge commit (no squash).
3. Every rework round repeats the full browser walkthrough. Reviews trace data from creation to use. README claims are checked against behaviour sentence by sentence (iteration 2, lesson 1).
4. The PM does user acceptance and decides when the iteration is done.

## Conventions
- Commits and PRs: `[<agent>][session 6ec914a0] <message> (#N)`. Each agent adds a co-author trailer naming its own model and version.
- The iteration logs are edited in the worktree scratchpad/wt-iteration-3.

## Progress
- Iteration branch and this log created.
- PM (Claude Opus 5.5) decided the scope: one issue, #16 "Teach the first technique: a Hint button for naked singles (includes #14)" (PM log commit acacf23). The hint nudges first and explains on a second click. It never fills in the cell, and the player gets a "Well done" when they apply it. #14 is folded in because the same README section changes.
- PM open questions and the lead's answers:
  - (1) One branch and one PR for #16 + #14: accepted.
  - (2) Pages is still blocked: carried forward for Dirk. It matters more now, because the strategy is about learning and nobody can judge that without users.
  - (3) Hints use the rules, not the stored solution: accepted as the PM decided. Easy is generated as solvable by naked singles alone, and values that are correct so far keep it that way, so AC6 holds.
- #16 and #14 pass the gate check. Branch `issue-16-hint-naked-single`, work log created, developer launched.
- #16 delivered on PR #17 in two rounds (details in work-log/issue-16-hint-naked-single.md):
  - Round 1 (c38a10a): lead check passed, test PASS (240 checks), review CHANGES REQUESTED, nothing blocking:
    - S1: a README sentence was no longer literally true after the "Well done!" message.
    - S2: a test did not assert what its name said.
  - The lead chose to rework before PM acceptance, because S1 is the same class of defect the PM rejected in iteration 2.
  - Round 2 (3dc5f9c): S1, S2 and two nits fixed. Review APPROVE, full re-test PASS (294 checks; Easy solved with hints only on 4 puzzles). **PM ACCEPTED** on first presentation.
- PR #17 merged with a merge commit (5d4e587), individual commits kept. #16 and #14 closed. main: `node --test` 75/75.
- Iteration 3 is complete, as confirmed by the PM.

## Outcome and lessons
- Delivered: the first teaching feature, under the new strategy. The Hint button nudges, then explains the naked single, never fills in the cell, and rewards the player for applying it. The README is now literally accurate (#14).
- Lesson 1: the sentence-by-sentence README check introduced after iteration 2 worked. The reviewer caught the literal-truth defect before the PM saw it, and the PM accepted on the first presentation.
- Lesson 2: having the tester compute expected values independently (target, digit, excluded digits) rather than reading them from the app gave strong evidence for logic-heavy features. Keep doing this.
- Lesson 3: fixing cheap nits (contrast, declaration placement) in the same rework round as should-fix items cost nothing extra in gates.
- Known limit: a real clipboard paste cannot be driven headless. The CDP insertText stand-in drives the same `input` path.
- Carried-forward concern for Dirk: GitHub Pages is still not enabled. Under a learning-focused strategy, whether hints actually teach can only be judged with real users. Every teaching assumption so far rests on PM judgement alone.
- Next-iteration candidates (PM, not yet decided): a hidden-single hint, learning rewards and progress, a short technique explainer, Pages, and convenience features that support learning.

# Iteration 11: product log

Product manager, session 544de00f-db0c-4fd3-8425-f2e90d4ada4d, Claude Opus 5.5 (claude-opus-5-5). Started 2026-10-20.

## Inputs read
- memory/wiki/index.md, product.md, backlog.md, lessons.md; memory/wip/current.md; README.md (behaviour spec); governance/context/product-strategy.md and test-strategy.md (re-read; unchanged in substance: teach techniques progressively, reward learning and applying skills, solving secondary; test strategy: golden path, edge cases, errors; PM does acceptance only).
- Not read: work-log/ (Dirk's rule; not needed for diagnosis so far) and governance/LOG.md (never read).

## Scoping approach
- Start from the PM candidate list (backlog.md): 1 clash follow-ups, 2 pointing visuals v2, 3 Tricky practice density, 4 wording items, 5 claiming, 6 mobile/progress.
- Reproduce the top pain first on the current main code (play tool in the session scratchpad, pm-it11/play.js; Tricky seed 1).

## Reproduction (main at e3c8f63)
- Fresh Tricky seed 1. Slip r4c1=6 (6 is a given at r5c3, same box): clash text "Entered: row 4, column 1 is 6. 6 is already in this cell's box, so it breaks the rules. It is not counted."
- Then r7c2=9, a genuine naked single whose row, column and box do not touch the slip: "Entered: row 7, column 2 is 9. Some numbers break the rules, so it is not counted. Click Verify to see which." Counts stay 0. Every later entry gets the same text until the slip is fixed.
- Product view: this blocks the reward for a correctly applied technique and reads as if the new entry were wrong. It hits the strategy aim (reward applying skills) directly.

## Persona round 1 (play + mock-up)
Mock-up: <scratchpad>/pm-it11/mock/mock.md with K0/K1/K3 screenshots (amber outline injected by CSS into the real page; no product code).
- Part 1 options for the after-slip text: S0 today, S1 "digit fits, other numbers break the rules", S2 S1 plus naming the clash, S3 judge and count anyway with a reminder.
- Part 2 clash marker: K0 none, K1 entered cell amber outline, K3 entered cell and the existing cell; duration L1 next value change, L2 until the clash is gone.
- Part 3 ranking: slip recovery, pointing visuals v2, Tricky density, claiming.

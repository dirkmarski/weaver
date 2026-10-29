# Iteration 24: product log (PM)

PM: Claude Opus 5.5 (claude-opus-5-5), session c62cf25c-8b8e-4cda-905a-5ce306a4299f. Run: scoping (deliver the next iteration).
PM scratch: `/tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/c62cf25c-8b8e-4cda-905a-5ce306a4299f/scratchpad/pm-it24/` (briefs, `shots/`, `shots2/`, `shots3/` with facts.md and mapping.txt, `check/` scripts).

## Status
- 2026-10-29: scoping done. main e5028f3, no open issues/PRs at start. New governance since the it23 close: ADR 002 (local run with one command, In force).
- Issues raised, in delivery order: #121 (ADR 002 local run, spec on `issue-121-local-run` 794ebf7), #122 (own reward marks, spec on `issue-122-reward-marks` 774b91c). Next: lead delivers #121, then #122; PM accepts each.

## Direction
- ADR 002 first: it applies to every change. Fresh-clone check of main (`node tools/serve.js`; `/`, `/ui.js`, `/style.css`, `/generation.js` 200): it runs, but the README View section omits the Node version (only under Testing) and nothing guards the rule.
- Feature: backlog item 1, scoped to own pointing/claiming rewards (the longest texts, the persona pain at #108). Hints already mark their cells.

## Evidence (personas a/b/c, real-page screenshots with injected Hint classes)
- R1 (blind, looks A none / B box+unit tint+all badges / C badges only): marks over none 3/3; naked: B first 3/3 (M 5/5/5); hidden: B first 2/3. Flagged 3/3: struck badge over the entered digit looks like a glitch; two tints without a key confuse. Clear on next entry (3/3; a timer is too short).
- R2 (D: one tint, no badge on filled cells, key line vs B): key useful 3/3, "=" twice awkward 3/3; hidden-unit tint preferred 3/3. Claiming shot invalid (assistant injected column 7 for column 6; personas caught it).
- R3 (final design E, 4 forms x 2 sizes, cells verified): marks agree with message 3/3; want it 3/3. M 4.08, L 3.75, C 3.67 (claiming hidden lowest: M 3.33, C 3.0, two amber columns). Key fits the 4-line reserve at 360x740 (64/64), nothing moves (button row 517.7). "lines" jargon 3/3 -> "rows and columns".

## Decisions
- D1: design E (hint mark classes; tint box + line + hidden unit as the Hint does; struck only on empty named cells; key line in the reserve). Same tint rule as the Hint keeps one mark language.
- D2: #121 scenario 2 pins a rule main already meets, so it cannot be red first; its red proof is mutant runs (AC1). Guard lives in the spec (spec-implementation is outside the ratio cap; `tests/` headroom is about 21 lines and #122 needs it).
- D3: #122 acceptance targets set below the R3 spike (M >= 3.75, L >= 3.5, want >= 2/3), as the lessons ask for margin.
- D4: pointing and claiming in one issue: same marks, the key differs by one word.
- Assumption A1: the key text reuses the Hint's "struck grey D = this step rules D out there" for consistency, although personas found the double "=" slightly awkward.

## Concerns
- C1 (open, Dirk): GitHub Pages still not enabled; ADR 002 covers the local run only, so all evidence stays simulated.
- C2: two amber shades (the tint over the board's box shading) were noticed 3/3; it is the Hint's existing look. Backlog.

## Backlog (PM, after it24 scoping)
1. In it24: #121 (ADR 002), #122 (own reward marks).
2. Reward/hint marks follow-ups (it24 R1-R3): one even amber shade over the box shading (3/3); larger struck badge on phones (3/3); show why the entered cell gets its digit (blocking digits, naked "only digit left"; b, c); tell the claim line from the hidden unit apart (c); marks for singles rewards.
3. Shorter box names in all texts (unchanged from it23 item 2).
4. Hidden-form rewards and hint step 3 say why the unit's other cells are out (it23 item 3; layout limit D10).
5. Claiming follow-ups (it23 item 4, unchanged).
6. Explanation follow-ups (it23 item 5, unchanged).
7. Mobile remainder (it23 item 6, unchanged).
8. Pointing/claiming reach (watch; it23 item 7).
9. Slip follow-ups (it23 item 8).
10. Small wording items (it23 item 9).
11. Long-term (it23 item 10).
Watch: a busy port 8000 gives no friendly message (ADR 002 local run).

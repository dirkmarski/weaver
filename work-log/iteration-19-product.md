# Work Log: Iteration 19 (product manager)

- PM: weaver-agents product-manager agent (Claude Opus 5.5, claude-opus-5-5)
- Run type: scope the next iteration (review state, raise issues in priority order)
- Baseline: main 84c7c9d (last product change 5b45f13, #85). Ratio 2119/1328, cap 2124, headroom 5.
- Inputs read: memory/wip/current.md, memory/wiki/{index,backlog,product,process,lessons}.md, memory/README.md, governance/context/*.md (strategy unchanged since 25f6735), work-log/iteration-18-product.md (status + candidate list), work-log/iteration-18.md (close section), index.html, sudoku.js (pointingHint 322-361, hint wiring 1040-1100), style.css (#status/#key/#link lines). governance/LOG.md not read.
- Scratch: $WEAVER_SCRATCHPAD/pm-it19/ (session tmp, not committed). Prior tester scripts reused from the it18 session scratchpad (test-85/lib.js).

## Status check (2026-10-22)
- Fresh start: no open issues or PRs; WIP says it18 closed, it19 scoping not started; no it19 product log existed. 84c7c9d (Dirk) only changed agent definitions (PM: report documents read instead of flagging to the closing lead).

## Direction
- Backlog item 1 (carried PM decision, it18 D2): reveal the pointing explanation steps one at a time. Strategy fit: teaching first; personas ranked it first in it18 (1/3/1) and 3/2/2 in it17. Also the D9 mobile carry-over (seed 1 step 3 below the fold at 360x740).
- Design spike needed before an issue (interaction, control placement, keyboard/touch, link reserve fit, marks per step).

## Evidence
### Spike 1 (assistant; $WEAVER_SCRATCHPAD/pm-it19/spike.js, spike.json/md, shots/; README.md there). Injected mock-ups, Tricky seeds 1 (naked) and 8 (hidden), Hint twice; 360x740, 375x812, 390x664 mobile, 1280x900.
- A today; B Next-step button (0.85rem), cumulative steps, all marks; C = B + staged marks (1: confined; 2: + struck; 3: + rings, hatching, key, link); D Hint advances, one step at a time (replaces), staged marks (3rd/4th click simulated); E = C with the conclusion last.
- Grid/link/button row never move in any variant. B/C button moves 42 px per stage (phones). 360x740 and 375x812: stages 1-2 fit with the button visible; stage 3 = today (360x740 seed 1 miss 17.5). 390x664: button below the fold (D4 short screens, accepted). D never moves.
- Baseline: a 3rd Hint click on main re-shows the same full explanation.
### Persona round 1 (user-a/b/c; brief pm-it19/persona/brief.md; 375x812 seed 1 screens)
- Learning A 3/2/3, C 4/5/5, D 3/3/3, E 5/4/4. Phone ease A 3/2/2, C 4/4/4, D 4/5/5, E 4/4/4.
- Rank: a E>C>D>A; b C>E>D>A; c C>E>D>A. D: miss earlier steps 3/3 (step 3 leans on step 2). Answer first (C) 2/3; a prefers E.
- Staged marks (C) over all at once (B) 3/3; b: step 1's evidence (rings/hatching in the box) belongs to step 1.
- Button: clear but small 3/3; moving button "re-find it" (b, c). Blank link-reserve gap looks broken (a, b; it18 3/3 too). Key cut off at the bottom; jargon (ring, hatched, ruled out); "Click" vs "Tap" (b); Back control (b).
### Spike 2 (assistant; spike2.js, spike2.json, shots2/): F = C with play-button-size Next step (16 px, 6.4/16 px padding) and b's staging (stage 1 adds box hatching + their rings, key with hatched clause, invitation).
- 360x740: button bottom 674.3 (stage 1) / 716.3 (stage 2), visible; 375x812 689.3/731.3. 1280x900 seed 8 stage 2 button 7.4 px below the fold (desktop, page scrolls; today's block already misses 6.6 there).
- Seed 1: all hatching is in the box (stages differ only by badges). Seed 8: box hatching 2 cells at stage 1, + 2 unit cells and 1 ring at stage 3.
### Persona round 2 (P = C staging, Q = F staging; seed 8 375x812; brief pm-it19/persona2/brief.md). user-c's first run failed (could not resolve $WEAVER_SCRATCHPAD: echo denied); re-run with the literal path.
- Stage-1 evidence P/Q: 4/3 (a), 2/5 (b), 4/3 (c). Marks match the step: P 5/3/4, Q 3/4.5/3. Button P 3/2.5/3, Q 4/4/4. Preference P, Q, P.

## Decisions
- D1 Scope it19 = two issues in sequence: (1) step-by-step reveal with a Next step button (design C text, play-button size, answer first, cumulative), Hint also advances (steady thumb target, D's strength); marks unchanged. (2) Marks and key line follow the step, staging P (majority 2/3), key line from stage 1 naming only shown marks (c's gap in P).
- D2 Not D (replace): 3/3 miss earlier steps. Not E (steps first): 2/3 prefer the answer first; a's preference logged.
- D3 Staging Q (b) kept as backlog alternative; #91 acceptance round re-checks the evidence question. If personas then say stage 1 lacks evidence, Q is the follow-up.
- D4 The #85 carry-over (360x740 seed 8 status-bottom assertion) goes into #90 AC11 (it is the next issue touching `#status` layout).
- D5 Not this iteration: blank link reserve (raised again, a, b; more visible during stages 1-2 of #91: candidate next), key cut off/jargon/"Tap" wording, Back control, button moving 42 px (Hint advancing gives a fixed target instead), 390x664.
- D6 #91 AC10 target (avg >= 4, none < 3) matches the spike scores for P (5/3/4 = 4.0); cross-checked against the other ACs (lesson: consistent ACs).

## Issues (priority order; deliver in sequence)
1. #90 Hint: reveal the pointing explanation one step at a time with a Next step button. 12 ACs. https://github.com/dirkmarski/weaver/issues/90
2. #91 Hint: board marks and key line follow the revealed pointing step. 10 ACs. https://github.com/dirkmarski/weaver/issues/91
- Ratio headroom 5 at 5b45f13; both issues add product lines and pay 1.6x.
- Acceptance plan: per issue, real-input page check (CDP touch 360/375, mouse 1280), my own measurements vs the ACs, persona round on real screenshots (#90 AC12, #91 AC10).

## Assumptions / concerns
- A1 Headless Chrome emulation only. A2 Persona prompts must give the literal scratchpad path (user-c could not echo the env var). A3 #91 stage 1 hides rings that exist on the board today; a methodical learner (b) may miss the box evidence: watched at acceptance.

## Candidate list (PM, ordered, after it19 scoping)
1. This iteration: #90, #91.
2. Explanation follow-ups: blank link-line reserve while empty (a, b; it18 3/3; more visible with staging); staging Q alternative (D3); "Tap" vs "Click" on touch; key line cut off on phones / jargon ("ring", "hatched", "ruled out"); shorter naked step 3 ("sees"); conclusion set apart (bold, c); Back/previous step (b); ring tap cue; invitation wording; non-breaking "row N"/"7-9"; rest of backlog item 1 unchanged.
3. Mobile remainder: as in memory/wiki/backlog.md item 2 (the #85 seed 8 status pin moves into #90).
4-6. Pointing reach (watch), slip follow-ups, small wording items, long-term: unchanged from memory/wiki/backlog.md.

## Notes for the lead
- This log is uncommitted on main's working tree; carry it on the #90 branch (one branch line per log file).

# Work Log: Iteration 20 (product manager)

- PM: weaver-agents product-manager agent (Claude Opus 5.5, claude-opus-5-5)
- Run type: scope the next iteration (review state, raise issues in priority order)
- Baseline: main 8ed9eee (last product change a552c1d, #91). Ratio 2187/1371, cap 2193, headroom 6.
- Inputs read: see "Documents read" at the end.
- Scratch: $WEAVER_SCRATCHPAD/pm-it20/ (session tmp, not committed).

## Status check (2026-10-23)
- Fresh start: no open issues or PRs (gh); WIP says it19 closed, it20 scoping not started; no it20 product log existed. Commits after a552c1d are close/memory only.
- Strategy (governance/context/product-strategy.md) unchanged since 25f6735: teach techniques progressively, reward learning over solving.

## Direction
- Pointing explanations have been polished since it12 and now score 4/4/4 (learning, button, marks per step). The strategy asks for progressive new techniques; the next technique (claiming) is the long-term backlog item.
- it20: close the remaining 3/3 explanation pains (cheap, user-raised twice) before pivoting; it21 candidate: claiming (box-line reduction), preceded by a data spike. Decision recorded below once spikes report.

## Evidence
### Spike A (assistant; pm-it20/spikeA/{data.js,var.js,data.txt,variants.txt}): step 2 naming
- Tricky seeds 1-60, walked forward up to 40 hints: 238 pointing explanations (131 naked, 107 hidden). removed = 1/2/3/4/5: naked 67/46/14/4/0, hidden 26/53/22/4/2. Removed cells always share the one line outside the box.
- Naked: the target is always a removed cell (131/131), not always first. Hidden: never (an "including the target" clause would be wrong there).
- Seed 1 (naked, removed r1c5, r1c6) and seed 8 (hidden, removed r4c3, r6c3) start positions confirmed.
- Variants: W1 list all (grows ~18 ch per cell, comma-run at 3+: "row 1, column 1, row 4, column 1 or ..."), W2 count ("struck in N cells"), W3 short positions ("columns 5 and 6", +3 ch per cell). Naked 2-3 phone lines in all; today 2.
### Spike B (assistant; pm-it20/spikeB/{spike.js,results.json,table.txt,shots/}): key line and reserve
- Today: stage-3 key cut off at 360 s1 (99 px), 360 s8 (78), 375 s1 (42); 375 s8 flush (0.2). 1280 cut at stage 2-3 (page scrolls on desktop). Reserve 64 px blank before step 3 at all states.
- V1 (key in reserve while #link empty): fills the gap at stages 1-2 (key 1-2 lines), stage 3 unchanged. V2 (key always in reserve): stage-3 key is exactly 4 lines and fits; the moved invitation is then cut off (360 both, 375 s1). V3 (scroll #key into view after the last step): 360 s1 scrolls 99 px, grid top 19 px off-screen; s8 78 px, 0 off; 375 s1 42 px, 0 off. V4 shorter key saves 1 line, fits only 375 s8. Button row steady in all except V3 (scroll).
- Decision so far: V4 alone does not fix it; V2/V3 are the only fixes. Combined candidates X (V1+V3), Y (V2 + scroll to invitation), Z (V3 only) go to a persona round with step 2 wordings W1/W4 (spike B2).
### Spike B2 (assistant; spikeB/{spike2.js,results2.json,shots2/}): X (V1+V3), Y (key always in the reserve, invitation below the steps, scroll to it), Z (V3)
- Stage 3 after scroll: X/Z 360 s1 scroll 99 px, grid top -19.2; s8 78, +1.8; 375 s1 42. Y 360 s1 83 px, grid -3.2; s8 62, +17.8; 375 s1 10; s8 0 (32 px spare). All end flush with the viewport. Button row page-relative steady in all.
### Persona round 1 (brief pm-it20/persona/brief.md; 375/360 seed 1 shots; W shots seeds 1, 8)
- Layout a/b/c (find key / looks finished / learn): X a 4/4/4, b 3/3/4, c 3/3/3; Y a 3/3/4, b 5/4/4, c 5/4/5; Z a 2/3/3, b 2/3/3, c 2/2/3. Averages Y 4.33/3.67/4.33, X 3.33/3.33/3.67, Z 2.0/2.67/3.0. Ranks a X>Y>Z, b Y>X>Z, c Y>X>Z.
- Y: "the Key sits directly under the board at every stage" (b); invitation at the bottom edge, far from the board (a, b, c: minor). Nudge-state blank gap bothers 3/3 (mild). 360 top-row clip after scroll: matters 0/3.
- Step 2 wording "text matches the struck cells": Today 3/2/3, W1 4/5/4, W4 5/4/5 (W4 4.67). Ranks a W4, b W1, c W4. Complaints on W4: "so not in row 1, column 5" redundant/abrupt (a, b, c); "rows 4 and 6" could read as whole rows (b).
- Other: "Next step (3 of 3)" shown at step 2 reads as finishing (b); "7-"/"9" hyphen break at 360 (b, c); "Techniques applied" heading peeking under Next step (a, b); struck badges tiny (b, known).
### Spike B3 (assistant; spikeB/{spike3.js,results3.json,shots3/}): Y2 + W5 feasibility
- Y2 = key in the reserve whenever a key exists and no link sentence is selected; a selected hatched cell/ring shows its link sentence in the reserve instead; invitation below the steps, scrolled into view (nearest) when it first appears. W5 = step 2 "not in row 1, columns 5 and 6 (struck)." / "not in column 3, rows 4 and 6 (struck)." (no target clause).
- Reserve 64 px in every state (stage-3 key 4 lines at 360/375, 3 at 1280; worst link sentence 4 lines, 360 s1 ring r2c2); button row page-relative steady everywhere.
- W5 adds one status line (21 px): stage-2 `#next` bottom 738.9/740 (360), 753.9/812 (375); 1280 stage 2 below the fold (909 s1, 930 s8; desktop scrolls).
- Stage 3 scroll: 360 s1 104 px, s8 83; 375 s1 31, s8 0; 1280 56/77. "Grid top" is the table incl. caption: PM viewed Y-s1-360-stage3.png, all 9 rows visible, only the caption cut.
- Hidden single (Medium seed 1): key 2 lines in reserve, invitation in view without scroll (697/740, 696/812).

## Decisions
- D1 Scope it20 = two issues, in sequence: (1) step 2 names every struck cell (W5); (2) key line in the reserve under the board, link sentences there while selected, invitation below the steps and scrolled into view (Y2). Both close 3/3 pains raised twice (key cut off; step 2 vs struck marks) and fill the blank reserve during explanations.
- D2 Layout Y over X: Y ranked first 2/3, highest on finding the key (4.33) and learning (4.33); X kept the key moving between stages. Z rejected (2.0 on finding the key). a's X preference logged.
- D3 Wording W5 = W4 (ranked first 2/3, 4.67) minus the "so not in row R, column C" tail (3/3 called it redundant/abrupt) and with the line named first ("row 1, columns 5 and 6") so positions read as cells, not whole columns (b). One rule for both forms: the hidden target is never a removed cell, the naked target is always one and step 3 names it. Refinement not persona-tested: re-checked at #96 acceptance (AC9 persona round).
- D4 Not this iteration: nudge/no-hint blank reserve (3/3 mild; no content to put there yet: next candidate, needs a design spike); non-breaking "7-9" (2/3; touches every box-name message, own small issue next); "Next step (3 of 3)" at step 2 reads as finishing (b); "Techniques applied" heading peeking (a, b); desktop 1280 stage-2 Next step below the fold (desktop scrolls).
- D5 Pivot: after it20 the explanation pains raised 3/3 are closed; it21 starts the next technique (claiming) with a data spike, per the strategy (progressive techniques). Remaining explanation polish drops below it.
- D6 Ratio: headroom 6 at a552c1d; both issues pay 1.6 test lines per product line; removals listed, never AC-required.

## Issues (priority order; deliver in sequence)
1. #96 Hint: pointing step 2 names every struck cell. 9 ACs. https://github.com/dirkmarski/weaver/issues/96
2. #97 Hint: key line under the board, invitation below the steps and scrolled into view. 10 ACs. https://github.com/dirkmarski/weaver/issues/97
- Acceptance plan per issue: re-run the tester's scripts, own real-input check (CDP touch 360x740/375x812, mouse 1280x900; Tricky seeds 1, 8; Medium seed 1 for #97), measurements vs the ACs, persona round on real screenshots (#96 AC9, #97 AC10).
- AC cross-check (lesson: consistent ACs): #96 AC6 fit measured (738.9/740, 1.1 px slack at 360, seeds 1/8 only); #97 AC5 measured in B3 incl. the target cell (row 1) after the scroll; #97 AC10 targets sit at or below the spike Y scores (4.33 key; 3.67 finished, min 3).

## Assumptions / concerns
- A1 Headless Chrome emulation only (no iOS Safari; URL-bar resizing not modelled for the scroll).
- A2 #96 stage-2 fit at 360x740 has 1.1 px slack on seeds 1/8; a 3+ cell step 2 may push the Next step button below the fold on other seeds (not required; watch).
- A3 W5 refinement (no target tail, line first) was not persona-tested in that exact form; #96 AC9 is the check.
- A4 #97 moves the invitation away from the board (a, b, c minor): watched at acceptance.

## Backlog (PM, ordered, after it20 scoping)
1. This iteration: #96, #97.
2. Next technique: claiming (box-line reduction): data spike first (frequency on Tricky/Hard, a level or Hint preference to practise it), then teach-before-reward as with pointing (it8/it9). Planned it21.
3. Explanation follow-ups: blank reserve before an explanation (no hint, nudge; 3/3 mild); non-breaking "7-9" in box names (2/3 at 360); "Next step (3 of 3)" at step 2 reads as finishing (b); "Techniques applied" heading peeking under the steps (a, b); struck badge legibility on phones; Next step prominence (b); "Done" cue (c); target caret glyph (b); "Tap" vs "Click"; jargon; shorter naked step 3; conclusion set apart; Back step; ring tap cue; invitation wording; pin #next alignment/gap; staging Q (lowered).
4. Mobile remainder: as memory/wiki/backlog.md item 2; 1280x900 stage-2 Next step below the fold (now 9/30 px with #96).
5-7. Pointing reach (watch), slip follow-ups, small wording items, long-term (minus claiming, now item 2): unchanged from memory/wiki/backlog.md.

## Notes for the lead
- This log is uncommitted on main's working tree; carry it on the #96 branch (one branch line per log file).
- Spike scripts/screens (session scratchpad, not committed): pm-it20/spikeA, pm-it20/spikeB (README.md: spike.js, spike2.js, spike3.js), persona brief pm-it20/persona/brief.md, issue bodies pm-it20/issues/.

## Documents read (scoping)
- memory/wip/current.md (whole, 17 lines): restart state. memory/README.md (whole): memory tiers. memory/wiki/index.md (whole): what to read by role. memory/wiki/backlog.md (whole, 47): candidates + evidence. memory/wiki/product.md "Hint" and "Known product gaps" (lines 35-65): current behaviour for ACs. memory/wiki/lessons.md "Scoping and spec" (lines 5-17): spec lessons. memory/wiki/process.md (grep for ratio/acceptance lines only): ratio and acceptance rules.
- governance/context/product-strategy.md, test-strategy.md, development-practices.md (whole, 5-6 lines each): strategy check.
- work-log/iteration-19-product.md (whole, 105): last PM decisions and live candidate list (format template). No other work logs; governance/LOG.md not read.
- sudoku.js lines 320-361 (pointingHint), 820-870 (showSteps/clearResults/unlink), 1150-1177 (exports), grep for "removed": spec accuracy. index.html 15-43, style.css 55-80: layout order and reserve. README.md grep for key/link lines: what the README states. tests/page.test.js 15-60: seeding pattern for spike briefs. gh issue #91 body: issue format.
- Spike reports A, B, B2, B3 and persona reports a/b/c (agent replies); screenshots viewed: shots2/X-s1-375-stage2, shots2/Y-s1-375-stage3, shots3/Y-s1-360-stage3.

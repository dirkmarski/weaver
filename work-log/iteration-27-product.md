# Iteration 27: product log (PM)

Session 512d8df6-bdf0-4d6d-9806-20017be40830, 2 November 2026. Status: #139 accepted (PR #141, head e276a2d; code head b95608e).

## Direction
- Requests: none Answered for the PM (001-005 Closed). Raised 006 (production LLM trial, PR #140).
- New governance since the it26 scoping: ADR 002 now says calling local services (such as Ollama) is in line with the ADR. technology-options: Ollama is for experimentation, and a production-grade LLM is available on request. This replaces it26 assumption A1's ADR 002 argument. Acted on with a spike (below).
- Scope: backlog item 1 only (one issue, small increment). C5 (item 2) stays a separate issue because it changes Hint step 3 too.

## Evidence
- LLM spike (`$SCRATCH/pm-it27/spike/llm1.mjs`, `llm2.mjs`, `transcript.txt`): Ollama `qwen2.5:7b-instruct`, grounded prompt (grid plus hint text), 4 questions on Tricky seed 1's pointing hint. Answers took 2-7 s. It declined to name an unhinted digit, which is right. 2 of 4 answers were wrong or muddled. Personas a/b/c: usefulness 3/3/3, trust 2/2/2.5, wait too long. 3/3 chose the deterministic reward item over the Ask box ("confident wrong answers teach false rules").
- Reward wording spike (assistant; `census.json`, `facts.md`, `page.mjs`, `mapping.json`, shots/): 195 unique own hidden-form rewards (Tricky and Hard seeds 1-60; Tough = Tricky per seed). 174 have a reason, 21 none, 0 false. Boxes appear in 50. Longest: Tricky 54 r8c3 and Hard 13 r5c1 (V2 297 chars).
- Layout, longest case: 360x740 goes from 6 to 8 lines, `#status` bottom 736.5 (3.5 px spare; main 694.5). 375x812: 751.6. Typical case: 7 lines.
- Blind personas, 375x812, 3 cases x M/V2/V3 (letters were A = V2, B = V3, C = M in every case, not reshuffled: minor blinding weakness). V2 preferred 9/9. Scores (WHY/LEARN/READ): V2 4.89/4.00/3.00, M 2.67/3.33/4.67, V3 3.33/3.11/2.67. Comments: V3 reads as one list (3/3). Messages are long and push the tally down (3/3). C5 redundancy "the middle‑right box and column 8" is one 8 (b). "pointing"/"claiming" not explained (b).
- Spec check: `pm-verify.mjs` checks all 10 scenarios against main's `creditEntry` plus the V2 rule: all OK. On main, 7 are red and 3 pass (2 naked, plus the no-reason case).

## Decisions
- D1: V2 wording: append ", since <units> already has/have a D" to the hidden-form last sentence, with the unit list reused from `hiddenStep3`. No change when there is no reason.
- D2: The layout is accepted at 3.5 px spare on the 360x740 worst case. Reasoning: it is rare (the longest of 195), the message stays fully on screen, and the tally was already below the fold. AC5 caps it at 737.
- D3: Persona LEARN gate set at main + 0.5 (3.83), not 4.0. The spike gave exactly 4.00, and a gate the spike only just meets is fragile (lesson). WHY is gated at >= 4.0 and +1.0 over main; READ at >= 3.0 (spike 3.00, a guard against getting worse).
- D4: No LLM in the product this iteration. Request 006 asks for a production LLM and how to call it. The default proposal is a local-run-only trial through `tools/serve.js`.

## Assumptions / concerns
- A1: Tough puzzles equal Tricky ones per seed (assistant census). Expected, because Tough is Tricky generation with claiming-first hints. Noted for the curator; product.md does not say it.
- C1: Message length is now the main readability cost (READ 4.67 -> 3.00). Backlog item 3 (density) rises.

## Issues
1. #139 Own pointing/claiming reward, hidden form: say why the unit's other cells are out (order 1, only item).

## Acceptance #139 (PR #141, head e276a2d)
- Decision: accepted. Code head b95608e; e276a2d adds log-only commits.
- Specs: `node --test` on e276a2d: 242/242 pass, 0 skipped; port 8000 free before and after. The PR test summary covers the red run (7 failing on assertion, plus 1 under the no-reason mutant), green run, 5 killed mutants (and 1 equivalent mutant, argued), sizes (tests 1.566x, cap 2529), the 4-case layout table and the oracle (195 census rewards, 0 mismatches). AC 1-6 are met as reported.
- AC 7: blind personas on the tester's real 375x812 shots, 4 cases, branch vs main. The A/B letters were reshuffled per case (this fixes the it27 spike weakness). Mapping: `$SCRATCH/pm-139-accept/mapping.txt`. Scores (WHY/LEARN/READ):
  - a: branch 5.00/4.00/3.00, main 3/3/4.
  - b: branch 4.75/3.75/3.00, main 3/3/4.
  - c: branch 4.75/4.00/3.00, main 3/3/4.
  - Average: branch 4.83/3.92/3.00 vs main 3.00/3.00/4.00.
  - Gates: WHY >= 4.0 and +1.0 (+1.83): pass. LEARN >= 3.83: pass. READ >= 3.0: met exactly.
  - Preference: branch 11 of 12 (b chose main on case 4 because of the redundant reason).
- Claims checked by the PM against the screenshots: t54 (top-left box and rows 2, 4, 6, 7 have a 7), t14 (columns 7 and 8 have a 4) and t8 (r5c8 is both the box's 8 and column 8's 8) all hold. The personas' own checks agree (3/3, none false).
- Persona findings:
  - C5 redundancy on case 4, "the middle-right box and column 8" (one 8): 3/3. Item 2 is confirmed.
  - Length and density push "Techniques applied" down: 3/3.
  - "rows 2, 4, 6 and 7 already have a 7" is hard to parse: a.
  - Row 2 is redundant with the top-left box: b.
- C2: READ is exactly at the gate and drops 1.0 from main. The reason is right, but the length cost is real. Item 3 rises to joint top with item 2.
- C3: at 360x740, 3 of 4 cases reach 8 lines, with `#status` bottom at 736.5 against the 737 gate (0.5 px). Any change that lengthens a message needs a 360x740 check. Backlog note added to item 3.

## Backlog (PM, after #139 acceptance)
1. C5: name one D once when it covers several units (Hint step 3 and own rewards). Found 3/3 at the #139 acceptance; it also shortens messages.
2. Message density: long rewards (READ 4.00 -> 3.00 at #139), the tally below the fold, "rows 2, 4, 6 and 7 ... a 7" parse. Note: 360x740 has 0.5 px left (8 lines on 3 of 4 checked cases); any longer text needs a layout check or a density fix first.
3-10. As in `memory/wiki/backlog.md` items 4-11.
11. LLM "Ask about this hint": waits on request 006. Local 7B trust 2.2/5 (it27).

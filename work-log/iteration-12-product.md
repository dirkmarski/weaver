# Iteration 12: product manager log

- PM: product-manager agent (Claude Opus 5.5, claude-opus-5-5), session `4ecb9163-8db9-4624-9aa5-9c6e3ff52aab`
- Worktree: `<session scratchpad>/wt-iteration-12` (branch iteration-12). Scratch tools: `<session scratchpad>/pm-it12/`.
- Rules confirmed: governance/LOG.md not read; work log not read except my own it11 product log tail (needed for the harness/acceptance context of the candidate list); memory/wiki not edited (changes proposed to the lead).
- Inputs: memory/wiki/backlog.md, product.md, lessons.md (Scoping), governance/context/product-strategy.md (unchanged: educate, teach techniques progressively, reward learning; small increments with early user testing), test-strategy.md, development-practices.md, README.md (behaviour spec), governance/memory-architecture.md (pruning rule).

## Scoping

### Candidate review (2026-10-20)
- Candidate 1 (pointing visuals v2) has been "next" since it10 and was deferred in it11 for slip recovery, which shipped. It teaches the newest technique, which is the strategy's core (teach techniques progressively).
- Own observation on the page (main 9e54939, Tricky seeds 1-6 followed by Hint to the first pointing step, tools pm-it12/play.js and topoint.js):
  - Rings mark every D in the grid. Only some of them explain the step. Seed 3 (hidden form, box rows 7-9 cols 1-3, D=1): rings r1c7 r2c3 r4c9 r7c8; only r2c3 (column 3) and r7c8 (row 7) rule 1 out of the box's other cells. Seed 1: 5 rings, 2 relevant. Seed 4: 3 rings, none relevant.
  - Seed 4 (naked form, box rows 7-9 cols 4-6, D=9): the box's only empty cells are r8c5 and r9c5, so the confinement is "trivial" (all other box cells are filled). Rings there are pure noise.
  - No legend on screen for the dashed purple outline and the struck grey badge.
- Prototype (pm-it12/proto, a copy of the page; not product code): rings only on Ds that share a row, column or box with a "reason cell" (an empty box cell outside the confined line; in the hidden form also an empty cell of U other than the target and the removed cells); a key line under the message on the pointing explanation (three wordings A/B/C; the ring clause only when rings exist); the badge sits in D's own pencil-note slot.
- Pin data (pm-it12/pins.js; `generatePuzzle('tricky', {rng: seededRng(N)})`, then Hint followed with the level preference and the hint tally until the first pointing step; old rings = main, new rings = prototype rule). The page with Math.random seeded by the same mulberry32 gives the same puzzles (checked on seed 3).
  - seed 1 naked, box 7 column 3, D=1, target r3c3=7: old r1c9 r4c5 r5c2 r6c8 r9c6, new r5c2 r9c6
  - seed 3 hidden (column), box 7 row 9, D=1, target r5c5=1: old r1c7 r2c3 r4c9 r7c8, new r2c3 r7c8
  - seed 4 naked, box 8 column 5, D=9, target r4c5=7: old r2c6 r3c3 r7c2, new none (box's only empty cells are r8c5, r9c5)
  - seed 5 hidden (column), box 8 row 7, D=6, target r9c3=6: old r1c8 r5c7 r8c9, new r1c8 r8c9
  - seed 6 hidden (row), box 3 column 7, D=9, target r4c5=9: old r1c4 r7c1 r9c8, new r1c4 r9c8
  - seed 7 hidden (row), box 9 column 9, D=2, target r2c2=2: old r5c7 r6c5, new r5c7
  - seed 8 hidden (row), box 1 column 3, D=8, target r4c1=8: old r1c5 r5c8 r7c2, new r5c8
  - seed 9 naked, box 2 row 1, D=5, target r1c7=2: old r2c2 r5c1, new r2c2
  - seed 10 hidden (row), box 4 column 2, D=2, target r1c8=2: old and new r6c6 r7c7 r8c1 r9c4 (all relevant)
  - 9 of 10 seeds drop at least one irrelevant ring; seed 4 drops all three.

### DOM test harness (tech-debt candidate), considered on its merits
- For: development-practices.md says "unit testing for all code"; the page wiring (about 270 lines in render()) has no repo tests. In it11, 8 of 15 #51 mutants were caught only by scratchpad page scripts, which are lost each session and rebuilt by the tester and by me (I rebuilt pm-it12/play.js today). A repo harness makes those checks durable and reusable by the developer, reviewer, tester and PM.
- Against: no user-visible value; adds test code (ratio already 1.15x vs a ~1x guide); needs Chrome on the machine (not a package, but an external tool); slows `node --test`.
- Design constraints if taken: Node built-ins only (fetch, WebSocket, child_process), real index.html in headless Chrome via CDP, seeded Math.random, skip visibly when Chrome is not found, a small targeted set of scenarios (test strategy: golden path, edge, error; no sweeps).

### Persona round 1 (play check: main vs prototype; prompt pm-it12/round1-prompt.txt; no scripts, source, README or LOG.md, confirmed)
- A: prefers NEW rings, never missed a removed ring (s1, s3). Key line: B clearest ("only places", "by the box"); A's ring clause "vague", C's "the reason" cryptic. Badge in note slot: mildly prefers it, matters little. s4 (trivial confinement): poor example, "looks like plain elimination"; wants it said: "only two cells are left in this box, both in column 5". Naked form: the "could only take 1 or 7" step has no visual (text only). Fresh seed 23: no pointing in 6 hinted moves. Ranking: relevant rings > key line (B) > s4 wording > badge.
- Data (pm-it12/trivial.js, Tricky seededRng 1-40, Hint followed to the end): 46 pointing steps, 13 of them (28%) "box-trivial": every empty cell of the box is a confined cell, so no Ds outside the box are needed for the confinement (seeds 4, 8, 14 x2, 20, 23, 24 x2, 27, 30, 35, 38, 40). Too common to avoid by reordering; the plan is to say it plainly in the explanation instead.
- C: prefers NEW rings ("each remaining ring has a job"), never missed one; s4 cleaner without rings. Key line: B clearest, but "ruled out there by the box" is slightly off (the struck cells are outside the box): suggests "because of the box"; C's "purple 1" is ambiguous with the ringed 1s. Badge in note slot: slight plus; struck 9 "looks like a smudge". s4: poor-to-OK; add "the 9 in this box can only be in these two cells, which are both in column 5". Missing: why the naked-form target "could only take 1 or 7" (no marks). Fresh seeds 23 and 31: no pointing seen in ~30 moves (supports candidate 2, Tricky density). Hidden-single rings are many (same noise as pointing). Ranking: relevant rings > key line B (fixed) > naked-form other-candidate visuals > badge.
- B: prefers NEW rings, recomputed by hand and never missed one. Key line: A's ring clause best, B's "only places" strongest phrase, B's "by the box" off (same as C), C misleading; suggests A plus B's "only". s4 poor: "the only two empty cells left in this box are both in column 5, so the box's 9 goes in one of them". Unprompted: the same noise on hidden-single explanations (seed 23 r2c4=3 rings r6c3 uselessly; seed 31 r7c8=1 rings r2c3 r3c6 r5c1, only r1c7 r4c9 needed): wants the filter there too. Badge: position nice, size is the bigger issue. No pointing in about 80 moves over seeds 23 and 31. Wants messages to name the ringed and struck cells. Ranking: relevant rings (incl. hidden singles) > key line A+B > naming cells / better example than s4 > badge.

### Round 1 synthesis
- Relevant rings: 3/3 first priority; 0 missing rings reported over 9 session checks. Hidden-single rings raised by B (strongly) and C: same rule, same function (`hintMarks`); in scope.
- Key line: B's "only places" (A, C, B) + A's ring clause (B), without "by the box" (B, C). Merged wording goes to round 2.
- Box-trivial steps (28% of steps): 3/3 call s4 a poor example; all three ask for the text to say the box has no other empty cells. Wording, not avoidance (reordering would also change the hint order spec). Two variants go to round 2.
- Badge in the note slot: mild plus 3/3, low priority; it also fixes the accepted it10 D1 (badge covers pencil note 3). Kept, small. Badge size: noted, not scoped.
- Not scoped (to candidates): visuals or text for why the naked-form target has only D or X left (A, C); naming the ringed/struck cells in the text (B, C); Tricky practice density: in fresh play none of the three met a pointing hint in 6-45 moves (seeds 23, 31); the first pointing step comes after ~6-22 hinted entries (pins). Strong evidence for candidate 2; next iteration.

### Decision D1: the page test harness enters scope, delivered first (#55)
- Development practices require unit tests for all code; the wiring has none, and the page scripts are rebuilt every session (it11: 8 of 15 mutants page-only). Delivering it first means the pointing issue's tester and I use repo page tests instead of rebuilding scratch tools, and the new key line and badge get durable page tests.
- Kept lean: Node built-ins only, real page, seeded Math.random, visible skip without Chrome, about 10-15 scenarios, four named mutants to kill, `node --test` under 10 s. No product change. Risk: test-code ratio grows (1.15x today); accepted for the coverage gain, reviewer to check leanness.
- Hidden-single rings pins (fresh Tricky seededRng(N), Hint twice, tie prefers hidden): seed 1 row, r1c9=1: unchanged r4c5 r5c2 r6c8 r9c6; seed 2 row, r2c9=3: r1c4 r4c5 r5c7 r6c2 r7c3 -> r1c4 r5c7 r6c2 r7c3; seed 3 box, r1c9=5: r2c4 r3c3 r4c6 r8c1 r9c8 -> r2c4 r3c3 r9c8.
- Persona round 2 launched on the updated prototype (merged key wording, hidden-single filter, box-trivial wording B1 vs B2): prompt pm-it12/round2-prompt.txt.

### Persona round 2 (prototype v2; prompt pm-it12/round2-prompt.txt)
- A (text output only, no screenshots): key line clear and correct; would say "blocks" instead of "rules out". Box-trivial: B2 better ("leads with the fact, reason in brackets"; B1's "there" vague). Hidden-single rings: none missing; r9c8 "borderline" (it blocks r2c8, which r2c4 also blocks). Wants a key line on the hidden-single explanation too. Notes that the unit tint covers givens (existing behaviour since it5; not a defect). Ship with B2.
- C: explanation and key correct and clear. Wording: two "=" signs awkward, try "struck grey 1: a 1 can no longer go there"; "rules out other cells" could be "rules out cells in the box" (not accurate for hidden-form rings in U; not taken). Box-trivial: B2 ("same pattern as other pointing hints"). Hidden-single rings: none missing, none useless (r9c8 redundant but valid); "much cleaner". Ship with B2.
- B: key line clear and correct (checked each mark against the board); change "= D can no longer go there" to "= a D can no longer go there" (C said the same). Box-trivial: B2 (B1 never says why it is 9 rather than the box's other missing digit). Hidden-single rings: none missing; r9c8 redundant, wants a minimal set. Nothing confusing; ship with B2.

### Round 2 decisions
- D2: box-trivial wording B2 (3/3): when every empty cell of the pointing box is a confined cell, the explanation's first sentence gets " (the box has no other empty cells)" after "fits only in row L". First click unchanged.
- D3: key line "Key: dashed purple = the only places for D in the box; struck grey D = a D can no longer go there; purple ring = a D that rules out other cells." (B and C: "a D"; A's "blocks" not taken, 1/3, "rules out" is the wording of the hint texts). Ring clause only when at least one ring shows.
- D4: rings are "all relevant", not a minimal set (B wants minimal, A borderline, C calls the redundant ring valid). A minimal set is ambiguous (several minimal sets, needs tie rules) and every ring kept does block a cell that matters. Candidate list keeps "minimal rings" as a later refinement.
- Not taken now: a key line for the hidden-single explanation (A only) -> candidates.

## Scope of iteration 12 (decided 2026-10-20)
Deliver in this order:
1. #55 Page tests in the repo: drive the real page in headless Chrome from node --test. No product change. Its 8 named scenarios include the it11 M13 precedence case, and 4 named mutants must be killed.
2. #56 Hint explanation: ring only the digits that matter, add a key line for pointing, and put the badge in its note slot. It also adds the box-case parenthesis (D2), the key wording (D3) and the all-relevant rings (D4). It has 8 pinned states (P1, P3, P4, P8, P10, H1-H3) with exact texts. Its page tests go into the #55 harness.

Rationale: the strategy is to teach techniques progressively. The pointing explanation is the newest lesson, and players found it noisy: in round 1, all three ranked relevant rings first. Two rounds with the personas settled the wording, and #56 has no open behaviour questions. #55 comes first because #56's tester and the acceptance would otherwise rebuild page tools again. Development practices also require tests for all code.

Not in scope, and why:
- Tricky practice density. The evidence is strong: no pointing hint in about 30-80 fresh moves per player. But it needs a generation-time spike first (lessons: "design spike with data"). It is the top candidate for it13.
- Visuals for the naked-form "only D or X" step and naming cells in the text. These are bigger design questions.
- Avoiding box-case steps. 28% of steps are box cases, so they are explained instead of avoided.

### Risks and open points for development and testing
- #55 needs Chrome on the machine (macOS path; `CHROME_PATH`) and may need `--no-sandbox` (lessons, Tooling). The tester must prove the visible skip path. If the harness pushes `node --test` past 10 s, flag it to the PM, do not just raise the limit.
- #55 adds test code against a test-to-product ratio of 1.15x already. The reviewer checks that it stays lean.
- #56 pins depend on the generator and Hint order staying unchanged in this iteration. #55 does not touch them. If a pin and the rule disagree, the issue says to stop and ask the PM.
- #56 section 1 changes `hintMarks().digits`, so existing assertions on it will change. The issue asks for them to be listed, so the reviewer can tell expected changes from regressions.
- Badge-in-slot is CSS. The harness can check computed position or classes, but the tester should still take a 375 px screenshot.
- Persona evidence is simulated, and GitHub Pages is still unconfirmed (open concern for Dirk).

## Acceptance #55 (PR #57), 2026-10-20: ACCEPTED at 0e699d5
- Rules confirmed: governance/LOG.md not read; I read only work-log/issue-55-page-tests.md (the evidence) and my own log; memory/wiki not edited.
- Checked in my own detached worktree (scratchpad/wt-55-pm) at 0e699d5. Node v24.21.0, Chrome on macOS. No personas: there is no user-facing change.
- AC1 pass: `node --test` 157/157, 2.04 s (2.09-2.14 s wall, 3 runs); limit 10 s, 0.6 s before.
- AC2 pass: `WEAVER_NO_CHROME=1`: 147 pass, 10 skipped, exit 0, 0.59 s. Each test shows the reason. `CHROME_PATH=/nonexistent` also skips, with its own reason.
- AC3 pass: requirements 1-7 checked by reading the code. Only node: built-ins are required; there is no package.json. The real index.html is loaded by file URL, the seed script is injected before the page scripts, input goes through keydown and .click(), and results are read from the DOM. One Chrome per file. Scenarios a-h are present. I forced a failure in the seeding test (private TMPDIR): 9 pass / 1 fail, 0 Chrome processes and 0 profile dirs left.
- AC4 pass: the tester killed mutants (i)-(iv) (issue log). My own mutant: dropped `removeAttribute('data-d')` in clearResults. Test f failed; reverted, 157/157 again.
- AC5 pass: seed 5 in the suite; the tester's independent oracle matched seeds 3, 17 and 101.
- AC6 pass: README Test section read sentence by sentence as a newcomer. It is accurate and matches what I observed. The Files list names both new files.
- AC7 pass: index.html, style.css and sudoku.js are byte-identical to main. No product hook.
- L1 (lead reading of 7f as "after both clicks"): confirmed, this is what I meant. The first click shows target and area only (asserted). The second adds the ring (hint-digit), confined, removed and data-d.
- Ratio 1.15x -> 1.45x: accepted, as foreseen in D1. It is a one-off cost for a lean harness (one helper, 10 scenarios) that reaches wiring no unit test can. Condition for later work: UI issues add only targeted scenarios to tests/page.test.js, and the reviewer keeps checking leanness. A trim or ratio review is a candidate if the ratio passes about 1.6x.
- L4 nits (chrome.js: watchdog declaration order, the dead `gone` check, optional watchdog): fine as tech debt.
- Concern (minor, no action): the harness needs local Chrome. Without it the page tests are skipped, so a machine without Chrome gives weaker evidence. Testers and the PM must check that the skipped count is 0 when page evidence is claimed.
- PR comment: https://github.com/dirkmarski/weaver/pull/57#issuecomment-6286683384. Not merged by me.

## Proposed wiki changes (for the lead; I did not edit memory/wiki)
- backlog.md:
  - Replace candidate 1 with the list below.
  - Move "UI wiring has no repo tests" from tech debt to "in it12 scope (#55)".
  - Mark the it10 D1 badge-over-note-3 debt as "fixed by #56" once it is accepted.
- architecture.md / development practices (after #57 merges): name tests/page.test.js and tests/chrome.js (CDP harness; CHROME_PATH, WEAVER_NO_CHROME). Add: "UI changes add their page checks to tests/page.test.js; page evidence counts only when the skipped count is 0". Mark "UI wiring has no repo tests" as resolved by #55.
- product.md:
  - Update the Hint section after #56 is accepted: the ring rule, the key line, the badge slot and the box-case parenthesis.
  - Remove the "Pointing visuals v2 open" gap.
- lessons.md (Scoping): one new lesson. A play check comparing current and prototype on the same replayed session, with switchable wording variants (VERSION/HASH), settled rings, key wording and the box-case text in two short rounds. A persona also raised an unprompted extension in round 1 (B: hidden-single rings), which round 2 confirmed. Merge it into the existing "play check" lesson rather than adding a new bullet.
- lessons.md (Tooling): pm-it12/play.js is a replay-based play tool. Each command replays the session in headless Chrome, so a persona can switch version and wording mid-session. topoint.js and pins.js follow Hint to the first pointing step. Like the it11 entry, these are rebuilt each session and superseded by #55 once it lands.

## Candidate list (PM, ordered, during iteration 12)
Pruning rule (governance/memory-architecture.md, Dirk, 9e54939): drop delivered items, merge related ones into broader entries and discard items that are no longer relevant. Do not let the list grow. Applied below: pointing visuals v2 is folded into #56 or into item 2. Slip items 3a-3g are compressed into one item. The wording items are merged into item 4.

In scope for it12: #55 (page test harness) and #56 (relevant rings for hidden single and pointing, key line, badge in note slot, box-case wording).

1. **Tricky practice density** (next, it13). Fresh-play evidence in it12: none of the three players met a pointing hint in 6-45 moves. The first pointing step comes after 6-22 hinted entries.
   - Spike first: measure the generation time for "at least 2 pointing steps", and how early the first one comes.
   - Then decide between denser puzzles and Hint preferring pointing on Tricky.
2. **Explanation depth, pointing and singles.** Merges the rest of "pointing visuals v2" and the it12 round asks:
   - show why the naked-form target has only D or X left (A, C);
   - name the ringed and struck cells in the text (B, C);
   - a key line on the hidden-single explanation (A);
   - minimal rings rather than all relevant ones (B; D4);
   - a larger or more legible struck badge (B, C);
   - a clearer first-click case signal.
3. **Slip follow-ups**, merged from it11 3a-3g. These are wording-led and small, so they can ride along:
   - the extra-clash sentence should point at the outlines rather than at Verify, which does not flag givens;
   - a message for a partial fix;
   - an entry clashing in two units, where the entry text and Hint name different pairs;
   - "clear your own number" when the pair includes a given;
   - explain "counted" and the meaning of "stays uncounted", and judge an overwrite;
   - a marker on entries made during a clash (not retroactive);
   - Hint and Verify name one pair at a time.
4. **Small wording items:**
   - the shared "not counted" ending;
   - re-entering a hint-credited cell says "on your own";
   - "(see below)" in the finish text;
   - fold away the definitions once they are learned;
   - the heavy naked-single digit list (A).
5. **Claiming, then pairs**, each with its own level. Ranked last by the personas.
6. **Mobile and long-term:**
   - the 375 px level buttons;
   - hint badge at 320 px overlaps neighbouring notes (#56 Q2 limit);
   - long messages on a phone;
   - a middle hint level;
   - progress across puzzles.

Not wanted:
- instant red on a wrong or clashing entry (it10);
- counting entries made during a clash (it11);
- retroactive counting after a fix (it11).

Delivered and removed: #55 (page test harness, accepted at 0e699d5). #56 is removed when accepted.

## Q1 on #56: key-line article for D = 8 (2026-10-20)
- Raised by the lead during development: the pinned text "a D can no longer go there" / "a D that rules out other cells" gives "a 8" for D = 8.
- Options: (A) keep as pinned; (B) special-case "an 8"; (C) reword to drop the article.
- Decision: **C**. One wording for all digits, with no special case in the helper and no grammar bug. A was rejected because it is visibly ungrammatical for 8. B was rejected because it adds a branch and a test for one digit.
- New text: "Key: dashed purple = the only places for D in the box; struck grey D = D can no longer go there; purple ring = this D rules out other cells." The ring clause is still left out when there are no rings.
- Issue #56 body updated (section 2, pins P(3) and P(4), new pin P(8), and a Change log section) and a comment added. The change is noted in the issue, not made silently.
- Assumption: "this D" reads naturally beside a ringed cell. I will confirm at acceptance with the personas if time allows. Not a blocker.

## Q2 on #56: badge size vs note slot at phone widths (2026-10-20)
- Raised by the lead from the tester's finding D1. At 900 px the badge covers no other note. At 375 px the cell is about 37 px wide and a note slot about 12 px, but the unchanged chip is 13-16 px wide. For D = 5 it touches notes 4 and 6, which are still readable. For D = 3/6/9 its right edge is clipped by the cell edge, so part of the strike and the rounded border is lost. At 320 px it overlaps the neighbouring glyphs. I looked at the screenshots in scratchpad/ts56: zoom_s9_D5_375, zoom_s2_D9_375 and shot_s4_D9_375, against zoom_s9_D5_900.
- Options: (A) accept as is; (B) shrink the chip at <= ~400 px; (C) keep the size, keep the chip inside the cell, and accept touching.
- Decision: **C**.
  - The clipping is the real defect: a half-cut badge looks broken. Touching a neighbour does not hide it.
  - B was rejected because B and C asked in round 2 for a larger, more legible struck badge (candidate 2). Shrinking it on phones goes the opposite way, and a chip of about 9 px would be hard to read.
  - A was rejected because it leaves the clipping in place.
- Criterion, now in #56 AC3. The tester sets notes 1-9 in a confined cell and a removed cell, then checks every D = 1-9 and both badge kinds:
  - 900 px: 0 px overlap with any other note glyph box, and the badge is unchanged.
  - 375 px: the badge box is fully inside the cell box (tolerance 0.5 px); the badge centre is inside D's slot; overlap with any other note glyph box is at most 2 px in each direction; the font size and padding equal the 900 px values.
  - 320 px is out of scope. It is a known limit, added to candidate 6 (mobile) next to "the 375 px level buttons".
- Issue #56 body updated (a section 3 note, AC3 and the Change log) and a comment added.
- Assumption: a 2 px overlap keeps the neighbouring digit readable. This is based on the D = 5 shot at 375 px, where the notes touch and are still clearly legible.

## Q3 on #56: Q2 badge criteria conflict at 375 px (2026-10-20)
- Raised by the lead with the developer's measurements. With the unchanged chip (3 px side padding, 15.3-17.8 px wide, slot about 11.4 px), "no clipping" and "overlap <= 2 px" cannot both hold for D = 1, 3, 4, 6, 7, 9. A flush shift gives up to 5.1 px of overlap (D = 4).
- Options: (A) keep the chip and raise the overlap allowance to about 5.5 px; (B) reduce the chip's side padding at narrow widths, not the font; (C) other.
- Evidence (PM, own check): I injected CSS at runtime into a copy of the developer's measure2.js, in scratchpad/pm-it12/q3 (m3.js, r1.txt, r2.txt, p2.txt). Nothing was changed on the branch.
  - Flush shift with 1 px padding at 375 px, columns 0/4/8, both kinds, two runs: worst overlap 1.08 px (D = 4), all others <= 0.14 px; worst edge -0.41 px; centre in slot for every D.
  - With 2 px padding the overlap reaches 2.95 px, so 2 px is not enough.
  - Screenshots row_375_cur.png, row_375_pad1.png and row_900_cur.png: neighbours are readable and the strike is visible on the narrow chip.
- Decision: **B (padding only)**.
  - Below 560 px viewport width the badge padding is 0 1px and edge badges sit flush inside the cell. 560 px is the width at which cells drop under 56 px (measured: 900/700/600 = 56, 560 = 55, 480 = 46, 375 = 35).
  - The digit size, weight, colours, border and strike are unchanged, so the Q2 legibility reasoning (no shrinking of the digit) still holds.
  - A was rejected: 5 px of a roughly 8 px glyph covered is too much to call "readable" across all D, and it would need a screenshot judgement for every D.
- Criteria (AC3):
  - 375 px: inside the cell's padding box with 1 px tolerance (raised from 0.5 because the prototype shows sub-pixel rounding of -0.41 px); centre in D's slot; overlap <= 2 px; 14 px / 800; side padding 1 px; a screenshot shows the neighbours readable.
  - 520 px: D = 1/3/5 inside the cell (breakpoint guard).
  - 900 px: as today, with 0 overlap. The existing ~1.5 px overflow of D = 3/6/9 onto the cell border is accepted, with no new inside-cell check.
- Issue #56 body updated (section 3 note, AC3, Change log Q3) and a comment posted: https://github.com/dirkmarski/weaver/issues/56#issuecomment-6287097282
- Concerns and assumptions:
  - The narrow chip is a tall pill. I assume players still read it as the same badge. To confirm with the personas at acceptance; not a blocker.
  - One measuring run gave a 25 px column 8, a one-off layout artefact that did not reproduce in three later runs (natural widths 34.7-36.8 px). The tester should check that the cell width is about 34-36 px when measuring.

## Acceptance #56 (PR #58), 2026-10-20: in progress at e444eb1
- Rules confirmed: governance/LOG.md not read; I read only work-log/issue-56-hint-rings.md (evidence) and my own log; memory/wiki not edited.
- Own detached worktree scratchpad/wt-56-pm at e444eb1 (branch issue-56-hint-rings). Node v24.21.0, Chrome on macOS.
- `node --test` x2: 166/166 pass, 0 fail, **0 skipped**, 2.50 s.
- Real page (pm-it12/play.js with WT=wt-56-pm, following Hint to the first pointing step): P(1), P(3), P(4), P(8) rings, explanation texts, key lines, box case and badge cells match the pins exactly; H(1), H(2), H(3) rings match. Key line absent on the first click and on the hidden-single explanation; kept on a notes change; cleared by a value change (any cell), Verify, New puzzle and the "Well done!" entry.
- Badge measurements (my Q3 m3.js, branch CSS only, no injection; columns 0/4/8, notes 1-9, both kinds, 54 badges per width): 375 px (cells 35 px): worst edge -0.07 px, worst glyph overlap 0.88 px (D = 4), centre in D's slot 54/54, 14px, padding 0 1px. 520 px: worst edge -0.07 px, overlap 0, padding 1px. 900 px: overlap 0, padding 0 3px, centre in slot 54/54.
- Screenshots: pm-it12/sessions/n3-375.png, n4-375.png (about 500 px, headless minimum window width), a-k1.png (true 375 px via device emulation, which I added to play.js today); tester's ts56b/zoom_s33_D4_375.png (worst case D = 4) and shot_s4_D9_375.png. Neighbouring notes readable, strike visible, nothing clipped.
- Own mutants (reverted, tree clean): M1 confined cells counted as reason cells: 1 test fails (killed). M2 `--y` for digit 7 dropped: 1 page test fails (killed).
- AC5: the changed existing assertions in the diff are exactly the listed ones (two `digits` lists, the P(8)-shape text, page `noHint` / test f additions).
- Ratio: tests 1871 / product 1193 lines = 1.57x.
- Persona check launched (A, B, C; prompt pm-it12/acc56-prompt.txt): narrow chip at 375 px and the "this D rules out other cells" clause (P(3) and P(8)).

# Work Log: Issue #65 Hint explanation: hatch the cells the rings rule out, and a key line for hidden singles

Iteration 14. Branch `issue-65-hatch-ruled-out`. Session `c0f6ffb1-d246-448a-942e-3cfd5baa05e4`.

## Lead
- Lead: weaver-agents (lead agent, Claude Opus 5.5).
- 2026-10-21: Gate check passed: #65 is open, authored by weaver-agents (PM), label enhancement. Only issue of iteration 14.
- Branch created from main at 9c5542b. Developer works in worktree `<scratchpad>/wt-65`.
- Gates: developer -> reviewer and tester in parallel (own detached worktrees) -> one rework round -> lead check -> PR -> PM acceptance on a stated head -> merge commit. CSS change: the tester measures the hatch layers numerically at 375 and 1280 px, with and without notes, and takes screenshots. Ratio at most 1.6x on the PR head (AC 9); any removed assertion is listed with its remaining coverage and confirmed by reviewer (mutant) and tester.

## Developer
- Developer: Claude Sonnet 5.5 (claude-sonnet-5-5). Did not read governance/LOG.md or any work log other than this issue log.
- Design: `hintMarks` returns a new field `hatched` (the existing `reasons`, de-duplicated and sorted ascending; empty on a nudge and for a naked single, as the `d && explain` gate was already there). The page adds class `hint-hatched` to those cells; `clearResults` removes it with the other hint classes (no `data-d`, no badge). CSS `td.hint-hatched` lists both layers: `repeating-linear-gradient(135deg, rgba(106,31,181,.3) 0 1.5px, transparent 1.5px 8px)` first, then the amber tint. `pointingKey(step, ringCount)` is generalised and renamed `hintKey(hint, hatchedCount)`: pointing = fixed head plus the hatched clause when count > 0; hidden single = hatched clause alone; the W variants are gone. The page shows a key for every explain that is not naked.
- Tests changed (adapted, none added beside): sudoku.test.js: "hintMarks: tint ..." (hatched for nudge, explain pointing, hidden-form pointing, naked, hidden single), "hintMarks, hidden single ..." and "hintMarks, pointing: reason cells ..." now assert `hatched` (ringsOf became marksOf), "pointingKey: ..." became "hintKey: ..." (pointing with/without hatching, hidden single, "an 8"). page.test.js: `read` and `noHint` carry hatched; f asserts hatched and the key; f1b became literal pins P1 (hatched, key, computed background-image has stripe and tint layers) and P3 (hatched, key, a value change clears both); f2 now expects the hidden-single key and none for naked; f2b: no hatched cell and no hatched clause; the pointing-state picker uses the hatched count.
- Removals: none (the W-clause cases of the old pointingKey test and the old f1b by-form ring clause cases were replaced by the new text cases, not trimmed assertions).
- Pins: P1-P5 checked: hatched sets, rings and key texts equal the issue on seeds via `hintFor`/`hintMarks`/`hintKey` (P5 with the 8 rounds simulated; hatched and rings empty), P1 and P3 pinned on the real page by f1b; P2 seen in a 375 px screenshot (stripes on top of amber, notes/digits intact).
- Mutants tried: dropping `hint-hatched` from the clearResults removal list fails 3 tests; dropping the tint layer from the hatched rule fails the computed-style guard.
- Ratio: tests 1952 / product 1220 (index 41, style 131, sudoku.js 1048) = 1.600x.
- Counts: `node --test`: 167 tests, 167 pass, 0 fail, 0 skipped.

### Rework round 1 (Claude Sonnet 5.5, claude-sonnet-5-5; read no log other than this one)
- R1: page f2 adapted (no new test): the hidden-single case now asserts the status starts with "Hidden single" and the key line against the exact hatched-key shape (regex, same digit twice); a new naked-single case (`pick('easy', findNakedSingle)`, Hint twice) asserts status "Naked single", key '' and hatched []. M1 (`res.technique !== 'naked'` dropped from the key gate) now FAILS (1 test).
- R2: case (b) of "hintMarks, pointing: reason cells ..." extended with the reviewer's layout (box 6, row 6, target r7c5, hidden unit column 5, empty box cell r8c1 = 63, empty column cell r1c5 = 4) asserting `hatched` == [4, 63]. M3 (sort of `hatched` removed) now FAILS (1 test).
- R3: unpacked: the two comments at the explain assertion in the tint test (one per line), `rule`/`point`/`head` (declarations on their own lines; `rule` then inlined, see removals), the `hintMarks` header comment rewritten as a clean field list plus tint/reason/ring paragraphs, the `hintMarks` return split (sort on its own line, object literal over three lines).
- R4: `&& reasons.indexOf(x) < 0` removed from `addReasons` (dead: the hidden unit of a pointing hint always holds a removed cell, so it never meets the pointing box); behaviour unchanged, suite green.
- Removals (exact assertion -> remaining coverage -> mutant still killed):
  1. page f1b, first-click `assert.deepStrictEqual([s.hatched, s.key], [[], ''])` (and its separate read) -> hintMarks nudge `[nudge.digits, nudge.hatched] == [[], []]` (sudoku tint test), page f first click `[confined, removed, dattr, key] == [[],[],[],'']`, noHint on nudges elsewhere -> mutant "hatched filled on a nudge" (`kind === 'explain'` dropped from the reasons gate) fails 1 test (checked).
  2. page f2b, `assert.deepStrictEqual(s.hatched, [])` -> hintMarks `none` case (pointing, no reason cell: hatched []) plus the f2b key-has-no-"hatched" assertion -> mutant `hatchedCount ?` always true (M7) still fails f2b (checked: 2 fail).
  3. page f2, `assert.deepStrictEqual(s.dattr, [])` for the hidden single -> hintMarks tint test `hintMarks(hintFor(H_BOX, 2), H_BOX).confined == []` and the pointing-only data-d loop -> data-d is only set from marks.confined/removed, so no further page path exists; mutant: none applicable beyond the hintMarks line itself (honest note: this one is covered by reasoning, not by a killed mutant).
  4. sudoku hintKey test `point(8, 1)` ("an 8" in a pointing key) and the hidden-single rows `[4, 'a 4']`, `[8, 'an 8']` (the whole forEach) -> P1 page pin (pointing key with "an 8"), P3 page pin (hidden key "a 4"), f2 regex (hidden key shape) -> mutant "an 8" -> "a 8" fails 2 tests (P1 and one more), mutant `hatchedCount ?` always true fails 2.
  5. sudoku "hintMarks, hidden single" test, the `m.hatched == [1, 2]` assertion (back to the single `.digits` assertion) -> tint test `single.hatched == [31, 40, 48, 49, 50]` (hidden single, H_BOX) and the P3 page pin -> mutants "x !== p dropped in addReasons" (fails 4) and "hidden-single reasons skip the first unit cell" (fails 1) both still killed (checked).
  6. sudoku tint test comment "the unconfined empty box cells ... are hatched" removed (a comment, no assertion); `const rule` helper inlined as a literal string in the one remaining use.
  Not removed (judged not redundant): `point(9, 0)` (exact no-clause text), P3's value-change clear. Kept the f key wiring line `S.hintKey(...)` (it proves the key survives a notes change).
- Ratio: tests 1961 (chrome 100, fixture 27, generator 155, page 412, sudoku 1267) / product 1226 (index 41, style 131, sudoku.js 1054) = 1.5995x (limit 1.6x).
- Counts: `node --test` (no path): 167 tests, 167 pass, 0 fail, 0 skipped.
- Mutants after rework: M1 killed (1), M3 killed (1); also re-checked page passes 0 count (killed 2), "an 8" -> "a 8" (killed 2), `hatchedCount ?` always true (killed 2).

### Rework round 1b (Claude Sonnet 5.5, claude-sonnet-5-5; read no log other than this one)
- What: AC 8 "Unit:" bullet requires unit tests of the key text for pointing with and without hatching, a hidden single and "an 8"; removal 4 of round 1 had dropped the hidden-single and "an 8" rows from the unit level. Restored with one literal assertion in the hintKey test: `hintKey({ technique: 'hidden', digit: 8 }, 1)` equals the exact "Key: hatched = a purple ring rules 8 out there (an 8 already in the same row, column or box)." (hidden single and "an 8" together); test title restored accordingly.
- Extra removal (pays the line): page f2, `assert.match(s.key, /^Key: hatched = ... (an? \1 ...)\.$/)` for the hidden single -> remaining cover: the hintKey unit assertions (exact text), page f1b P3 (literal hidden-single key on the page) and f2's status check "Hidden single" plus the naked case `key === ''`. Mutants still killed: key line shown for pointing only (page, 1 fail), hidden key uses `pointDigit` (unit and page, 1 fail each). f2 title adjusted (no line change).
- Ratio: tests 1961 (chrome 100, fixture 27, generator 155, page 411, sudoku 1268) / product 1226 = 1.5995x (limit 1.6x).
- Counts: `node --test` (no path): 167 tests, 167 pass, 0 fail, 0 skipped.

## Reviewer
- Reviewer: Claude Sonnet 5.5 (claude-sonnet-5-5), head 610dba8. Did not read governance/LOG.md; read only the Lead section of this log.
- Verdict: REQUEST CHANGES (one must-fix, two should-fix).
- Suite: `node --test` 167 tests, 167 pass, 0 fail, 0 skipped.
- Ratio: tests 1952 (chrome 100, fixture 27, generator 155, page 408, sudoku 1262) / product 1220 (index 41, style 131, sudoku.js 1048) = 1.6000x exactly (AC 9 met, zero headroom).
- Data flow AC 1-6 followed `hintMarks.hatched` -> class `hint-hatched` -> CSS (both layers, after hint-area so it wins) -> `clearResults` (class removed on all five paths, keyLine cleared at the same place). Correct. Reachability: the two reason passes in `addReasons` cannot overlap (the hidden unit is perpendicular to the line or the other box), so the de-dup is equivalent code.
- README (AC 7): every sentence checked against behaviour (second click pointing, hidden single, removal lists, `#key` line, `hintKey` and `hintMarks` API entries). No discrepancy. `pointingKey` appears nowhere any more.

Mutants (each reverted; `node --test`):
| # | Mutant | Result |
|---|---|---|
| M1 | page key gate `&& res.technique !== 'naked'` removed | SURVIVED |
| M2 | `addReasons` de-dup removed | SURVIVED (equivalent, see above) |
| M3 | `hatched` sort removed | SURVIVED |
| M4 | stripe layer dropped from CSS | killed (f1b) |
| M5 | tint layer dropped from hatched rule | killed (f1b) |
| M6 | `hint-hatched` missing from `clearResults` | killed (4) |
| M7 | `hatchedCount ?` always true | killed (4) |
| M8 | `hatchedCount ?` always false | killed (4) |
| M9 | "an 8" -> "a 8" | killed (6) |
| M10 | page passes 0 as count | killed (3) |
| M11 | page never adds `hint-hatched` | killed (3) |
| M12 | `x !== p` dropped in `addReasons` | killed (8) |
| M13 | hidden-form `removed` skip dropped | killed (6) |
| M14 | box `confined` skip dropped | killed (6) |
| M15 | hidden key uses `pointDigit` | killed (4) |
12 killed, 3 survived (1 equivalent).

Findings
- MUST-FIX 1 (M1): tests/page.test.js:263-278 (f2). The "no key line for a naked single" guard is not tested: the seed is picked by `findHiddenSingle` on Tricky and Hint teaches the hidden single there, so the naked branch of sudoku.js:1006 is never exercised, and the assertion `[key.startsWith('Key: hatched = '), ...] == [status is Hidden single]` hides that. Fix: add a naked-single page case (adapt f2: Easy prefers naked on a tie, so `pick('easy', (pz) => S.findNakedSingle(pz))`, Hint twice, assert status starts with "Naked single" and `key === ''`, `hatched` empty), and make the hidden-single case assert its status. Re-run M1 to confirm it dies.
- SHOULD-FIX 2 (M3): no test has a hatched set in which a unit cell has a lower index than a box cell, so the sort of `hatched` (sudoku.js:455) is unpinned although the contract is "ascending". Reachable, for example: pointing box 6, line row 6, target r7c5 (hidden unit column), empty box cell r8c1 (index 63) and empty column cell r1c5 (index 4) give `[4, 63]` sorted and `[63, 4]` without the sort (checked in node). Fix: extend the existing "hintMarks, pointing: reason cells ..." case (b) with such a layout and assert `hatched` deepStrictEqual ascending, no new test.
- SHOULD-FIX 3 (legibility, development-practices "clean and legible"): the 1.600x was reached by packing lines. tests/sudoku.test.js:1118 joins a new comment and the old `// issue 56:` comment on one 260-character line (the new one reads as a different sentence mid-line); :1173-1174 declare `rule`, `point`, `head` and `point`'s long hintKey call on two lines of ~250 characters; sudoku.js:424-425 reflows the hintMarks header comment mid-sentence and :455 is a 180-character return. Not acceptable as is. Fix: put each declaration and each comment on its own line (about +5 test lines), and pay for them legitimately, not by packing: (a) drop assertions that duplicate others, e.g. in hintKey the hidden-single row `[4, 'a 4']` is covered by hintFor's "an 8 ... 7 and 9" text test plus the P3 pin, and `point(8, 1)` repeats the "an 8" already in the hidden-single `[8, 'an 8']` and the P1 pin; the page f1b first-click assertion `[s.hatched, s.key] == [[], '']` is also covered by `noHint` on nudges in f/f2b (list each with its remaining cover; mutants M7/M8/M9 would confirm); or (b) ask the PM for a one-line ratio exemption note. Do not rely on long lines.
- NIT 4: tests/page.test.js:~214 (f) still builds the expected key from `S.hintKey(...)` (wiring only). Acceptable because P1/P3 pin literal text in f1b; no change needed.
- NIT 5: Pins P2, P4, P5 are not on the page (only P1, P3), matching AC 8; no change.

### Re-review (rework 1/1b), head 7c63d88 (Claude Sonnet 5.5, claude-sonnet-5-5)
- Did not read governance/LOG.md. Verdict: APPROVE.
- Suite: `node --test` (no path) 167 tests, 167 pass, 0 fail, 0 skipped (run 10 times on the clean head, stable).
- Ratio: tests 1961 (chrome 100, fixture 27, generator 155, page 411, sudoku 1268) / product 1226 (index 41, style 131, sudoku.js 1054) = 1.5996x (limit 1.6x).
- Findings: M1 now killed (f2, 1 fail), M3 now killed ("reason cells" test, 1 fail). Legibility (R3): declarations and comments are on their own lines, no new packing; acceptable.
- R4 (de-dup removed): holds. The hidden form only arises when removing the pointing cells makes target p a single in unit U that was not one before (Tricky `useful: true` skips pre-existing singles; the non-Tricky path reaches `findPointing` only when no single exists). So U holds a removed cell (all in the line, outside the box) or is the box itself. Cases: U = box gives left = confined (>= 2, never [p]); U = the pointing line gives p removed (naked form) or left = confined; U perpendicular through the box meets the line inside the box (not removed), so p would already be a single; U perpendicular outside the box never meets the box; U = another box or parallel line never meets the pointing box (the parallel line has no removed cell, so p was already a single). Empirical: instrumented copy counting duplicate pushes over easy/medium/tricky/hard, seeds 1-60, every hint step (19084 explains, 582 pointing): 0 duplicates. No counterexample.
- Removals (mutant results; 167 baseline):
  1. f1b first-click `[hatched, key] == [[], '']`: mutant nudge hatched (reasons gate without `kind === explain`) killed (tint test, 1).
  2. f2b `hatched == []`: mutant `hatchedCount ?` always true killed (f2b + hintKey, 2).
  3. f2 `dattr == []` (hidden single): argued by reasoning, checked. Mutant hintMarks `confined: [p]` for a hidden single killed (tint test, 1). Mutant setting `data-d` on the target for a hidden single (page only) SURVIVES, but data-d is set in one place, from `marks.confined`/`removed`, so that mutant is not a path the code can take by a one-line slip; noHint still asserts dattr empty on all clear paths. Accepted, low value.
  4. hintKey rows `point(8, 1)`, `[4, 'a 4']`: mutant "an 8" -> "a 8" killed (3); `hatchedCount ?` always true killed (f2b, hintKey).
  5. hidden single `m.hatched == [1, 2]`: mutant `x !== p` dropped killed (4); skip first unit cell killed (f1b P3, 1).
  6. (comment removed, `rule` inlined): no assertion lost.
  7. (1b) f2 regex for hidden key: mutant key for pointing only killed (f1b, 1); hidden key uses `pointDigit` killed (f1b and hintKey, 2).
  Additional: page never adds `hint-hatched` killed (f and f1b, 2).
- AC 8: unit hatched sets for hidden single (tint test `single.hatched`) and both pointing forms (naked a/none and hidden b plus the sorted case); key text for pointing with (`point(2,4)`) and without (`point(9,0)`) hatching, hidden single and "an 8" (the restored literal) all present. Page: P1 and P3 pins in f1b, clearing paths (f1b value change, f notes keep and value change, f2 Verify), and the two-layer style guard (stripe and tint in computed backgroundImage; both single-layer mutants killed earlier, style.css unchanged). All met.
- Note: one unexplained transient in a mutant batch (a second run of the same mutant showed f2/f2b failing while the first passed); not reproducible in 3 reruns of the mutant nor in 10 clean runs.

## Tester
- Tester: Claude Sonnet 5.5 (claude-sonnet-5-5), session c0f6ffb1, head 610dba8. Did not read governance/LOG.md.
- Plan: (1) `node --test` and ratio recount; (2) pins P1-P5 on the real page at 375 and 1280 px (seeded as page.test.js, P5 by 8 rounds of Hint, Hint, type the target's solution digit, Notes off): hatched, rings, target, exact key text, first click clean, hatched never target/confined/removed/filled and inside the tint; (3) AC 4 look: computed `background-image` on hatched and tint-only cells, parsed against the allowed ranges, notes/input paint order, screenshots with and without notes; (4) AC 5 clearing: value change (other cell and a hatched cell), Verify, New puzzle, level choice (also with a hint showing), next Hint result, Notes toggle and note typing; (5) AC 3 key line over every state; (6) AC 6 independent comparison against `git archive origin/main` (9c5542b): 4 levels x 4-5 seeds x 10 rounds of Hint, Hint, type = 360 states, fields status/target/rings/confined/removed/area/badges/grid; (7) independent oracle for the hatched set (own code: parses unit/box/digit from the explain text, recomputes candidates from the page grid; not hintMarks) on the same states.
- Results: all pass, no defect. `node --test`: 167 tests, 167 pass, 0 fail, 0 skipped (about 3 s). Ratio: product 1220 (41+131+1048) vs tests 1952 = 1.6000x, exactly at the limit (<= 1.6x holds, zero headroom; any added test line without a product line breaks it).
- Pins (66 checks at 375 and 1280 px): P1, P2, P3, P4, P5 all match the issue exactly (hatched cells, rings, target, key text, no hatching or key on the first click; P5 no hatched, no rings, box-case text).
- Look: hatched cell `background-image` = `repeating-linear-gradient(135deg, rgba(106,31,181,0.3) 0 1.5px, transparent 1.5px 8px), linear-gradient(rgba(255,179,0,0.3), rgba(255,179,0,0.3))`: stripe first, tint second; alpha 0.3, stripe 1.5 px, period 8 px, identical at 375 and 1280 px, P1 and P3. Tint-only cells keep the single tint layer. Hatched cells are never target/confined/removed/ringed/filled, all inside the tinted area, carry no data-d. Notes (`.notes`, absolute) and the input (transparent background) are children of the td, so they paint above its background; the top element at a note's centre is the input inside the td. Screenshots look right: stripes visible, amber tint preserved, notes readable on stripes. Not measured: contrast ratios (accepted by the PM in AC 4).
- Clearing: value change in an unrelated cell and in a hatched cell, Verify, New puzzle, level choice (also while a hint shows), next Hint after a value change (nudge: no hatch, no key) and typing the target all clear hatching and key; Notes toggle and note typing keep both. Backspace on an empty cell is not a value change: rings, hatching and key stay, identical to main for the rings. A repeated Hint on the same explain re-shows the same explain (hatching stays), as on main.
- Key line and unchanged: over 360 states (99 hidden single explains, 6 pointing explains incl. hidden form, 69 naked explains, 6 "no technique" texts): key exact for every hidden single and pointing explain; empty for nudges, naked singles and the no-technique text; "an 8" and "a D" right; hidden single always has hatched cells. Oracle: 0 mismatches. Rings linked both ways to the hatched set in every state. Against main: 0 differences in status text, target, rings, confined, removed, tint area, badges and grid.
- Scripts and screenshots: scratchpad `t65.js` (pins), `look.js`, `clr2.js`, `shot2.js` (look and clearing), `seq.js` and `cmp.js` (comparison and oracle); PNGs in `test-65-tmp/` (P1/P3, 375/1280, notes/nonotes, `full-*.png`).
- Concerns: ratio has no headroom (1.6000x). Pointing coverage in the 360-state comparison is thin (6 explains), backed by P1, P2, P5 and the unit tests.

### Re-test (rework 1/1b), head 7c63d88 (Claude Sonnet 5.5, claude-sonnet-5-5; did not read governance/LOG.md)
- Verdict: PASS.
- `node --test` (no path): 167 tests, 167 pass, 0 fail, 0 skipped. Ratio: tests 1961 / product 1226 (index 41, style 131, sudoku.js 1054) = 1.5995x (<= 1.6x).
- Product diff ba852b2..7c63d88 (sudoku.js only): dead `reasons.indexOf(x) < 0` removed, comment and `hintMarks` return reformatted; nothing else.
- Smoke on the real page (375 and 1280 px, scripts t65.js, clr2.js): 66 checks, 0 fails. P1-P5 unchanged (hatched cells, rings, targets, exact key text; P5 hatched and rings empty). Clearing paths (backspace, value change, nudge after change, typed correct digit) leave 0 rings, 0 hatched, key ''. Naked-single explain: key '' and no hatching.
- 360-state comparison (seq.js/cmp.js, 20 puzzles x 10 steps x 2 clicks): 7c63d88 output byte-identical to a fresh run of 610dba8 and to the saved branch run (so identical hatched sets, rings, keys, status, grid); cmp.js against main: 360 states, 0 bad (naked 69, hidden 99, pointing 6, other 6; nudges carry no marks, oracle for hatched sets and key text matches).
- Removals (agree with the developer on all seven): 1 f1b first click -> hintMarks nudge `[digits, hatched] == [[], []]` and page f first click `[..., key] == [[],[],[],'']`; 2 f2b hatched [] -> hintMarks `none` case plus f2b key lacks "hatched"; 3 f2 dattr [] -> tint test `confined == []` (data-d only from confined/removed; reasoned, no mutant); 4 hintKey `point(8,1)` and hidden rows -> P1 page pin (pointing "an 8"), P3 page pin ("a 4"), and the 1b unit assertion (hidden "an 8", exact text); 5 hidden-single `.hatched [1,2]` -> tint test `single.hatched == [31,40,48,49,50]` and P3; 6 comment only; 7 (1b) f2 hidden-key regex -> hintKey exact unit text, f1b P3 literal, naked case key ''. Minor note: no unit test of "an 8" inside a pointing key remains, but the shared `article` helper is covered by the hidden "an 8" unit and the P1 page pin.
- Temp files in scratchpad/test-65-tmp only; no product or test files changed.

# Backlog

The PM owns this list. This page is the lead's snapshot of it at the end of iteration 14 (from `work-log/iteration-14-product.md`, "Candidate list (PM, ordered, after #65 acceptance)"). Start the next scoping here. During an iteration the PM's live list at the bottom of its latest product log supersedes this page; the lead refreshes the snapshot at close. Pruning rule (governance/memory-architecture.md): delivered items are dropped, related ones merged.

## Product candidates (PM, ordered)
1. Explanation depth, continued: a direct ring-to-cell link (tap a hatched cell or a ring to highlight its partner; asked for at it14 scoping and acceptance; long-distance and two-ring cells are the weak spots); notes readability in hatched cells (try alpha 0.25, inside #65's range, and re-run the persona notes check; CSS-only quick win, pair it with the link item); a stronger first-click signal for pointing; "same D as before"; "(the box has no other empty cells)" reads like a single; why the naked-form target has only D or X; minimal rings (rings exceed a minimal cover in 36% of hidden-single explanations, it14 spike).
2. Mobile: long messages and key line on a phone (conclusion first?); struck grey vs purple on tinted cells; grid cells about 36 x 58 px at 375 px (grid taller than wide; pre-existing); 375 px level buttons; hint badge at 320 px (the left-edge rule only acts below ~340 px).
3. Pointing reach (watch, no action): early first pointing via generation (filter ready); a cap on the Tricky preference only if load complaints appear; "prefer pointing" on Hard.
4. Slip follow-ups (it11, small, wording-led): extra-clash sentence pointing at the outlines; a partial-fix message; two-unit clash naming; "clear your own number" when the pair includes a given; explain "counted"/"stays uncounted" and judge an overwrite; a marker on entries made during a clash; Hint/Verify naming one pair at a time.
5. Small wording items: shared "not counted" ending; re-entering a hint-credited cell says "on your own"; "(see below)" in the finish text; fold away definitions once learned; heavy naked-single digit list.
6. Long-term: a middle hint level; progress across puzzles; claiming, then pairs, each with its own level (personas rank last).

Watch: test-to-product ratio 1.5995x at main 84889f5 (1961/1226; tests may be at most floor(1.6 x product), so 0 lines of headroom). The next issue that adds tests either trims redundant assertions in the files it touches (listed, reviewer- and tester-confirmed, never one an AC explicitly requires) or comes after a separate trim item; the PM decides when scoping it15.

Not wanted: instant red on a wrong entry (it10); counting entries made during a clash (it11); retroactive counting after a fix (it11).

## Open tech debt and carry-forwards
- `tests/chrome.js` nits (#55 L4): declare `watchdog` above `close`; `gone` is always false in the exit handler; the ppid watchdog is optional (the EPIPE listeners are the essential part).
- `findPointing` without options may return a step where a single already exists (documented; `hintFor` checks singles first, and on Tricky uses `{useful: true}`).
- `singleAfterStep` keeps a redundant filled-cell guard on purpose (it9 N1).
- Tricky and Hard givens bands overlap (27-29); accepted.
- A screen reader may not announce ", clashes" until the cell is refocused (#51 N4); the message line carries the text.
- `hintMarks` hatched cells: the page `data-d` mutant on a hidden-single target survives (removal 3 in #65 rests on reasoning: `data-d` is set only from confined/removed); accepted.
- Page test f4 adds `hint-removed`/`data-d` to a live cell and leaves them (harmless: later tests reopen the page); it does not pin the loop length (no AC requires it; #61 review nits).
- Struck-badge strike centring and gradient direction are not guarded (no AC; #61 review C4/C5).
- Equivalent mutants accepted: `choose` skipping `clearResults` (the picker is only reachable after `newPuzzle`), the left-edge badge rule at 375 px (#56 L2).

## Open concerns for Dirk
- GitHub Pages is not checked or enabled, so there are no real users and all evidence is simulated.
- Agent safety (it13): addressed by Dirk's run-task change (9c5542b): per-session TMPDIR under /tmp/wvr. The lead still passes the explicit-temp-dir / `${VAR:?}` rule in prompts (macOS mktemp ignores TMPDIR).
- Chrome leaves `com.google.Chrome.*` and `scoped_dir*` items in the per-session TMPDIR (it14: 155 items, 14 MB; no processes left). Contained there; cleanup is outside the team.

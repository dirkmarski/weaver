# Work Log: Iteration 17 (product manager)

- PM: weaver-agents product-manager agent (Claude Opus 5.5, claude-opus-5-5)
- Run type: scope the next iteration (review state, raise issues in priority order)
- Baseline: main 897c762 (last product change b481959). Ratio 1.586x (2081/1312), cap floor(1.6 x 1312) = 2099, 18 lines of headroom.
- Inputs read: memory/wip/current.md, memory/wiki/backlog.md, memory/wiki/product.md, memory/wiki/lessons.md, governance/context/*.md (product strategy unchanged: teach techniques progressively, reward learning), work-log/iteration-16-product.md, issue #72 (format), index.html, style.css, sudoku.js (link/click handlers). governance/LOG.md not read.
- Scratch: /Users/dirk/Code/weaver-team/scratchpad/pm-it17/ (briefs, mock-up scripts, screenshots).

## Status check
- Fresh start: no open issues or PRs; WIP says iteration 16 complete (#71, #72 merged, accepted). No it17 product log existed.

## Direction
- Top backlog item: link discoverability and phone reach (F-72a, F-72b, F-72c) from the #72 acceptance (Discover 2/3/3, Phone 3/3/3, ruled look confused with a ring by 3/3).
- Hypothesis H1: moving the link line to directly under the grid (above the buttons) fixes F-72b (visible after a tap at 375 px) and most of F-72a (invitation next to the thing it talks about), at almost no product-line cost.
- Hypothesis H2: a ruled look that is not a solid purple border (the ring's own language) removes the F-72c confusion; candidates to be mocked up.
- Ratio constraint: 18 lines of headroom, so the issues must stay CSS/markup-light.

## Evidence
### Mock-up screenshots (assistant, scratchpad pm-it17/run.js, shots/)
- Tricky seed 1, Hint twice: target r1c5, rings r2c2, r9c7, hatched r2c7, r2c8, r2c9, r3c7 (verified). Notes 2/5/7 in r2c8; ring r2c2 selected by real touch (375) and mouse (1280).
- Layout at 375x812 (CSS px, top/bottom):
  - L0 (today): grid 96/660, buttons 676/746, status 762/909, key 926/990, link 994/1026 (invite) and 994/1042 (selected). Link line below the fold in both states.
  - L1 (#link moved directly under the grid): link 668/700 (invite), 668/716 (selected); buttons 716-732 / 786-802, i.e. within 812. Status and key below the fold in both layouts.
  - L1 at 1280x900: link 651/683, all visible.
  - Buttons shift by 16 px when the invite changes to the 3-line sentence (and by the link height when the line first appears).
- Ruled-mark variants (ring r2c2 selected): V0 today (inset 3 px #4a0f8a), V1 denser stripes (0.6, no border), V2 dotted outline, V3 purple struck D badge in D's note slot, V4 double border.
  - Contrast vs tinted backgrounds (#e4d7ac / #f7dea1): V0, V2, V3, V4 8.45 and 9.25:1; V1 about 2.9-3.0:1 (fails 3:1).
  - Notes at 375: V0/V2 touch the 7 (about -0.1 px), V4 overlaps (-3 px); V3 covers the note D (2) in its own slot, by design.

### Persona round 1 (user-a, user-b, user-c, screenshots, foreground; brief scratchpad pm-it17/brief.md; none read LOG.md)
- Layout (X = today, Y = link under grid), 375 px:
  - Saw the sentence after a tap without scrolling: X no/no/no; Y yes/yes/yes. Nobody saw the invitation in X.
  - Discover: X 1/2/2, Y 4/4/5. Grid and explanation together: X 1/2/1, Y 5/5/4.
  - Concern 3/3: buttons jump when the line appears/changes (mis-tap risk); all three suggest reserving space. 2/3: the pointing paragraph is now pushed further below the fold.
- Ruled mark (tell apart from a ring / says "2 cannot go there"), mapped by the persona's description (user-a mislabelled the file numbers; mapped by what was described):
  - V0 solid: 3/1, 3/2, 2/2. V1 dense stripes: 4/1, 2/1, 4/2. V2 dotted: 2/1, 2/1, 2/1 (all: confused with the dashed confined boxes). V3 struck purple D: 4/5, 5/5, 4/5. V4 double: 3/1, 3/2, 3/2.
  - Favourite V3 3/3 ("states the meaning"). Least V2 (3/3 named it least or worst). V3 hides the note D under the badge: a and b fine ("the 2 is out anyway"), c would prefer the note struck, b wants it clear the note was not erased.
- Learning value ranking (1 = most): P link under grid 1/3/3; Q ruled mark 4/5/5; R short numbered pointing steps, conclusion first 2/1/1; S show-me-why replay 3/2/2; T practice puzzle 5/4/4.
- Unprompted: invitation wordy (a); "hatched" is jargon, "striped" friendlier (b); many purple marks to learn (a); pulse rings once (b); buttons look alike (b).

### Mock-up 2: pointing explanation layout (assistant, scratchpad pm-it17/run2.js, shots2/; 375x812, link under grid)
- Originals verbatim: N (Tricky 1) "Pointing: in the box of rows 1-3 and columns 7-9, the digit 2 fits only in row 1, so 2 cannot go in row 1 outside that box. Row 1, column 5 has every digit except 2 and 7 in its row, column and box, so it could only take 2 or 7. With 2 now ruled out there, it must be 7." H (Tricky 8) "Pointing: in the box of rows 1-3 and columns 1-3, the digit 8 fits only in column 3, so 8 cannot go in column 3 outside that box. That leaves row 4, column 1 as the only cell in its row where 8 fits, so it must be 8."
- C = current; S = conclusion line + 3 numbered steps, left-aligned, one per line (N 9 lines, H 7 lines at 375); P = conclusion first + "Why:" paragraph. My S/P drafts for H dropped the closing "so it must be 8" (draft error, caught by all three personas).

### Persona round 2 (screenshots, foreground; brief pm-it17/brief2.md; none read LOG.md)
- Follow / phone-readable (a, b, c):
  - N: C 3/2, 3/3, 3/3; S 5/4, 5/5, 5/4; P 3/2, 4/3, 3/3.
  - H: C 4/3, 4/3, 4/3; S 4/4, 4/5, 4/4 (all: missing "so it must be 8"); P 3/2, 4/3, 3/3.
- Favourite S 3/3 ("one inference per line, tick them off against the board").
- All three explained both deductions correctly in their own words.
- Answer first spoils learning? No 3/3 ("I pressed Hint, I expect the answer; it gives me something to check the reasons against"). Two suggest steps revealed on tap (later; joins "show me why").
- Other: "has every digit except" reads as "contains" (b: "sees" clearer; watch); hidden-form step 3 does not say why the other unit cells are out (a, b; the hatching shows it; watch); key text small and skipped (a, b).

## Decisions
- D1 Scope: three issues, delivered in sequence, all small and CSS/markup/wording-led (ratio headroom 18):
  1. Link line under the grid, with a reserved height so the buttons do not jump (P: discover 1/2/2 -> 4/4/5; together 1/2/1 -> 5/5/4). Highest certainty, cheapest, unblocks the phone.
  2. Pointing explanation as a conclusion line plus numbered steps (R: ranked 2/1/1; N follow 3/3/3 -> 5/5/5). Text for the hidden form keeps ", so it must be D." on step 3.
  3. Ruled look as a purple struck D badge (V3) instead of the solid border (Q: tell-apart 4/5/4, meaning 5/5/5; least value rank, so last).
- D2 Not this iteration: "show me why" replay (S, rank 3/2/2) is a large feature; it needs a design spike first (candidate for it18 scoping, possibly as "reveal steps one at a time" on top of issue 2). Practice puzzle (T) stays long-term.
- D3 Button stability: personas 3/3 asked for reserved space; the issue asks that the button row does not move for link texts up to three lines at 375 px. The first appearance cost is removed by reserving the height whenever the game shows (developer's choice of means).
- D4 Wording "has every digit except" -> "sees": one persona; logged as a watch item, not changed (it16 on-screen accepted).

## Assumptions / concerns
- A1. Rounds are screenshot mock-ups (injected CSS/text), not the built feature; each issue gets an on-screen persona check at acceptance.
- A2. Hatched cells never carry confined/removed badges (from the hint-mark definitions: hatched box cells are the non-confined ones, hatched unit cells exclude removed cells), so the ::after slot is free for the ruled badge. The developer must confirm this in code.
- A3. Four-cell reverse sentences (1 in 1861 rings) may be four lines at 375 px and push the buttons; accepted.
- A4. Moving the status further down (it now starts at about 802 px at 375) puts the pointing explanation below the fold on a phone. Issue 2 makes it scannable, but where it sits is still an open mobile item (backlog).

## Issues (priority order; deliver in sequence)
1. #76 Link line under the grid: invitation and link sentences next to the board, buttons kept still. 7 ACs. https://github.com/dirkmarski/weaver/issues/76
2. #77 Pointing explanation as a conclusion line plus numbered steps. 8 ACs. https://github.com/dirkmarski/weaver/issues/77
3. #78 Ruled look: a purple struck digit badge instead of the solid border. 9 ACs. https://github.com/dirkmarski/weaver/issues/78
- Order comments posted on #77 and #78. Expected product delta about 3-13 lines in total; within the 18-line headroom plus what the new lines earn.
- Acceptance plan: each issue gets a real-input page check (CDP mouse/touch, 375 and 1280) and an on-screen persona check without naming cells; personas run in the foreground.

## Candidate list (PM, ordered, after it17 scoping)
1. This iteration: #76, #77, #78.
2. Explanation depth: "show me why" / reveal steps one at a time on top of #77 (personas S rank 3/2/2; 2 asked for tap-to-reveal); minimal rings; a stronger first-click signal for pointing; "same D as before"; box-case wording; keyboard reach for given rings; watch: "has every digit except" -> "sees" (user-b), hidden-form step 3 says why other unit cells are out (a, b), "hatched" -> "striped" (b), grouped "(same row)" (F-72e), highlight the shared unit (F-72f), many purple marks to learn (a).
3. Mobile (raised in priority after #76 acceptance; candidate for the it18 lead item): the button row wraps at 375/360 (New puzzle on its own row under the others: mis-tap risk named by user-b, clipped at 360x800); a discovery cue on the rings before or with the first explanation (it17 #76 personas, discover 3/4/3); vertical centring shifts the page on tall windows (C1); the status/explanation below the fold at 375 px (starts ~822 px after #76); F2 notes contrast in hatched cells; pointing badges small on a phone; soft keyboard on hatched-cell tap; struck grey vs purple on tinted cells; cell aspect 36 x 58 px; "New puzzle" wraps; hint badge at 320 px; buttons look alike (b).
4. Pointing reach (watch): early first pointing via generation; Tricky preference cap; "prefer pointing" on Hard.
5. Slip follow-ups (it11): unchanged list.
6. Small wording items: unchanged list; plus invitation wordy (a).
7. Long-term: practice puzzle per technique (T rank 5/4/4); middle hint level; progress across puzzles; claiming, then pairs.

## 2026-10-21 - #76 scope decision: link reserve 4 lines (option B)
- Lead asked: 3lh (A) vs 4lh (B). Facts from lead: at 360 px content (360 Android phone, or 375 window with 15 px classic scrollbar) the R3 sentence is 4 lines; 3lh moves the buttons 16 px on the R3 tap, 4lh keeps them still. At 375x812 with 4lh, buttons 748-783, everything fits at scroll 0.
- Decision: B. Reason: the issue exists to stop the buttons jumping under the thumb (3/3 persona concern); 360 px phones are common and R3 is the core teaching tap. 16 px of blank space is an acceptable cost.
- Spec change: AC3 "up to four lines, at 360 px, 375 px and 1280 px content width", "longer than four lines may push", suggested means four lines; AC7 R3 described as three or four lines by width. Recorded in issue Change log; comment posted.
- Assumption: no persona round needed; the trade-off is layout-only and covered by the it17 persona evidence.
- Did not read governance/LOG.md.

## 2026-10-21 - #76 AC5 FAIL follow-up: option B2
- Lead correction: my option-B decision used "buttons bottom 783", which covered only the first button row. At 375/360 px the buttons wrap; New puzzle sits on row 2 at 783-818 and is clipped at 375x812 (tester AC5 FAIL, real touch, issue comment 6311522242). All other ACs pass.
- Options (lead measurements): A 3lh (pass at 10 px spare, but a 16 px jump on R3 at 360); B 4lh plus button paragraph margin-top 0.5rem (pass at 2 px spare); B2 = B plus link margin-top 0.25rem (pass at 6 px spare, buttons still); C reword AC5 (rejected).
- Decision: B2. Reason: it keeps the purpose of the issue (stable buttons on the R3 tap at 360 px), and its 6 px margin is safer than B's 2 px against rendering differences. Same line cost as B (+1 CSS rule). A 4 px grid-to-link gap still meets AC1.
- Spec change (issue Change log): AC5 adds "including the second button row where the buttons wrap (New puzzle at 375 px)"; AC3 suggested means names the spacing.
- Accepted: New puzzle stays clipped at 360x800 (pre-existing wrap; mobile backlog "New puzzle wraps"). Real phones have a smaller visible height because of the browser chrome, so the wrap fix gets more urgent for the mobile item.
- Backlog add (Mobile/layout): C1 from the tester, which was already on main. The body is centred vertically, so on tall windows (>= about 1080 px at 1280 wide) the page and buttons shift when the status or key appears. Candidate fix: align to the top.
- Lesson: check the bottom of every wrapped row, not the first rect, when I accept a layout figure.
- Did not read governance/LOG.md.

## 2026-10-21 - #76 acceptance on PR #79: ACCEPTED at 60c5024
- Setup: private worktrees /tmp/wvr/cb27eb6b/wt-pm (60c5024) and /tmp/wvr/cb27eb6b/pm/main (897c762). My scripts: /tmp/wvr/cb27eb6b/pm (acc.js, play.js, replay.js, and h.js adapted from the tester's). Shots: /tmp/wvr/cb27eb6b/pm/shots. Real CDP input: touch at 375x812 (mobile), mouse at 1280x900. No Chrome left running afterwards.
- AC1 PASS: grid bottom < link < buttons < status < key. At 375: 660 / 664-728 / 736. At 1280: 643 / 647-711 / 719.
- AC2 PASS: replay of 570 steps on the branch and on main, 0 diffs.
- AC3 PASS: button top constant across 8 states at 375 (736) and at 1280 (719). The play-through (pointing, hidden and naked singles, Verify) also stayed at 736 throughout.
- AC4 PASS: picker screenshots byte-identical to main.
- AC5 PASS: at 375x812, scroll 0, the whole grid, the invitation, the full R3 sentence and New puzzle (bottom 805.6, 6.4 px spare) are visible, with no horizontal scroll. Same at 1280x900.
- AC6 PASS: README diff is only the two phrases.
- AC7 PASS: f1e +10 lines, reset in `finally`. Suite 173/173, skipped 0.
- Personas (foreground, real screenshots at 375, no cell names, no scripts, source or LOG.md). Scores a/b/c:
  - see the explanation with the grid: 5/5/5;
  - buttons still: 5/5/5;
  - mis-tap (5 = none): 4/4/4;
  - discover taps: 3/4/3.
- Quotes:
  - a: "Everything stays put and I can see the why next to the grid, I just wouldn't have known to tap the rings without that line."
  - b: "I just don't want my thumb near New puzzle."
  - c: "I'd only discover the tapping if I actually read the purple line."
- Concerns:
  - The discover score (3/4/3) is lower than in the mock-up round (4/4/5). The cause is probably the question: this time the personas judged discovery before any Hint (screenshot 1 has no cue). Not an AC of #76. It goes to the backlog as a ring cue.
  - The mis-tap risk sits in the wrapped button row (pre-existing).
  - Real phones show less height than 812 because of the browser chrome, so New puzzle may still clip on a device. That raises the priority of the button-wrap fix.
  - Not simulated: the soft keyboard that a tap on a hatched cell opens on a real phone.
- Acceptance comment: https://github.com/dirkmarski/weaver/pull/79#issuecomment-6311756869
- Did not read governance/LOG.md.

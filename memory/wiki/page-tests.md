# Page tests: what each scenario pins

Auxiliary to `architecture.md` "Tests". Read only when adding or changing a page test in `tests/page.test.js`.

- Setup (#116/#117): the file serves the repo with `serve(0)` from `tools/serve.js` and opens `index.html` over http; a seeded case calls `window.__seed(n)` (imports `/generation.js`, sets `Math.random = seededRng(n)`) before choosing a level. Expected puzzles come from `generatePuzzle(level, {rng: seededRng(n)})` imported in the test.

- Page tests that pin wording use literal text (f1b pins P1 pointing and P3 hidden single of #65, with the two-layer background guard and a value-change clear; f2 covers naked = no key; f1c pins the #68 L1 link flow, grid-leave and linked computed styles; f1d the naked-form pointing link digit). Page tests need `Emulation.setFocusEmulationEnabled` for focus events (set in `before`, #68);
- f compares the page with the helper and so tests wiring only.
- f4 (mobile:true; #83) guards squareness at 360/375 px, the grid span at 375, corner badges 1/3/7/9 inside and flush, and the struck badge: strike contrast >= 4.5:1 and the thinnest strike over digits 1-9 >= 2 px at 375 px.
- f1e (the reverse-link test) ends with a 375 px mobile:true block: the button row stays still across hint states (#76), New puzzle on the level line after a second level choice, one-row play buttons with gaps >= 8 and height >= 34 (#84) and the compact top: grid top <= 88 px at 375 (#85; the only #85 assertion).
- f (naked, literal) and f1b (hidden final text) pin the #90 reveal; f1a (360x740 mobile, seed 8) pins Hint advancing, label, steady tops, Next step look = Verify (font+padding), Hint focus, a value-change clear and the stage-2 Next step button inside 740 (#96; stage 3 is f1h's); `#next` alignment/gap are measured only (no headroom).
- f1h (#97; 360x740 seeds 1, 8 and Medium 1; 360x560 hidden single) pins the invitation, `#status` and target in view after the scroll, scrollY 0 before the last Hint; f1c also pins the reserve style (key grey 400, link sentence purple 500).
- f1 (seed 1, naked) pins the #91 stages 1-3 (classes, literal keys, no link on a later-hatched cell or ring before stage 3); `hints(n)` clicks Hint n times.
- f5 (#102): claiming fallback on Hard seeds 57 (naked) and 184 (hidden): staged marks, key, Next step, focus, hinted entry counted.
- g1 (#103/#104): Tough via the picker (fifth button), seeds 1/3 first Hint is claiming, struck-cell steps, the 1rem rule, own claiming reward.

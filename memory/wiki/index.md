# Weaver wiki: index

Durable facts and learnings about the weaver project. History of events lives in the work log (`work-log/`), not here.
Snapshot basis: end of iteration 24 (main at 65a90a6, 230 tests passing incl. 21 spec scenarios; 12 ES modules per ADR 001; runs with `node tools/serve.js` per ADR 002; `tests/` 2472 / product 1564 = 1.581x, cap 2502, about 30 lines of headroom; `spec-implementation/` 483 and `tools/` 32 outside the cap). Pruned at the it24 close. Next: iteration 25 scoping from backlog.md item 1.
All pages live under `memory/wiki/` (there is no top-level `wiki/`).

## Pages
- [product.md](product.md): what weaver is today: levels (incl. Tough), techniques taught (singles, pointing, claiming), Hint, rewards and counts, known gaps and layout figures.
- [architecture.md](architecture.md): sections "Files" (sizes, ratio), "Modules" (ADR 001 rules, concerns, guard), "Exports" (by module, incl. `rewardMarks` and `creditEntry`'s `marks`), "How ui.js wires the page", "ATDD" (runner, steps, drivers incl. the local-run process driver), "Tests" (running, port 8000, page-test serving and seeding).
- ADRs: `governance/context/decisions/` (README = format; read each record whose status is In force: 001 modules (18 lines), 002 local run (15 lines)). Binding; agents never edit them.
- [page-tests.md](page-tests.md): which page test pins what (auxiliary to architecture.md "Tests").
- [process.md](process.md): how the team works: run types, roles, conventions (incl. the brief skeleton), per-issue flow (red first), test strategy applied (ATDD, ratio), rework re-checks, work-log format.
- [lessons.md](lessons.md): durable lessons from iterations 1-24, compressed by theme (scoping, testing, review, coordination, tooling).
- [backlog.md](backlog.md): PM candidate list and open tech debt (owned by the PM; snapshot at iteration 24 end, with the last persona evidence per candidate). Scoping starts here.
- [glossary.md](glossary.md): sudoku terms and project terms (incl. ATDD terms).
- Outside the wiki: `specs/README.md` (spec conventions, PM-owned) and the `.feature` files.

## What to read, by role (sections, not whole pages)
List a page's sections with `grep -n '^## ' <file>`, then print only the one you need: `awk '/^## Testing/{f=1;print;next} /^## /{f=0} f' memory/wiki/lessons.md`. Whole-page reads are for the pages marked whole below.
- Lead (every new run, even in the same session): `wip/current.md` and this index; process.md "Per-issue flow" and "Conventions" ("Rework re-checks" only when a rework round starts; "Test strategy applied" when planning the red run or a ratio question; not the whole page); lessons "Coordination". Briefs: the skeleton in process.md "Conventions", not earlier briefs; list each section to read as its `awk` command. Issue logs: the section you need (template in process.md "Work-log entry format"), never whole logs; earlier iteration logs only for diagnosis.
- PM (scoping): `governance/context/` (about 110 lines incl. ADRs in force; `git log --oneline -5 -- governance/context` shows what is new since the last close), then backlog.md whole; product.md sections only (it24 PM read product.md and process.md whole): `awk '/^## Rewards and counts/{f=1;print;next} /^## /{f=0} f' memory/wiki/product.md`, likewise "Hint" (long: `grep -n` the topic inside it first) and "Known product gaps"; lessons "Scoping and spec"; process.md: `grep -n 'Specs (ATDD\|Ratio (PM\|PM log' memory/wiki/process.md` gives the three lines you need (specs, ratio, PM log format); never the whole page. Specs: `specs/README.md`, the feature in the area you change, and `grep -rn 'define(' spec-implementation/steps/` to reuse step texts. Never open an earlier `work-log/iteration-*-product.md`. Code: architecture.md "Exports" first for result shapes ("Files" and "Modules" only for structural scope), then `grep -n` the function and read only its range.
- Developer: ADR 001; architecture.md "Modules" and "Exports" ("Files" only for sizes/ratio), plus "How ui.js wires the page" for UI work and "ATDD" for steps/drivers (not the whole page); page-tests.md only when adding or changing a page test; lessons "Testing"; process.md "Test strategy applied" (developer, specs and ratio lines).
- Reviewer: lessons "Review" and "Testing"; the issue log's `## Lead` section only; architecture.md "Modules" when the diff adds, moves or splits code between modules; "ATDD" when the diff touches `spec-implementation/`.
- Tester: process.md "Test strategy applied" (tester and specs lines); lessons "Testing" and "Tooling" only; architecture.md "Tests" when serving the page (use `tools/serve.js`); the previous tester's scratch README if the brief gives one. Mutants go into the file the brief names, never into `specs/`.
- Personas: their brief and screenshots only.

## How to use / maintain
- The curator curates the wiki at each close; the lead keeps it correct during an iteration. Read the section you need; follow the links to the work log for evidence.
- Keep pages short and factual (about 40-120 lines). One fact in one place.
- When a fact changes, update the page. Do not append history ("in iteration 9 we changed..."); that belongs in the work log.
- A lesson replaced by a later one is rewritten to its current form, with one line on what it replaced.
- Verify facts against code and README, not against older logs. If unsure, write an open question.
- Prefer citing the iteration or issue (for example "it8", "#36") so the work log can be found.
- The README is the authoritative behaviour spec; this wiki summarises it and must not contradict it.
- Memory tiers: see `governance/context/memory-architecture.md` (wiki, WIP structure, work log, session). Governance context wins over memory on conflict.
- No agent reads `governance/LOG.md`.
- Do not read the work log unless specifically needed (memory-architecture.md); the wiki and WIP should be enough to work.
- Prune at every close (memory-architecture.md): merge duplicates, compress similar items into one broader entry, drop or archive what no longer applies (delivered backlog items, superseded tools).

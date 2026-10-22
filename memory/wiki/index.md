# Weaver wiki: index

Durable facts and learnings about the weaver project. History of events lives in the work log (`work-log/`), not here.
Snapshot basis: end of iteration 19 (main at a552c1d, 173 tests passing: 152 unit, 21 page; tests 2187 / product 1371, cap 2193, 6 lines of headroom). Pruned at the it19 close.
All pages live under `memory/wiki/` (there is no top-level `wiki/`).

## Pages
- [product.md](product.md): what weaver is today: levels, techniques taught, Hint, rewards and counts, known gaps.
- [architecture.md](architecture.md): files, main exports of `sudoku.js`, how `index.html` wires them, tests, sizes.
- [process.md](process.md): how the team works: run types, roles, branch/PR/commit conventions, per-issue flow.
- [lessons.md](lessons.md): durable lessons from iterations 1-19, compressed by theme (scoping, testing, review, coordination, tooling).
- [backlog.md](backlog.md): PM candidate list and open tech debt (owned by the PM; snapshot at iteration 19 end, with the last persona evidence per candidate). Scoping starts here.
- [glossary.md](glossary.md): sudoku terms and project terms.

## What to read, by role (sections, not whole pages)
List a page's sections with `grep -n '^## ' <file>`, then read only that range.
- Lead: `wip/current.md`; process.md "Per-issue flow", "Conventions", "Rework re-checks"; lessons "Coordination". Issue logs: the section you need (template in process.md "Work-log entry format"), never whole logs.
- PM (scoping): backlog.md (scores are inline: no product-log reads), product.md "Hint" and "Known product gaps", lessons "Scoping and spec".
- Developer: architecture.md; lessons "Testing" (and the ratio rule in process.md "Test strategy applied").
- Reviewer: lessons "Review" and "Testing"; the issue log's `## Lead` section only.
- Tester: process.md "Test strategy applied" (tester line); lessons "Testing" and "Tooling" (Headless Chrome/CDP lines); the previous tester's scratch README if the brief gives one.
- Personas: their brief and screenshots only.

## How to use / maintain
- The lead curates the wiki. Read the page you need; follow the links to the work log for evidence.
- Keep pages short and factual (about 40-120 lines). One fact in one place.
- When a fact changes, update the page. Do not append history ("in iteration 9 we changed..."); that belongs in the work log.
- A lesson replaced by a later one is rewritten to its current form, with one line on what it replaced.
- Verify facts against code and README, not against older logs. If unsure, write an open question.
- Prefer citing the iteration or issue (for example "it8", "#36") so the work log can be found.
- The README is the authoritative behaviour spec; this wiki summarises it and must not contradict it.
- Memory tiers: see `governance/memory-architecture.md` (wiki, WIP structure, work log, session).
- No agent reads `governance/LOG.md`.
- Do not read the work log unless specifically needed (memory-architecture.md); the wiki and WIP should be enough to work.
- Prune at every close (memory-architecture.md): merge duplicates, compress similar items into one broader entry, drop or archive what no longer applies (delivered backlog items, superseded tools).

# Executable specifications

Owned and written by the PM only (`governance/context/specification-strategy.md`; enforced by `.claude/hooks/specs-guard.py`). The development team implements the steps in `spec-implementation/` and never edits this folder. A gap or error in a spec goes to the PM through the lead.

Conventions
- One feature file per behaviour area: `specs/<area>/<behaviour>.feature`. Tags: `@issue-N` links the issue that delivers a scenario.
- Specs use the player's words, not code: cells are "row R, column C" (1-based), a puzzle is 9 rows of digits with `.` for an empty cell, and messages are the exact text the player reads.
- Every step must execute. An undefined step is a failure, and every new scenario must fail before development starts (red first).

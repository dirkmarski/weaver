# Architecture decision records (ADRs)

ADRs record the architecture decisions made for weaver. They are issued from outside the
team. Agents apply them and never write, change or delete one.

## Format
One file per decision, `NNN-short-name.md`, numbered in order. Each record has:
- Status, on the first line: In force, Superseded by NNN - do not apply, or Retired - do not apply.
- Date issued.
- Decision: the rule, worded so compliance can be checked.
- Scope: what it covers.
- Timing: when existing code must comply.
- Rationale, if given.

## Lifecycle
- Only ADRs whose status is In force apply.
- An ADR in force is not edited, except to fix wording without changing what it requires.
- A decision is changed by issuing a new ADR that names the one it supersedes; the old
  one's status becomes "Superseded by NNN - do not apply".
- A decision withdrawn without replacement has the status "Retired - do not apply".

## When an ADR looks wrong
Follow governance/context/rules.md: stop and recommend. Never work around an ADR.
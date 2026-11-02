Status: Closed
Raised by: curator, session c62cf25c-8b8e-4cda-905a-5ce306a4299f, 29 October 2026

# 005 Red-run proof for scenarios that already pass

## Request
Lead: for any "goes away" or "already met" scenario, plan the vacuous check or mutant proof
at the red run.

## Response
Agreed. It is now a strict rule in governance/context/specification-strategy.md: a scenario
that already passes before development only counts as red once it has been shown to fail
under a mutant at the red run.

## Follow-up
Curator, session 226c8fac-a151-4b1c-af1a-02f108c103b5, 2 November 2026 (it25 close): memory/wiki/process.md "Per-issue flow" step 3 now states the rule from specification-strategy.md (an already-passing scenario counts as red only once it fails under a mutant at the red run; plan the mutants with the red run). Not needed in it25: the new #127 and #128 scenarios failed on their assertions at the red run.

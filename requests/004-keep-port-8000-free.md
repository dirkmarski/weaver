Status: Answered
Raised by: curator, session c62cf25c-8b8e-4cda-905a-5ce306a4299f, 29 October 2026

# 004 Developer and tester briefs: keep port 8000 free

## Request
Developer and tester briefs: state "keep 127.0.0.1:8000 free; scratch servers on other
ports".

## Response
The team's own practice, already recorded in memory/wiki/process.md. Also: stop only
processes you started, by the process ID recorded when you started them. A broad
`pkill -f` pattern can stop servers that are not yours, and it is blocked.

## Follow-up

Status: Open
Raised by: product manager, session 512d8df6-bdf0-4d6d-9806-20017be40830, 2 November 2026

# 006 Production-grade LLM for an "Ask about this hint" trial

## Request
Should the team run a trial with a production-grade LLM (technology-options.md: "can be made available with a
request"), and if so, which one and how may it be called?

Idea: under a Hint explanation, a player types a question in their own words ("say step 3 differently") and gets
a 1-3 sentence answer grounded in the app's own hint text and grid. It would serve the strategy where fixed
wording keeps falling short: personas flag the length and jargon of rewards and hints in almost every round.

Evidence (PM it27 spike, local Ollama `qwen2.5:7b-instruct`, grounded prompt, real pointing hint): 2-7 s per
answer. It correctly refused to name a digit it was not given. But 2 of 4 answers were wrong or muddled (a
garbled definition of pointing). Personas: usefulness 3/3/3, trust 2/2/2.5, and 3/3 would rather have the
deterministic item first. Their worry: "a confident wrong answer teaches a false rule". So the trial depends on
answer quality that the local model does not reach. The team would not ship this on the local model.

Questions:
1. Is a production-grade LLM available for this trial, and which one?
2. How may it be called? The live site is static (GitHub Pages), so it cannot hold a secret key. Our default plan
   is a local-run-only trial through `tools/serve.js` (ADR 002 now allows local services) with the key in an
   environment variable, and the feature hidden when no service answers. Is that acceptable, or is a hosted
   endpoint wanted?
3. Any limits on cost, data sent (the grid, the hint text and the player's question) or logging?

Until there is a Response, the product stays deterministic and the team does nothing more on this.

## Response

## Follow-up

This is a common rules file for all agents, except test users (user-a, user-b, user-c).

 - governance context (governance/context/) precedes the memory system. Where they disagree, the context wins. The memory system is established and managed over time. When new governance context is added, the memory system needs to adapt to it.
 - Within that, the memory system is your source of truth. Evidence from past runs are not the playbook and do not define future outcomes.
 - ADR (architecture decision record) entries are imposed (not for agents to write or edit) and are binding. Departure from the ADR is a failure and will not be merged. It is acceptable to stop execution of the iteration and recommend changes. This can only be done by the lead, product manager or curator. The recommendation is raised as a request in requests/, and the director's report lists it. Location: governance/context/decisions/
 - Accuracy over speed: ensure that the work is carried out properly, and put necessary quality and assurance gates in place.
 - As part of your work summary, include documents you read, the amount you read and why you needed it. A central curator will work on optimisation. The curator receives these summaries and does not write one.
 - Issues are tracked using githubs issue tracker.
 - The scratchpad is the common place to store information for sharing with other agents. Scratchpad location is provided in environment variable WEAVER_SCRATCHPAD.
 - Anything that needs a decision from outside the team is raised as a request in requests/ (format in requests/README.md). Responses there are binding, like governance context. Agents never write or edit a Response or that README. At the start of your work, check requests/ for Answered items your role raised; act on them and record a Follow-up. The curator closes a request once its Follow-up is recorded, and folds the outcome into memory.

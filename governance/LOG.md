# Log

## Entries (newest first)

### Agents go for discovery by default
- **Seen:** 2026-10-19
- **Means:** Agents go for discovery by default, not just the items their definition raises. Pointed at the context folder, the product manager read it first, then everything else in the repository: the charter, this log, every issue and work log, its own definition and the settings. Whatever is in the repository is part of every agent's context, whether a definition points at it or not.
- **Response:** Pending.

### The product manager decides from training knowledge, not research
- **Seen:** 2026-10-19
- **Means:** Its discovery stayed inside the repository. It did no research on players, other sudoku apps or solving practice, and it has no web tools to do so. The options it weighed, and its claim that its choices "follow common minimal sudoku apps", are the model's recollection stated as fact.
- **Response:** Pending: whether the product manager researches before deciding is a definition change (tools and an instruction). Held until the strategy comparison is done, so it doesn't add a second variable.

### The lead's decisions rest on the model's defaults
- **Seen:** 2026-10-16
- **Means:** Without guidance, the lead decides from the model's own judgement. The decisions so far are sound, but they are the model's, not mine, and only visible in the work log.
- **Response:** Pending: a guidance framework for the product agent to decide against (see "Missing product decisions are decided by the lead agent").

### Missing product decisions are decided by the lead agent
- **Seen:** 2026-10-16
- **Means:** Assumptions and decisions are made and recorded. These outline where the requirements were insufficient.
- **Response:** Pending: implement an agile workflow where there is a product agent in the loop that can make these decisions.

### File system permissions triggered a request
- **Seen:** 2026-10-16
- **Means:** The run was paused until the question was answered.
- **Response:** Pending: out of folder access should be refused, not asked.

### Shared storage was not declared
- **Seen:** 2026-10-16
- **Means:** Agents struggled to share output.
- **Response:** Added clear instruction on where to store output for sharing.

### Permission mode auto blocked the merge without review
- **Seen:** 2026-10-16
- **Means:** It indicates that auto mode requires a human check before a PR merge by default.
- **Response:** Added an exception in auto mode's safety check.

### State needs to live outside the claude session
- **Seen:** 2026-10-16
- **Means:** If a task execution fails, all state is lost unless explicitly captured and tracked.
- **Response:** Updated lead agent definition to include better tracking in the work log and checking if the task is in flight when starting up.

### Claude Code's built in prompt is part of the environment
- **Seen:** 2026-10-16
- **Means:** Additional instructions are applied, such as a co-author line in the commits and plan files.
- **Response:** Test replacing the built-in prompt at launch.

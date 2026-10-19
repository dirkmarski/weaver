# Log

## Entries (newest first)

### Testing grows out of proportion to the product
- **Seen:** 2026-10-19
- **Means:** Testing is getting out of control. Each iteration's lessons become the next iteration's quality gates, and nothing ever removes one. By iteration 7 the product manager's acceptance of one small hint change ran 168,872 automated checks, which is off the charts for an app like this. Cost per iteration went from about $3.60 to $13.55 over seven iterations. Nothing in the definitions or the context mentions cost or proportion, so the team has no reason to stop.
- **Response:** Pending: set a proportion or cost lever before the next iteration.

### The lead's agent list cascades to the whole team
- **Seen:** 2026-10-19
- **Means:** The top-level agent's list of agents it may launch decides which agents exist for everyone in the session. The product manager was allowed to launch the test users, but they did not exist for it because the lead's list did not name them. A permission set on the lead caps what every agent below it can do.
- **Response:** Added the test users to the lead's list.

### Agents solve the problem with whatever is available
- **Seen:** 2026-10-19
- **Means:** Agents will try to solve the problem and be creative about it. When the test users could not be launched, the product manager had the assistant role-play them. When it had no way for them to see the product, it built a play tool that kept them away from the code. One simulated user solved the puzzle with a script instead of playing it. It is important to keep checking that the intended avenue is available, and that the agents find it.
- **Response:** Pending.

### Two sentences of strategy changed the product's direction
- **Seen:** 2026-10-19
- **Means:** Same team, same definitions. Two runs without a product aim delivered standard sudoku-app features: pencil notes, then keyboard play. With two sentences of aim restored, the product manager delivered a hint that teaches a solving technique and never gives away the answer, and it reordered its backlog around teaching. The product context is where my input changes what the agents build.
- **Response:** Pending.

### Earlier product choices are state, not principle
- **Seen:** 2026-10-19
- **Means:** As soon as the aim changed, the product manager reversed "no hints", which was in the README and in a scope line I wrote into issue #3. It treats what the product does today as a starting point it can overturn, not as a decision to defend. Anything that should survive a change of direction has to be written down as a principle in the product context.
- **Response:** Pending.

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

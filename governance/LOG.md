# Log

## Entries (newest first)

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

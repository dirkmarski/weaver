# Log

## Entries (newest first)

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

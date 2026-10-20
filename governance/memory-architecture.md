This file outlines the memory architecture to be used for this project.

Tiered approach:
 - LLM wiki: persistent facts that stay over time. Indexed and summary content available for easy access and navigation. Ensure you review sessions for learnings worth capturing so you grow your knowledge. The wiki needs to be curated and managed over time.
 - WIP structure: work in progress memory structure, divided by activities and work streams. This is a fast access memory to help navigate the activities and what is next.
 - Worklog: historic record of everything that happened. Not to be used as WIP, but rather diagnosis and audit trails. Do not read the worklog unless specifically needed.
 - Session: the agent's current context.
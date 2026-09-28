---
name: posthog-task-report
description: Read one task attempt by another group from PostHog events through MCP, measure time and clicks, and link directly to its session replay. Read-only.
---

# PostHog task report

Use PostHog MCP read-only. Never change settings or data, and never invent missing events or links.

1. **Choose the task.** Match this repo to its PostHog project. Read its README for the flow's start and finish event names. Ask for the attempt's approximate time if needed.
2. **Find one attempt.** Filter to the deployed site's `$host` (ask for the Vercel URL if unknown), because local test runs land in the same project. Query start and finish events by `$session_id` and anonymous distinct ID. Get `$autocapture` clicks from that session and interval. If several attempts fit, show their times and ask which one to report on. Missing finish means completion was not observed.
3. **Measure.** Report elapsed time and click count. List clicks in order: timestamp, gap since previous click, element text or selector, and page. Mark unavailable fields clearly.
4. **Link the replay.** Use the start event's timestamped `replay_url` from `posthog.get_session_replay_url()`; fall back to the finish event. Check its `$session_id` with PostHog's recording tools if available. Include **[Watch this attempt in PostHog Replay](URL)**. Keep the link private to project members. If the property is absent, use only a verified URL returned by PostHog MCP. Never construct a guessed URL; mark the report incomplete if no direct link can be verified.
5. **Protect privacy.** Point to pauses, repeat clicks, and backtracking without guessing causes. Do not quote names, emails, addresses, free text, or secrets; flag sensitive property names only.

Present **Result**, **Click path** (table), **Hotspots**, and **Replay link**. Let the user decide what to change.


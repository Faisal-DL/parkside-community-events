import posthog from "posthog-js";

/**
 * Called at the start and finish of each task. Sends the event to PostHog with a
 * timestamped replay_url, so the task report can link straight to the session replay.
 * Does nothing until a PostHog token is set (see instrumentation-client.ts).
 */
export function journeyEvent(name: string, properties: Record<string, string> = {}) {
  if (typeof window === "undefined" || !process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) return;

  posthog.capture(name, {
    ...properties,
    replay_url: posthog.get_session_replay_url({ withTimestamp: true, timestampLookBack: 5 }),
  });
}

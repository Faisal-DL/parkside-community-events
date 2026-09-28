// Connect this hook to posthog.capture after running PostHog's Install with AI wizard.
// Include replay_url: posthog.get_session_replay_url({ withTimestamp: true, timestampLookBack: 5 }).
// PostHog env vars belong in .env.local (see .env.example), never in .env.
export function journeyEvent(name: string, properties?: Record<string, string>) {
  void name;
  void properties;
  // The base project runs without credentials or external services.
}

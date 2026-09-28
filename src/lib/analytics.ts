// Connect this hook to posthog.capture after running PostHog's Install with AI wizard.
// Include replay_url: posthog.get_session_replay_url() in the event properties.
export function journeyEvent(name: string, properties?: Record<string, string>) {
  void name;
  void properties;
  // The base project runs without credentials or external services.
}

// Connect this hook to posthog.capture after running PostHog's Install with AI wizard.
export function journeyEvent(name: string, properties?: Record<string, string>) {
  void name;
  void properties;
  // The base project runs without credentials or external services.
}

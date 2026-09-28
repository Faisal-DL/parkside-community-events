import posthog from "posthog-js";

// PostHog starts only when a project token is set: in .env.local locally, in Vercel when deployed.
// Traffic goes through this app's /ingest route (see next.config.ts), so ad blockers rarely block it.
const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

if (token) {
  posthog.init(token, {
    api_host: "/ingest",
    ui_host: "https://eu.posthog.com",
    defaults: "2026-01-30",
  });
}

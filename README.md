# Parkside Community Events

A self-contained Next.js demo for the Observability & Monitoring collab. It needs no account, database, email, OAuth, API key, or hosted backend. Reservations and suggestions stay in browser storage.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Check the production build with `npm run build`.

## Ready-to-use tasks

| Task for a partner | Starting point | Completed when |
| --- | --- | --- |
| Join the neighborhood repair café | Join an event | An `EV-…` reference appears |
| Check an existing place | Check a place; `EV-2042` is prefilled | Booking details appear |
| Suggest a new event | Suggest an event | An `IDEA-…` reference appears |

The garden walk is deliberately full, but two events have places open. The reset action clears only new data on this device; `EV-2042` remains available. Use invented details in the suggestion form.

## Deploy on Vercel

Fork and clone the repository. After adding PostHog, commit and push your changes, then import the fork into your own Vercel account. Use the detected Next.js preset and add the wizard's `NEXT_PUBLIC_` PostHog values before deploying. The base app needs no environment variables.

## PostHog integration point

The base app intentionally has no PostHog credentials. [`src/lib/analytics.ts`](src/lib/analytics.ts) contains a `journeyEvent` hook already called at each task's start and completion. After running [PostHog's Install with AI wizard](https://posthog.com/docs/session-replay/installation), ask your coding agent to connect it to `posthog.capture(name, properties)`, include a `replay_url` property from [`posthog.get_session_replay_url({ withTimestamp: true, timestampLookBack: 5 })`](https://posthog.com/docs/references/posthog-js) on each journey event, and verify autocapture and session replay. The reporting skill uses the start event's URL to open the matching private replay near the beginning of the flow.

Suggested agent prompt: “Connect `src/lib/analytics.ts` to the PostHog client installed by the wizard. Preserve all existing journey event names and properties, add `replay_url` from `posthog.get_session_replay_url({ withTimestamp: true, timestampLookBack: 5 })` to each event, and keep user-entered text out of event properties. Check that a start and finish event, autocaptured clicks, and a replay appear for one local test flow. Run the build and tell me which `NEXT_PUBLIC_` values to add in Vercel.”

| Flow | Start | Finish |
| --- | --- | --- |
| Join event | `reservation_started` | `reservation_completed` |
| Check place | `lookup_started` | `lookup_completed` |
| Suggest event | `suggestion_started` | `suggestion_completed` |

Add the client-side PostHog environment values produced by the wizard to Vercel before redeploying. Review [PostHog's replay privacy controls](https://posthog.com/docs/session-replay/privacy) and use fictional input only.

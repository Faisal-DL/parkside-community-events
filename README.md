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

Fork the repository, import the fork into your own Vercel account, and deploy with the detected Next.js preset. The base app needs no environment variables.

## PostHog integration point

The base app intentionally has no PostHog credentials. [`src/lib/analytics.ts`](src/lib/analytics.ts) contains a `journeyEvent` hook already called at each task's start and completion. After running [PostHog's Install with AI wizard](https://posthog.com/docs/session-replay/installation), connect it to `posthog.capture(name, properties)` and verify autocapture and session replay.

| Flow | Start | Finish |
| --- | --- | --- |
| Join event | `reservation_started` | `reservation_completed` |
| Check place | `lookup_started` | `lookup_completed` |
| Suggest event | `suggestion_started` | `suggestion_completed` |

Add the client-side PostHog environment values produced by the wizard to Vercel before redeploying. Review [PostHog's replay privacy controls](https://posthog.com/docs/session-replay/privacy) and use fictional input only.

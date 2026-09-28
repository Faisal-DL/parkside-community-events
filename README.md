# Parkside Community Events

A self-contained Next.js demo for the Observability & Monitoring collab. It needs no account, database, email, OAuth, API key, or hosted backend. Reservations and suggestions stay in browser storage.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Check the production build with `npm run build`.

## Ready-to-use tasks

| Task for the other group | Starting point | Completed when |
| --- | --- | --- |
| Join the neighborhood repair café | Join an event | An `EV-…` reference appears |
| Check an existing place | Check a place; `EV-2042` is prefilled | Booking details appear |
| Suggest a new event | Suggest an event | An `IDEA-…` reference appears |

The garden walk is deliberately full, but two events have places open. The reset action clears only new data on this device; `EV-2042` remains available. Use invented details in the suggestion form.

## Exercise

Follow [GUIDE.md](GUIDE.md): create your repo from this template, add PostHog (EU cloud), deploy to Vercel, swap tasks with the other group, and generate a replay-linked report with the included `posthog-task-report` skill.

## PostHog integration point

The base app has no PostHog dependency or credentials and runs before instrumentation. [`src/lib/analytics.ts`](src/lib/analytics.ts) contains a `journeyEvent` hook already called at each task's start and completion. The guide shows how to connect it to `posthog.capture` with a timestamped `replay_url` from [`posthog.get_session_replay_url()`](https://posthog.com/docs/references/posthog-js). The six journey event names are:

| Flow | Start | Finish |
| --- | --- | --- |
| Join an event | `reservation_started` | `reservation_completed` |
| Check a place | `lookup_started` | `lookup_completed` |
| Suggest an event | `suggestion_started` | `suggestion_completed` |

The app sends no personal data by itself. Use invented details, and review [PostHog's replay privacy controls](https://posthog.com/docs/session-replay/privacy) before recording real users.

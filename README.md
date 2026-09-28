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

## Set up PostHog and Vercel

**With Claude Code:** paste the setup prompt from [GUIDE.md](GUIDE.md#quick-setup-with-claude-code) into Claude Code, and it does the steps below for you.

**By hand:**

1. **Create your repo:** click **Use this template → Create a new repository**, then clone it and run `npm install`.
2. **Add PostHog:** sign up at [eu.posthog.com/signup](https://eu.posthog.com/signup) (EU cloud, free). Copy your project token from **Settings → Project → Project token**, then run `cp .env.example .env.local` and paste the token after `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=`. Check that **Settings → Session replay → Record user sessions** is on.
3. **Check it locally:** run `npm run dev`, complete a task, and look under **Activity** and **Session replay** in PostHog. New events can take a few minutes to appear.
4. **Deploy on Vercel:** at [vercel.com/new](https://vercel.com/new), import your repo, keep the Next.js preset, and paste your token into the `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` environment variable. Skip the optional PostHog integration, then click **Deploy**.

No code changes are needed. For the rest of the exercise (swapping tasks, the agent report, and the replay), follow [GUIDE.md](GUIDE.md).

## PostHog

PostHog is already wired in and stays off until you set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` (copy `.env.example` to `.env.local` locally, and add the same variable in Vercel). [`instrumentation-client.ts`](instrumentation-client.ts) starts PostHog with autocapture and session replay, and [`next.config.ts`](next.config.ts) routes its traffic through the app's `/ingest` path so ad blockers rarely block it. [`src/lib/analytics.ts`](src/lib/analytics.ts) sends each task's start and finish event with a timestamped `replay_url`. The six task events are:

| Flow | Start | Finish |
| --- | --- | --- |
| Join an event | `reservation_started` | `reservation_completed` |
| Check a place | `lookup_started` | `lookup_completed` |
| Suggest an event | `suggestion_started` | `suggestion_completed` |

The app sends no personal data by itself. Inputs are masked in replays by default. Use invented details, and review [PostHog's replay privacy controls](https://posthog.com/docs/session-replay/privacy) before recording real users.

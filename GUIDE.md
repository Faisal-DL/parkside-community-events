# Step-by-step guide: events and replay

You and your partner each deploy one demo app with PostHog, try a task on each other's app, and then compare what the events say with what the replay shows.

**Time:** 50 minutes. The times below are targets; if a step overruns, check **Troubleshooting** at the end.

## Before you start (do this before the session if you can)

You need:

- A **GitHub** account.
- A **Vercel** account. Sign up at [vercel.com/signup](https://vercel.com/signup) with **Continue with GitHub** so Vercel can see your repositories. The free Hobby plan is enough.
- A **PostHog** account. Sign up at [posthog.com/signup](https://posthog.com/signup). No card is needed. Pick **EU** or **US** cloud; either works.
- **Node.js 20.9 or newer** (`node -v`) and **git**.
- A coding agent that runs in your project folder: **Claude Code**, **Codex**, or **Cursor**.

Turn off ad blockers for your own deployment and your partner's. Many of them block PostHog.

## 1. Pick your app (1 min)

Pair up. One of you takes **Northstar Neighborhood Service Desk**, the other **Parkside Community Events**:

- Northstar: <https://github.com/Faisal-DL/northstar-neighborhood-desk>
- Parkside: <https://github.com/Faisal-DL/parkside-community-events>

## 2. Make your own copy and run it (4 min)

1. Open your app's GitHub page and click **Use this template → Create a new repository**.
2. Choose your account as the owner, keep the name, and select **Public** or **Private**. Click **Create repository**.
3. On your new repository, click **Code** and copy the HTTPS URL. Then run:

   ```bash
   git clone <your-repo-url>
   cd <repo-name>
   npm install
   npm run dev
   ```

4. Open <http://localhost:3000> and click through one task from the table in `README.md`. Stop the server with `Ctrl+C` when you are done.

## 3. Install PostHog with AI (8 min)

In the project folder, run:

```bash
npx -y @posthog/wizard@latest
```

1. Choose your cloud region (EU or US, whichever you signed up with). A browser window opens: log in and **authorize** the wizard.
2. Pick your project when asked. Most new accounts have one, called **Default project**.
3. Let the wizard finish. It installs `posthog-js`, adds the PostHog setup for Next.js, and writes your project key and host to **`.env.local`**.
4. Check that `.env.local` is **not** staged in git: `git status` must not list it. The repo's `.gitignore` already excludes it.

## 4. Connect the task events (5 min)

The app already calls `journeyEvent` in `src/lib/analytics.ts` when each task starts and finishes. Open your coding agent in the project folder and paste this prompt:

> Connect `src/lib/analytics.ts` to the PostHog client the wizard installed. Forward each call to `posthog.capture(name, properties)`, keep all existing event names and properties, and add a `replay_url` property from `posthog.get_session_replay_url({ withTimestamp: true, timestampLookBack: 5 })`. Don't put anything the user types into event properties. Make sure session replay and autocapture are on. Then run `npm run build` and tell me which `NEXT_PUBLIC_` variables I need in Vercel.

Review the change before you accept it. The diff should touch only a few lines.

## 5. Check it locally (3 min)

1. Run `npm run dev` and complete one task in your browser.
2. In PostHog, open **Activity** in the left sidebar. Within a minute you should see your `…_started` and `…_completed` events. Click one: it should have a `replay_url` property.
3. Open **Replay** in the left sidebar. Your session should be listed; it can take a minute or two to appear.

If nothing shows up, check the **Troubleshooting** section before you deploy.

## 6. Push and deploy to Vercel (7 min)

1. Commit and push:

   ```bash
   git add -A
   git commit -m "Add PostHog"
   git push
   ```

2. Go to [vercel.com/new](https://vercel.com/new). Under **Import Git Repository**, find your repo and click **Import**. If it is missing, click **Adjust GitHub App Permissions** and allow access to the repository.
3. Keep the detected **Next.js** preset. Open **Environment Variables** and add every `NEXT_PUBLIC_POSTHOG_…` line from your `.env.local` (name and value).
4. Click **Deploy**. When it finishes, copy the domain Vercel gives you, for example `https://your-repo.vercel.app`.

## 7. Swap tasks with your partner (8 min)

1. Send your partner your Vercel URL and **one** task from your `README.md` table. Don't explain how to do it.
2. Your partner does the task in a normal browser window, with invented details only. Note roughly when they started, for example 10:42.
3. Then swap: do the task your partner gives you on their app.

## 8. Get the report with your agent (8 min)

1. Give your agent access to PostHog:

   ```bash
   npx -y @posthog/wizard@latest mcp add
   ```

   Pick your agent, log in if asked, then **restart the agent** so it loads the PostHog tools.
2. The report skill is already in your repo, at `.claude/skills/posthog-task-report/` and `.agents/skills/posthog-task-report/`. In your agent, ask:

   > Write a PostHog task report for my partner's "<task name>" attempt on my deployed app, started around <time>.

3. The agent reads your PostHog data, measures time and clicks, lists hotspots, and ends with a **Watch this attempt in PostHog Replay** link.

## 9. Watch the replay (5 min)

1. Open the report's replay link while logged in to PostHog. The player starts just before the task began.
2. If you need to find it by hand: go to **Replay** in PostHog's sidebar, set the date filter to the last hour, and open the session whose time matches your partner's attempt.
3. Compare the report's hotspots with what you see. Where did your partner pause, backtrack, or click twice?

## At the end

Show your partner's report, its replay link, and one improvement that both the events and the replay support.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Wizard can't find your project or asks for a region | Use the same region (EU or US) you signed up with. |
| No events in **Activity** | Turn off your ad blocker, hard-reload the page, and check that `.env.local` (locally) or the Vercel environment variables (deployed) have the PostHog values. After adding variables in Vercel, **redeploy**. |
| Events arrive but no replay | In PostHog, open **Settings → Session replay** and turn on **Record user sessions**. Replays can take a couple of minutes to appear. |
| `replay_url` is missing on events | Ask your agent to check that `get_session_replay_url` is called on the PostHog client, after it has initialized. |
| Agent has no PostHog tools | Re-run `npx -y @posthog/wizard@latest mcp add` and restart your agent completely. |
| Vercel build fails | Run `npm run build` locally, fix the error with your agent, then push again. Vercel redeploys automatically. |

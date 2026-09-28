# Step-by-step guide: events and replay

You and your partner each deploy one demo app with PostHog, try a task on each other's app, and then compare what the events say with what the replay shows.

**Time:** 50 minutes. The PostHog wizard alone takes about 10 minutes, so start it early and read ahead while it works. If a step goes wrong, check **Troubleshooting** at the end.

## Before you start (ideally before the session)

You need:

- A **GitHub** account.
- A **Vercel** account. Sign up at [vercel.com/signup](https://vercel.com/signup) with **Continue with GitHub**. The free Hobby plan is enough.
- A **PostHog** account. Sign up at [posthog.com/signup](https://posthog.com/signup). No card is needed. Pick **EU** or **US** cloud; either works. Stay logged in to PostHog in your default browser.
- **Node.js 20.9 or newer** (`node -v`) and **git**.
- A coding agent that runs in your project folder: **Claude Code**, **Codex**, or **Cursor**.

Turn off ad blockers for your own deployment and your partner's. Many of them block PostHog.

## 1. Pick your app (1 min)

Pair up. One of you takes **Northstar Neighborhood Service Desk**, the other **Parkside Community Events**:

- Northstar: <https://github.com/Faisal-DL/northstar-neighborhood-desk>
- Parkside: <https://github.com/Faisal-DL/parkside-community-events>

## 2. Make your own copy and run it (4 min)

1. Open your app's GitHub page and click **Use this template → Create a new repository**.
2. Choose **your account** as the owner and type a name, for example `northstar-desk`. Public or Private both work. Click **Create repository**.
3. On your new repository, click **Code** and copy the HTTPS URL. Then run:

   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   npm install
   npm run dev
   ```

   npm may warn that an install script "is not yet covered by allowScripts". You can ignore that.
4. Open <http://localhost:3000> and click through one task from the table in `README.md`. Stop the server with `Ctrl+C`.

## 3. Install PostHog with the wizard (10 min)

In the project folder, run:

```bash
npx -y @posthog/wizard@latest
```

1. It detects **Next.js**. Press **Enter** on **Continue**.
2. Your browser opens. If asked, log in to PostHog and **authorize** the wizard. The wizard then works on its own for about 8 minutes.
3. When it asks **Install the PostHog MCP server and plugin?**, choose **Install**. Select your agent with **Enter**, move down to **Confirm**, and press **Enter**. This gives your agent read access to your PostHog data later.
4. Skip the Slack step with **Esc**. Press **Enter** to keep the installed skills.
5. **Claude Code users:** run the command the wizard prints at the end:

   ```bash
   claude mcp login plugin:posthog:posthog
   ```

   In the browser page that opens, choose **Read-only** and click **Authorize**. Other agents ask you to log in the first time they use PostHog.

The wizard installs `posthog-js`, adds `instrumentation-client.ts`, and writes your project token and host to **`.env`** or **`.env.local`**. The repo's `.gitignore` already keeps both out of git.

## 4. Check the task events (2 min)

The app calls `journeyEvent` in `src/lib/analytics.ts` when each task starts and finishes. The wizard usually connects it to PostHog for you. Open the file and check that it calls `posthog.capture(...)` with a `replay_url` from `posthog.get_session_replay_url(...)`.

If it doesn't, paste this into your coding agent:

> Connect `src/lib/analytics.ts` to the PostHog client the wizard installed. Forward each call to `posthog.capture(name, properties)`, keep all existing event names and properties, and add a `replay_url` property from `posthog.get_session_replay_url({ withTimestamp: true, timestampLookBack: 5 })`. Don't put anything the user types into event properties.

## 5. Check it locally (3 min)

1. Run `npm run dev` and complete one task in your browser.
2. In PostHog, open **Activity** in the left sidebar. Within a minute you should see your `…_started` and `…_completed` events. Click one: it has a `replay_url` property.
3. Open **Session replay** in the left sidebar. Your session is listed, usually after a minute.

## 6. Push and deploy to Vercel (6 min)

1. Commit and push:

   ```bash
   git add -A
   git commit -m "Add PostHog"
   git push
   ```

2. Go to [vercel.com/new](https://vercel.com/new). Under **Import Git Repository**, find your repo and click **Import**. If it is missing, click **Adjust GitHub App Permissions** and give Vercel access to it, or paste your repo's GitHub URL into the box at the top of the page.
3. Keep the **Next.js** preset. Open **Environment Variables**. Vercel already lists `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`. Paste each value from your `.env` or `.env.local` file.
4. Skip the **PostHog** entry under **Optional Integrations**. You already have PostHog set up.
5. Click **Deploy**. If Vercel shows **Create Project** first, click that, then **Deploy**. After about a minute, click **Continue to Project** and copy your domain, for example `https://northstar-desk.vercel.app`.

## 7. Swap tasks with your partner (6 min)

1. Send your partner your Vercel URL and **one** task from your `README.md` table. Don't explain how to do it.
2. Your partner does the task in a normal browser window, with invented details only. Write down roughly when they started, for example 10:42.
3. Then swap: do the task your partner gives you on their app.

## 8. Get the report from your agent (6 min)

The report skill is already in your repo, at `.claude/skills/posthog-task-report/` and `.agents/skills/posthog-task-report/`. Start your agent in the project folder (restart it if it was open during the wizard) and ask:

> Write a PostHog task report for my partner's "<task name>" attempt on my deployed app <your Vercel URL>, started around <time and timezone>.

The agent reads your PostHog data, measures time and clicks, lists hotspots, and ends with a **Watch this attempt in PostHog Replay** link. It takes about a minute.

## 9. Watch the replay (5 min)

1. Open the report's replay link while logged in to PostHog. The player opens at the start of the task.
2. To find it by hand, open **Session replay** in PostHog's sidebar and pick the session with your Vercel domain at your partner's time.
3. Compare the report's hotspots with what you see. Where did your partner pause, backtrack, or click twice?

## At the end

Show your partner's report, its replay link, and one improvement that both the events and the replay support.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `git push` says **Repository not found** | Git is using a different GitHub account. Run `gh auth login` as the owner of your copy (or update your saved GitHub credentials) and push again. |
| No events in **Activity** | Turn off your ad blocker and hard-reload. Check that `.env`/`.env.local` (locally) or the Vercel environment variables (deployed) have both PostHog values. After changing variables in Vercel, **redeploy**. |
| Vercel shows the deployment as **Blocked** | Your git commit email isn't linked to your Vercel account. Run `git config user.email <the email on your GitHub account>`, make a new commit, and push. |
| `npm run dev` fails with "…POSTHOG… variable required" | `.env`/`.env.local` is missing or empty. Re-run the wizard, or copy `.env.example` to `.env.local` and fill in your values from PostHog **Settings → Project**. |
| Events arrive but no replay | In PostHog, open **Settings → Session replay** and turn on **Record user sessions**. Replays can take a couple of minutes to appear. |
| `replay_url` is missing on events | Redo step 4. |
| Your agent has no PostHog tools | Run `npx -y @posthog/wizard@latest mcp add`, authenticate (step 3.5 for Claude Code), and restart the agent. |
| The report mixes in your own test runs | Give the agent your Vercel URL; it filters to that domain. |
| Vercel build fails | Run `npm run build` locally, fix the error with your agent, then push again. Vercel redeploys automatically. |

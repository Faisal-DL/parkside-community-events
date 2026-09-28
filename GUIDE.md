# Guide: PostHog events and session replay

Your group deploys one demo app with PostHog, swaps tasks with a group that has the other app, and compares an agent's event report with the session replay.

**Time:** 50 minutes. The wizard (step 2) takes about 10; read ahead while it runs.

## Prerequisites

- **Ad blocker off** for `*.vercel.app` and `localhost`. Most ad blockers block PostHog.
- **GitHub** account.
- **Vercel** account: sign up at [vercel.com/signup](https://vercel.com/signup) with **Continue with GitHub** (free Hobby plan).
- **PostHog** account on **EU cloud**: sign up at [eu.posthog.com/signup](https://eu.posthog.com/signup) (free, no card). Stay logged in in your default browser.
- **Node.js 20.9+** (`node -v`) and **git**.
- A coding agent: **Claude Code**, **Codex**, or **Cursor**.

Your group gets one app:

- Northstar: <https://github.com/Faisal-DL/northstar-neighborhood-desk>
- Parkside: <https://github.com/Faisal-DL/parkside-community-events>

## 1. Clone the repo (4 min)

1. On your app's GitHub page, click **Use this template → Create a new repository**. Pick your account as owner, enter a name (e.g. `northstar-desk`), and click **Create repository**.
2. Clone and run it:

   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   npm install
   npm run dev
   ```

   Ignore npm's warning about install scripts and `allowScripts`.
3. Open <http://localhost:3000>, try one task from `README.md`, then stop the server (`Ctrl+C`).

## 2. Run the PostHog wizard (10 min)

```bash
npx -y @posthog/wizard@latest
```

1. Press **Enter** on **Continue**. In the browser tab that opens, authorize the wizard. It then works on its own for about 8 minutes: it installs PostHog, connects the app's task events, and writes your keys to `.env.local` (git-ignored).
2. At **Install the PostHog MCP server and plugin?**, choose **Install**, select your agent with **Enter**, move to **Confirm**, and press **Enter**.
3. Skip Slack with **Esc**. Press **Enter** to keep the installed skills.
4. **Claude Code only:** run `claude mcp login plugin:posthog:posthog`, choose **Read-only**, and click **Authorize**. Other agents ask you to log in on first use.

## 3. Verify events locally (3 min)

1. Run `npm run dev` and complete one task.
2. In PostHog, open **Activity**. Your `…_started` and `…_completed` events appear within a minute, each with a `replay_url` property.
3. Open **Session replay**. Your session is listed after about a minute.

## 4. Deploy to Vercel (6 min)

1. Push your changes:

   ```bash
   git add -A
   git commit -m "Add PostHog"
   git push
   ```

2. At [vercel.com/new](https://vercel.com/new), click **Import** next to your repo. If it's missing, click **Adjust GitHub App Permissions** and allow it, or paste the repo URL into the box at the top.
3. Keep the **Next.js** preset. Under **Environment Variables**, Vercel already lists `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`: paste the values from `.env.local`.
4. Ignore the **PostHog** entry under **Optional Integrations**.
5. Click **Deploy** (if **Create Project** appears first, click it, then **Deploy**). When it's done, click **Continue to Project** and copy the domain, e.g. `https://northstar-desk.vercel.app`.

## 5. Swap tasks with the other group (6 min)

1. Send the other group your Vercel URL and one task from your `README.md`, without explaining how to do it. Note the time they start.
2. Do the task they give you on their app, using invented details only.

## 6. Generate the report (6 min)

The `posthog-task-report` skill is already in your repo. Start your agent in the project folder (restart it if it was open during the wizard) and ask:

> Write a PostHog task report for the other group's "<task name>" attempt on my deployed app <your Vercel URL>, started around <time and timezone>.

After about a minute you get the task time, click path, hotspots, and a **Watch this attempt in PostHog Replay** link.

## 7. Watch the replay (5 min)

Open the report's replay link while logged in to PostHog. It starts at the beginning of the task. Without the link: **Session replay** → the session on your Vercel domain at the task time.

## At the end

Walk the other group through your report and replay.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Wizard or PostHog opens on US cloud | Log in at [eu.posthog.com](https://eu.posthog.com), then rerun the wizard. |
| No events in **Activity** | Check your ad blocker, hard-reload, and check the two values in `.env.local` (locally) or in Vercel (deployed). After changing Vercel variables, redeploy. |
| `npm run dev` fails: "…POSTHOG… variable required" | `.env.local` is missing. Rerun the wizard, or copy `.env.example` to `.env.local` and add your project token from PostHog **Settings → Project**. |
| Events have no `replay_url` | Ask your agent: "Connect `src/lib/analytics.ts` to `posthog.capture` and add `replay_url` from `posthog.get_session_replay_url({ withTimestamp: true, timestampLookBack: 5 })`." |
| Events arrive but no replay | PostHog **Settings → Session replay** → turn on **Record user sessions**. |
| `git push`: **Repository not found** | Git is logged in as another GitHub account. Log in as your repo's owner (`gh auth login`) and push again. |
| Vercel deployment **Blocked** | Your commit email isn't linked to your Vercel account. Run `git config user.email <your GitHub email>`, commit again, and push. |
| Agent has no PostHog tools | Run `npx -y @posthog/wizard@latest mcp add`, log in (step 2.4 for Claude Code), and restart the agent. |
| Vercel build fails | Run `npm run build` locally, fix it with your agent, and push again. |

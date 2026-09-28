# Guide: PostHog events and session replay

Your group deploys one demo app with PostHog, swaps tasks with a group that has the other app, and compares an agent's event report with the session replay. PostHog is already wired into the app; you only add your project token.

**Time:** 50 minutes, about 35 of them for the steps below.

## Quick setup with Claude Code

Open Claude Code in the folder where you keep your projects and paste the prompt below. Claude clones, configures and deploys the app for you. You pick your app, create your repo from the template, paste your PostHog token, and approve the Vercel and PostHog logins in your browser. Using another agent, or prefer to do it by hand? Follow the steps below instead.

```text
Set up the PostHog events and session replay exercise for me, from template to live Vercel deployment. Do everything you can yourself. Before each step, explain in one or two plain sentences what you're doing and why, so I can follow along.

Only stop for my input at the three STOP points below. Whenever you run a command that opens a login or authorization page, tell me first that it opens in my default browser, what account to log in with, and which button to click. Then wait for the command to finish.

Rules: PostHog is EU cloud only. Use only free tools. PostHog is already wired into the app, so don't change its code. Never print the token back to me, and never commit .env.local. If something fails, check the Troubleshooting table in GUIDE.md and fix it yourself where you can.

STOP 1: Welcome me. Tell me that I need GitHub, Vercel (sign up with GitHub) and PostHog EU (eu.posthog.com/signup) accounts. Then ask which app my group got:
- Northstar Neighborhood Service Desk: https://github.com/Faisal-DL/northstar-neighborhood-desk
- Parkside Community Events: https://github.com/Faisal-DL/parkside-community-events

STOP 2: Tell me how to create my repo from the template:
1. Open the app's link and click "Use this template" → "Create a new repository".
2. Pick my account as owner, name it (suggest northstar-desk or parkside-events), and choose Public.
3. Click "Create repository", then paste the new repo's URL here.

Then, without stopping: check that node -v is 20.9 or newer and git is installed. Clone the repo (if the clone is empty, wait a few seconds and git pull; GitHub fills template repos in with a short delay). cd into it, run npm install (the allowScripts warning is harmless), and start npm run dev in the background.

STOP 3: Tell me the local URL (usually http://localhost:3000, but use whichever port the dev server picked) and to try one task from README.md. Then ask me to confirm that it works, and to paste my PostHog project token (eu.posthog.com → Settings → Project → Project token, starts with phc_).

Then continue without stopping:

4. Connect the app to PostHog:
   - Copy .env.example to .env.local, set NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN to my token, and check that git status doesn't list .env.local.
   - Restart the dev server.
   - Check that session replay is on: GET https://eu-assets.i.posthog.com/array/<token>/config. If sessionRecording is false, tell me to turn on eu.posthog.com → Settings → Session replay → "Record user sessions", then check again.
   - Tell me I can click through a task now and see it under Activity and Session replay in PostHog. New events can take a few minutes to show up.

5. Register PostHog for the report later: claude mcp add --scope user --transport http posthog https://mcp.posthog.com/mcp (if a server named posthog already exists, keep it). Don't run claude mcp login; it needs an interactive terminal. I'll authenticate in step 7.

6. Deploy with the Vercel CLI (no push is needed, because the code is unchanged):
   - npx vercel login. Tell me first that a Vercel page opens in my default browser, and that I should log in with GitHub and confirm.
   - npx vercel link --yes --project <repo name>
   - npx vercel env add NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN production --value <token> --no-sensitive --yes (the project token is a public browser key)
   - npx vercel deploy --prod --yes, then check that the production URL returns HTTP 200.

7. Finish with a short summary:
   - My live URL, and the three tasks from README.md to choose from when I give the other group a task. Mention that the Vercel project is connected to my GitHub repo, so future pushes redeploy automatically.
   - Next steps:
     1. Swap tasks with the other group.
     2. Restart Claude Code in the repo folder, type /mcp, select posthog → Authenticate. A PostHog page opens in my default browser: choose Read-only and click Authorize.
     3. Wait a few minutes after the other group finishes, then ask: Write a PostHog task report for the other group's "<task>" attempt on my deployed app <URL>, started around <time and timezone>.
```

When Claude is done, continue at **6. Swap tasks with the other group**.

## Prerequisites

- **GitHub** account.
- **Vercel** account: sign up at [vercel.com/signup](https://vercel.com/signup) with **Continue with GitHub** (free Hobby plan).
- **PostHog** account on **EU cloud**: sign up at [eu.posthog.com/signup](https://eu.posthog.com/signup) (free, no card).
- **Node.js 20.9+** (`node -v`) and **git**.
- A coding agent: **Claude Code**, **Codex**, or **Cursor**.

Your group gets one app:

- Northstar: <https://github.com/Faisal-DL/northstar-neighborhood-desk>
- Parkside: <https://github.com/Faisal-DL/parkside-community-events>

## 1. Clone the repo (4 min)

1. On your app's GitHub page, click **Use this template → Create a new repository**. Pick your account as owner, enter a name (e.g. `northstar-desk`), and click **Create repository**.
2. Clone it and install:

   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   npm install
   ```

   Ignore npm's warning about install scripts and `allowScripts`.

## 2. Add your PostHog token (2 min)

1. In PostHog, open **Settings → Project** and copy the **Project token** (starts with `phc_`).
2. Create `.env.local` from the example and paste the token after the `=`:

   ```bash
   cp .env.example .env.local
   ```

3. In PostHog, open **Settings → Session replay** and check that **Record user sessions** is on.

`.env.local` is git-ignored. The app sends nothing to PostHog until the token is set.

## 3. Verify events locally (4 min)

1. Run `npm run dev`, open <http://localhost:3000>, and complete one task from `README.md`.
2. In PostHog, open **Activity**. Your `…_started` and `…_completed` events appear, each with a `replay_url` property. This can take a few minutes.
3. Open **Session replay**. Your session is listed.

## 4. Connect PostHog to your agent (2 min)

- **Claude Code:**

  ```bash
  claude mcp add --scope user --transport http posthog https://mcp.posthog.com/mcp
  claude mcp login posthog
  ```

  In the page that opens in your browser, choose **Read-only** and click **Authorize**.
- **Codex or Cursor:** run `npx -y @posthog/wizard@latest mcp add`, select your agent, and log in when asked.

## 5. Deploy to Vercel (5 min)

1. At [vercel.com/new](https://vercel.com/new), click **Import** next to your repo. If it's missing, click **Adjust GitHub App Permissions** and allow it, or paste the repo URL into the box at the top.
2. Keep the **Next.js** preset. Under **Environment Variables**, Vercel already lists `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`: paste your token.
3. Ignore the **PostHog** entry under **Optional Integrations**.
4. Click **Deploy** (if **Create Project** appears first, click it, then **Deploy**). When it's done, click **Continue to Project** and copy the domain, e.g. `https://northstar-desk.vercel.app`.

## 6. Swap tasks with the other group (6 min)

1. Send the other group your Vercel URL and one task from your `README.md`, without explaining how to do it. Note the time they start.
2. Do the task they give you on their app, using invented details only.

## 7. Generate the report (6 min)

The `posthog-task-report` skill is already in your repo. Wait a few minutes after the other group finishes, so PostHog has their events. Then start your agent in the project folder (restart it if it was open during step 4) and ask:

> Write a PostHog task report for the other group's "<task name>" attempt on my deployed app <your Vercel URL>, started around <time and timezone>.

You get the task time, click path, hotspots, and a **Watch this attempt in PostHog Replay** link.

## 8. Watch the replay (5 min)

Open the report's replay link while logged in to PostHog. It starts at the beginning of the task. Without the link: **Session replay** → the session on your Vercel domain at the task time.

## At the end

Walk the other group through your report and replay.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| No events in **Activity** | Wait a few minutes; PostHog can lag. Then check the token in `.env.local` (locally) or in Vercel (deployed), and restart `npm run dev` after editing `.env.local`. After changing the Vercel variable, redeploy. |
| Events arrive but no replay | PostHog **Settings → Session replay** → turn on **Record user sessions**. |
| Still nothing arrives | Turn off your ad blocker for the page and hard-reload. |
| The report finds no attempt | Wait a few more minutes and ask again, and give the agent your Vercel URL and the start time. |
| Agent has no PostHog tools | Redo step 4 and restart the agent. |
| Vercel build fails | Run `npm run build` locally, fix it with your agent, and push. Vercel redeploys automatically. |

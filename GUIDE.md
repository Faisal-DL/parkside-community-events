# Guide: PostHog events and session replay

Your group deploys one demo app with PostHog, swaps tasks with a group that has the other app, and compares an agent's event report with the session replay. PostHog is already wired into the app; you only add your project token.

**Time:** 50 minutes, about 35 of them for the steps below.

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

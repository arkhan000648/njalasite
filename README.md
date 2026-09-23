# GKStreams Mirror List

Informational landing page for GKStreams mirror domains. **No streams or media are hosted here.**

## Stack

- **Astro** static site → **GitHub Pages**
- **cron-job.org** (free) every 5 minutes → GitHub `repository_dispatch`
- **GitHub Actions** checks domains, builds, deploys

## Setup

1. Edit `src/data/domains.json` with your real mirror URLs.
2. Edit `src/data/config.ts` — set `SITE.url` (your Pages custom domain) and `SITE.email`.
3. Push this repo to GitHub as a **public** repository (Actions are free on public repos).
4. Repo **Settings → Pages → Source: GitHub Actions**.
5. Create a **fine-grained PAT**: only this repo, **Contents: Read and write**. Expiration 90 days.
6. In [cron-job.org](https://cron-job.org) create a job:
   - **URL:** `https://api.github.com/repos/<owner>/<repo>/dispatches`
   - **Method:** `POST`
   - **Headers:**
     - `Authorization: Bearer <YOUR_PAT>`
     - `Accept: application/vnd.github+json`
     - `Content-Type: application/json`
   - **Body:** `{"event_type":"check-domains"}`
   - **Schedule:** every 5 minutes
   - Expect HTTP **204** in logs
7. Manually run the workflow once (**Actions → Check domains and deploy → Run workflow**) or wait for the first cron hit.

## Local commands

```bash
npm install
npm run dev
npm run check:domains   # writes src/data/status.json + public/status.json
npm run build
```

## Files to customize

| File | Purpose |
|------|---------|
| `src/data/domains.json` | Mirror domain list |
| `src/data/config.ts` | Site URL, brand copy, DMCA email, footer disclaimer |
| `src/styles/global.css` | Design system |
| `public/` | Logo, favicons, manifest |

## Security notes

- Fine-grained PAT is stored **only** in cron-job.org (never in this repo).
- Rotate the PAT every 90 days.
- This site is a directory of links only; keep it that way for DMCA safety (`/disclaimer/`).

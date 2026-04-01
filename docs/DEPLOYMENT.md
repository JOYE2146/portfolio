# Step 11: Deployment & CI/CD

This repo is a **Vite + React** app under `frontend/`. You can ship it in two ways:

1. **Host dashboard (simplest)** — Connect GitHub in Vercel or Netlify; every push to `main` builds and deploys automatically. No deploy workflow required.
2. **GitHub Actions** — Optional workflows deploy with the Vercel or Netlify CLI when you flip a repository variable and add secrets.

## What’s in this repo

| Item | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | **Always on** — `npm ci`, `lint`, `build` on push/PR to `main`. |
| `.github/workflows/deploy-vercel.yml` | Optional production deploy via Vercel CLI. |
| `.github/workflows/deploy-netlify.yml` | Optional production deploy via Netlify CLI. |
| `frontend/vercel.json` | SPA fallback so React Router URLs refresh correctly on Vercel. |
| `netlify.toml` | Build + SPA redirect for Netlify. |

Enable **only one** of the deploy workflows (or neither if you use native Git integration).

---

## Vercel (recommended quick path)

### A. Native Git (no Action)

1. Sign in at [vercel.com](https://vercel.com) → **Add New…** → **Project** → Import `JOYE2146/portfolio`.
2. Set **Root Directory** to `frontend`.
3. Framework: Vite (auto). Build: `npm run build`, output: `dist`.
4. Add **Environment Variables** from `frontend/.env.example` (e.g. `VITE_PUBLIC_SITE_URL`, Firebase keys). Never commit real `.env`.
5. Deploy. Future pushes to `main` redeploy automatically.

Leave **`ENABLE_VERCEL_ACTION`** unset so `.github/workflows/deploy-vercel.yml` stays skipped.

### B. GitHub Action (`deploy-vercel.yml`)

1. Install Vercel CLI locally: `npm i -g vercel`.
2. In `frontend/`: `vercel link` and create/link the project.
3. In Vercel → Project → **Settings** → **General**, copy **Project ID** and **Team / Org ID**.
4. Create a token: Account **Settings** → **Tokens** → create token with appropriate scope.
5. In GitHub → repo **Settings** → **Secrets and variables** → **Actions**:
   - **Secrets**: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
   - **Variables**: `ENABLE_VERCEL_ACTION` = `true`
6. Push to `main` (or run **Actions** → **Deploy (Vercel)** → **Run workflow**).

If you use **both** native Git and this Action, you may get **double deploys** — pick one.

---

## Netlify

### A. Native Git

1. [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project** → GitHub → this repo.
2. **Base directory**: `frontend`. **Build command**: `npm run build`. **Publish directory**: `dist` (relative to `frontend`, Netlify resolves using `netlify.toml`).
3. Add environment variables (same ideas as `frontend/.env.example`).
4. Deploy. Pushes to `main` trigger builds.

Leave **`ENABLE_NETLIFY_ACTION`** unset unless you want the CLI workflow.

### B. GitHub Action (`deploy-netlify.yml`)

1. Netlify → **User settings** → **Applications** → **Personal access tokens** → create a token.
2. Site → **Site settings** → **Site details** → **Site ID**.
3. GitHub **Secrets**: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`.
4. GitHub **Variables**: `ENABLE_NETLIFY_ACTION` = `true`.

---

## Custom domain

### Vercel

1. Project → **Settings** → **Domains** → add `www.example.com` and/or `example.com`.
2. At your DNS registrar (Cloudflare, Namecheap, etc.), add the records Vercel shows (usually **A** apex to Vercel anycast, or **CNAME** `www` to `cname.vercel-dns.com`).
3. Wait for DNS propagation (often minutes, up to 48h).

Set **`VITE_PUBLIC_SITE_URL`** to `https://your-domain.com` (no trailing slash) before the next production build.

### Netlify

1. **Domain settings** → **Add custom domain** → follow DNS instructions (**CNAME** or Netlify load balancer).
2. Enable HTTPS (Let’s Encrypt) when Netlify marks the domain active.
3. Set **`VITE_PUBLIC_SITE_URL`** for SEO/analytics.

---

## Production checklist

- [ ] `VITE_PUBLIC_SITE_URL` matches the live URL.
- [ ] Firebase / EmailJS / analytics env vars set on the host.
- [ ] `npm run build` passes locally (`frontend/`).
- [ ] CI workflow green on `main`.

---

## Troubleshooting

- **404 on refresh** on deep links: ensure `frontend/vercel.json` rewrites (Vercel) or `netlify.toml` `[[redirects]]` (Netlify) are present and deployed.
- **CI fails**: run `cd frontend && npm ci && npm run lint && npm run build` locally.
- **Deploy job skipped**: set `ENABLE_VERCEL_ACTION` or `ENABLE_NETLIFY_ACTION` to `true` and add the matching secrets.

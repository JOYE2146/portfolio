# Portfolio platform

## Planning (Step 1)

**[docs/STEP-1-PLAN-AND-DEFINE.md](docs/STEP-1-PLAN-AND-DEFINE.md)** — deep plan: purpose, sections (Hero, Projects, Skills, **Architecture**, Blog, Contact), project showcase rubric, stack decisions (including Firebase vs current API), wireframes, and checklists.

## Git & GitHub

- **Global Git identity**: `user.name` **JOYE2146**, `user.email` **yosephbedasa85@email.com**.
- Local repo: branch **`main`**, root **`.gitignore`** (`node_modules/`, `dist/`, `.env`, etc.).
- **Remote `origin`** is set to **`https://github.com/JOYE2146/portfolio.git`**. If your GitHub username is different, run:

  `git remote set-url origin https://github.com/YOUR_USERNAME/portfolio.git`

### Publish this code to GitHub (you must log in once)

1. Create an **empty** repository on GitHub: [github.com/new](https://github.com/new)  
   - Owner: **JOYE2146** (or your account)  
   - Repository name: **`portfolio`**  
   - Do **not** add a README, `.gitignore`, or license (this project already has commits).

2. From the `Portfolio` folder, push (Git Credential Manager or a browser window may open):

   ```bash
   git push -u origin main
   ```

3. **Alternative — GitHub CLI** (after `winget install GitHub.cli` and a new terminal):  
   `gh auth login` then:

   ```bash
   gh repo create portfolio --public --source=. --remote=origin --push
   ```

   If `origin` already exists, use `gh repo create portfolio --public --push` after creating the repo on the website, then `git push -u origin main`.

## Run from repo root

Root **`package.json`** defines scripts so `npm run` works from `Portfolio/`:

| Command | Action |
|--------|--------|
| `npm run` | List all scripts |
| `npm run install:frontend` | Install dependencies inside `frontend/` |
| `npm run dev` | Start Vite dev server (usually [http://localhost:5173](http://localhost:5173)) |
| `npm run dev:fresh` | Clear Vite’s `.vite` cache then start dev (use if you see **504 Outdated Optimize Dep**) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

You can also use `cd frontend && npm run dev`.

---

Production-oriented developer portfolio: a **Next.js (App Router)** marketing site and **Express + PostgreSQL** API with an **admin CMS** (projects, blog, contact inbox), **JWT authentication**, validation, structured logging, and deployment paths for **Vercel** + **Render/Railway**.

## Architecture

```mermaid
flowchart LR
  subgraph client [Next.js on Vercel]
    Pages[App Router pages]
    Admin[Admin dashboard]
  end
  subgraph api [Express API]
    R[routes]
    C[controllers]
    S[services]
    M[models / SQL]
  end
  DB[(PostgreSQL)]
  Pages -->|REST JSON| R
  Admin -->|Bearer JWT| R
  R --> C --> S --> M --> DB
```

- **Frontend**: Server Components fetch public data with ISR (`revalidate`). Client components handle theme, motion (`prefers-reduced-motion`), contact form, and admin UI.
- **Backend**: Layered design under `backend/src/` — `routes` → `controllers` → `services` → `models` (parameterized `pg` queries). Cross-cutting: `middleware` (auth, validation, errors), `config` (env + pool), `utils/logger` (Winston).
- **Security**: Secrets only via env; Zod at startup and on request bodies; Helmet + CORS; rate limits on login and contact; JWT for admin routes; React escapes text by default (XSS).

## Repository layout

| Path | Role |
|------|------|
| `frontend/` | Next.js 16, Tailwind v4, Framer Motion, next-themes |
| `backend/` | Express API, PostgreSQL, migrations + seed |

There is a **root `package.json`** so you can run commands from `Portfolio/` (the repo root).

- **`npm install`** (once at root) installs `concurrently` for combined dev.
- **`npm run dev`** starts **both** the Next.js app and the API in one terminal.
- **`npm start`** runs **production** servers for both (run **`npm run build`** first so the frontend has a `.next` build).
- You can still use **`npm run dev:frontend`** / **`npm run dev:backend`** in separate terminals, or `cd frontend` / `cd backend` and run `npm run dev` there.

## Prerequisites

- Node.js **20+**
- PostgreSQL **14+** (local Docker, [Neon](https://neon.tech), [Supabase](https://supabase.com), etc.)

Local database (optional):

```bash
docker compose up -d
# DATABASE_URL=postgresql://portfolio:portfolio@localhost:5432/portfolio
```

## Backend setup

1. Create a database and copy env:

   ```bash
   cd backend
   cp .env.example .env
   ```

2. Set **`DATABASE_URL`** and **`JWT_SECRET`** (minimum **32 characters**). Set **`FRONTEND_URL`** to your Next.js origin in production (required for browser CORS).

3. Migrate and seed (creates admin user + demo content):

   ```bash
   npm install
   npm run migrate
   npm run seed
   ```

4. Run the API:

   ```bash
   npm run dev
   ```

   Health check: `GET http://localhost:4000/api/health`

### API surface (summary)

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/login` | Public (rate limited) |
| GET | `/api/projects` | Public |
| GET | `/api/projects/:id` | Public |
| POST/PUT/DELETE | `/api/projects` … | Admin JWT |
| POST | `/api/contact/submit` | Public (rate limited) |
| GET | `/api/contact/messages` | Admin JWT |
| GET | `/api/blog/posts` | Public |
| GET | `/api/blog/posts/:slug` | Public |
| CRUD | `/api/blog/admin/posts` … | Admin JWT |

Use **Postman** or `curl` against these routes; send admin writes with `Authorization: Bearer <token>`.

## Frontend setup

1. Copy environment file:

   ```bash
   cd frontend
   cp .env.example .env.local
   ```

2. Set **`NEXT_PUBLIC_API_URL`** to the API base (no trailing `/api`). Set **`NEXT_PUBLIC_SITE_URL`** to the deployed site URL for metadata and sitemap.

3. Run:

   ```bash
   npm install
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login) (credentials from backend seed / `.env`).

## Environment variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | API port (default `4000`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Signing secret (≥ 32 chars) |
| `JWT_EXPIRES_IN` | e.g. `7d` |
| `FRONTEND_URL` | Allowed CORS origin (e.g. `https://your-app.vercel.app`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used by `npm run seed` |
| `LOG_LEVEL` | `info`, `debug`, etc. |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | API origin, e.g. `https://your-api.onrender.com` |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for OG + sitemap |
| `NEXT_PUBLIC_SITE_NAME` | Display name (also edit `src/lib/constants.ts` for full copy) |

## Deployment

1. **Database**: Create a managed Postgres instance; run `npm run migrate` and `npm run seed` once (CI job, local, or one-off shell on the host).
2. **Backend (Render / Railway)**: Node service, `npm start`, set env vars; ensure `FRONTEND_URL` matches Vercel.
3. **Frontend (Vercel)**: Import `frontend/`, set `NEXT_PUBLIC_*` vars, build command `npm run build`, output `.next`.

**Contact email notifications**: extend `contact.service.js` (e.g. Resend, SendGrid, Nodemailer) after storing the row; keep secrets in env.

## Performance notes

- Next.js Image uses `unoptimized` for arbitrary project image URLs; tighten `next.config` `images.remotePatterns` if you only allow specific hosts.
- Home and blog index use ISR revalidation windows aligned with `fetch` options in `src/lib/api.ts`.
- Prefer Lighthouse in production builds with real URLs and API reachable from Vercel’s region.

## Optional extensions

- E2E or API tests (e.g. `supertest`, Playwright).
- Refresh tokens or httpOnly cookies for admin (with stricter CORS/cookie settings).
- Rich markdown for blog (e.g. `react-markdown` with sanitization).
- **GitHub Actions**: lint + `next build` on PR; optional API smoke tests (see Step 1 plan doc).

## License

Private / your choice — this scaffold is yours to customize.

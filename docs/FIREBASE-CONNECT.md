# Connect your Firebase web app (Vite)

Your [Firebase console](https://console.firebase.google.com/) project (e.g. `portfolio-44fb3`) supplies a **Web app** config object. This repo reads the same values from **environment variables** (not hardcoded), so keys are not committed when `.env` stays local.

## 1. Create `frontend/.env`

From the repo root:

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env` and map your SDK snippet like this:

| Firebase snippet field | Env variable |
|------------------------|--------------|
| `apiKey` | `VITE_FIREBASE_API_KEY` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `VITE_FIREBASE_APP_ID` |
| `measurementId` (optional) | `VITE_FIREBASE_MEASUREMENT_ID` |

**Important:** In Vite, only variables prefixed with `VITE_` are exposed to the browser bundle.

## 2. Enable products in Firebase Console

- **Authentication** — Build → Authentication → Sign-in method (e.g. Email/Password, Google).
- **Firestore** — Build → Firestore Database → Create database → start with **locked** rules, then tighten for production.
- **Analytics** — Usually enabled with the web app; `measurementId` must be present for `getAnalytics` to be useful.

## 3. Security (senior checklist)

- Client `apiKey` is not a secret by itself; **Firestore / Storage rules** and **Auth** protect data. See [Firestore security rules](https://firebase.google.com/docs/firestore/security/get-started).
- Restrict the API key in [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials) (HTTP referrers for your domains).
- Never commit `frontend/.env` (already listed in `.gitignore`).
- If keys were pasted in chat or a public repo, **rotate** them in the console.

## 4. Code in this repo

- `src/lib/firebase/config.ts` — builds options from `import.meta.env`.
- `src/lib/firebase/index.ts` — `getFirebaseApp()`, `getFirebaseDb()`, `getFirebaseAuth()`, `initFirebaseAnalytics()`.
- `src/components/FirebaseStatus.tsx` — shows project id + analytics status after init.

Example Firestore read (after rules allow it):

```ts
import { collection, getDocs } from 'firebase/firestore'
import { getFirebaseDb } from '../lib/firebase'

const db = getFirebaseDb()
const snap = await getDocs(collection(db, 'projects'))
```

## 5. Run

```bash
cd frontend
npm run dev
```

Restart the dev server after changing `.env`.

## 6. Troubleshooting (Vite: `Failed to resolve import "@firebase/auth"`)

The npm package `firebase` re-exports `firebase/auth` → `@firebase/auth`. If `@firebase/auth` (or other `@firebase/*` packages) is missing from `node_modules`—often after a partial install or sync issues (e.g. OneDrive)—Vite’s pre-bundle step fails.

**Fix:** This repo lists `@firebase/app`, `@firebase/auth`, `@firebase/firestore`, and `@firebase/analytics` as **direct** `frontend` dependencies (versions aligned with `firebase@12.x`). Run:

```bash
cd frontend
rm -rf node_modules/.vite
npm install
npm run dev
```

On Windows PowerShell: `Remove-Item -Recurse -Force node_modules\.vite`.

### 504 `Outdated Optimize Dep` (Firestore / other deps)

Vite pre-bundles deps under `node_modules/.vite/deps`. If the browser keeps an old `?v=` hash while the server regenerated files, you get **504 Outdated Optimize Dep**.

This project sets **`optimizeDeps.force` in dev** so each `npm run dev` rebuilds that cache. If you still see 504:

```bash
cd frontend
npm run dev:fresh
```

That deletes `node_modules/.vite` then starts Vite. Hard-refresh the browser (Ctrl+Shift+R).

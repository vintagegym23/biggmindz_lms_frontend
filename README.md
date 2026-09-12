# BiggMinds Academy — Frontend

React 19 + TypeScript + Vite + Tailwind v4 frontend for the BiggMinds Academy internal LMS. Talks to the real backend in `../lms_backend` — see that project's README for setup.

## Run locally

1. Start the backend first (`../lms_backend`, `npm run dev`, listening on port 4000 by default).
2. Copy `.env.example` to `.env` and point `VITE_API_BASE_URL` at the backend if it's not on `http://localhost:4000/api`.
3. `npm install`
4. `npm run dev` — serves on port 3000 (falls back to the next free port if taken).

## Demo logins

See `../lms_backend/README.md` for the full list — all seeded accounts use the password `password` (e.g. `admin@biggminds.com`, `tutor@biggminds.com`, `john@biggminds.com`).

## Architecture

- `src/api/` — the only place that knows the backend exists: `client.ts` (axios instance + JWT refresh interceptor), `adapters.ts` (backend DTO → frontend display type), one module per resource (`courseApi.ts`, `submissionApi.ts`, …).
- `src/context/AuthContext.tsx` / `AppDataContext.tsx` — real API-backed session and shared app data; every page reads through these rather than calling `src/api/*` directly (a few pages needing a single full-detail record — the Course Builder, the Course Player, the dashboard's course spotlight — fetch it directly since the shared course list is intentionally lightweight).
- `src/pages/`, `src/components/` — unchanged from the original Stitch/AI-Studio export's visual design; only the data-fetching internals were rewired.

## Scripts

- `npm run dev` — Vite dev server
- `npm run build` — production build (`tsc` + `vite build`)
- `npm run lint` — `tsc --noEmit`

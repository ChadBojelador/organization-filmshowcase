# Copilot instructions for this repository

## Architecture quick map
- Monorepo with two apps: `client/` (Vite + React 19 + Tailwind, ESM) and `server/` (Express 5, CommonJS, Supabase, Zod).
- Active client boot path is: `client/src/main.jsx` → `client/src/app/App.jsx` → `client/src/routes/index.jsx`.
- Server entry is `server/src/index.js`; all APIs are mounted under `/api` via `server/src/routes/index.js`.

## Critical data/auth flows
- There are two distinct auth systems on the server:
  - Supabase Auth routes: `/api/auth/sign-in`, `/api/auth/sign-up` (`server/src/services/authService.js`).
  - Custom director auth: `/api/login`, `/api/register` using `Directors`/`Members` tables and custom JWT (`server/src/services/loginService.js`, `server/src/services/directorService.js`, `server/src/utils/jwt.js`).
- Current routed UI uses custom director auth (`client/src/components/Login.jsx`, `client/src/components/Register.jsx` via `client/src/services/directorAuthService.js`).
- Token contract is custom HMAC SHA-256 JWT (not `jsonwebtoken`); keep header/payload/signature format compatible when changing auth.

## Backend implementation pattern (project-specific)
- Follow this layering for endpoint work: `validators` (Zod) → `routes` (`validateRequest`, `asyncHandler`) → `controllers` → `services`.
- Read validated input from `req.validatedBody` (set by `server/src/middlewares/validateRequest.js`), not raw `req.body`.
- Throw `createHttpError(statusCode, message)` in services for consistent JSON error responses (`server/src/middlewares/errorHandler.js`).
- Supabase access is centralized through `getSupabaseClient()` with guard helpers (`requireSupabaseClient`) in services.

## Frontend conventions
- Prefer `apiRequest` in `client/src/lib/apiClient.js` for API calls; it applies base URL + JSON + unified error extraction.
- `VITE_API_BASE_URL` is optional; in local dev `/api` is proxied to `http://localhost:4000` by `client/vite.config.js`.
- `client/src/pages/Dashboard.jsx` requests `GET /api/films`, then normalizes either `{ films: [...] }`, sectioned payloads, or array payloads.
- `/dashboard` route is currently unguarded in `client/src/routes/index.jsx`; only `/login` and `/register` are wrapped by `GuestOnlyRoute`.

## Environment + integrations
- Env validation is strict at startup in `server/src/config/env.js`; server fails fast on invalid config.
- Required for startup: `JWT_SECRET`.
- Needed for Supabase-backed features (`/api/login`, `/api/register`, `/api/auth/*`): `SUPABASE_URL`, `SUPABASE_ANON_KEY`.
- CORS origin comes from `CLIENT_URL` (defaults to `http://localhost:5173`).

## Developer workflow
- Install deps separately:
  - `client`: `npm install`
  - `server`: `npm install`
- Run locally:
  - `client`: `npm run dev` (Vite 5173)
  - `server`: `npm run dev` (nodemon 4000)
- Production-style:
  - `client`: `npm run build` then `npm run preview`
  - `server`: `npm start`
- No automated tests yet (`test` scripts are placeholders in both apps).

## Legacy/duplicate paths to avoid
- Prefer active routed auth screens in `client/src/components/Login.jsx` and `client/src/components/Register.jsx`.
- Treat `client/src/App.js`, `client/src/pages/Login.jsx`, and `client/src/pages/Registration.jsx` as legacy unless routing is explicitly rewired.
- `server/middleware/auth.js` is a compatibility re-export; edit `server/src/middlewares/auth.js`.

# Deploy Guide

This project is prepared for:

- Frontend: Vercel
- Backend: Render
- Database: Supabase Postgres

## 1. Supabase database

1. Create a Supabase project.
2. Open the project's `Connect` panel.
3. Copy one Postgres connection string.

Recommended for Render:

- Use the Supavisor `session mode` connection on port `5432`, or another IPv4-friendly pooled connection if direct IPv6 is unavailable from your Render region.
- Avoid Supavisor `transaction mode` on port `6543` unless you really need it. This app now adds JDBC compatibility flags for that mode, but `session mode` is still the safer choice for a long-lived Spring Boot service.

Set these backend environment variables from that connection:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`

When you use a Supavisor pooler URL, `DB_USERNAME` is usually the full pooled username from Supabase, such as `postgres.your_project_ref`, not plain `postgres`.

`DB_URL` can be either a JDBC URL or a raw Postgres URL. The backend will normalize it in production. For Supabase, include or allow the app to add `sslmode=require`.

Recommended example:

`jdbc:postgresql://aws-0-xxx.pooler.supabase.com:5432/postgres?sslmode=require`

## 2. Render backend

The backend is in [backend](./backend) and Render can build it from the existing Dockerfile.

### Render setup

1. Push the repo to GitHub.
2. In Render, create a new `Web Service`.
3. Connect the GitHub repo.
4. If Render asks for settings manually, use:
   - Root directory: leave blank when using the repo-level `render.yaml`, or set to repo root.
   - Runtime: Docker
5. Render will use [render.yaml](./render.yaml).

### Required Render environment variables

- `SPRING_PROFILES_ACTIVE=prod`
- `DB_URL=jdbc:postgresql://...`
- `DB_USERNAME=...`
- `DB_PASSWORD=...`
- `JWT_SECRET=your-long-random-secret`
- `CORS_ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app`
- `FRONTEND_BASE_URL=https://your-vercel-domain.vercel.app`

The production backend also accepts:

- `JDBC_DATABASE_URL`
- `DATABASE_URL`
- `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`

### Optional but recommended

- `MAIL_HOST=smtp.gmail.com`
- `MAIL_PORT=587`
- `MAIL_USERNAME=your-email`
- `MAIL_PASSWORD=your-app-password`
- `MAIL_FROM=your-email`
- `FEEDBACK_RECIPIENT=your-email`
- `AI_ENABLED=true`
- `AI_PROVIDER=gemini`
- `GEMINI_API_KEY=your-key`
- `OPENAI_API_KEY=your-key`
- `CATALOG_SEED_ON_STARTUP=false`

`CATALOG_SEED_ON_STARTUP=false` is the safest production default while you stabilize a first deploy. You can turn it on later if you want the backend to auto-seed starter catalog content during startup.

## 3. Vercel frontend

The frontend is in [frontend](./frontend).

### Vercel setup

1. Create a new Vercel project.
2. Import the same GitHub repo.
3. Set the project root directory to `frontend`.
4. Framework preset: Vite.
5. Build command: `npm run build`
6. Output directory: `dist`

The SPA rewrite file is already added in [frontend/vercel.json](./frontend/vercel.json).

### Required Vercel environment variables

- `VITE_API_URL=https://your-render-backend.onrender.com`

Do not add `/api` at the end unless you want to. The frontend app will normalize it automatically.

## 4. Deploy order

1. Create the Supabase database.
2. Deploy the Render backend with the database and JWT env vars.
3. Confirm the backend is live.
4. Deploy the Vercel frontend with `VITE_API_URL` pointing to Render.
5. Update Render `CORS_ALLOWED_ORIGINS` and `FRONTEND_BASE_URL` to the final Vercel domain if it changed after first deploy.

## 5. Important note about code execution

This app includes Docker-based code execution in the backend. Render free web services are not the right place for nested Docker execution.

Expected behavior on Render:

- The main app should run.
- Code execution may fall back or show Docker-unavailable messages.

If you want live code execution in production later, host that executor separately on a VM/container platform that supports it.

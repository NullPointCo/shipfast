# {{PROJECT_NAME}}

A production-ready **Django 5 + Supabase + Stripe** SaaS starter by NullPointerCo.

Authentication is handled by **Supabase** (email/password, OAuth, magic link). This
Django backend resolves the Supabase-issued JWT on every request (via
`accounts.middleware.SupabaseAuthMiddleware`), exposes protected API routes, and
runs **Stripe** subscription billing with webhooks.

## Features
- Django 5 + Gunicorn, ready for Docker & Render
- Supabase Auth (JWT verification, no custom password storage)
- `Profile` model linking Supabase `sub` → local Django user
- Stripe Checkout subscriptions (Pro $19/mo, Enterprise $99/mo)
- Signed Stripe webhooks that flip `is_pro` / `plan` on the user
- Postgres (Supabase or local), with sqlite fallback for quick starts
- Tests with pytest-django

## Quick start
```bash
pip install -r requirements.txt
cp .env.example .env   # fill in SUPABASE_* and STRIPE_* values
python manage.py migrate
python manage.py runserver
```
Open http://localhost:8000

## Auth flow
1. The frontend signs the user in with Supabase (`@supabase/supabase-js`).
2. It sends the Supabase `access_token` as an `Authorization: Bearer <token>` header.
3. `SupabaseAuthMiddleware` verifies the JWT against `SUPABASE_JWT_SECRET`, looks up
   (or creates) the linked `Profile`, and attaches `request.user`.

## Environment variables
| Var | Purpose |
|-----|---------|
| `DATABASE_URL` | Postgres connection string (Supabase pooler or local) |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Public anon key (frontend) |
| `SUPABASE_JWT_SECRET` | Used to verify access tokens (Settings → API) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | From `stripe listen` / dashboard |
| `SECRET_KEY` | Django secret |
| `DEBUG` | `True`/`False` |

## Deploy
- **Docker**: `docker compose up --build`
- **Render**: `render.yaml` provided — connect the repo and add the env vars.

## License
MIT — NullPointerCo

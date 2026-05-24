# API Data Structures

These files describe the future Supabase/Postgres data layer for the existing API.
They are intentionally not imported by the running server yet.

Use this folder as a staging area before wiring Prisma into the app.

Current API surfaces covered:

- `POST /api/helpers`
- `POST /api/maps/route`
- `POST /api/ai-local`
- `GET /api/providers`
- `POST /api/providers/seed`
- admin persistence state

Planned database tables:

- `api_request_logs`: raw API request/response audit trail.
- `helper_quote_requests`: quote form request plus generated helper offers.
- `route_requests`: route lookup inputs and returned polyline.
- `ai_request_logs`: local/OpenRouter AI request/response logs.
- `providers`: provider catalog currently backed by Mongo when enabled.
- `admin_events`: admin changes such as persistence toggles.

No runtime code uses these files yet.

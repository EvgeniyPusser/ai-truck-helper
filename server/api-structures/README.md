# API Data Structures

These files describe the Supabase/Postgres data layer for the existing API.
Prisma is now wired into the running server for helper quote requests and API request logs.

Use Prisma as the source of truth for applied schema changes.

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

Runtime code currently writes `api_request_logs` and `helper_quote_requests`.

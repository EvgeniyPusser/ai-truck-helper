-- Preview-only Supabase/Postgres tables for the current API.
-- This file is not applied by the app.

create table if not exists api_request_logs (
  id text primary key,
  method text not null,
  path text not null,
  "statusCode" integer not null,
  "durationMs" integer not null,
  origin text,
  ip text,
  "userAgent" text,
  query jsonb,
  "requestBody" jsonb,
  "responseBody" jsonb,
  error text,
  "createdAt" timestamptz not null default now()
);

create index if not exists api_request_logs_created_at_idx on api_request_logs ("createdAt");
create index if not exists api_request_logs_path_idx on api_request_logs (path);
create index if not exists api_request_logs_status_code_idx on api_request_logs ("statusCode");

create table if not exists helper_quote_requests (
  id text primary key,
  "pickupZip" text not null,
  "dropoffZip" text not null,
  helpers double precision,
  rooms double precision,
  volume double precision,
  "moveDate" text,
  request jsonb not null,
  response jsonb not null,
  "resultCount" integer not null default 0,
  "selectedOfferId" text,
  "aiStatus" text,
  "aiText" text,
  "aiModel" text,
  "aiError" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create index if not exists helper_quote_requests_created_at_idx on helper_quote_requests ("createdAt");
create index if not exists helper_quote_requests_pickup_zip_idx on helper_quote_requests ("pickupZip");
create index if not exists helper_quote_requests_dropoff_zip_idx on helper_quote_requests ("dropoffZip");

create table if not exists route_requests (
  id text primary key,
  pickup_zip text,
  dropoff_zip text,
  profile text not null default 'driving-car',
  simplify boolean not null default true,
  input_coordinates jsonb,
  route_coordinates jsonb,
  error text,
  created_at timestamptz not null default now()
);

create index if not exists route_requests_created_at_idx on route_requests (created_at);
create index if not exists route_requests_pickup_zip_idx on route_requests (pickup_zip);
create index if not exists route_requests_dropoff_zip_idx on route_requests (dropoff_zip);

create table if not exists ai_request_logs (
  id text primary key,
  provider text not null,
  model text,
  prompt text not null,
  response jsonb,
  status text not null,
  error text,
  duration_ms integer,
  created_at timestamptz not null default now()
);

create index if not exists ai_request_logs_created_at_idx on ai_request_logs (created_at);
create index if not exists ai_request_logs_provider_idx on ai_request_logs (provider);
create index if not exists ai_request_logs_status_idx on ai_request_logs (status);

create table if not exists providers (
  id text primary key,
  slug text not null unique,
  name text not null,
  service_type text not null,
  rating double precision not null default 0,
  service_zips text[] not null default '{}',
  pricing jsonb not null,
  services text[] not null default '{}',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists providers_service_type_idx on providers (service_type);
create index if not exists providers_status_idx on providers (status);

create table if not exists admin_events (
  id text primary key,
  action text not null,
  request_body jsonb,
  result jsonb,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists admin_events_created_at_idx on admin_events (created_at);
create index if not exists admin_events_action_idx on admin_events (action);

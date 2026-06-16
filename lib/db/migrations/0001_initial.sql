create table organizations (
  id uuid primary key,
  name varchar(160) not null,
  created_at timestamptz not null default now()
);

create table users (
  id uuid primary key,
  email varchar(255) not null unique,
  name varchar(160) not null
);

create table memberships (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  user_id uuid not null references users(id),
  role varchar(60) not null
);

create table api_keys (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  key_prefix varchar(24) not null,
  hashed_key text not null,
  created_at timestamptz not null default now()
);

create table entities (
  id varchar(80) primary key,
  organization_id uuid not null references organizations(id),
  type varchar(40) not null,
  label varchar(220) not null,
  risk_score integer not null,
  attributes jsonb not null,
  last_seen_at timestamptz not null
);

create table cases (
  id varchar(80) primary key,
  organization_id uuid not null references organizations(id),
  title varchar(240) not null,
  status varchar(40) not null,
  severity varchar(40) not null,
  risk_score integer not null,
  primary_entity_id varchar(80) not null references entities(id),
  assigned_analyst varchar(160) not null,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create index cases_org_status_idx on cases (organization_id, status);
create index cases_org_severity_idx on cases (organization_id, severity);

create table case_events (
  id uuid primary key,
  case_id varchar(80) not null references cases(id),
  event_id varchar(80) not null,
  created_at timestamptz not null default now()
);

create table risk_scores (
  id uuid primary key,
  entity_id varchar(80) not null references entities(id),
  score integer not null,
  reasons jsonb not null,
  created_at timestamptz not null default now()
);

create index risk_scores_entity_score_idx on risk_scores (entity_id, score desc);

create table evidence_ledger (
  id varchar(120) primary key,
  organization_id uuid not null references organizations(id),
  case_id varchar(80) not null references cases(id),
  action_type varchar(80) not null,
  actor varchar(160) not null,
  payload_hash varchar(64) not null,
  previous_hash varchar(64) not null,
  current_hash varchar(64) not null,
  payload_json jsonb not null,
  created_at timestamptz not null
);

create index evidence_ledger_case_created_idx on evidence_ledger (case_id, created_at);

create table case_notes (
  id uuid primary key,
  case_id varchar(80) not null references cases(id),
  actor varchar(160) not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table reports (
  id varchar(120) primary key,
  case_id varchar(80) not null references cases(id),
  title varchar(240) not null,
  html text not null,
  generated_at timestamptz not null
);

create index reports_case_idx on reports (case_id);

create table billing_plans (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  plan varchar(80) not null,
  monthly_price numeric not null
);

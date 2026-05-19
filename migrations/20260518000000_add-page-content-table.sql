create table if not exists page_content (
  page        text not null,
  content     jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  primary key (page)
);

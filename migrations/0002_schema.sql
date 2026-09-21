-- Checklist items + passcode settings. Access is gated in server functions,
-- not by RLS (the app's SQL client is the table owner).

create table if not exists items (
  id uuid primary key,
  section text not null,
  subsection text,
  sort_order int not null,
  title text not null,
  priority_tier text,
  checked boolean not null default false,
  notes text not null default '',
  links jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  constraint items_priority_tier_check check (
    priority_tier is null
    or priority_tier in ('Very High', 'High', 'Medium', 'Secondary')
  )
);

create unique index if not exists items_sort_order_idx on items (sort_order);
create index if not exists items_section_idx on items (section);

create table if not exists site_settings (
  id text primary key,
  passcode_hash text,
  session_secret text not null,
  updated_at timestamptz not null default now()
);

create or replace function set_items_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists items_set_updated_at on items;
create trigger items_set_updated_at
before update on items
for each row execute function set_items_updated_at();

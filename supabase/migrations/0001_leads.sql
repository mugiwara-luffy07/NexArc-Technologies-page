-- NexArc website leads: project briefs, product waitlist, internship applications.
-- Run once in Supabase > SQL Editor.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null check (type in ('project', 'waitlist', 'internship')),
  status text not null default 'new' check (status in ('new', 'contacted', 'won', 'lost', 'archived')),
  name text,
  email text not null,
  phone text,
  data jsonb not null default '{}'::jsonb,
  notes text
);

create index if not exists leads_type_created_idx on public.leads (type, created_at desc);
create index if not exists leads_status_idx on public.leads (status);

-- Only the server (service role key) writes and reads. No public access.
alter table public.leads enable row level security;

-- Private bucket for internship resumes (PDF only, 5 MB)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('resumes', 'resumes', false, 5242880, array['application/pdf'])
on conflict (id) do nothing;

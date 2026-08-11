create table public.order_status_notifications (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  previous_status text,
  new_status text not null,
  order_updated_at timestamptz not null,
  recipient_email text not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'sent', 'failed')),
  provider_message_id text,
  error_message text,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  unique (order_id, previous_status, new_status, order_updated_at)
);

create index order_status_notifications_status_created_at_idx on public.order_status_notifications(status, created_at);
alter table public.order_status_notifications enable row level security;

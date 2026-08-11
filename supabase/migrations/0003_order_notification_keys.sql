alter table public.order_status_notifications
  add column notification_key text,
  add column notification_type text;

alter table public.order_status_notifications
  add constraint order_status_notifications_notification_type_check
  check (
    notification_type is null
    or notification_type in ('order-confirmation', 'admin-new-order', 'status-update')
  );

create unique index order_status_notifications_notification_key_idx
  on public.order_status_notifications(notification_key)
  where notification_key is not null;

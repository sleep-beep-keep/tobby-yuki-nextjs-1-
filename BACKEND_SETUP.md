# Backend setup

1. Create a Supabase project and open its SQL Editor.
2. Run `supabase/migrations/0001_storefront.sql`.
3. Copy `.env.example` to `.env.local` and add the Supabase URL and publishable key. Do not commit `.env.local`.
4. In Supabase Authentication settings, set the Site URL to your Netlify address and add `http://localhost:3000` as a development redirect URL.
5. In Netlify, add the same variables under **Site configuration → Environment variables**. Keep `SUPABASE_SERVICE_ROLE_KEY`, Razorpay secrets, and the webhook secret server-only.

The migration creates profiles, addresses, products, variants, carts, orders, order items, and payments. Row Level Security allows customers to see and manage only their own account data; payment capture and order creation must run in server-side route handlers with the service-role key. The Supabase browser and server client helpers are in `lib/supabase` and are ready for the account and order routes.

To access the protected `/admin` dashboard, set `ADMIN_EMAILS` to a comma-separated list of administrator login emails. The page also requires `SUPABASE_SERVICE_ROLE_KEY`; never expose that key through a `NEXT_PUBLIC_` variable.

## Order-status email notifications

1. Run `supabase/migrations/0002_order_status_notifications.sql` in the Supabase SQL Editor.
2. Verify the sending domain in Resend, then set `RESEND_API_KEY`, `ORDER_EMAIL_FROM`, `ORDER_NOTIFICATION_WEBHOOK_SECRET`, and `NEXT_PUBLIC_SITE_URL` in Netlify.
3. In **Supabase -> Database -> Webhooks**, create an `UPDATE` webhook for `public.orders` with target URL `https://your-domain.com/api/order-notifications`.
4. Add a header named `x-order-notification-secret` with the same value as `ORDER_NOTIFICATION_WEBHOOK_SECRET`.

The handler only sends when `status` changes. It logs the transition in `order_status_notifications` before delivery, which prevents a successful message from being sent again if Supabase repeats the webhook request. Failed messages remain recorded for diagnosis and retry.

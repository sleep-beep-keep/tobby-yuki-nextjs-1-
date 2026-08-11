import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type OrderRecord = {
  id?: unknown;
  order_number?: unknown;
  status?: unknown;
  updated_at?: unknown;
  total_paise?: unknown;
  payment_method?: unknown;
  shipping_address?: unknown;
};

type SupabaseWebhookPayload = {
  type?: unknown;
  record?: OrderRecord;
  old_record?: OrderRecord | null;
};

type EmailInput = {
  to: string;
  subject: string;
  html: string;
};

type DeliveryInput = {
  notificationKey: string;
  notificationType: "order-confirmation" | "admin-new-order" | "status-update";
  orderId: string;
  previousStatus: string | null;
  newStatus: string;
  orderUpdatedAt: string;
  recipientEmail: string;
  email: EmailInput;
};

const statusMessages: Record<string, string> = {
  confirmed: "Your order has been confirmed and is being prepared.",
  packed: "Great news! Your order has been packed and is ready for dispatch.",
  shipped: "Your package is on its way!",
  delivered: "Your order has been delivered. We hope your pet loves it!",
  cancelled: "Your order has been cancelled.",
  refunded: "Your order refund has been initiated.",
};

function getText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        character
      ] ?? character,
  );
}

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatRupees(paise: number | null) {
  if (paise === null) return null;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(paise / 100);
}

function getStoreUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tobbyandyuki.com").replace(/\/$/, "");
}

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function hasValidSecret(request: Request) {
  const expected = process.env.ORDER_NOTIFICATION_WEBHOOK_SECRET;
  const received = request.headers.get("x-order-notification-secret");
  if (!expected || !received) return false;
  const expectedBytes = new TextEncoder().encode(expected);
  const receivedBytes = new TextEncoder().encode(received);
  return expectedBytes.length === receivedBytes.length && timingSafeEqual(expectedBytes, receivedBytes);
}

async function sendEmail({ to, subject, html }: EmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_EMAIL_FROM;
  if (!apiKey || !from) throw new Error("Email delivery is not configured.");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  const result = (await response.json().catch(() => null)) as { id?: string; message?: string } | null;
  if (!response.ok) throw new Error(result?.message ?? "Email provider rejected the request.");
  return result?.id ?? null;
}

async function deliverEmailOnce(input: DeliveryInput) {
  const admin = createAdminClient();
  const { data: existing, error: existingError } = await admin
    .from("order_status_notifications")
    .select("id, status")
    .eq("notification_key", input.notificationKey)
    .maybeSingle();

  if (existingError) throw new Error("Unable to read order notification state.");
  if (existing?.status === "sent") return "already_sent";
  if (existing?.status === "processing") return "already_processing";

  let notificationId = existing?.id as string | undefined;
  if (notificationId) {
    const { error } = await admin
      .from("order_status_notifications")
      .update({ status: "processing", error_message: null })
      .eq("id", notificationId);
    if (error) throw new Error("Unable to prepare order notification retry.");
  } else {
    const { data, error } = await admin
      .from("order_status_notifications")
      .insert({
        order_id: input.orderId,
        previous_status: input.previousStatus,
        new_status: input.newStatus,
        order_updated_at: input.orderUpdatedAt,
        recipient_email: input.recipientEmail,
        notification_key: input.notificationKey,
        notification_type: input.notificationType,
        status: "processing",
      })
      .select("id")
      .single();

    if (error) {
      const { data: repeated } = await admin
        .from("order_status_notifications")
        .select("id, status")
        .eq("notification_key", input.notificationKey)
        .maybeSingle();
      if (repeated?.status === "sent") return "already_sent";
      if (repeated?.status === "processing") return "already_processing";
      throw new Error("Unable to create order notification state.");
    }
    notificationId = data.id as string;
  }

  try {
    const providerMessageId = await sendEmail(input.email);
    const { error } = await admin
      .from("order_status_notifications")
      .update({
        status: "sent",
        provider_message_id: providerMessageId,
        sent_at: new Date().toISOString(),
        error_message: null,
      })
      .eq("id", notificationId);
    if (error) throw new Error("Email was sent, but its delivery state could not be saved.");
    return "sent";
  } catch (error) {
    await admin
      .from("order_status_notifications")
      .update({
        status: "failed",
        error_message: error instanceof Error ? error.message.slice(0, 1000) : "Unknown delivery error",
      })
      .eq("id", notificationId);
    throw error;
  }
}

function renderCustomerConfirmation({
  customerName,
  orderNumber,
  totalLabel,
}: {
  customerName: string;
  orderNumber: string;
  totalLabel: string | null;
}) {
  const storeUrl = getStoreUrl();
  return `<div style="font-family:Arial,sans-serif;padding:20px;color:#4A3026"><h2>Thank you for your order, ${escapeHtml(customerName)}!</h2><p>We've received your order <strong>${escapeHtml(orderNumber)}</strong> and are getting it ready.</p>${totalLabel ? `<p><strong>Total:</strong> ${escapeHtml(totalLabel)}</p>` : ""}<p>We will notify you as soon as your order is packed and shipped.</p><p><a href="${storeUrl}/account" style="display:inline-block;background:#553a29;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">View order status</a></p></div>`;
}

function renderAdminAlert({
  customerName,
  customerEmail,
  orderNumber,
  totalLabel,
  paymentMethod,
}: {
  customerName: string;
  customerEmail: string | null;
  orderNumber: string;
  totalLabel: string | null;
  paymentMethod: string | null;
}) {
  const storeUrl = getStoreUrl();
  return `<div style="font-family:Arial,sans-serif;padding:20px;color:#4A3026"><h2>New order received</h2><p><strong>Order:</strong> ${escapeHtml(orderNumber)}</p><p><strong>Customer:</strong> ${escapeHtml(customerName)}${customerEmail ? ` (${escapeHtml(customerEmail)})` : ""}</p>${totalLabel ? `<p><strong>Total:</strong> ${escapeHtml(totalLabel)}</p>` : ""}<p><strong>Payment method:</strong> ${escapeHtml(paymentMethod ?? "Not provided")}</p><p><a href="${storeUrl}/admin" style="display:inline-block;background:#553a29;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">Open admin panel</a></p></div>`;
}

function renderStatusUpdate({
  customerName,
  orderNumber,
  status,
}: {
  customerName: string;
  orderNumber: string;
  status: string;
}) {
  const storeUrl = getStoreUrl();
  const statusLabel = formatStatus(status);
  const message = statusMessages[status] ?? `Your order status is now ${statusLabel}.`;
  return `<div style="font-family:Arial,sans-serif;padding:20px;color:#4A3026"><h2>Order status update</h2><p>Hi ${escapeHtml(customerName)},</p><p>${escapeHtml(message)}</p><p><strong>Order:</strong> ${escapeHtml(orderNumber)}</p><p><strong>Status:</strong> ${escapeHtml(statusLabel)}</p><p><a href="${storeUrl}/account" style="display:inline-block;background:#553a29;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">View order details</a></p></div>`;
}

export async function POST(request: Request) {
  if (!hasValidSecret(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let payload: SupabaseWebhookPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
  }

  const eventType = getText(payload.type)?.toUpperCase();
  const order = payload.record;
  const orderId = getText(order?.id);
  const orderNumber = getText(order?.order_number);
  const updatedAt = getText(order?.updated_at);

  if ((eventType !== "INSERT" && eventType !== "UPDATE") || !order || !orderId || !orderNumber || !updatedAt) {
    return NextResponse.json({ error: "Unexpected order webhook payload" }, { status: 400 });
  }

  const address =
    order.shipping_address && typeof order.shipping_address === "object"
      ? (order.shipping_address as Record<string, unknown>)
      : {};
  const customerEmail = getText(address.email);
  const customerName = getText(address.recipient_name) ?? getText(address.full_name) ?? getText(address.name) ?? "there";
  const totalLabel = formatRupees(getNumber(order.total_paise));
  const paymentMethod = getText(order.payment_method);

  if (eventType === "INSERT") {
    const deliveries: Promise<unknown>[] = [];

    if (customerEmail) {
      deliveries.push(
        deliverEmailOnce({
          notificationKey: `order:${orderId}:insert:customer-confirmation`,
          notificationType: "order-confirmation",
          orderId,
          previousStatus: null,
          newStatus: "created",
          orderUpdatedAt: updatedAt,
          recipientEmail: customerEmail,
          email: {
            to: customerEmail,
            subject: `Order confirmation ${orderNumber}`,
            html: renderCustomerConfirmation({ customerName, orderNumber, totalLabel }),
          },
        }),
      );
    }

    for (const adminEmail of getAdminEmails()) {
      deliveries.push(
        deliverEmailOnce({
          notificationKey: `order:${orderId}:insert:admin-new-order:${adminEmail.toLowerCase()}`,
          notificationType: "admin-new-order",
          orderId,
          previousStatus: null,
          newStatus: "created",
          orderUpdatedAt: updatedAt,
          recipientEmail: adminEmail,
          email: {
            to: adminEmail,
            subject: `New order received ${orderNumber}${totalLabel ? ` (${totalLabel})` : ""}`,
            html: renderAdminAlert({ customerName, customerEmail, orderNumber, totalLabel, paymentMethod }),
          },
        }),
      );
    }

    await Promise.all(deliveries);
    return NextResponse.json({ message: "New order notifications processed", deliveries: deliveries.length });
  }

  const previousStatus = getText(payload.old_record?.status)?.toLowerCase() ?? null;
  const newStatus = getText(order.status)?.toLowerCase();
  if (!newStatus) return NextResponse.json({ error: "Order update has no status" }, { status: 400 });
  if (newStatus === previousStatus) return NextResponse.json({ message: "Status did not change" });
  if (!customerEmail) return NextResponse.json({ message: "Order has no customer email" });

  const result = await deliverEmailOnce({
    notificationKey: `order:${orderId}:status:${previousStatus ?? "none"}:${newStatus}:${updatedAt}`,
    notificationType: "status-update",
    orderId,
    previousStatus,
    newStatus,
    orderUpdatedAt: updatedAt,
    recipientEmail: customerEmail,
    email: {
      to: customerEmail,
      subject: `Order update ${orderNumber}: ${formatStatus(newStatus)}`,
      html: renderStatusUpdate({ customerName, orderNumber, status: newStatus }),
    },
  });

  return NextResponse.json({ message: "Order status notification processed", result });
}

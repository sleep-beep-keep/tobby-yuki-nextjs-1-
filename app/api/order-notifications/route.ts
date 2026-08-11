import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type OrderRecord = { id?: unknown; order_number?: unknown; status?: unknown; updated_at?: unknown; shipping_address?: unknown };
type SupabaseWebhookPayload = { type?: unknown; record?: OrderRecord; old_record?: OrderRecord | null };

const statusMessages: Record<string, string> = {
  confirmed: "Your order has been confirmed and is being prepared.",
  packed: "Great news! Your order has been packed and is ready for dispatch.",
  shipped: "Your package is on its way!",
  delivered: "Your order has been delivered. We hope your pet loves it!",
  cancelled: "Your order has been cancelled.",
  refunded: "Your order refund has been initiated.",
};

function getText(value: unknown) { return typeof value === "string" && value.trim() ? value.trim() : null; }
function escapeHtml(value: string) { return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character); }

function hasValidSecret(request: Request) {
  const expected = process.env.ORDER_NOTIFICATION_WEBHOOK_SECRET;
  const received = request.headers.get("x-order-notification-secret");
  if (!expected || !received) return false;
  const expectedBytes = new TextEncoder().encode(expected);
  const receivedBytes = new TextEncoder().encode(received);
  return expectedBytes.length === receivedBytes.length && timingSafeEqual(expectedBytes, receivedBytes);
}

async function sendOrderEmail({ email, name, orderNumber, status }: { email: string; name: string; orderNumber: string; status: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_EMAIL_FROM;
  const storeUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tobbyandyuki.com").replace(/\/$/, "");
  if (!apiKey || !from) throw new Error("Email delivery is not configured.");
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
  const message = statusMessages[status] ?? `Your order status is now ${statusLabel}.`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [email],
      subject: `Order update ${orderNumber}: ${statusLabel}`,
      html: `<div style="font-family:Arial,sans-serif;padding:20px;color:#4A3026"><h2>Order status update</h2><p>Hi ${escapeHtml(name)},</p><p>${escapeHtml(message)}</p><p><strong>Order:</strong> ${escapeHtml(orderNumber)}</p><p><a href="${storeUrl}/account" style="display:inline-block;background:#553a29;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">View order details</a></p></div>`,
    }),
  });
  const result = await response.json().catch(() => null) as { id?: string; message?: string } | null;
  if (!response.ok) throw new Error(result?.message ?? "Email provider rejected the request.");
  return result?.id ?? null;
}

export async function POST(request: Request) {
  if (!hasValidSecret(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let payload: SupabaseWebhookPayload;
  try { payload = await request.json(); } catch { return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 }); }

  const order = payload.record;
  const previousStatus = getText(payload.old_record?.status);
  const orderId = getText(order?.id);
  const orderNumber = getText(order?.order_number);
  const newStatus = getText(order?.status)?.toLowerCase();
  const updatedAt = getText(order?.updated_at);
  if (payload.type !== "UPDATE" || !orderId || !orderNumber || !newStatus || !updatedAt) return NextResponse.json({ error: "Unexpected order webhook payload" }, { status: 400 });
  if (newStatus === previousStatus?.toLowerCase()) return NextResponse.json({ message: "Status did not change" });

  const address = order.shipping_address && typeof order.shipping_address === "object" ? order.shipping_address as Record<string, unknown> : {};
  const email = getText(address.email);
  if (!email) return NextResponse.json({ message: "Order has no customer email" });

  const admin = createAdminClient();
  const notificationKey = { order_id: orderId, previous_status: previousStatus?.toLowerCase() ?? null, new_status: newStatus, order_updated_at: updatedAt };
  const { data: existing, error: existingError } = await admin.from("order_status_notifications").select("id, status").match(notificationKey).maybeSingle();
  if (existingError) throw new Error("Unable to read order notification state.");
  if (existing?.status === "sent") return NextResponse.json({ message: "Notification already sent" });
  if (existing?.status === "processing") return NextResponse.json({ message: "Notification already processing" }, { status: 202 });

  const notification = existing ?? (await admin.from("order_status_notifications").insert({ ...notificationKey, recipient_email: email, status: "processing" }).select("id").single()).data;
  if (!notification) throw new Error("Unable to create order notification state.");
  try {
    const providerMessageId = await sendOrderEmail({ email, name: getText(address.recipient_name) ?? "there", orderNumber, status: newStatus });
    const { error } = await admin.from("order_status_notifications").update({ status: "sent", provider_message_id: providerMessageId, sent_at: new Date().toISOString(), error_message: null }).eq("id", notification.id);
    if (error) throw new Error("Email was sent, but its delivery state could not be saved.");
  } catch (error) {
    await admin.from("order_status_notifications").update({ status: "failed", error_message: error instanceof Error ? error.message.slice(0, 1000) : "Unknown delivery error" }).eq("id", notification.id);
    throw error;
  }
  return NextResponse.json({ message: "Order notification sent" });
}

"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin";

const validStatuses = new Set(["pending", "confirmed", "packed", "shipped", "delivered", "cancelled", "refunded"]);

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  const orderId = formData.get("orderId");
  const status = formData.get("status");
  if (typeof orderId !== "string" || typeof status !== "string" || !validStatuses.has(status)) return;

  const { error } = await createAdminClient().from("orders").update({ status }).eq("id", orderId);
  if (error) throw new Error("Unable to update the order status.");
  revalidatePath("/admin");
}

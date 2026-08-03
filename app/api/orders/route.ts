import { NextResponse } from "next/server";
import { createClient as createAuthClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type CheckoutItem = { slug: string; quantity: number; size?: string };
type ShippingAddress = {
  recipient_name: string;
  phone: string;
  line_1: string;
  line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  email: string;
};

const isCheckoutItem = (item: unknown): item is CheckoutItem => {
  if (!item || typeof item !== "object") return false;
  const candidate = item as CheckoutItem;
  return typeof candidate.slug === "string" && Number.isInteger(candidate.quantity) && candidate.quantity > 0 && candidate.quantity <= 20 && (candidate.size === undefined || typeof candidate.size === "string");
};

export async function POST(request: Request) {
  const auth = await createAuthClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in before placing an order." }, { status: 401 });

  let body: { items?: unknown; shippingAddress?: ShippingAddress };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid order request." }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items : [];
  const shippingAddress = body.shippingAddress;
  if (!items.length || !items.every(isCheckoutItem) || !shippingAddress || !shippingAddress.recipient_name || !shippingAddress.phone || !shippingAddress.line_1 || !shippingAddress.city || !shippingAddress.state || !/^\d{6}$/.test(shippingAddress.postal_code) || !shippingAddress.email) {
    return NextResponse.json({ error: "Please provide a valid cart and delivery address." }, { status: 400 });
  }

  const uniqueSlugs = [...new Set(items.map((item) => item.slug))];
  const admin = createAdminClient();
  const { data: products, error: productsError } = await admin
    .from("products")
    .select("id, slug, title, base_price")
    .eq("is_active", true)
    .in("slug", uniqueSlugs);

  if (productsError) return NextResponse.json({ error: "Unable to validate products." }, { status: 500 });
  if (!products || products.length !== uniqueSlugs.length) return NextResponse.json({ error: "One or more products are no longer available." }, { status: 409 });

  const { data: variants, error: variantsError } = await admin
    .from("product_variants")
    .select("id, product_id, name, price_paise, stock_quantity")
    .eq("active", true)
    .in("product_id", products.map((product) => product.id));
  if (variantsError) return NextResponse.json({ error: "Unable to validate product options." }, { status: 500 });

  const requestedVariantQuantities = new Map<string, number>();
  for (const item of items) {
    if (!item.size) continue;
    const key = `${item.slug}:${item.size}`;
    requestedVariantQuantities.set(key, (requestedVariantQuantities.get(key) ?? 0) + item.quantity);
  }

  const lines = items.map((item) => {
    const product = products.find((candidate) => candidate.slug === item.slug)!;
    const productVariants = variants?.filter((candidate) => candidate.product_id === product.id) ?? [];
    const variant = item.size ? productVariants.find((candidate) => candidate.name === item.size) : undefined;
    const requestedQuantity = item.size ? requestedVariantQuantities.get(`${item.slug}:${item.size}`) ?? 0 : 0;
    if ((productVariants.length > 0 && !item.size) || (item.size && (!variant || variant.stock_quantity < requestedQuantity))) return null;

    const unitPricePaise = variant?.price_paise ?? Math.round(Number(product.base_price) * 100);
    return {
      product_id: product.id,
      variant_id: variant?.id ?? null,
      product_name: product.title,
      variant_name: variant?.name ?? null,
      unit_price_paise: unitPricePaise,
      quantity: item.quantity,
    };
  });

  if (lines.some((line) => !line)) return NextResponse.json({ error: "A selected size is unavailable or no longer has enough stock. Please update your cart." }, { status: 409 });

  const orderLines = lines.filter((line): line is NonNullable<typeof line> => line !== null);
  const subtotalPaise = orderLines.reduce((total, line) => total + line.unit_price_paise * line.quantity, 0);
  const shippingPaise = subtotalPaise >= 99900 ? 0 : 9900;
  const orderNumber = `TY-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 5).toUpperCase()}`;

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: user.id,
      status: "pending",
      payment_status: "cod",
      payment_method: "cod",
      subtotal_paise: subtotalPaise,
      shipping_paise: shippingPaise,
      total_paise: subtotalPaise + shippingPaise,
      shipping_address: shippingAddress,
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) return NextResponse.json({ error: "Unable to create your order. Please try again." }, { status: 500 });

  const { error: itemsError } = await admin.from("order_items").insert(orderLines.map((line) => ({ ...line, order_id: order.id })));
  if (itemsError) {
    await admin.from("orders").delete().eq("id", order.id);
    return NextResponse.json({ error: "Unable to save order items. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ orderNumber: order.order_number }, { status: 201 });
}

import Link from "next/link";
import { Package, ShoppingBag, Users, Wallet } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateOrderStatus } from "./actions";

export const dynamic = "force-dynamic";

type Order = { id: string; order_number: string; user_id: string | null; status: string; payment_status: string; payment_method: string; subtotal_paise: number; shipping_paise: number; total_paise: number; shipping_address: Record<string, unknown>; created_at: string };
type OrderItem = { id: string; order_id: string; product_name: string; variant_name: string | null; unit_price_paise: number; quantity: number };
type Profile = { id: string; full_name: string | null; phone: string | null };
type Payment = { order_id: string; provider: string; status: string; provider_payment_id: string | null };
type Product = { id: string; title: string; category: string; pet_type: string; base_price: number; is_active: boolean };
type Variant = { id: string; product_id: string; name: string; stock_quantity: number; active: boolean };

const formatMoney = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;
const statusOptions = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled", "refunded"];

export default async function AdminPage() {
  await requireAdmin();
  const admin = createAdminClient();
  const [{ data: orderData, error: ordersError }, { data: profileData, error: profilesError }, { data: paymentData, error: paymentsError }, { data: productData, error: productsError }, { data: variantData, error: variantsError }] = await Promise.all([
    admin.from("orders").select("id, order_number, user_id, status, payment_status, payment_method, subtotal_paise, shipping_paise, total_paise, shipping_address, created_at").order("created_at", { ascending: false }).limit(100),
    admin.from("profiles").select("id, full_name, phone"),
    admin.from("payments").select("order_id, provider, status, provider_payment_id"),
    admin.from("products").select("id, title, category, pet_type, base_price, is_active").order("created_at", { ascending: false }),
    admin.from("product_variants").select("id, product_id, name, stock_quantity, active").order("stock_quantity"),
  ]);
  if (ordersError || profilesError || paymentsError || productsError || variantsError) throw new Error("Unable to load the admin dashboard data.");

  const orders = (orderData ?? []) as Order[];
  const profiles = (profileData ?? []) as Profile[];
  const payments = (paymentData ?? []) as Payment[];
  const products = (productData ?? []) as Product[];
  const variants = (variantData ?? []) as Variant[];
  const orderIds = orders.map((order) => order.id);
  const { data: itemData, error: itemsError } = orderIds.length ? await admin.from("order_items").select("id, order_id, product_name, variant_name, unit_price_paise, quantity").in("order_id", orderIds) : { data: [], error: null };
  if (itemsError) throw new Error("Unable to load order items.");
  const orderItems = (itemData ?? []) as OrderItem[];

  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));
  const paymentByOrderId = new Map(payments.map((payment) => [payment.order_id, payment]));
  const itemsByOrderId = new Map<string, OrderItem[]>();
  orderItems.forEach((item) => itemsByOrderId.set(item.order_id, [...(itemsByOrderId.get(item.order_id) ?? []), item]));
  const lowStock = variants.filter((variant) => variant.active && variant.stock_quantity <= 5);
  const productById = new Map(products.map((product) => [product.id, product]));
  const revenue = orders.filter((order) => !["cancelled", "refunded"].includes(order.status)).reduce((total, order) => total + order.total_paise, 0);

  return <main className="mx-auto max-w-7xl px-4 py-12 md:px-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.25em] text-mocha">Protected workspace</p><h1 className="mt-2 font-display text-5xl text-cocoa">Store dashboard</h1><p className="mt-3 text-gray-600">Orders, customers, payments, catalogue and inventory in one place.</p></div><Link href="/" className="w-fit rounded-full border border-cocoa px-5 py-2.5 text-sm font-semibold text-cocoa">View storefront</Link></div><section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[[ShoppingBag, "Orders", orders.length.toString()], [Wallet, "Order value", formatMoney(revenue)], [Users, "Customers", profiles.length.toString()], [Package, "Low-stock variants", lowStock.length.toString()]].map(([Icon, label, value]) => { const StatIcon = Icon as typeof Package; return <article key={label as string} className="rounded-3xl bg-ivory p-6"><StatIcon className="text-mocha" size={24} /><p className="mt-5 text-sm text-gray-600">{label as string}</p><p className="mt-1 font-display text-4xl text-cocoa">{value as string}</p></article>; })}</section><section className="mt-10"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-mocha">Fulfilment</p><h2 className="mt-2 font-display text-3xl text-cocoa">Recent orders</h2></div><p className="text-sm text-gray-500">Latest 100 orders</p></div>{orders.length ? <div className="mt-5 space-y-4">{orders.map((order) => { const customer = order.user_id ? profileById.get(order.user_id) : undefined; const payment = paymentByOrderId.get(order.id); const address = order.shipping_address ?? {}; return <article key={order.id} className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm"><div className="flex flex-col justify-between gap-4 md:flex-row"><div><div className="flex flex-wrap items-center gap-x-3 gap-y-1"><h3 className="font-semibold text-cocoa">{order.order_number}</h3><span className="rounded-full bg-ivory px-3 py-1 text-xs font-semibold capitalize text-cocoa">{order.payment_status}</span><span className="text-sm capitalize text-gray-500">{order.payment_method}</span></div><p className="mt-2 text-sm text-gray-500">{new Date(order.created_at).toLocaleString("en-IN")}</p><p className="mt-3 text-sm text-gray-700"><span className="font-semibold text-cocoa">Customer:</span> {customer?.full_name || String(address.recipient_name || "Guest")} {customer?.phone || String(address.phone || "")}</p><p className="mt-1 max-w-xl text-sm text-gray-600">{String(address.line_1 || "")}{address.line_2 ? `, ${String(address.line_2)}` : ""}, {String(address.city || "")}, {String(address.state || "")} {String(address.postal_code || "")}</p></div><div className="md:text-right"><p className="font-semibold text-cocoa">{formatMoney(order.total_paise)}</p><p className="mt-1 text-sm text-gray-500">Items {formatMoney(order.subtotal_paise)} · Shipping {formatMoney(order.shipping_paise)}</p>{payment && <p className="mt-1 text-xs capitalize text-gray-500">{payment.provider}: {payment.status}{payment.provider_payment_id ? " verified" : ""}</p>}<form action={updateOrderStatus} className="mt-4 flex items-center gap-2 md:justify-end"><input type="hidden" name="orderId" value={order.id} /><select name="status" defaultValue={order.status} className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm capitalize">{statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select><button className="rounded-xl bg-cocoa px-3 py-2 text-sm font-semibold text-white">Update</button></form></div></div><div className="mt-4 border-t border-black/5 pt-4 text-sm text-gray-600">{(itemsByOrderId.get(order.id) ?? []).map((item) => <p key={item.id} className="flex justify-between gap-4 py-1"><span>{item.product_name}{item.variant_name ? ` · ${item.variant_name}` : ""} × {item.quantity}</span><span>{formatMoney(item.unit_price_paise * item.quantity)}</span></p>)}</div></article>; })}</div> : <div className="mt-5 rounded-3xl bg-ivory p-8 text-gray-600">No orders have been placed yet.</div>}</section><section className="mt-12 grid gap-8 lg:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-mocha">Inventory</p><h2 className="mt-2 font-display text-3xl text-cocoa">Low stock</h2><div className="mt-5 overflow-hidden rounded-3xl border border-black/5 bg-white">{lowStock.length ? lowStock.map((variant) => <div key={variant.id} className="flex items-center justify-between border-b border-black/5 px-5 py-4 last:border-0"><div><p className="font-semibold text-cocoa">{productById.get(variant.product_id)?.title ?? "Unknown product"}</p><p className="mt-1 text-sm text-gray-500">{variant.name}</p></div><span className="rounded-full bg-rose/10 px-3 py-1 text-sm font-bold text-rose">{variant.stock_quantity} left</span></div>) : <p className="p-5 text-sm text-gray-600">All active variants have more than five units in stock.</p>}</div></div><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-mocha">Catalogue</p><h2 className="mt-2 font-display text-3xl text-cocoa">Products</h2><div className="mt-5 overflow-hidden rounded-3xl border border-black/5 bg-white">{products.map((product) => <div key={product.id} className="flex items-center justify-between border-b border-black/5 px-5 py-4 last:border-0"><div><p className="font-semibold text-cocoa">{product.title}</p><p className="mt-1 text-sm capitalize text-gray-500">{product.pet_type} · {product.category}</p></div><div className="text-right"><p className="font-semibold text-cocoa">₹{Number(product.base_price).toLocaleString("en-IN")}</p><p className={`mt-1 text-xs font-semibold ${product.is_active ? "text-green-700" : "text-rose"}`}>{product.is_active ? "Active" : "Inactive"}</p></div></div>)}</div></div></section></main>;
}

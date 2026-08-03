"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import AuthForm from "@/components/AuthForm";
import { createClient } from "@/lib/supabase/client";

type Address = { id: string; recipient_name: string; phone: string; line_1: string; line_2: string | null; city: string; state: string; postal_code: string; country: string };
type Order = { id: string; order_number: string; status: string; payment_status: string; total_paise: number; created_at: string };

const emptyAddress = { recipient_name: "", phone: "", line_1: "", line_2: "", city: "", state: "", postal_code: "" };

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [address, setAddress] = useState(emptyAddress);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const loadAccount = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      if (currentUser) {
        const [addressResult, orderResult] = await Promise.all([
          supabase.from("addresses").select("id, recipient_name, phone, line_1, line_2, city, state, postal_code, country").order("created_at", { ascending: false }),
          supabase.from("orders").select("id, order_number, status, payment_status, total_paise, created_at").order("created_at", { ascending: false }),
        ]);
        if (addressResult.data) setAddresses(addressResult.data as Address[]);
        if (orderResult.data) setOrders(orderResult.data as Order[]);
        if (addressResult.error || orderResult.error) setNotice("Your account was created, but the profile tables still need the Supabase migration to be run.");
      }
      setLoading(false);
    };
    loadAccount();
  }, []);

  async function saveAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    const supabase = createClient();
    const { data, error } = await supabase.from("addresses").insert({ ...address, user_id: user.id }).select("id, recipient_name, phone, line_1, line_2, city, state, postal_code, country").single();
    if (error) setNotice(error.message);
    else if (data) { setAddresses((current) => [data as Address, ...current]); setAddress(emptyAddress); setNotice("Address saved."); }
  }

  async function signOut() {
    await createClient().auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  }

  if (loading) return <main className="mx-auto max-w-6xl px-4 py-20 text-center text-gray-600">Loading your account…</main>;
  if (!user) return <main className="mx-auto max-w-6xl px-4 py-12"><AuthForm /></main>;

  return <main className="mx-auto max-w-6xl px-4 py-12"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.25em] text-mocha">Your account</p><h1 className="mt-2 font-display text-5xl text-cocoa">Hello{user.user_metadata.full_name ? `, ${user.user_metadata.full_name}` : ""}</h1><p className="mt-3 text-gray-600">{user.email}</p></div><button onClick={signOut} className="w-fit rounded-full border border-cocoa px-5 py-2.5 text-sm font-semibold text-cocoa transition hover:bg-ivory">Sign out</button></div>
    {notice && <p className="mt-7 rounded-2xl bg-ivory px-5 py-4 text-sm text-cocoa">{notice}</p>}
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_.9fr]"><section className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft"><h2 className="font-display text-3xl text-cocoa">Order history</h2>{orders.length ? <div className="mt-5 divide-y divide-black/5">{orders.map((order) => <div key={order.id} className="flex items-center justify-between gap-4 py-4 text-sm"><div><p className="font-semibold text-cocoa">{order.order_number}</p><p className="mt-1 text-gray-500">{new Date(order.created_at).toLocaleDateString("en-IN")} · {order.status}</p></div><div className="text-right"><p className="font-semibold text-cocoa">₹{(order.total_paise / 100).toLocaleString("en-IN")}</p><p className="mt-1 capitalize text-gray-500">{order.payment_status}</p></div></div>)}</div> : <div className="mt-5 rounded-2xl bg-ivory p-5 text-sm text-gray-600">No orders yet. <Link href="/new-arrivals" className="font-semibold text-cocoa underline">Start shopping</Link>.</div>}</section>
      <section className="rounded-3xl bg-ivory p-6"><h2 className="font-display text-3xl text-cocoa">Saved addresses</h2>{addresses.length > 0 && <div className="mt-5 space-y-3">{addresses.map((item) => <div key={item.id} className="rounded-2xl bg-white p-4 text-sm leading-6 text-gray-600"><p className="font-semibold text-cocoa">{item.recipient_name} · {item.phone}</p><p>{item.line_1}{item.line_2 ? `, ${item.line_2}` : ""}, {item.city}, {item.state} {item.postal_code}</p></div>)}</div>}<form onSubmit={saveAddress} className="mt-6 grid gap-3 sm:grid-cols-2"><input required placeholder="Full name" value={address.recipient_name} onChange={(event) => setAddress({ ...address, recipient_name: event.target.value })} className="rounded-xl border border-black/10 bg-white p-3 text-sm outline-none focus:border-mocha" /><input required placeholder="Phone" value={address.phone} onChange={(event) => setAddress({ ...address, phone: event.target.value })} className="rounded-xl border border-black/10 bg-white p-3 text-sm outline-none focus:border-mocha" /><input required placeholder="Address line 1" value={address.line_1} onChange={(event) => setAddress({ ...address, line_1: event.target.value })} className="rounded-xl border border-black/10 bg-white p-3 text-sm outline-none focus:border-mocha sm:col-span-2" /><input placeholder="Address line 2 (optional)" value={address.line_2} onChange={(event) => setAddress({ ...address, line_2: event.target.value })} className="rounded-xl border border-black/10 bg-white p-3 text-sm outline-none focus:border-mocha sm:col-span-2" /><input required placeholder="City" value={address.city} onChange={(event) => setAddress({ ...address, city: event.target.value })} className="rounded-xl border border-black/10 bg-white p-3 text-sm outline-none focus:border-mocha" /><input required placeholder="State" value={address.state} onChange={(event) => setAddress({ ...address, state: event.target.value })} className="rounded-xl border border-black/10 bg-white p-3 text-sm outline-none focus:border-mocha" /><input required inputMode="numeric" maxLength={6} placeholder="PIN code" value={address.postal_code} onChange={(event) => setAddress({ ...address, postal_code: event.target.value.replace(/\D/g, "") })} className="rounded-xl border border-black/10 bg-white p-3 text-sm outline-none focus:border-mocha sm:col-span-2" /><button className="rounded-full bg-cocoa px-5 py-3 text-sm font-bold text-white transition hover:bg-mocha sm:col-span-2">Save address</button></form></section></div>
  </main>;
}

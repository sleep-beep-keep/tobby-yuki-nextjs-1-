"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";

type Address = { id: string; recipient_name: string; phone: string; line_1: string; line_2: string | null; city: string; state: string; postal_code: string; country: string; is_default: boolean };

const initialDetails = { firstName: "", lastName: "", email: "", phone: "", line1: "", line2: "", city: "", state: "", postalCode: "" };

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [details, setDetails] = useState(initialDetails);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("new");
  const [saveAddress, setSaveAddress] = useState(true);
  const [serviceable, setServiceable] = useState<boolean | null>(null);
  const [pincodeMessage, setPincodeMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const selectedAddress = addresses.find((address) => address.id === selectedAddressId);
  const addingNewAddress = selectedAddressId === "new";

  useEffect(() => {
    setDetails((current) => ({ ...current, email: user?.email ?? current.email }));
    if (!user) { setAddresses([]); setSelectedAddressId("new"); return; }
    setAddressLoading(true);
    createClient().from("addresses").select("id, recipient_name, phone, line_1, line_2, city, state, postal_code, country, is_default").order("is_default", { ascending: false }).order("created_at", { ascending: false }).then(({ data, error }) => {
      if (!error) setAddresses((data ?? []) as Address[]);
      setAddressLoading(false);
    });
  }, [user]);

  const updateDetail = (key: keyof typeof initialDetails, value: string) => {
    setDetails((current) => ({ ...current, [key]: value }));
    if (key === "postalCode") { setServiceable(null); setPincodeMessage(""); }
  };

  async function lookupPincode() {
    if (!/^\d{6}$/.test(details.postalCode)) { setServiceable(false); setPincodeMessage("Enter a valid 6-digit PIN code."); return; }
    setPincodeMessage("Looking up location…");
    try {
      const response = await fetch(`/api/pincode/${details.postalCode}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setDetails((current) => ({ ...current, city: result.city, state: result.state }));
      setServiceable(true);
      setPincodeMessage(`Location found${result.postOffice ? `: ${result.postOffice}` : ""}. You can edit the details if needed.`);
    } catch (error) {
      setServiceable(false);
      setPincodeMessage(error instanceof Error ? error.message : "Unable to look up this PIN code.");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    if (!user) { router.push("/account"); return; }
    if (addingNewAddress && !serviceable) { setNotice("Please look up a valid PIN code before placing your order."); return; }
    if (!addingNewAddress && !selectedAddress) { setNotice("Choose a saved address or add a new one."); return; }

    const shippingAddress = selectedAddress ? { recipient_name: selectedAddress.recipient_name, phone: selectedAddress.phone, line_1: selectedAddress.line_1, line_2: selectedAddress.line_2 || undefined, city: selectedAddress.city, state: selectedAddress.state, postal_code: selectedAddress.postal_code, country: selectedAddress.country, email: user.email ?? "" } : {
      recipient_name: `${details.firstName} ${details.lastName}`.trim(), phone: details.phone, line_1: details.line1, line_2: details.line2 || undefined, city: details.city, state: details.state, postal_code: details.postalCode, country: "India", email: details.email,
    };
    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: items.map(({ slug, quantity, size }) => ({ slug, quantity, size })), shippingAddress, saveAddress: addingNewAddress && saveAddress }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to place your order.");
      clearCart();
      setOrderNumber(result.orderNumber);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to place your order.");
    } finally { setSubmitting(false); }
  }

  if (!items.length && !orderNumber) return <main className="mx-auto max-w-4xl px-4 py-20 text-center"><h1 className="font-display text-5xl text-cocoa">Checkout</h1><p className="mt-5 text-gray-600">Your cart is empty.</p><Link href="/" className="mt-7 inline-block rounded-full bg-cocoa px-7 py-3 text-sm font-bold text-white">Continue shopping</Link></main>;
  if (orderNumber) return <main className="mx-auto max-w-xl px-4 py-24 text-center"><CheckCircle2 className="mx-auto text-mocha" size={52} /><h1 className="mt-5 font-display text-5xl text-cocoa">Order received!</h1><p className="mt-4 leading-relaxed text-gray-600">Your cash-on-delivery order <strong>{orderNumber}</strong> has been saved. We&apos;ll send updates to {user?.email ?? details.email}.</p><Link href="/account" className="mt-8 inline-block rounded-full bg-cocoa px-7 py-3 text-sm font-bold text-white">View your orders</Link></main>;

  return <main className="mx-auto max-w-6xl px-4 py-12"><h1 className="font-display text-5xl text-cocoa">Checkout</h1><div className="mt-9 grid gap-8 lg:grid-cols-[1.25fr_.75fr]"><form onSubmit={submit} className="space-y-7 rounded-3xl border border-black/5 p-6 shadow-soft"><section><h2 className="font-display text-3xl text-cocoa">Delivery address</h2>{!authLoading && user && <div className="mt-5 space-y-3">{addressLoading ? <p className="text-sm text-gray-600">Loading saved addresses…</p> : addresses.map((address) => <label key={address.id} className={`block cursor-pointer rounded-2xl border p-4 transition ${selectedAddressId === address.id ? "border-cocoa bg-[#f5e9df]" : "border-black/10 bg-white"}`}><input className="sr-only" type="radio" name="address" checked={selectedAddressId === address.id} onChange={() => setSelectedAddressId(address.id)} /><p className="font-semibold text-cocoa">Deliver to {address.recipient_name}{address.is_default ? " · Default" : ""}</p><p className="mt-1 text-sm leading-6 text-gray-600">{address.line_1}{address.line_2 ? `, ${address.line_2}` : ""}, {address.city}, {address.state} {address.postal_code}<br />{address.phone}</p></label>)}<label className={`block cursor-pointer rounded-2xl border p-4 transition ${addingNewAddress ? "border-cocoa bg-[#f5e9df]" : "border-black/10 bg-white"}`}><input className="sr-only" type="radio" name="address" checked={addingNewAddress} onChange={() => setSelectedAddressId("new")} /><p className="font-semibold text-cocoa">Add a new address</p><p className="mt-1 text-sm text-gray-600">Use a different delivery address for this order.</p></label></div>}<div className={`mt-5 grid gap-4 sm:grid-cols-2 ${addingNewAddress ? "" : "hidden"}`}><input required={addingNewAddress} value={details.firstName} onChange={(event) => updateDetail("firstName", event.target.value)} placeholder="First name" className="rounded-xl border p-3 outline-none focus:border-mocha" /><input required={addingNewAddress} value={details.lastName} onChange={(event) => updateDetail("lastName", event.target.value)} placeholder="Last name" className="rounded-xl border p-3 outline-none focus:border-mocha" /><input required={addingNewAddress} type="email" value={details.email} onChange={(event) => updateDetail("email", event.target.value)} placeholder="Email address" className="rounded-xl border p-3 outline-none focus:border-mocha sm:col-span-2" /><input required={addingNewAddress} inputMode="tel" value={details.phone} onChange={(event) => updateDetail("phone", event.target.value)} placeholder="Phone number" className="rounded-xl border p-3 outline-none focus:border-mocha sm:col-span-2" /><input required={addingNewAddress} value={details.line1} onChange={(event) => updateDetail("line1", event.target.value)} placeholder="Address line 1" className="rounded-xl border p-3 outline-none focus:border-mocha sm:col-span-2" /><input value={details.line2} onChange={(event) => updateDetail("line2", event.target.value)} placeholder="Address line 2 (optional)" className="rounded-xl border p-3 outline-none focus:border-mocha sm:col-span-2" /><input required={addingNewAddress} value={details.city} onChange={(event) => updateDetail("city", event.target.value)} placeholder="City" className="rounded-xl border p-3 outline-none focus:border-mocha" /><input required={addingNewAddress} value={details.state} onChange={(event) => updateDetail("state", event.target.value)} placeholder="State" className="rounded-xl border p-3 outline-none focus:border-mocha" /><div className="flex gap-2 sm:col-span-2"><input required={addingNewAddress} value={details.postalCode} inputMode="numeric" maxLength={6} placeholder="PIN code" className="min-w-0 flex-1 rounded-xl border p-3 outline-none focus:border-mocha" onChange={(event) => updateDetail("postalCode", event.target.value.replace(/\D/g, ""))} /><button type="button" onClick={lookupPincode} className="rounded-xl bg-ivory px-4 text-sm font-semibold text-cocoa">Look up</button></div>{pincodeMessage && <p className={`sm:col-span-2 text-sm ${serviceable ? "text-green-700" : "text-rose"}`}><MapPin className="mr-1 inline" size={16} />{pincodeMessage}</p>}<label className="sm:col-span-2 flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={saveAddress} onChange={(event) => setSaveAddress(event.target.checked)} /> Save this address to my profile</label></div></section><section className="border-t border-black/5 pt-7"><h2 className="font-display text-3xl text-cocoa">Payment</h2><label className="mt-4 flex items-center gap-3 rounded-xl border border-cocoa bg-[#f5e9df] p-4 text-sm font-semibold"><input type="radio" defaultChecked name="payment" /> Cash on Delivery</label><p className="mt-3 text-sm text-gray-600">Online payment will be available soon.</p></section>{notice && <p className="rounded-xl bg-rose/10 px-4 py-3 text-sm text-rose" role="alert">{notice}</p>} {!authLoading && !user && <p className="rounded-xl bg-ivory px-4 py-3 text-sm text-cocoa">Please <Link href="/account" className="font-bold underline">sign in or create an account</Link> to use saved addresses and place your order.</p>}<button disabled={submitting || authLoading || (addingNewAddress && !serviceable)} className="w-full rounded-full bg-cocoa py-4 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">{submitting ? "Placing order…" : user ? "Place COD order" : "Sign in to place order"}</button></form><aside className="h-fit rounded-3xl bg-ivory p-6"><h2 className="font-display text-3xl text-cocoa">Your order</h2><div className="mt-5 space-y-3">{items.map((item) => <p key={`${item.slug}-${item.size}`} className="flex justify-between gap-3 text-sm text-gray-600"><span>{item.name} × {item.quantity}</span><span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span></p>)}</div><p className="mt-5 flex justify-between text-sm text-gray-600"><span>Shipping</span><span>{shipping ? `₹${shipping}` : "Free"}</span></p><p className="mt-3 border-t border-black/10 pt-4 font-bold text-cocoa">Total <span className="float-right">₹{(subtotal + shipping).toLocaleString("en-IN")}</span></p></aside></div></main>;
}

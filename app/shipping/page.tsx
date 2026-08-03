import { Box, RefreshCw, Truck } from "lucide-react";
import Link from "next/link";

const policies = [
  { icon: Truck, title: "Shipping", copy: "We offer free standard shipping on orders above ₹999. Once your order is on its way, you'll receive a confirmation with tracking details." },
  { icon: Box, title: "Order processing", copy: "Orders are thoughtfully packed and usually dispatched within 1–2 business days. During launches and sale periods, a little extra time may be needed." },
  { icon: RefreshCw, title: "Returns & exchanges", copy: "If something isn&apos;t quite right, contact us within 7 days of delivery. Items should be unused, in their original condition, and returned with their packaging." },
];

export default function ShippingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <section className="rounded-[2rem] bg-[#f5e9df] px-6 py-14 text-center md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[.3em] text-mocha">The helpful details</p>
        <h1 className="mt-3 font-display text-5xl text-cocoa md:text-6xl">Shipping &amp; Returns</h1>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-gray-700">A smooth journey from our door to yours, with support whenever you need it.</p>
      </section>

      <section className="grid gap-5 py-12 md:grid-cols-3 md:py-16">
        {policies.map(({ icon: Icon, title, copy }) => <article key={title} className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft"><Icon className="text-mocha" size={24} /><h2 className="mt-5 font-display text-2xl text-cocoa">{title}</h2><p className="mt-3 text-sm leading-6 text-gray-600">{copy}</p></article>)}
      </section>

      <section className="rounded-3xl bg-cocoa px-6 py-10 text-center text-white md:p-12"><h2 className="font-display text-3xl">Need a hand with an order?</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/75">Our support team is happy to help with delivery updates, returns, and exchanges.</p><Link href="/contact" className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-cocoa transition hover:bg-[#f5e9df]">Contact support</Link></section>
    </main>
  );
}

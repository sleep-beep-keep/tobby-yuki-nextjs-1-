import { Ruler, Shirt } from "lucide-react";
import Link from "next/link";

const sizes = [
  ["XS", "20–28 cm", "28–36 cm", "Up to 4 kg"],
  ["S", "28–36 cm", "36–48 cm", "4–8 kg"],
  ["M", "36–46 cm", "48–60 cm", "8–16 kg"],
  ["L", "46–56 cm", "60–72 cm", "16–28 kg"],
  ["XL", "56–66 cm", "72–84 cm", "28+ kg"],
];

export default function SizeGuidePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <section className="rounded-[2rem] bg-lilac px-6 py-14 text-center md:py-20">
        <Ruler className="mx-auto text-lavender" size={28} />
        <p className="mt-5 text-xs font-semibold uppercase tracking-[.3em] text-lavender">Find their perfect fit</p>
        <h1 className="mt-3 font-display text-5xl text-[#4d3861] md:text-6xl">Size Guide</h1>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-[#4d3861]/80">A few simple measurements help make every walk, nap, and adventure more comfortable.</p>
      </section>

      <section className="grid gap-8 py-12 md:grid-cols-[.8fr_1.2fr] md:py-16">
        <div className="rounded-3xl bg-ivory p-7"><Shirt className="text-mocha" size={26} /><h2 className="mt-5 font-display text-3xl text-cocoa">How to measure</h2><ol className="mt-5 space-y-4 text-sm leading-relaxed text-gray-600"><li><span className="font-semibold text-cocoa">1. Neck:</span> Measure around the base of the neck where a collar comfortably sits.</li><li><span className="font-semibold text-cocoa">2. Chest:</span> Measure the widest part of the chest, just behind the front legs.</li><li><span className="font-semibold text-cocoa">3. Fit:</span> Leave room for two fingers between the product and your pet.</li></ol></div>
        <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-soft"><div className="border-b border-black/5 px-6 py-5"><h2 className="font-display text-3xl text-cocoa">Harness &amp; apparel sizing</h2><p className="mt-1 text-sm text-gray-500">Use chest measurement as your primary guide.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm"><thead className="bg-[#f5e9df] text-cocoa"><tr><th className="px-6 py-4 font-semibold">Size</th><th className="px-6 py-4 font-semibold">Neck</th><th className="px-6 py-4 font-semibold">Chest</th><th className="px-6 py-4 font-semibold">Guide weight</th></tr></thead><tbody>{sizes.map((size) => <tr key={size[0]} className="border-t border-black/5 text-gray-600">{size.map((value, index) => <td key={value} className={`px-6 py-4 ${index === 0 ? "font-semibold text-cocoa" : ""}`}>{value}</td>)}</tr>)}</tbody></table></div></div>
      </section>

      <section className="rounded-3xl bg-cocoa px-6 py-10 text-center text-white md:p-12"><h2 className="font-display text-3xl">Between sizes?</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/75">We recommend choosing the larger size for a more comfortable fit. Still unsure? Our team can help.</p><Link href="/contact" className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-cocoa transition hover:bg-[#f5e9df]">Ask about sizing</Link></section>
    </main>
  );
}

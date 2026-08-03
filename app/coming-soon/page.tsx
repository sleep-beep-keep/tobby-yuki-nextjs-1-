import { Bell, Sparkles } from "lucide-react";
import Link from "next/link";

const upcoming = [
  { title: "Walks, elevated", description: "Thoughtful new walkwear made for daily adventures.", tone: "bg-[#f5e9df]", label: "For dogs" },
  { title: "Little luxuries", description: "Playful feline accessories with a polished finish.", tone: "bg-lilac", label: "For cats" },
  { title: "Home comforts", description: "Beautiful essentials designed to fit right into your home.", tone: "bg-[#faeee8]", label: "For every pet" },
];

export default function ComingSoonPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <section className="overflow-hidden rounded-[2rem] bg-cocoa px-6 py-16 text-center text-white md:px-12 md:py-24">
        <Sparkles className="mx-auto text-[#e8cbb5]" size={28} />
        <p className="mt-5 text-xs font-semibold uppercase tracking-[.3em] text-[#e8cbb5]">A little preview</p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Coming Soon</h1>
        <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/75">
          We are putting the finishing touches on a few lovely things for the pets who make life beautiful.
        </p>
      </section>

      <section className="py-12 md:py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {upcoming.map((item) => (
            <article key={item.title} className={`${item.tone} rounded-3xl p-7 md:p-8`}>
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-mocha">{item.label}</p>
              <h2 className="mt-5 font-display text-3xl text-cocoa">{item.title}</h2>
              <p className="mt-3 leading-relaxed text-cocoa/70">{item.description}</p>
              <p className="mt-8 text-sm font-semibold text-cocoa">In the works</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-black/5 bg-ivory px-6 py-10 text-center md:py-12">
        <Bell className="mx-auto text-mocha" size={25} />
        <h2 className="mt-4 font-display text-3xl text-cocoa">Want to be first to know?</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-gray-600">Drop us a note and we&apos;ll make sure you hear about our next collection.</p>
        <Link href="/contact" className="mt-6 inline-flex rounded-full bg-cocoa px-6 py-3 text-sm font-semibold text-white transition hover:bg-mocha">Get in touch</Link>
      </section>
    </main>
  );
}

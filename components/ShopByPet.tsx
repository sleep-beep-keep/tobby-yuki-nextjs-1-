import Link from "next/link";

export default function ShopByPet() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[.3em] text-rose">♥ Shop by pet ♥</p>
        <h2 className="mt-2 font-display text-3xl text-cocoa">Made for every personality</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Link href="/dogs" className="group relative min-h-[340px] overflow-hidden rounded-[2rem] bg-[#f5e9df]">
          <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=85" alt="Dog collection" className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f5e9df] via-[#f5e9df]/75 to-transparent" />
          <div className="relative max-w-sm p-9">
            <h3 className="font-display text-4xl text-cocoa">🐾 DOGS</h3>
            <p className="mt-2 text-lg">Adventure. Comfort. Style.</p>
            <p className="mt-3 text-sm text-ink/70">Everything your dog needs for a pawsome life.</p>
            <span className="mt-7 inline-block rounded-full bg-cocoa px-6 py-3 text-xs font-bold text-white">EXPLORE DOG COLLECTION →</span>
          </div>
        </Link>
        <Link href="/cats" className="group relative min-h-[340px] overflow-hidden rounded-[2rem] bg-lilac">
          <img src="https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=1000&q=85" alt="Cat collection" className="absolute inset-0 h-full w-full object-cover object-right opacity-70 transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-lilac via-lilac/75 to-transparent" />
          <div className="relative max-w-sm p-9">
            <h3 className="font-display text-4xl text-[#4d3861]">🐱 CATS</h3>
            <p className="mt-2 text-lg text-[#4d3861]">Elegant. Curious. Loved.</p>
            <p className="mt-3 text-sm text-[#4d3861]/70">Elegant essentials for your curious companion.</p>
            <span className="mt-7 inline-block rounded-full bg-lavender px-6 py-3 text-xs font-bold text-white">EXPLORE CAT COLLECTION →</span>
          </div>
        </Link>
      </div>
    </section>
  );
}

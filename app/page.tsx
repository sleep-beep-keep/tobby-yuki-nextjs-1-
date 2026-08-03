import Hero from "@/components/Hero";
import CategoryNav from "@/components/CategoryNav";
import ShopByPet from "@/components/ShopByPet";
import ProductGrid from "@/components/ProductGrid";
import { createClient } from "@/lib/supabase/server";
import { productSelect, toProduct } from "@/lib/storefront";

export default async function Home() {
  const supabase = await createClient();
  const [{ data: dogRows, error: dogError }, { data: catRows, error: catError }] = await Promise.all([
    supabase.from("products").select(productSelect).eq("pet", "dogs").eq("featured", true).order("created_at", { ascending: false }).limit(6),
    supabase.from("products").select(productSelect).eq("pet", "cats").eq("featured", true).order("created_at", { ascending: false }).limit(6),
  ]);
  if (dogError) throw new Error(`Unable to load dog products: ${dogError.message}`);
  if (catError) throw new Error(`Unable to load cat products: ${catError.message}`);
  const dogs = (dogRows ?? []).map(toProduct);
  const cats = (catRows ?? []).map(toProduct);

  return (
    <main>
      <Hero />
      <CategoryNav />
      <section className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-black/5 bg-ivory p-6 md:grid-cols-4">
          {[
            ["✦", "Premium Quality", "Handpicked with love for your pets"],
            ["🚚", "Free Shipping", "On orders above ₹999"],
            ["♢", "Easy Returns", "Hassle-free returns within 7 days"],
            ["♡", "Made with Love", "Thoughtful designs for happy tails"]
          ].map(([icon, title, text]) => (
            <div key={title} className="p-3 text-center md:text-left">
              <div className="text-2xl">{icon}</div><h3 className="mt-2 font-semibold">{title}</h3><p className="mt-1 text-xs text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </section>
      <ShopByPet />
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-7 flex items-end justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-[.25em] text-mocha">🐾 Featured for dogs</p><h2 className="mt-2 font-display text-3xl text-cocoa">Adventure-ready favourites</h2></div>
          <a href="/dogs" className="hidden text-sm font-semibold text-mocha sm:block">View all dog products →</a>
        </div>
        <ProductGrid products={dogs} />
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-7 flex items-end justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-[.25em] text-lavender">🐾 Featured for cats</p><h2 className="mt-2 font-display text-3xl text-cocoa">Elegant feline favourites</h2></div>
          <a href="/cats" className="hidden text-sm font-semibold text-lavender sm:block">View all cat products →</a>
        </div>
        <ProductGrid products={cats} />
      </section>
      <section className="mx-auto my-12 max-w-7xl rounded-[2rem] bg-gradient-to-r from-[#f6e8dc] to-[#eee4f2] px-6 py-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-[.3em] text-mocha">Join the Pawsome Club</p>
        <h2 className="mt-3 font-display text-4xl text-cocoa">A little love, straight to your inbox.</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600">Get updates on new arrivals, exclusive offers and pawsome tips for your furry friends.</p>
        <div className="mx-auto mt-7 flex max-w-lg overflow-hidden rounded-full bg-white p-1 shadow-sm">
          <input className="min-w-0 flex-1 bg-transparent px-5 outline-none" placeholder="Enter your email address" />
          <button className="rounded-full bg-cocoa px-6 py-3 text-sm font-bold text-white">Subscribe</button>
        </div>
      </section>
    </main>
  );
}

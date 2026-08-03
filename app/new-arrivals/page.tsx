import SortableProductGrid from "@/components/SortableProductGrid";
import { createClient } from "@/lib/supabase/server";
import { productSelect, toProduct } from "@/lib/storefront";
import Link from "next/link";

export default async function NewArrivalsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select(productSelect).eq("featured", true).order("created_at", { ascending: false });
  if (error) throw new Error(`Unable to load new arrivals: ${error.message}`);
  const newArrivals = (data ?? []).map(toProduct);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <section className="rounded-[2rem] bg-[#f5e9df] px-6 py-14 text-center md:px-12 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[.3em] text-mocha">Tobby &amp; Yuki</p>
        <h1 className="mt-3 font-display text-5xl text-cocoa md:text-6xl">New Arrivals</h1>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-gray-700">
          Freshly curated essentials for beautiful everyday moments with your best friend.
        </p>
      </section>

      <div className="flex flex-col justify-between gap-4 py-10 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-mocha">Just landed</p>
          <h2 className="mt-2 font-display text-3xl text-cocoa">Made for happy tails &amp; whiskers</h2>
        </div>
        <Link href="/dogs" className="w-fit rounded-full border border-cocoa px-5 py-2.5 text-sm font-semibold text-cocoa transition hover:bg-cocoa hover:text-white">
          Shop all collections
        </Link>
      </div>

      <SortableProductGrid products={newArrivals} />
    </main>
  );
}

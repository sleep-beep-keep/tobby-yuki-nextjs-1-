import SortableProductGrid from "@/components/SortableProductGrid";
import { createClient } from "@/lib/supabase/server";
import { productSelect, toProduct } from "@/lib/storefront";

export default async function CatsPage() {
  const supabase = await createClient();
  const [{ data: productRows, error: productError }, { data: categoryRows, error: categoryError }] = await Promise.all([
    supabase.from("products").select(productSelect).eq("pet", "cats").order("created_at", { ascending: false }),
    supabase.from("products").select("category").eq("pet", "cats").order("category"),
  ]);
  if (productError) throw new Error(`Unable to load cat products: ${productError.message}`);
  if (categoryError) throw new Error(`Unable to load cat categories: ${categoryError.message}`);
  const catProducts = (productRows ?? []).map(toProduct);
  const catCategories = [...new Set((categoryRows ?? []).map(({ category }) => category))];
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="rounded-[2rem] bg-lilac px-7 py-14 text-center">
        <p className="text-xs font-semibold uppercase tracking-[.3em] text-lavender">🐱 Tobby & Yuki</p>
        <h1 className="mt-3 font-display text-6xl text-[#4d3861]">Cats</h1>
        <p className="mx-auto mt-4 max-w-xl text-[#4d3861]/80">Small details. Big personalities.</p>
      </div>
      <div className="my-8 flex gap-2 overflow-x-auto pb-2">
        {catCategories.map(c => <a key={c} href={`/shop/${c}`} className="whitespace-nowrap rounded-full border px-5 py-2 text-sm capitalize hover:bg-lavender hover:text-white">{c.replace("-", " ")}</a>)}
      </div>
      <SortableProductGrid products={catProducts} />
    </main>
  );
}

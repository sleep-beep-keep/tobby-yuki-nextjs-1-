import SortableProductGrid from "@/components/SortableProductGrid";
import { createClient } from "@/lib/supabase/server";
import { productSelect, toProduct } from "@/lib/storefront";

export default async function DogsPage() {
  const supabase = await createClient();
  const [{ data: productRows, error: productError }, { data: categoryRows, error: categoryError }] = await Promise.all([
    supabase.from("products").select(productSelect).eq("is_active", true).eq("pet_type", "dog").order("created_at", { ascending: false }),
    supabase.from("products").select("category").eq("is_active", true).eq("pet_type", "dog").order("category"),
  ]);
  if (productError) throw new Error(`Unable to load dog products: ${productError.message}`);
  if (categoryError) throw new Error(`Unable to load dog categories: ${categoryError.message}`);
  const dogProducts = (productRows ?? []).map(toProduct);
  const dogCategories = [...new Set((categoryRows ?? []).map(({ category }) => category))];
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="rounded-[2rem] bg-[#f5e9df] px-7 py-14 text-center">
        <p className="text-xs font-semibold uppercase tracking-[.3em] text-mocha">🐾 Tobby & Yuki</p>
        <h1 className="mt-3 font-display text-6xl text-cocoa">Dogs</h1>
        <p className="mx-auto mt-4 max-w-xl text-gray-700">Everything your best friend needs to live life beautifully.</p>
      </div>
      <div className="my-8 flex gap-2 overflow-x-auto pb-2">
        {dogCategories.map(c => <a key={c} href={`/shop/${c}`} className="whitespace-nowrap rounded-full border px-5 py-2 text-sm capitalize hover:bg-cocoa hover:text-white">{c.replace("-", " ")}</a>)}
      </div>
      <SortableProductGrid products={dogProducts} />
    </main>
  );
}

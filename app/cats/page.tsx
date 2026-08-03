import ProductGrid from "@/components/ProductGrid";
import { products, catCategories } from "@/data/products";

export default function CatsPage() {
  const catProducts = products.filter(p => p.pet === "cats");
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
      <ProductGrid products={catProducts} />
    </main>
  );
}

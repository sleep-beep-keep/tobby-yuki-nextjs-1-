import SortableProductGrid from "@/components/SortableProductGrid";
import { products, dogCategories } from "@/data/products";

export default function DogsPage() {
  const dogProducts = products.filter(p => p.pet === "dogs");
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

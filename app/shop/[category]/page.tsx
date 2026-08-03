import SortableProductGrid from "@/components/SortableProductGrid";
import { products } from "@/data/products";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const normalized = decodeURIComponent(category).toLowerCase();
  const filtered = normalized === "new-arrivals"
    ? products.slice(-6)
    : normalized === "coming-soon"
      ? []
      : products.filter(p => p.category === normalized);

  const title = normalized.replaceAll("-", " ");
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[.3em] text-mocha">Shop the collection</p>
        <h1 className="mt-2 font-display text-5xl capitalize text-cocoa">{title}</h1>
        <p className="mt-3 text-gray-600">{normalized === "coming-soon" ? "Something pawsome is on the way." : "Designed for pets who deserve the very best."}</p>
      </div>
      {normalized === "coming-soon" ? (
        <div className="rounded-3xl bg-ivory px-6 py-24 text-center">
          <div className="text-5xl">🐾</div><h2 className="mt-4 font-display text-4xl text-cocoa">Coming soon</h2>
          <p className="mx-auto mt-3 max-w-md text-gray-600">Join the Pawsome Club to be the first to know when our newest designs arrive.</p>
        </div>
      ) : <SortableProductGrid products={filtered} />}
    </main>
  );
}

"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/storefront";
import ProductGrid from "./ProductGrid";

type SortOption = "featured" | "price-low" | "price-high" | "name";

const sortLabels: Record<SortOption, string> = {
  featured: "Featured",
  "price-low": "Price: Low to High",
  "price-high": "Price: High to Low",
  name: "Name: A to Z",
};

export default function SortableProductGrid({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortOption>("featured");
  const sortedProducts = useMemo(() => [...products].sort((first, second) => {
    if (sort === "price-low") return first.price - second.price;
    if (sort === "price-high") return second.price - first.price;
    if (sort === "name") return first.name.localeCompare(second.name);
    return Number(second.featured) - Number(first.featured) || first.name.localeCompare(second.name);
  }), [products, sort]);

  return <section>
    <div className="mb-6 flex items-center justify-between gap-4">
      <p className="text-sm text-gray-600">{products.length} {products.length === 1 ? "item" : "items"}</p>
      <label className="flex items-center gap-2 text-sm font-medium text-cocoa">Sort by
        <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-ink outline-none focus:border-mocha">
          {Object.entries(sortLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
    </div>
    <ProductGrid products={sortedProducts} />
  </section>;
}

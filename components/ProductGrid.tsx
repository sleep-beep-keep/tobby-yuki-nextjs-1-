import ProductCard from "./ProductCard";
import type { Product } from "@/data/products";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) return <p className="py-16 text-center text-gray-500">No products found yet.</p>;
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => <ProductCard key={p.slug} product={p} />)}
    </div>
  );
}

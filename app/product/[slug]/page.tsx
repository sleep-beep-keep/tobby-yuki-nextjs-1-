import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { Truck, RotateCcw, ShieldCheck } from "lucide-react";
import ProductActions from "@/components/ProductActions";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find(p => p.slug === slug);
  if (!product) notFound();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-ivory">
          <img src={product.image} alt={product.name} className="aspect-square h-full w-full object-cover" />
        </div>
        <div className="py-3">
          <p className="text-xs font-semibold uppercase tracking-[.25em] text-mocha">{product.pet} · {product.category}</p>
          <h1 className="mt-3 font-display text-5xl text-cocoa">{product.name}</h1>
          <div className="mt-4 text-amber-500">★★★★★ <span className="text-sm text-gray-500">({product.reviews} reviews)</span></div>
          <p className="mt-5 text-2xl font-semibold">₹{product.price.toLocaleString("en-IN")}</p>
          <p className="mt-5 leading-7 text-gray-600">{product.description}</p>
          <ProductActions product={product} />
          <div className="mt-8 grid grid-cols-3 gap-3 border-t pt-6 text-center text-xs">
            <div><Truck className="mx-auto mb-2" size={20}/><p>Free shipping</p></div>
            <div><RotateCcw className="mx-auto mb-2" size={20}/><p>Easy returns</p></div>
            <div><ShieldCheck className="mx-auto mb-2" size={20}/><p>Quality assured</p></div>
          </div>
        </div>
      </div>
    </main>
  );
}

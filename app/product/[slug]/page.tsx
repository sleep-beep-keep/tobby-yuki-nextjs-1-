import { notFound } from "next/navigation";
import { Truck, RotateCcw, ShieldCheck } from "lucide-react";
import ProductActions from "@/components/ProductActions";
import { createClient } from "@/lib/supabase/server";
import { productSelect, toProduct } from "@/lib/storefront";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select(productSelect).eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Unable to load product: ${error.message}`);
  if (!data) notFound();
  const product = toProduct(data);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-ivory">
          <img src={product.image} alt={product.name} className="aspect-square h-full w-full object-cover" />
        </div>
        <div className="py-3">
          <p className="text-xs font-semibold uppercase tracking-[.25em] text-mocha">{product.pet} · {product.category}</p>
          <h1 className="mt-3 font-display text-5xl text-cocoa">{product.name}</h1>
          <p className="mt-4 text-sm text-gray-500">Thoughtfully made for everyday adventures.</p>
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

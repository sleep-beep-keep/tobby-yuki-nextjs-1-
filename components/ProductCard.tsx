"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/storefront";
import { useCart } from "./CartProvider";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const requiresVariant = ["harnesses", "raincoats", "cat-collars"].includes(product.category);
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_2px_8px_rgba(46,32,28,0.05)] transition duration-300 hover:-translate-y-1 hover:border-black/10 hover:shadow-[0_14px_30px_rgba(46,32,28,0.12)]">
      <Link href={`/product/${product.slug}`}>
        <div className="relative m-3 aspect-square overflow-hidden rounded-[1.15rem] border border-black/[0.06] bg-[#faf8f5] p-1.5 shadow-[0_6px_16px_rgba(46,32,28,0.08)] transition duration-300 group-hover:shadow-[0_10px_22px_rgba(46,32,28,0.12)]">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full rounded-[0.9rem] object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <button
            aria-label={`Add ${product.name} to wishlist`}
            onClick={(e) => e.preventDefault()}
            className="absolute right-5 top-5 rounded-full border border-black/5 bg-white/95 p-2 shadow-sm transition hover:scale-105"
          >
            <Heart size={17} />
          </button>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-medium text-ink">{product.name}</h3>
        </Link>
        <p className="mt-1 font-semibold text-cocoa">₹{product.price.toLocaleString("en-IN")}</p>
        <p className="mt-2 text-xs text-gray-500">Thoughtfully made for everyday adventures.</p>
        {requiresVariant ? <Link href={`/product/${product.slug}`} className="mt-4 block w-full rounded-full bg-cocoa py-2.5 text-center text-sm font-semibold text-white transition hover:bg-mocha">Choose size</Link> : <button onClick={() => addItem(product)} className="mt-4 w-full rounded-full bg-cocoa py-2.5 text-sm font-semibold text-white transition hover:bg-mocha">Quick Add</button>}
      </div>
    </article>
  );
}

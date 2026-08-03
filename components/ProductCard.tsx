"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "./CartProvider";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <Link href={`/product/${product.slug}`}>
        <div className="relative m-2 aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-[#f5e9df] to-[#eee4f2]">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover p-2 mix-blend-multiply transition duration-500 group-hover:scale-105"
          />
          <button
            aria-label={`Add ${product.name} to wishlist`}
            onClick={(e) => e.preventDefault()}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2"
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
        <div className="mt-2 text-xs text-amber-500">★★★★★ <span className="text-gray-500">({product.reviews})</span></div>
        <button onClick={() => addItem(product)} className="mt-4 w-full rounded-full bg-cocoa py-2.5 text-sm font-semibold text-white transition hover:bg-mocha">
          Quick Add
        </button>
      </div>
    </article>
  );
}

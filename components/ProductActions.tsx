"use client";

import { useState } from "react";
import { CheckCircle2, Heart, MapPin } from "lucide-react";
import Link from "next/link";
import type { Product, ProductVariant } from "@/lib/storefront";
import { useCart } from "./CartProvider";

export default function ProductActions({ product, variants }: { product: Product; variants: ProductVariant[] }) {
  const [size, setSize] = useState("");
  const [pincode, setPincode] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const { addItem, items } = useCart();
  const hasSizes = variants.length > 0;
  const selectedVariant = variants.find((variant) => variant.name === size);
  const canAddToCart = !hasSizes || Boolean(selectedVariant && selectedVariant.stockQuantity > 0);
  const selectedItemIsInCart = items.some((item) => item.slug === product.slug && (!hasSizes || item.size === size));

  const checkDelivery = () => {
    const valid = /^\d{6}$/.test(pincode);
    setDeliveryMessage(valid ? "Delivery available. Estimated arrival: 3–7 business days." : "Please enter a valid 6-digit Indian PIN code.");
  };

  return <>
    {hasSizes && <div className="mt-7"><div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold">Select size</p><Link href="/size-guide" className="text-sm font-semibold text-mocha underline underline-offset-4 hover:text-cocoa">View size guide</Link></div><div className="mt-3 flex flex-wrap gap-2">{variants.map((variant) => { const soldOut = variant.stockQuantity < 1; return <button key={variant.id} type="button" disabled={soldOut} onClick={() => setSize(variant.name)} className={`rounded-full border px-5 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${size === variant.name ? "border-cocoa bg-cocoa text-white" : "hover:border-cocoa"}`}>{variant.name}{soldOut ? " · Sold out" : ""}</button>; })}</div>{!selectedVariant && <p className="mt-3 text-sm text-gray-600">Choose an in-stock size to add this product to your cart.</p>}{selectedVariant && <p className={`mt-3 text-sm ${selectedVariant.stockQuantity > 0 ? "text-green-700" : "text-rose"}`}>{selectedVariant.stockQuantity > 0 ? `${selectedVariant.stockQuantity} in stock` : "This size is sold out."}</p>}</div>}
    {!hasSizes && <Link href="/size-guide" className="mt-6 inline-block text-sm font-semibold text-mocha underline underline-offset-4 hover:text-cocoa">Need help finding the right fit? View size guide</Link>}
    <div className="mt-8 flex gap-3"><button disabled={!canAddToCart} onClick={() => addItem(product, hasSizes ? size : undefined)} className="flex-1 rounded-full bg-cocoa py-4 font-bold text-white transition hover:bg-mocha disabled:cursor-not-allowed disabled:opacity-40">{hasSizes && !selectedVariant ? "Select a size" : "Add to Cart"}</button><button aria-label="Add to wishlist" className="rounded-full border p-4"><Heart /></button></div>
    {selectedItemIsInCart && <Link href="/checkout" className="mt-3 block rounded-full border border-cocoa py-4 text-center text-sm font-bold text-cocoa transition hover:bg-ivory">Go to Checkout</Link>}
    <div className="mt-7 rounded-2xl bg-ivory p-4"><div className="flex items-center gap-2 text-sm font-semibold text-cocoa"><MapPin size={18} /> Check delivery availability</div><div className="mt-3 flex gap-2"><input value={pincode} onChange={(event) => setPincode(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" placeholder="Enter PIN code" className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-mocha" /><button onClick={checkDelivery} className="rounded-xl bg-white px-4 text-sm font-semibold text-cocoa shadow-sm">Check</button></div>{deliveryMessage && <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-gray-600"><CheckCircle2 size={16} className="shrink-0 text-mocha" />{deliveryMessage}</p>}</div>
  </>;
}

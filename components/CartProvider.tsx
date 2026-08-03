"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";

export type CartItem = Pick<Product, "slug" | "name" | "price" | "image"> & { quantity: number; size?: string };
type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  addItem: (product: Product, size?: string) => void;
  updateQuantity: (slug: string, size: string | undefined, quantity: number) => void;
  removeItem: (slug: string, size?: string) => void;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "tobby-yuki-cart";

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) setItems(JSON.parse(stored));
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) window.localStorage.setItem(storageKey, JSON.stringify(items)); }, [items, hydrated]);

  const value = useMemo(() => ({
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: items.reduce((total, item) => total + item.price * item.quantity, 0),
    addItem: (product: Product, size?: string) => setItems((current) => {
      const existing = current.find((item) => item.slug === product.slug && item.size === size);
      if (existing) return current.map((item) => item === existing ? { ...item, quantity: item.quantity + 1 } : item);
      return [...current, { slug: product.slug, name: product.name, price: product.price, image: product.image, size, quantity: 1 }];
    }),
    updateQuantity: (slug: string, size: string | undefined, quantity: number) => setItems((current) => quantity < 1 ? current.filter((item) => item.slug !== slug || item.size !== size) : current.map((item) => item.slug === slug && item.size === size ? { ...item, quantity } : item)),
    removeItem: (slug: string, size?: string) => setItems((current) => current.filter((item) => item.slug !== slug || item.size !== size)),
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}

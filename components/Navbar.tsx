"use client";

import Link from "next/link";
import { ChevronDown, Heart, Menu, PawPrint, Search, ShoppingBag, UserRound } from "lucide-react";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { useAuth } from "./AuthProvider";

const menuGroups = [
  { title: "Shop dogs", links: [["Shop all dogs", "/dogs"], ["Harnesses", "/shop/harnesses"], ["Raincoats", "/shop/raincoats"], ["Leashes & collars", "/shop/leashes"]] },
  { title: "Shop cats", links: [["Shop all cats", "/cats"], ["Cat collars", "/shop/cat-collars"], ["Toys & charms", "/shop/toys"], ["Litter boxes", "/shop/litter-boxes"]] },
  { title: "Everyday essentials", links: [["Tote & travel bags", "/shop/bags"], ["New arrivals", "/new-arrivals"], ["Size guide", "/size-guide"], ["Coming soon", "/coming-soon"]] },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, loading } = useAuth();
  const accountLabel = loading ? "Account" : user ? "Profile" : "Sign in";

  return (
    <>
      <div className="bg-cocoa px-4 py-2 text-center text-xs text-white">Free shipping on orders above ₹999 · COD available · Pawsome products. Happy pets.</div>
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <div className="relative" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
            <Link href="/" className="flex items-center gap-3">
              <PawPrint className="h-9 w-9 fill-[#d47b3f] text-[#2e201c]" />
              <div><div className="font-display text-2xl font-bold text-cocoa">Tobby &amp; Yuki</div><div className="text-[9px] font-semibold tracking-[.35em] text-mocha">PAWSOME BY DESIGN</div></div>
            </Link>
            <button onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-haspopup="menu" className="mt-2 flex items-center gap-1 rounded-full bg-ivory px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.16em] text-cocoa transition hover:bg-[#f5e9df]">
              <Menu size={14} /> Shop <ChevronDown size={13} className={`transition ${menuOpen ? "rotate-180" : ""}`} />
            </button>
            {menuOpen && <div role="menu" className="absolute left-0 top-full z-50 mt-3 w-[min(760px,calc(100vw-2.5rem))] rounded-3xl border border-black/5 bg-white p-5 shadow-soft md:p-6">
              <div className="grid gap-5 sm:grid-cols-3">{menuGroups.map((group) => <div key={group.title}><h2 className="text-xs font-bold uppercase tracking-[.18em] text-mocha">{group.title}</h2><div className="mt-3 flex flex-col gap-1">{group.links.map(([label, href]) => <Link key={label} href={href} onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2 text-sm text-ink transition hover:bg-ivory hover:text-cocoa">{label}</Link>)}</div></div>)}</div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2"><Link href="/shop/raincoats" onClick={() => setMenuOpen(false)} className="rounded-2xl bg-[#f5e9df] px-4 py-3 text-sm font-bold text-cocoa transition hover:bg-[#ead8ca]">Rainy-day ready <span className="block pt-1 text-xs font-normal text-cocoa/70">Explore raincoats →</span></Link><Link href="/shop/bags" onClick={() => setMenuOpen(false)} className="rounded-2xl bg-lilac px-4 py-3 text-sm font-bold text-[#4d3861] transition hover:bg-[#e4d6eb]">Outing essentials <span className="block pt-1 text-xs font-normal text-[#4d3861]/70">Shop bags →</span></Link></div>
            </div>}
          </div>
          <div className="flex items-center gap-4">
            <button aria-label="Search"><Search size={20} /></button>
            <Link href="/account" aria-label={accountLabel} className="hidden items-center gap-2 text-sm font-semibold text-cocoa sm:flex"><UserRound size={20} /><span>{accountLabel}</span></Link>
            <button aria-label="Wishlist"><Heart size={20} /></button>
            <Link href="/cart" aria-label={`Cart with ${itemCount} items`} className="relative"><ShoppingBag size={21} />{itemCount > 0 && <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-rose px-1 text-[10px] font-bold text-white">{itemCount}</span>}</Link>
          </div>
        </div>
      </header>
    </>
  );
}

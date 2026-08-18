"use client";

import Link from "next/link";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { useAuth } from "./AuthProvider";

const menuGroups = [
  { title: "Shop dogs", links: [["Shop all dogs", "/dogs"], ["Harnesses", "/shop/harnesses"], ["Raincoats", "/shop/raincoats"], ["Leashes & collars", "/shop/leashes"]] },
  { title: "Shop cats", links: [["Shop all cats", "/cats"], ["Cat collars", "/shop/cat-collars"], ["Toys & charms", "/shop/toys"], ["Litter boxes", "/shop/litter-boxes"]] },
  { title: "Everyday essentials", links: [["Tote & travel bags", "/shop/bags"], ["New arrivals", "/new-arrivals"], ["Size guide", "/size-guide"], ["Coming soon", "/coming-soon"]] },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const menuCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { itemCount } = useCart();
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const accountLabel = useMemo(() => {
    if (loading) return "Account";
    if (user) {
      const firstName = user.user_metadata?.full_name?.split(" ")[0];
      return firstName || "Profile";
    }
    return "Sign in";
  }, [user, loading]);
  const accountHref = useMemo(() => {
    return user || pathname === "/account" ? "/account" : `/account?redirect=${encodeURIComponent(pathname)}`;
  }, [user, pathname]);

  useEffect(() => {
    const updateScrollState = () => setHasScrolled(window.scrollY > 12);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    return () => {
      if (menuCloseTimeout.current) clearTimeout(menuCloseTimeout.current);
    };
  }, []);

  const openMenu = () => {
    if (menuCloseTimeout.current) clearTimeout(menuCloseTimeout.current);
    setMenuOpen(true);
  };

  const closeMenuAfterDelay = () => {
    if (menuCloseTimeout.current) clearTimeout(menuCloseTimeout.current);
    menuCloseTimeout.current = setTimeout(() => setMenuOpen(false), 350);
  };

  return (
    <>
      <div className="bg-cocoa px-4 py-2 text-center text-xs text-white">Free shipping on orders above ₹999 · COD available · Pawsome products. Happy pets.</div>
      <header
        className={`sticky top-0 z-50 border-b transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          hasScrolled
            ? "border-black/5 bg-white/70 shadow-sm backdrop-blur-md"
            : "border-transparent bg-white"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-5">
          <Link href="/" aria-label="Tobby & Yuki home" className="block shrink-0">
            <img
              src="/logo.png"
              alt="Tobby & Yuki — Pawsome by Design"
              className="h-auto w-28 object-contain sm:w-36"
            />
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative" onMouseEnter={openMenu} onMouseLeave={closeMenuAfterDelay}>
              <button onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-haspopup="menu" className="flex items-center gap-1 rounded-full bg-ivory px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-cocoa transition hover:bg-[#f5e9df]">
                <Menu size={13} /> Shop <ChevronDown size={12} className={`transition ${menuOpen ? "rotate-180" : ""}`} />
              </button>
              {menuOpen && <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-[min(760px,calc(100vw-1.25rem))] rounded-3xl border border-black/5 bg-white p-5 shadow-soft md:p-6">
                <div className="grid gap-5 sm:grid-cols-3">{menuGroups.map((group) => <div key={group.title}><h2 className="text-xs font-bold uppercase tracking-[.18em] text-mocha">{group.title}</h2><div className="mt-3 flex flex-col gap-1">{group.links.map(([label, href]) => <Link key={label} href={href} onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2 text-sm text-ink transition hover:bg-ivory hover:text-cocoa">{label}</Link>)}</div></div>)}</div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2"><Link href="/shop/raincoats" onClick={() => setMenuOpen(false)} className="rounded-2xl bg-[#f5e9df] px-4 py-3 text-sm font-bold text-cocoa transition hover:bg-[#ead8ca]">Rainy-day ready <span className="block pt-1 text-xs font-normal text-cocoa/70">Explore raincoats →</span></Link><Link href="/shop/bags" onClick={() => setMenuOpen(false)} className="rounded-2xl bg-lilac px-4 py-3 text-sm font-bold text-[#4d3861] transition hover:bg-[#e4d6eb]">Outing essentials <span className="block pt-1 text-xs font-normal text-[#4d3861]/70">Shop bags →</span></Link></div>
              </div>}
            </div>

            <button aria-label="Search" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-ivory"><Search size={18} /></button>
            <Link href={accountHref} aria-label={accountLabel} title={accountLabel} className="flex items-center gap-2 text-sm font-semibold text-cocoa"><UserRound size={18} /><span className="hidden min-[420px]:inline">{accountLabel}</span></Link>
            <button aria-label="Wishlist" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-ivory"><Heart size={18} /></button>
            <Link href="/cart" aria-label={`Cart with ${itemCount} items`} className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-ivory"><ShoppingBag size={18} />{itemCount > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose px-1 text-[9px] font-bold text-white">{itemCount}</span>}</Link>
          </div>
        </div>
      </header>
    </>
  );
}

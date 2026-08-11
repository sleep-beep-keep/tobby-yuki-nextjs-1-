import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 bg-cocoa px-6 py-14 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-5">

        <div className="md:col-span-2">
          <Link href="/" aria-label="Tobby & Yuki home" className="inline-block">
            <img
              src="/logo.png"
              alt="Tobby & Yuki — Pawsome by Design"
              className="h-auto w-56 object-contain"
            />
          </Link>

          <p className="mt-3 max-w-md text-sm leading-6 text-white/70">
            Premium pet lifestyle essentials designed for the pets who make
            life beautiful.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">
            Shop
          </h3>

          <div className="mt-4 flex flex-col space-y-2 text-sm text-white/70">
            <Link href="/dogs" className="hover:text-white transition-colors">Dogs</Link>
            <Link href="/cats" className="hover:text-white transition-colors">Cats</Link>
            <Link href="/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link>
            <Link href="/coming-soon" className="hover:text-white transition-colors">Coming Soon</Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">
            Help
          </h3>

          <div className="mt-4 flex flex-col space-y-2 text-sm text-white/70">
            <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
            <Link href="/shipping" className="hover:text-white transition-colors">Shipping Information</Link>
            <Link href="/refund-cancellation-policy" className="hover:text-white transition-colors">Refund & Cancellation</Link>
            <Link href="/size-guide" className="hover:text-white transition-colors">Size Guide</Link>
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp Support</a>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Legal</h3>
          <div className="mt-4 flex flex-col space-y-2 text-sm text-white/70">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/refund-cancellation-policy" className="hover:text-white transition-colors">Refund &amp; Cancellation Policy</Link>
          </div>
        </div>

      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-xs text-white/50">
        © 2026 Tobby & Yuki. Pawsome by Design.
      </div>
    </footer>
  );
}

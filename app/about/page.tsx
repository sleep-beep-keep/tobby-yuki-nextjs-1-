export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-[#2E2622] px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="text-[10px] font-semibold tracking-[.35em] text-[#8C6D53]">
            PAWSOME BY DESIGN
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
            Tobby & Yuki
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed font-light">
            Premium pet lifestyle essentials designed for the pets who make life beautiful.
          </p>
        </div>

        {/* Brand Story Details */}
        <div className="grid md:grid-cols-2 gap-10 pt-10 border-t border-neutral-100">
          <div className="space-y-3">
            <h2 className="text-2xl font-display font-semibold">The Philosophy</h2>
            <p className="text-neutral-600 leading-relaxed text-sm md:text-base">
              We believe that pets are more than just companions—they are integral members of our families who deserve thoughtfully crafted products that blend seamlessly into modern living. Every item we design reflects a deep appreciation for refined aesthetics and functional comfort.
            </p>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-display font-semibold">Crafted for Quality</h2>
            <p className="text-neutral-600 leading-relaxed text-sm md:text-base">
              From durable everyday accessories for dogs to elegant lifestyle pieces for cats, our collections undergo meticulous design iterations. We ensure uncompromised quality, premium textures, and safe materials for your closest companions.
            </p>
          </div>
        </div>

        {/* Commitment Banner */}
        <div className="bg-[#FAF8F5] rounded-3xl p-8 md:p-12 text-center space-y-4 border border-black/5">
          <span className="text-3xl">🐾</span>
          <h3 className="text-2xl font-display font-semibold">Designed with Purpose</h3>
          <p className="text-neutral-600 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Free shipping on orders above ₹999, cash on delivery options, and a dedication to making life better for pets and their humans.
          </p>
        </div>

      </div>
    </main>
  );
}
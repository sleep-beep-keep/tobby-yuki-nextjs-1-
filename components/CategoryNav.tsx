import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const categoryIcons: Record<string, string> = {
  harnesses: "🐕",
  leashes: "🔗",
  collars: "⭕",
  raincoats: "🌧️",
  bows: "🎀",
  "id-tags": "🏷️",
  "bell-charms": "🔔",
  bags: "👜",
  "cat-collars": "🐈",
  toys: "🧸",
  "litter-boxes": "🏠",
  food: "🍽️",
  sunglasses: "🕶️",
  accessories: "✨",
};

export default async function CategoryNav() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("category").order("category");
  if (error) throw new Error(`Unable to load categories: ${error.message}`);

  const categories = [...new Set((data ?? []).map(({ category }) => category))];

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[.3em] text-mocha">✦ Shop by category ✦</p>
        <h2 className="mt-2 font-display text-3xl text-cocoa">Find their perfect little something</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3">
        {categories.map((category) => (
          <Link href={`/shop/${category}`} key={category} className="min-w-[88px] text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-black/5 bg-ivory text-2xl transition hover:-translate-y-1 hover:shadow-soft">
              {categoryIcons[category] ?? "🐾"}
            </div>
            <p className="mt-2 text-xs font-medium">{category.replaceAll("-", " ")}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

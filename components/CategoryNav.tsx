import Link from "next/link";

const cats = [
  ["🐕", "Harnesses", "harnesses"], ["🔗", "Leashes", "leashes"], ["⭕", "Collars", "collars"],
  ["🌧️", "Raincoats", "raincoats"], ["🎀", "Bows", "bows"], ["🏷️", "ID Tags", "id-tags"],
  ["🔔", "Bell Charms", "bell-charms"], ["👜", "Bags", "bags"], ["🐈", "Cat Collars", "cat-collars"],
  ["🧸", "Toys", "toys"], ["🏠", "Litter Boxes", "litter-boxes"], ["🍽️", "Food", "food"],
  ["🕶️", "Sunglasses", "sunglasses"], ["✨", "Accessories", "accessories"]
];

export default function CategoryNav() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[.3em] text-mocha">✦ Shop by category ✦</p>
        <h2 className="mt-2 font-display text-3xl text-cocoa">Find their perfect little something</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3">
        {cats.map(([icon, label, slug]) => (
          <Link href={`/shop/${slug}`} key={slug} className="min-w-[88px] text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-black/5 bg-ivory text-2xl transition hover:-translate-y-1 hover:shadow-soft">{icon}</div>
            <p className="mt-2 text-xs font-medium">{label}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

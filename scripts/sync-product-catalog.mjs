import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const productSource = path.join(root, "Tobby & Yuki Products");
const publicProducts = path.join(root, "public", "products");
const env = Object.fromEntries(
  (await fs.readFile(path.join(root, ".env.local"), "utf8"))
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.split("=", 2)),
);
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing from .env.local. Add it before running this catalog sync.");
}

const catalog = [
  ["dog-leash-ty-green", "Tobby & Yuki Leash - Green", "dog", "leashes", "DOG/DOG LEASH/DOG LEASH TY GREEN"],
  ["dog-leash-ty-beige", "Tobby & Yuki Leash - Beige", "dog", "leashes", "DOG/DOG LEASH/DOG LEASH TY BEIGE"],
  ["dog-leash-tb-5-ft", "Tobby & Yuki Leash - 5 ft", "dog", "leashes", "DOG/DOG LEASH/DOG LEASH - TB 5 FT"],
  ["dog-harness-orange", "Orange Harness", "dog", "harnesses", "DOG/DOG HARNESS/DOG HARNESS - ORANGE"],
  ["dog-harness-neon-green", "Neon Green Harness", "dog", "harnesses", "DOG/DOG HARNESS/DOG HARNESS - NEON GREEN"],
  ["dog-harness-blue", "Blue Harness", "dog", "harnesses", "DOG/DOG HARNESS/DOG HARNESS - BLUE"],
  ["dog-harness-dragon-wings-yellow", "Dragon Wings Harness - Yellow", "dog", "harnesses", "DOG/DOG HARNESS/DOG HARNESS - DRAGON WINGS YELLOW"],
  ["dog-harness-batman-edition", "Batman Edition Harness", "dog", "harnesses", "DOG/DOG HARNESS/DOG HARNESS - BATMAN EDITION"],
  ["dog-harness-camouflage", "Camouflage Harness", "dog", "harnesses", "DOG/DOG HARNESS/DOG HARNESS - CAMOUFLAGE"],
  ["dog-harness-butterfly", "Butterfly Harness", "dog", "harnesses", "DOG/DOG HARNESS/DOG HARNESS - Butterfly"],
  ["dog-5-in-1-combo-camouflage", "5-in-1 Combo - Camouflage", "dog", "combos", "DOG/DOG 5 IN 1 COMBO/DOG 5 IN 1 COMBO - CAMOUFLAGE"],
  ["dog-5-in-1-combo-fairy", "5-in-1 Combo - Fairy", "dog", "combos", "DOG/DOG 5 IN 1 COMBO/DOG 5 IN 1 COMBO - FAIRY"],
  ["dog-5-in-1-combo-knight", "5-in-1 Combo - Knight", "dog", "combos", "DOG/DOG 5 IN 1 COMBO/DOG 5 IN 1 COMBO - KNIGHT"],
  ["cat-harness-butterfly", "Butterfly Harness", "cat", "harnesses", "CAT/CAT HARNESS - BUTTERFLY"],
  ["cat-harness-batman-edition", "Batman Edition Harness", "cat", "harnesses", "CAT/CAT HARNESS - BATMAN EDITION"],
  ["cat-collar-pack-of-5", "Collar Pack of 5", "cat", "cat-collars", "CAT/CAT COLLAR PACK OF 5"],
  ["cat-collar-charm", "Collar Charm", "cat", "cat-collar-charms", "CAT/CAT COLLAR CHARM"],
];

async function request(endpoint, options = {}) {
  const response = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${endpoint}`, {
    ...options,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  if (!response.ok) throw new Error(`${response.status}: ${await response.text()}`);
  return response.status === 204 ? null : response.json();
}

const products = [];
for (const [slug, title, petType, category, sourceFolder] of catalog) {
  const sourceDir = path.join(productSource, ...sourceFolder.split("/"));
  const files = (await fs.readdir(sourceDir))
    .filter((file) => /\.(jpe?g|png|webp|gif|jfif)$/i.test(file))
    .sort((a, b) => b.localeCompare(a));
  const destinationDir = path.join(publicProducts, slug);
  await fs.mkdir(destinationDir, { recursive: true });
  const images = await Promise.all(files.map(async (file, index) => {
    const extension = path.extname(file).toLowerCase();
    const destination = `${String(index + 1).padStart(2, "0")}${extension}`;
    await fs.copyFile(path.join(sourceDir, file), path.join(destinationDir, destination));
    return `/products/${slug}/${destination}`;
  }));
  products.push({
    slug,
    title,
    pet_type: petType,
    category,
    base_price: 1000,
    images,
    description: `A thoughtfully designed ${title.toLowerCase()} for everyday adventures.`,
    is_featured: slug === "dog-harness-batman-edition" || slug === "cat-harness-batman-edition",
    is_active: true,
  });
}

await request("products?on_conflict=slug", {
  method: "POST",
  headers: { Prefer: "resolution=merge-duplicates,return=representation" },
  body: JSON.stringify(products),
});

// Knight Harness is superseded by the Batman Edition listing. Keep unrelated
// existing products active so their original product images remain available.
await request("products?slug=eq.knight-harness", {
  method: "PATCH",
  body: JSON.stringify({ is_active: false }),
});

console.log(`Synced ${products.length} products and copied their image galleries to public/products.`);

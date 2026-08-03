export type Product = {
  slug: string;
  name: string;
  price: number;
  pet: "dogs" | "cats";
  category: string;
  image: string;
  description: string;
  featured: boolean;
};

type ProductRow = {
  slug: string;
  title: string;
  base_price: number;
  pet_type: "dog" | "cat";
  category: string;
  images: string | string[];
  description: string;
  is_featured: boolean;
};

/** Converts the storefront database shape to the shape used by UI components. */
export function toProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.title,
    price: row.base_price,
    pet: row.pet_type === "dog" ? "dogs" : "cats",
    category: row.category,
    image: Array.isArray(row.images) ? row.images[0] ?? "" : row.images,
    description: row.description,
    featured: row.is_featured,
  };
}

export const productSelect = "slug, title, base_price, pet_type, category, images, description, is_featured";

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

export type ProductVariant = {
  id: string;
  name: string;
  pricePaise: number | null;
  stockQuantity: number;
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

export const productSelect = "id, slug, title, base_price, pet_type, category, images, description, is_featured";

export function toProductVariant(row: { id: string; name: string; price_paise: number | null; stock_quantity: number }): ProductVariant {
  return {
    id: row.id,
    name: row.name,
    pricePaise: row.price_paise,
    stockQuantity: row.stock_quantity,
  };
}

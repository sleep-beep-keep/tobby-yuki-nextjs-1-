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
  name: string;
  price_paise: number;
  pet: "dogs" | "cats";
  category: string;
  image_url: string;
  description: string;
  featured: boolean;
};

/** Converts the storefront database shape to the shape used by UI components. */
export function toProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    price: row.price_paise / 100,
    pet: row.pet,
    category: row.category,
    image: row.image_url,
    description: row.description,
    featured: row.featured,
  };
}

export const productSelect = "slug, name, price_paise, pet, category, image_url, description, featured";

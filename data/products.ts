export type Product = {
  slug: string;
  name: string;
  price: number;
  pet: "dogs" | "cats";
  category: string;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  featured?: boolean;
  comingSoon?: boolean;
};

export const products: Product[] = [
  {
    slug: "knight-harness",
    name: "Knight Harness",
    price: 2499,
    pet: "dogs",
    category: "harnesses",
    image: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=900&q=80",
    rating: 5,
    reviews: 32,
    description: "A comfortable, adventure-ready harness with a premium structured fit.",
    featured: true
  },
  {
    slug: "olive-green-collar",
    name: "Olive Green Collar",
    price: 799,
    pet: "dogs",
    category: "collars",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80",
    rating: 5,
    reviews: 18,
    description: "A refined everyday collar with a timeless olive finish.",
    featured: true
  },
  {
    slug: "reflective-leash",
    name: "Reflective Leash",
    price: 699,
    pet: "dogs",
    category: "leashes",
    image: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=900&q=80",
    rating: 5,
    reviews: 24,
    description: "A dependable reflective leash designed for day-to-night walks.",
    featured: true
  },
  {
    slug: "camouflage-collar",
    name: "Camouflage Collar",
    price: 799,
    pet: "dogs",
    category: "collars",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=80",
    rating: 5,
    reviews: 21,
    description: "A bold camouflage collar with a durable premium finish.",
    featured: true
  },
  {
    slug: "neon-raincoat",
    name: "Raincoat (Neon)",
    price: 1299,
    pet: "dogs",
    category: "raincoats",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80",
    rating: 5,
    reviews: 29,
    description: "Bright, lightweight rain protection for wet-weather adventures.",
    featured: true
  },
  {
    slug: "bowie-pink",
    name: "Bowie Bow",
    price: 299,
    pet: "dogs",
    category: "bows",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80",
    rating: 5,
    reviews: 15,
    description: "A soft statement bow for everyday pawsome styling.",
    featured: true
  },
  {
    slug: "weekend-tote-bag",
    name: "Weekend Pet Tote",
    price: 1499,
    pet: "dogs",
    category: "bags",
    image: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=900&q=80",
    rating: 5,
    reviews: 17,
    description: "A roomy, refined tote for treats, toys, and every little outing essential.",
    featured: true
  },
  {
    slug: "bow-collar-lavender",
    name: "Bow Collar (Lavender)",
    price: 699,
    pet: "cats",
    category: "cat-collars",
    image: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=900&q=80",
    rating: 5,
    reviews: 26,
    description: "A delicate lavender bow collar designed for feline elegance.",
    featured: true
  },
  {
    slug: "bell-charm-classic",
    name: "Bell Charm (Classic)",
    price: 299,
    pet: "cats",
    category: "bell-charms",
    image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=80",
    rating: 5,
    reviews: 34,
    description: "A charming bell accessory with a polished golden finish.",
    featured: true
  },
  {
    slug: "interactive-feather-toy",
    name: "Interactive Feather Toy",
    price: 499,
    pet: "cats",
    category: "toys",
    image: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=900&q=80",
    rating: 5,
    reviews: 27,
    description: "A playful interactive toy for curious cats.",
    featured: true
  },
  {
    slug: "cat-carrier-lavender",
    name: "Cat Carrier (Lavender)",
    price: 2999,
    pet: "cats",
    category: "bags",
    image: "https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=900&q=80",
    rating: 5,
    reviews: 19,
    description: "A stylish carrier designed for comfortable travel.",
    featured: true
  },
  {
    slug: "covered-litter-box",
    name: "Litter Box (Covered)",
    price: 1599,
    pet: "cats",
    category: "litter-boxes",
    image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=900&q=80",
    rating: 5,
    reviews: 22,
    description: "A discreet covered litter box designed for modern homes.",
    featured: true
  },
  {
    slug: "cat-sunglasses",
    name: "Cat Sunglasses",
    price: 399,
    pet: "cats",
    category: "sunglasses",
    image: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=900&q=80",
    rating: 5,
    reviews: 13,
    description: "A playful accessory for fashion-forward feline moments.",
    featured: true
  }
];

export const dogCategories = ["harnesses", "leashes", "collars", "raincoats", "sunglasses", "bows", "id-tags", "bell-charms", "bags"];
export const catCategories = ["harnesses", "cat-collars", "bell-charms", "toys", "litter-boxes", "food", "bags", "sunglasses", "accessories"];

# Tobby & Yuki — Next.js + Tailwind Ecommerce Starter

A premium, responsive pet lifestyle ecommerce frontend inspired by the Tobby & Yuki design direction.

## Included

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Responsive homepage
- Dogs collection
- Cats collection
- Category pages
- Product detail pages
- Cart placeholder
- Product cards and product data
- Coming Soon page state
- Luxury ivory / mocha / lavender design system
- Easy replacement of placeholder images

## Requirements

- Node.js 18.18+ (Node 20+ recommended)
- npm

## Run locally

```bash
npm install
npm run dev
```

Open:

http://localhost:3000

## Production build

```bash
npm run build
npm start
```

## Project structure

- `app/` — routes and pages
- `components/` — reusable UI components
- `data/products.ts` — sample product catalog
- `public/` — local assets

## Add your real products

Edit:

`data/products.ts`

Replace the sample Unsplash URLs with your own product photography.

For production, I recommend moving product/catalog data to Supabase or another commerce backend.

## Recommended next production integrations

1. Supabase Auth + PostgreSQL
2. Razorpay payments
3. Shiprocket shipping
4. WhatsApp Business support
5. Cloudinary/Supabase Storage for product images
6. Resend for transactional email
7. Admin dashboard for products, orders and inventory
8. Customer accounts and wishlist persistence
9. Coupon and discount system
10. GST invoice generation
11. Email Channel: Resend

## Important

This is a functional frontend starter. Cart actions, authentication, payment processing, inventory, order persistence and admin management are intentionally prepared for backend integration rather than connected to live services.

## Branding

The website uses:
- Ivory: #F8F5EF
- Cocoa: #4A3026
- Mocha: #8A6654
- Rose: #C98B8B
- Lavender: #80649B
- Lilac: #E8DDF0

Replace these values in `tailwind.config.ts` to adjust the brand system.

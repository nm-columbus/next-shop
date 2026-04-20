# ShopNext Boilerplate — Design Spec

**Date:** 2026-04-20
**Status:** Approved

## Overview

Set up the ShopNext starter boilerplate from a fresh Next.js 16 app. The result is a fully functional minimal e-commerce storefront: products load from SQLite, the cart works, and the admin panel can add and delete products. Backlog tasks (SHOP-01 through SHOP-17) are explicitly out of scope.

## Decisions

| Question | Decision |
|---|---|
| shadcn/ui + Tailwind | Tailwind v3 (pinned) for full shadcn/ui compatibility |
| Core completeness | Fully functional — no TODOs in core features |
| Tests | Out of scope (covered by SHOP-17) |
| Implementation order | Layer-by-layer: deps → lib → API → components → pages |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| UI Components | shadcn/ui |
| State Management | Zustand |
| Database | SQLite via Prisma ORM |

---

## Section 1: Dependencies & Setup

**Packages:**
- `prisma` (dev) + `@prisma/client` — ORM + SQLite
- `zustand` — cart state
- `lucide-react` — icons
- Tailwind CSS v3 + `autoprefixer` — shadcn/ui compatibility (shadcn does not yet fully support Tailwind v4)
- `shadcn@latest` CLI — UI component installer

**shadcn/ui components installed:**
`button`, `badge`, `card`, `input`, `label`, `select`, `textarea`, `table`, `dialog`

**Environment:**
```
DATABASE_URL="file:./shopnext.db"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

**`.gitignore` additions:** `shopnext.db`, `.env`

---

## Section 2: Lib Layer

### `lib/types.ts`
Exact types from CLAUDE.md: `Category`, `Product`, `ProductFormData`, `CartItem`, `CartStore`.

### `lib/prisma.ts`
Singleton PrismaClient — imported everywhere as `@/lib/prisma`, never instantiated directly.

### `lib/utils.ts`
- `formatPrice(price: number)` → `"199,99 zł"` (Polish locale)
- `slugify(name: string)` → `"white-linen-shirt"`
- `cn(...inputs)` → Tailwind class merger via `clsx` + `tailwind-merge`

### `lib/cart-store.ts`
Zustand store, fully implemented:
- `addItem` — increments quantity if product exists, otherwise appends
- `removeItem` — filters by `productId`
- `updateQuantity` — sets quantity; removes item if quantity ≤ 0
- `clearCart` — resets to `[]`
- `totalItems` — sum of all quantities (computed)
- `totalPrice` — sum of `quantity × price` (computed)

No `persist` middleware (that's SHOP-12 territory).

---

## Section 3: API Layer

### `app/api/products/route.ts`
- `GET` — `findMany` with composable filters: `?category=`, `?sort=price_asc|price_desc|newest`, `?inStock=true`
- `POST` — creates product from `ProductFormData` body, returns 201

### `app/api/products/[id]/route.ts`
- `GET` — returns product by numeric ID, 404 if not found
- `DELETE` — deletes product, 404 if not found, 200 with deleted record on success

**Error handling:** 400 for invalid POST body, 404 for missing product, 500 for unexpected errors.

**Out of scope:** `PUT /api/products/[id]` — that's SHOP-14.

---

## Section 4: Components

### `components/Header.tsx`
Server component. Brand name left, nav links (`/`, `/admin`) centre, `<CartIcon />` right. No mobile menu (SHOP-04).

### `components/CartIcon.tsx`
Client component. Cart icon linked to `/cart`. Badge showing `totalItems` from `useCartStore`, hidden when 0.

### `components/ProductCard.tsx`
Server component. Shows: image, name, category badge, price. Struck-through `originalPrice` when set. Links to `/products/[slug]`.
- No hover effects (SHOP-03)
- No status badges (SHOP-08)
- No star rating (SHOP-09)
- No add-to-cart button (SHOP-07)

### `components/ProductGrid.tsx`
Server component. Receives `products: Product[]`, renders responsive CSS grid of `<ProductCard />`.
- No empty state (SHOP-05)
- No skeleton loader (SHOP-05)

### `components/ui/`
shadcn components only — installed via CLI, not hand-written.

---

## Section 5: Pages

### `app/layout.tsx`
Root layout. Renders `<Header />` above `{children}`.

### `app/(shop)/page.tsx`
PLP — server component. Reads `searchParams` (`category`, `sort`, `inStock`). Queries Prisma directly. Renders `<ProductGrid />`. No filter UI (SHOP-10/11), no hero (SHOP-02).

### `app/(shop)/products/[slug]/page.tsx`
PDP — server component. Fetches by slug. Shows image, name, description, price, category, stock status. Returns `notFound()` for unknown slugs. Add-to-cart is a separate `<AddToCartButton />` client component (`'use client'`) that receives the `product` as a prop and calls `useCartStore().addItem()`.

### `app/(shop)/cart/page.tsx`
Cart — client component. Reads `useCartStore`. Shows item list, order total, remove-per-item, clear-cart button. No quantity controls (SHOP-13).

### `app/admin/page.tsx`
Admin list — server component. Plain table of all products. Delete button is a `<DeleteProductButton />` client component that calls `DELETE /api/products/[id]` then `router.refresh()` to update the table without a full page reload. No confirm dialog (SHOP-15), no edit button (SHOP-14).

### `app/admin/products/new/page.tsx`
Add product — client component. All fields per CLAUDE.md. Slug auto-populates from name via `slugify()`. Submits to `POST /api/products`, redirects to `/admin` on success.

### `prisma/seed.ts`
20 products across 4 categories (clothing, footwear, accessories, electronics). Realistic Polish-market names, PLN prices, Unsplash image URLs.

---

## Explicitly Out of Scope

All backlog items are intentionally absent from this boilerplate:

| Task | Feature |
|---|---|
| SHOP-01 | Dark mode toggle |
| SHOP-02 | Hero banner |
| SHOP-03 | Product card hover effects |
| SHOP-04 | Mobile navigation drawer |
| SHOP-05 | Empty states & skeletons |
| SHOP-06 | Product image gallery |
| SHOP-07 | Add-to-cart on listing |
| SHOP-08 | Product badges (SALE, NEW, OUT OF STOCK) |
| SHOP-09 | Star rating display |
| SHOP-10 | Category filtering |
| SHOP-11 | Sort dropdown |
| SHOP-12 | Wishlist feature |
| SHOP-13 | Cart quantity controls |
| SHOP-14 | Admin: edit product |
| SHOP-15 | Admin: delete confirmation dialog |
| SHOP-16 | Search |
| SHOP-17 | Unit tests (Vitest setup) |

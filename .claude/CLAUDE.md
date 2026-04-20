# CLAUDE.md — ShopNext Workshop Project

## Project Overview

**ShopNext** is a minimal Next.js 16 e-commerce storefront. It is fully functional in its current state — products load from a SQLite database, the cart works, and the admin panel lets you add and delete products. It is intentionally barebone: no animations, no dark mode, minimal styling, missing several common e-commerce UI patterns.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| State Management | Zustand |
| Database | SQLite via Prisma ORM |

---

## Project Structure

```
app/
├── (shop)/
│   ├── page.tsx                        # Product listing (PLP)
│   ├── products/[slug]/page.tsx        # Product detail (PDP)
│   └── cart/page.tsx                   # Cart page
├── admin/
│   ├── page.tsx                        # Admin — product list
│   └── products/new/page.tsx           # Admin — add product form
├── api/
│   └── products/
│       ├── route.ts                    # GET all, POST new
│       └── [id]/route.ts               # GET one, DELETE
components/
├── ProductCard.tsx
├── ProductGrid.tsx
├── CartIcon.tsx
├── Header.tsx
└── ui/                                 # shadcn components
lib/
├── types.ts
├── prisma.ts
├── cart-store.ts
└── utils.ts                            # formatPrice, slugify, cn
prisma/
├── schema.prisma
└── seed.ts                             # 20 mock products
```

---

## Database Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./shopnext.db"
}

model Product {
  id            Int      @id @default(autoincrement())
  slug          String   @unique
  name          String
  description   String
  price         Float
  originalPrice Float?
  imageUrl      String
  category      String   // "clothing" | "footwear" | "accessories" | "electronics"
  inStock       Boolean  @default(true)
  stockCount    Int      @default(0)
  rating        Float    @default(0)
  reviewCount   Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

---

## Core Types

```typescript
// lib/types.ts

export type Category = 'clothing' | 'footwear' | 'accessories' | 'electronics'

export interface Product {
  id: number
  slug: string
  name: string
  description: string
  price: number
  originalPrice?: number | null
  imageUrl: string
  category: Category
  inStock: boolean
  stockCount: number
  rating: number
  reviewCount: number
  createdAt: string
  updatedAt: string
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>

export interface CartItem {
  product: Product
  quantity: number
}

export interface CartStore {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}
```

---

## Prisma Client

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ['query'] })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

Always import from `@/lib/prisma`. Never instantiate `PrismaClient` directly.

---

## API Reference

### Products

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List all products. Params: `?category=`, `?sort=price_asc\|price_desc\|newest`, `?inStock=true` |
| POST | `/api/products` | Create product. Body: `ProductFormData` |
| GET | `/api/products/[id]` | Single product |
| DELETE | `/api/products/[id]` | Delete product |

---

## Naming & Code Conventions

- **Components**: PascalCase, one per file
- **Hooks**: camelCase, prefix `use`
- **CSS**: Tailwind only — no custom CSS files
- **Imports**: always `@/` alias
- **Prices**: `Float` in DB, always display via `formatPrice()` from utils
- **Server vs Client**: default Server Components; `'use client'` only for hooks/browser APIs
- **DB access**: Server Components, Route Handlers, Server Actions only — never Client Components

---

## Key Patterns

### Fetch in Server Component
```typescript
import { prisma } from '@/lib/prisma'

const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
```

### URL filtering (Server Component)
```typescript
export default async function Page({ searchParams }: { searchParams: { category?: string } }) {
  const products = await prisma.product.findMany({
    where: searchParams.category ? { category: searchParams.category } : undefined,
  })
}
```

### Cart store (Client Component)
```typescript
'use client'
import { useCartStore } from '@/lib/cart-store'

const { addItem, items, totalPrice } = useCartStore()
```

### Utilities
```typescript
import { formatPrice, slugify } from '@/lib/utils'

formatPrice(199.99)          // → "199,99 zł"
slugify('White Linen Shirt') // → "white-linen-shirt"
```

---

## Environment Variables

```bash
# .env
DATABASE_URL="file:./shopnext.db"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

---

## Running the Project

```bash
npm install
npx prisma migrate dev --name init   # first run only
npx prisma db seed                   # seed 20 mock products
npm run dev                          # → http://localhost:3000
npx prisma studio                    # → DB GUI at http://localhost:5555
npm run build                        # verify production build
```

Backlog
Tasks are independent — each can be picked up and completed without depending on another task being done first. Estimated effort is relative to a developer using AI assistance (Copilot or Claude Code).

UI & Styling
SHOP-01 — Dark mode toggle
Add a dark/light mode toggle to the header. Use next-themes for theme management. Ensure all existing components (ProductCard, Header, cart page, admin panel) look correct in both modes. The toggle should persist across page reloads.
Effort: M
SHOP-02 — Hero banner on homepage
Add a full-width hero section at the top of the product listing page (app/(shop)/page.tsx). Should include a headline, subheadline, CTA button linking to the product grid, and a background image. Make it responsive.
Effort: S
SHOP-03 — Product card hover effects & polish
Currently ProductCard has no hover state. Add subtle hover elevation (shadow), image zoom on hover, and a smooth "Add to cart" button that appears on hover. Keep it accessible (visible on keyboard focus too).
Effort: S
SHOP-04 — Responsive mobile navigation
The header navigation breaks on small screens. Add a hamburger menu that opens a slide-in drawer (use shadcn Sheet component) with navigation links and the cart icon. Should close on route change.
Effort: M
SHOP-05 — Empty states & loading skeletons
Add a skeleton loader for ProductGrid while products are loading (use shadcn Skeleton). Add a proper empty state component (illustration + message + CTA) for when filters return no results and when the cart is empty.
Effort: S
SHOP-06 — Product image gallery on PDP
The product detail page shows a single image. Extend it to support multiple images — add a thumbnail strip below the main image that swaps the main image on click. Images array already exists on the Product type (add images String field to schema or derive from imageUrl).
Effort: M

Features
SHOP-07 — "Add to cart" button on product listing
Currently users can only add products to cart from the PDP. Add an "Add to cart" button directly on ProductCard in the listing. Should show a brief success state (icon change or toast notification) after clicking. Use sonner or shadcn toast for the notification.
Effort: S
SHOP-08 — Product badges (SALE, OUT OF STOCK, NEW)
Add visual badges to ProductCard:

SALE — shown when originalPrice is set, display percentage discount
OUT OF STOCK — shown when inStock is false, card should appear dimmed and "Add to cart" disabled
NEW — shown when createdAt is within the last 14 days
Effort: S

SHOP-09 — Star rating display
ProductCard and the PDP both have rating and reviewCount fields but nothing renders them. Add a star rating component (5 stars, support half-stars) and show review count. Create it as a reusable StarRating component in components/.
Effort: S
SHOP-10 — Product filtering by category
The ProductFilter component renders category buttons but they don't do anything. Wire them up to update the ?category= URL search param (use useRouter and useSearchParams). Active category should be visually highlighted. "All" resets the filter.
Effort: S
SHOP-11 — Product sorting
Add a sort dropdown to the product listing (price low→high, price high→low, newest first). Update the ?sort= URL param on change and handle sorting in the API route or in the Server Component query.
Effort: S
SHOP-12 — Wishlist feature (full)
This is a larger task — split it into sub-tasks or take it as a single larger task:
a) Database & API
Add a Wishlist table to the Prisma schema. Since there's no auth, use a sessionId stored in a cookie to identify the user. Create endpoints:

GET /api/wishlist — returns wishlist items for current session
POST /api/wishlist — adds a product
DELETE /api/wishlist/[productId] — removes a product

prismamodel WishlistItem {
  id        Int      @id @default(autoincrement())
  sessionId String
  productId Int
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([sessionId, productId])
}
b) WishlistButton component
Create components/WishlistButton.tsx — a heart icon button that calls the API to toggle wishlist state. Show filled heart if wishlisted, outline if not. Use optimistic UI so the toggle feels instant.
c) Wishlist page
Create app/(shop)/wishlist/page.tsx — lists all wishlisted products using the same ProductCard layout. Add a link to it in the header.
Effort: L
SHOP-13 — Cart quantity controls
The cart page shows items but has no way to change quantity. Add increment/decrement buttons next to each item. Decrementing to 0 removes the item. Show running subtotal per line item.
Effort: S
SHOP-14 — Admin: edit product
Currently admin can add and delete products. Add an edit flow:

Add Edit button to each row in the admin product table
Create app/admin/products/[id]/edit/page.tsx with a pre-filled form
Add PUT /api/products/[id] endpoint
On save, redirect back to /admin
Effort: M

SHOP-15 — Admin: confirmation dialog on delete
The delete button in admin currently deletes immediately. Wrap it in a shadcn AlertDialog confirmation ("Are you sure you want to delete [product name]? This action cannot be undone.").
Effort: S
SHOP-16 — Search
Add a search input to the header. On submit, navigate to /?search=query. In the product listing, filter by name or description containing the search term (Prisma contains filter). Highlight matched text in results.
Effort: M
SHOP-17 — Unit tests for cart store
Write unit tests for all CartStore actions using Vitest. Set up Vitest in the project (vitest.config.ts, @testing-library/react). Cover: adding a new item, adding a duplicate item (should increment qty), removing an item, updating quantity to 0 (should remove), clearCart, totalItems and totalPrice computed values.
Effort: M

Notes for Workshop Facilitators

Tasks SHOP-01 through SHOP-11 and SHOP-13/15 are good single-session tasks (30–45 min with AI assistance)
SHOP-12 (Wishlist) is designed as a longer task or pair programming exercise
SHOP-17 (Tests) works well as a demo of AI-generated tests
Run npx prisma studio during workshop — showing live DB changes is very effective
When demoing Claude Code: start at repo root, run claude, ask it to read CLAUDE.md and explain the project before writing any code
# ShopNext Boilerplate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully functional ShopNext e-commerce boilerplate from a fresh Next.js 16 app — products load from SQLite, cart works, admin can add and delete products.

**Architecture:** Layer-by-layer: deps → Tailwind v3/shadcn config → Prisma → lib → shadcn components → API routes → UI components → pages. Each layer compiles before the next starts.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v3, shadcn/ui, Zustand, Prisma + SQLite, lucide-react, tsx (seed runner)

---

## File Map

| Action | Path |
|---|---|
| Modify | `package.json` |
| Modify | `postcss.config.mjs` |
| Modify | `app/globals.css` |
| Modify | `app/layout.tsx` |
| Modify | `next.config.ts` |
| Modify | `.gitignore` |
| Create | `.env` |
| Create | `tailwind.config.ts` |
| Create | `components.json` |
| Create | `prisma/schema.prisma` |
| Create | `prisma/seed.ts` |
| Create | `lib/types.ts` |
| Create | `lib/prisma.ts` |
| Create | `lib/utils.ts` |
| Create | `lib/cart-store.ts` |
| Create | `components/CartIcon.tsx` |
| Create | `components/Header.tsx` |
| Create | `components/ProductCard.tsx` |
| Create | `components/ProductGrid.tsx` |
| Create | `components/AddToCartButton.tsx` |
| Create | `components/DeleteProductButton.tsx` |
| Create | `app/(shop)/page.tsx` |
| Create | `app/(shop)/products/[slug]/page.tsx` |
| Create | `app/(shop)/cart/page.tsx` |
| Create | `app/admin/page.tsx` |
| Create | `app/admin/products/new/page.tsx` |
| Create | `app/api/products/route.ts` |
| Create | `app/api/products/[id]/route.ts` |
| Auto-created by shadcn | `components/ui/button.tsx` etc. |

---

## Task 1: Package Setup

**Files:** `package.json`, `.env`, `.gitignore`

- [ ] **Step 1: Replace `package.json`**

```json
{
  "name": "shopnext",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@prisma/client": "^6",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.474.0",
    "next": "16.2.4",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "tailwind-merge": "^2.6.0",
    "zustand": "^5.0.3"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "autoprefixer": "^10.4.21",
    "eslint": "^9",
    "eslint-config-next": "16.2.4",
    "postcss": "^8.4.49",
    "prisma": "^6",
    "tailwindcss": "^3.4.17",
    "tailwindcss-animate": "^1.0.7",
    "tsx": "^4.19.2",
    "typescript": "^5"
  }
}
```

- [ ] **Step 2: Create `.env`**

```
DATABASE_URL="file:./shopnext.db"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

- [ ] **Step 3: Add to `.gitignore`**

Append to existing `.gitignore`:
```
shopnext.db
.env
```

- [ ] **Step 4: Install dependencies**

```bash
npm install
```

Expected: no errors, `node_modules` populated.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .env .gitignore
git commit -m "feat: add project dependencies (prisma, zustand, shadcn, tailwind v3)"
```

---

## Task 2: Tailwind v3 + shadcn Config

**Files:** `postcss.config.mjs`, `tailwind.config.ts`, `app/globals.css`, `components.json`, `next.config.ts`

- [ ] **Step 1: Replace `postcss.config.mjs`**

```js
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

export default config
```

- [ ] **Step 2: Create `tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

- [ ] **Step 3: Replace `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

- [ ] **Step 4: Create `components.json`**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

- [ ] **Step 5: Update `next.config.ts`**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 6: Commit**

```bash
git add postcss.config.mjs tailwind.config.ts app/globals.css components.json next.config.ts
git commit -m "feat: configure tailwind v3 and shadcn/ui"
```

---

## Task 3: Prisma Setup

**Files:** `prisma/schema.prisma`, `prisma/seed.ts`

- [ ] **Step 1: Create `prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Product {
  id            Int      @id @default(autoincrement())
  slug          String   @unique
  name          String
  description   String
  price         Float
  originalPrice Float?
  imageUrl      String
  category      String
  inStock       Boolean  @default(true)
  stockCount    Int      @default(0)
  rating        Float    @default(0)
  reviewCount   Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

- [ ] **Step 2: Run migration**

```bash
npx prisma migrate dev --name init
```

Expected: `shopnext.db` created, migration applied, Prisma Client generated.

- [ ] **Step 3: Create `prisma/seed.ts`**

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  {
    name: 'White Linen Shirt',
    slug: 'white-linen-shirt',
    description: 'Classic shirt made from 100% premium linen. Perfect for warm days or a smart casual look.',
    price: 179.99,
    originalPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
    category: 'clothing',
    inStock: true,
    stockCount: 45,
    rating: 4.5,
    reviewCount: 128,
  },
  {
    name: 'Slim Fit Jeans',
    slug: 'slim-fit-jeans',
    description: 'Modern slim fit jeans in classic indigo wash. Stretch denim for all-day comfort.',
    price: 249.99,
    originalPrice: 329.99,
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
    category: 'clothing',
    inStock: true,
    stockCount: 62,
    rating: 4.3,
    reviewCount: 89,
  },
  {
    name: 'Oversized Wool Sweater',
    slug: 'oversized-wool-sweater',
    description: 'Cozy oversized sweater knitted from merino wool blend. Available in neutral tones.',
    price: 299.99,
    originalPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
    category: 'clothing',
    inStock: true,
    stockCount: 30,
    rating: 4.7,
    reviewCount: 214,
  },
  {
    name: 'Floral Summer Dress',
    slug: 'floral-summer-dress',
    description: 'Light midi dress with a floral print. Features an adjustable waist tie.',
    price: 199.99,
    originalPrice: 269.99,
    imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
    category: 'clothing',
    inStock: false,
    stockCount: 0,
    rating: 4.6,
    reviewCount: 177,
  },
  {
    name: 'Classic Leather Jacket',
    slug: 'classic-leather-jacket',
    description: 'Timeless biker-style jacket in genuine cow leather. A wardrobe staple that ages beautifully.',
    price: 899.99,
    originalPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    category: 'clothing',
    inStock: true,
    stockCount: 12,
    rating: 4.9,
    reviewCount: 56,
  },
  {
    name: 'White Canvas Sneakers',
    slug: 'white-canvas-sneakers',
    description: 'Minimalist white sneakers with a vulcanized sole. Goes with everything.',
    price: 219.99,
    originalPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    category: 'footwear',
    inStock: true,
    stockCount: 88,
    rating: 4.4,
    reviewCount: 342,
  },
  {
    name: 'Suede Loafers',
    slug: 'suede-loafers',
    description: 'Premium suede penny loafers in cognac. Smart-casual shoe for any occasion.',
    price: 369.99,
    originalPrice: 449.99,
    imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&q=80',
    category: 'footwear',
    inStock: true,
    stockCount: 24,
    rating: 4.6,
    reviewCount: 93,
  },
  {
    name: 'Hiking Boots',
    slug: 'hiking-boots',
    description: 'Waterproof hiking boots with Gore-Tex lining. Ankle support and Vibram sole.',
    price: 599.99,
    originalPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
    category: 'footwear',
    inStock: true,
    stockCount: 37,
    rating: 4.8,
    reviewCount: 201,
  },
  {
    name: 'Leather Sandals',
    slug: 'leather-sandals',
    description: 'Hand-crafted full-grain leather sandals with an adjustable buckle strap. Made in Portugal.',
    price: 269.99,
    originalPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&q=80',
    category: 'footwear',
    inStock: false,
    stockCount: 0,
    rating: 4.3,
    reviewCount: 67,
  },
  {
    name: 'Chelsea Boots',
    slug: 'chelsea-boots',
    description: 'Classic Chelsea boots in smooth black leather. Elastic side panels for easy on/off.',
    price: 449.99,
    originalPrice: 549.99,
    imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80',
    category: 'footwear',
    inStock: true,
    stockCount: 19,
    rating: 4.5,
    reviewCount: 148,
  },
  {
    name: 'Bifold Leather Wallet',
    slug: 'bifold-leather-wallet',
    description: 'Slim bifold wallet in full-grain vegetable-tanned leather. 6 card slots.',
    price: 129.99,
    originalPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594785?w=800&q=80',
    category: 'accessories',
    inStock: true,
    stockCount: 110,
    rating: 4.7,
    reviewCount: 289,
  },
  {
    name: 'Merino Wool Beanie',
    slug: 'merino-wool-beanie',
    description: 'Soft and warm beanie knitted from fine merino wool. One size fits all.',
    price: 89.99,
    originalPrice: 119.99,
    imageUrl: 'https://images.unsplash.com/photo-1510598969022-c4c6c5d05769?w=800&q=80',
    category: 'accessories',
    inStock: true,
    stockCount: 74,
    rating: 4.4,
    reviewCount: 156,
  },
  {
    name: 'Braided Leather Belt',
    slug: 'braided-leather-belt',
    description: 'Handwoven braided leather belt with a polished silver buckle.',
    price: 99.99,
    originalPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    category: 'accessories',
    inStock: true,
    stockCount: 55,
    rating: 4.2,
    reviewCount: 82,
  },
  {
    name: 'Silk Square Scarf',
    slug: 'silk-square-scarf',
    description: 'Luxurious 100% silk twill scarf with an abstract geometric print. 70×70 cm.',
    price: 159.99,
    originalPrice: 219.99,
    imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80',
    category: 'accessories',
    inStock: true,
    stockCount: 28,
    rating: 4.6,
    reviewCount: 63,
  },
  {
    name: 'Aviator Sunglasses',
    slug: 'aviator-sunglasses',
    description: 'Classic metal-frame aviator sunglasses with polarized UV400 lenses.',
    price: 199.99,
    originalPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
    category: 'accessories',
    inStock: true,
    stockCount: 41,
    rating: 4.5,
    reviewCount: 194,
  },
  {
    name: 'Wireless Headphones',
    slug: 'wireless-headphones',
    description: 'Over-ear wireless headphones with ANC. 30-hour battery, USB-C charging.',
    price: 699.99,
    originalPrice: 899.99,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    category: 'electronics',
    inStock: true,
    stockCount: 33,
    rating: 4.8,
    reviewCount: 427,
  },
  {
    name: 'MagSafe Wireless Charger',
    slug: 'magsafe-wireless-charger',
    description: 'Fast wireless charger with magnetic alignment. 15W for compatible devices.',
    price: 149.99,
    originalPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80',
    category: 'electronics',
    inStock: true,
    stockCount: 96,
    rating: 4.3,
    reviewCount: 312,
  },
  {
    name: 'Premium Phone Case',
    slug: 'premium-phone-case',
    description: 'Genuine leather phone case with card slot and shock-absorbing inner layer.',
    price: 119.99,
    originalPrice: 149.99,
    imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
    category: 'electronics',
    inStock: true,
    stockCount: 78,
    rating: 4.1,
    reviewCount: 145,
  },
  {
    name: 'Sport Smartwatch',
    slug: 'sport-smartwatch',
    description: 'GPS smartwatch with heart rate monitor and 7-day battery. IP68 waterproof.',
    price: 1199.99,
    originalPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    category: 'electronics',
    inStock: true,
    stockCount: 21,
    rating: 4.7,
    reviewCount: 288,
  },
  {
    name: 'Portable Bluetooth Speaker',
    slug: 'portable-bluetooth-speaker',
    description: 'Waterproof portable speaker with 360° sound and 20-hour playtime.',
    price: 349.99,
    originalPrice: 429.99,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
    category: 'electronics',
    inStock: false,
    stockCount: 0,
    rating: 4.6,
    reviewCount: 193,
  },
]

async function main() {
  console.log('Seeding database...')
  await prisma.product.deleteMany()
  for (const product of products) {
    await prisma.product.create({ data: product })
  }
  console.log(`Seeded ${products.length} products.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

- [ ] **Step 4: Commit**

```bash
git add prisma/ 
git commit -m "feat: add prisma schema and seed data (20 products)"
```

---

## Task 4: Lib Layer

**Files:** `lib/types.ts`, `lib/prisma.ts`, `lib/utils.ts`, `lib/cart-store.ts`

- [ ] **Step 1: Create `lib/types.ts`**

```typescript
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

- [ ] **Step 2: Create `lib/prisma.ts`**

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ['query'] })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

- [ ] **Step 3: Create `lib/utils.ts`**

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return price.toLocaleString('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  })
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
```

- [ ] **Step 4: Create `lib/cart-store.ts`**

```typescript
import { create } from 'zustand'
import type { CartItem, CartStore, Product } from '@/lib/types'

function computeTotals(items: CartItem[]) {
  return {
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ),
  }
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,

  addItem: (product: Product) => {
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id)
      const items = existing
        ? state.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [...state.items, { product, quantity: 1 }]
      return { items, ...computeTotals(items) }
    })
  },

  removeItem: (productId: number) => {
    set((state) => {
      const items = state.items.filter((i) => i.product.id !== productId)
      return { items, ...computeTotals(items) }
    })
  },

  updateQuantity: (productId: number, quantity: number) => {
    set((state) => {
      const items =
        quantity <= 0
          ? state.items.filter((i) => i.product.id !== productId)
          : state.items.map((i) =>
              i.product.id === productId ? { ...i, quantity } : i
            )
      return { items, ...computeTotals(items) }
    })
  },

  clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
}))
```

- [ ] **Step 5: Commit**

```bash
git add lib/
git commit -m "feat: add lib layer (types, prisma client, utils, cart store)"
```

---

## Task 5: Install shadcn/ui Components

- [ ] **Step 1: Add components via CLI**

```bash
npx shadcn@latest add button badge card input label select textarea --yes
```

Expected: `components/ui/` populated. If prompted about overwriting `lib/utils.ts`, answer **No** (we already have our version).

- [ ] **Step 2: Commit**

```bash
git add components/ui/
git commit -m "feat: install shadcn/ui components (button, badge, card, input, label, select, textarea)"
```

---

## Task 6: API Routes

**Files:** `app/api/products/route.ts`, `app/api/products/[id]/route.ts`

- [ ] **Step 1: Create `app/api/products/route.ts`**

```typescript
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const sort = searchParams.get('sort')
  const inStock = searchParams.get('inStock')

  const where: Prisma.ProductWhereInput = {}
  if (category) where.category = category
  if (inStock === 'true') where.inStock = true

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' }
  if (sort === 'price_asc') orderBy = { price: 'asc' }
  else if (sort === 'price_desc') orderBy = { price: 'desc' }

  try {
    const products = await prisma.product.findMany({ where, orderBy })
    return NextResponse.json(products)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const product = await prisma.product.create({ data: body })
    return NextResponse.json(product, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Create `app/api/products/[id]/route.ts`**

```typescript
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: RouteParams) {
  const { id } = await params
  const productId = parseInt(id)
  if (isNaN(productId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }
  try {
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const { id } = await params
  const productId = parseInt(id)
  if (isNaN(productId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }
  try {
    const existing = await prisma.product.findUnique({ where: { id: productId } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const product = await prisma.product.delete({ where: { id: productId } })
    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/
git commit -m "feat: add product API routes (GET all, POST, GET one, DELETE)"
```

---

## Task 7: Header, CartIcon, Root Layout

**Files:** `components/CartIcon.tsx`, `components/Header.tsx`, `app/layout.tsx`

- [ ] **Step 1: Create `components/CartIcon.tsx`**

```typescript
'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'

export default function CartIcon() {
  const totalItems = useCartStore((state) => state.totalItems)

  return (
    <Link href="/cart" className="relative inline-flex">
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground">
          {totalItems}
        </span>
      )}
    </Link>
  )
}
```

- [ ] **Step 2: Create `components/Header.tsx`**

```typescript
import Link from 'next/link'
import CartIcon from '@/components/CartIcon'

export default function Header() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          ShopNext
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Shop
          </Link>
          <Link
            href="/admin"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Admin
          </Link>
          <CartIcon />
        </nav>
      </div>
    </header>
  )
}
```

- [ ] **Step 3: Replace `app/layout.tsx`**

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ShopNext',
  description: 'A minimal Next.js e-commerce storefront',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background`}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/CartIcon.tsx components/Header.tsx app/layout.tsx
git commit -m "feat: add header with cart icon and root layout"
```

---

## Task 8: ProductCard and ProductGrid

**Files:** `components/ProductCard.tsx`, `components/ProductGrid.tsx`

- [ ] **Step 1: Create `components/ProductCard.tsx`**

```typescript
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/types'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        <div className="p-4">
          <Badge variant="secondary" className="mb-2 capitalize">
            {product.category}
          </Badge>
          <h3 className="font-medium leading-tight">{product.name}</h3>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-semibold">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Create `components/ProductGrid.tsx`**

```typescript
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/lib/types'

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/ProductCard.tsx components/ProductGrid.tsx
git commit -m "feat: add ProductCard and ProductGrid components"
```

---

## Task 9: Shop Pages (PLP, PDP, Cart)

**Files:** `components/AddToCartButton.tsx`, `app/(shop)/page.tsx`, `app/(shop)/products/[slug]/page.tsx`, `app/(shop)/cart/page.tsx`

- [ ] **Step 1: Create `components/AddToCartButton.tsx`**

```typescript
'use client'

import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/cart-store'
import type { Product } from '@/lib/types'

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)

  return (
    <Button
      onClick={() => addItem(product)}
      disabled={!product.inStock}
      size="lg"
      className="w-full"
    >
      {product.inStock ? 'Add to cart' : 'Out of stock'}
    </Button>
  )
}
```

- [ ] **Step 2: Create `app/(shop)/page.tsx`**

```typescript
import { prisma } from '@/lib/prisma'
import ProductGrid from '@/components/ProductGrid'
import type { Product } from '@/lib/types'

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; inStock?: string }>
}) {
  const { category, sort, inStock } = await searchParams

  const where: Record<string, unknown> = {}
  if (category) where.category = category
  if (inStock === 'true') where.inStock = true

  let orderBy: Record<string, string> = { createdAt: 'desc' }
  if (sort === 'price_asc') orderBy = { price: 'asc' }
  else if (sort === 'price_desc') orderBy = { price: 'desc' }

  const raw = await prisma.product.findMany({ where, orderBy })
  const products: Product[] = raw.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Products</h1>
      <ProductGrid products={products} />
    </div>
  )
}
```

- [ ] **Step 3: Create `app/(shop)/products/[slug]/page.tsx`**

```typescript
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import AddToCartButton from '@/components/AddToCartButton'
import type { Product } from '@/lib/types'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const raw = await prisma.product.findUnique({ where: { slug } })
  if (!raw) notFound()

  const product: Product = {
    ...raw,
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col gap-4">
          <Badge variant="secondary" className="w-fit capitalize">
            {product.category}
          </Badge>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground">{product.description}</p>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {product.inStock
              ? `In stock (${product.stockCount} available)`
              : 'Out of stock'}
          </p>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create `app/(shop)/cart/page.tsx`**

```typescript
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/cart-store'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function CartPage() {
  const { items, removeItem, clearCart, totalPrice } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="mb-4 text-3xl font-bold">Your cart is empty</h1>
        <p className="mb-6 text-muted-foreground">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Button asChild>
          <Link href="/">Continue shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center gap-4 border-b pb-4"
          >
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={item.product.imageUrl}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <Link
                href={`/products/${item.product.slug}`}
                className="font-medium hover:underline"
              >
                {item.product.name}
              </Link>
              <p className="text-sm text-muted-foreground">
                Qty: {item.quantity}
              </p>
              <p className="font-semibold">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeItem(item.product.id)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between border-t pt-4">
        <p className="text-xl font-bold">Total: {formatPrice(totalPrice)}</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={clearCart}>
            Clear cart
          </Button>
          <Button>Checkout</Button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add components/AddToCartButton.tsx app/\(shop\)/
git commit -m "feat: add shop pages (PLP, PDP, cart)"
```

---

## Task 10: Admin Pages

**Files:** `components/DeleteProductButton.tsx`, `app/admin/page.tsx`, `app/admin/products/new/page.tsx`

- [ ] **Step 1: Create `components/DeleteProductButton.tsx`**

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function DeleteProductButton({
  productId,
}: {
  productId: number
}) {
  const router = useRouter()

  async function handleDelete() {
    await fetch(`/api/products/${productId}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete}>
      Delete
    </Button>
  )
}
```

- [ ] **Step 2: Create `app/admin/page.tsx`**

```typescript
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import DeleteProductButton from '@/components/DeleteProductButton'

export default async function AdminPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin — Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">Add product</Link>
        </Button>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-left font-medium">Price</th>
              <th className="px-4 py-3 text-left font-medium">Stock</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{product.name}</td>
                <td className="px-4 py-3 capitalize">{product.category}</td>
                <td className="px-4 py-3">{formatPrice(product.price)}</td>
                <td className="px-4 py-3">
                  {product.inStock ? `Yes (${product.stockCount})` : 'No'}
                </td>
                <td className="px-4 py-3">
                  <DeleteProductButton productId={product.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `app/admin/products/new/page.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { slugify } from '@/lib/utils'
import type { Category, ProductFormData } from '@/lib/types'

const defaultValues: ProductFormData = {
  name: '',
  slug: '',
  description: '',
  price: 0,
  originalPrice: null,
  imageUrl: '',
  category: 'clothing',
  inStock: true,
  stockCount: 0,
  rating: 0,
  reviewCount: 0,
}

export default function NewProductPage() {
  const router = useRouter()
  const [form, setForm] = useState<ProductFormData>(defaultValues)
  const [loading, setLoading] = useState(false)

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    setForm((prev) => ({ ...prev, name, slug: slugify(name) }))
  }

  function handleField(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    router.push('/admin')
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Add product</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleNameChange}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            value={form.slug}
            onChange={handleField}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleField}
            rows={4}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="price">Price (PLN) *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={handleField}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="originalPrice">Original price (PLN)</Label>
            <Input
              id="originalPrice"
              name="originalPrice"
              type="number"
              step="0.01"
              min="0"
              value={form.originalPrice ?? ''}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  originalPrice: e.target.value
                    ? parseFloat(e.target.value)
                    : null,
                }))
              }
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="imageUrl">Image URL *</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={form.imageUrl}
            onChange={handleField}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={form.category}
            onValueChange={(value) =>
              setForm((prev) => ({ ...prev, category: value as Category }))
            }
          >
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="footwear">Footwear</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="inStock"
            checked={form.inStock}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, inStock: e.target.checked }))
            }
            className="h-4 w-4 rounded border"
          />
          <Label htmlFor="inStock">In stock</Label>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="stockCount">Stock count</Label>
          <Input
            id="stockCount"
            name="stockCount"
            type="number"
            min="0"
            value={form.stockCount}
            onChange={handleField}
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Adding…' : 'Add product'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/DeleteProductButton.tsx app/admin/
git commit -m "feat: add admin pages (product list, add product form)"
```

---

## Task 11: Seed Database and Verify

- [ ] **Step 1: Run seed**

```bash
npx prisma db seed
```

Expected output:
```
Seeding database...
Seeded 20 products.
```

- [ ] **Step 2: Delete the default `app/page.tsx`**

The default root `app/page.tsx` conflicts with `app/(shop)/page.tsx`. Delete it:

```bash
rm app/page.tsx
```

- [ ] **Step 3: Production build check**

```bash
npm run build
```

Expected: clean build with no TypeScript errors.

- [ ] **Step 4: Start dev server and smoke test**

```bash
npm run dev
```

Visit and verify:
- `http://localhost:3000` — product grid shows 20 products
- `http://localhost:3000/products/white-linen-shirt` — PDP loads, "Add to cart" works
- `http://localhost:3000/cart` — cart shows added items, remove works
- `http://localhost:3000/admin` — product table with delete button
- `http://localhost:3000/admin/products/new` — form submits, redirects to admin

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete ShopNext boilerplate — fully functional starter"
```

# GitHub Copilot Instructions — ShopNext

This is a Next.js 14 (App Router) e-commerce project written in TypeScript.
Read this file before generating any code.

---

## Stack

- **Framework**: Next.js 14 App Router — use `app/` directory structure, not `pages/`
- **Language**: TypeScript — always type function arguments and return values explicitly
- **Styling**: Tailwind CSS — utility classes only, no CSS modules, no styled-components, no inline `style={{}}`
- **UI components**: shadcn/ui — prefer shadcn primitives (Button, Dialog, Badge, Sheet, Skeleton...) over custom HTML
- **State**: Zustand — cart and wishlist state lives in `lib/cart-store.ts` and `lib/wishlist-store.ts`
- **Database**: SQLite via Prisma ORM — schema is in `prisma/schema.prisma`
- **ORM client**: always import from `@/lib/prisma`, never instantiate `PrismaClient` directly

---

## Project Structure

```
app/(shop)/          → public storefront (PLP, PDP, cart)
app/admin/           → admin panel, no auth required
app/api/products/    → REST API route handlers
components/          → shared React components
lib/                 → utilities, stores, prisma client, types
prisma/              → schema + seed
```

---

## Imports

- Always use the `@/` alias — never use relative paths like `../../`
- ✅ `import { prisma } from '@/lib/prisma'`
- ✅ `import { formatPrice } from '@/lib/utils'`
- ❌ `import { prisma } from '../../lib/prisma'`

---

## Server vs Client Components

- Default to **Server Components** — no directive needed
- Add `'use client'` only when the component uses hooks, browser APIs, or event handlers
- **Never access the database from a Client Component** — DB queries belong in Server Components, Route Handlers, or Server Actions only

```typescript
// ✅ Server Component — direct Prisma access
export default async function ProductsPage() {
  const products = await prisma.product.findMany()
  return <ProductGrid products={products} />
}

// ✅ Client Component — receives data as props
'use client'
export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCartStore()
  return <Button onClick={() => addItem(product)}>Add to cart</Button>
}
```

---

## Database & Prisma

- Import: `import { prisma } from '@/lib/prisma'`
- Use `async/await` — never `.then()` chains
- Always handle the case where a record is not found (return 404)
- `id` is `Int` (autoincrement) — never use string IDs for DB records

```typescript
// ✅ Correct pattern for a route handler
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: Number(params.id) },
  })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}
```

---

## Types

All shared types are in `lib/types.ts`. Use them — do not redefine locally.

Key types:
- `Product` — matches the Prisma `Product` model
- `ProductFormData` — `Omit<Product, 'id' | 'createdAt' | 'updatedAt'>` — used in forms and POST body
- `CartItem` — `{ product: Product; quantity: number }`
- `Category` — `'clothing' | 'footwear' | 'accessories' | 'electronics'`

---

## Utilities (`lib/utils.ts`)

```typescript
formatPrice(199.99)          // → "199,99 zł"   — always use for displaying prices
slugify('White Shirt')       // → "white-shirt"  — use when generating slugs from names
cn('base', condition && 'extra')  // → conditional classnames (clsx + tailwind-merge)
```

---

## API Route Handlers

- Live in `app/api/`
- Use `NextResponse.json()` for all responses
- Parse numeric IDs with `Number(params.id)`
- Return appropriate HTTP status codes: 200, 201, 400, 404, 500

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: Number(params.id) } })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await prisma.product.delete({ where: { id: Number(params.id) } })
  return NextResponse.json(product)
}
```

---

## Zustand Stores

- Cart store: `lib/cart-store.ts` — `useCartStore()`
- Wishlist store: `lib/wishlist-store.ts` — `useWishlistStore()`
- Only use in Client Components (`'use client'`)
- Wishlist store uses Zustand `persist` middleware with `localStorage`

---

## Styling Rules

- Tailwind only — no external CSS
- Use `cn()` from `@/lib/utils` for conditional classes
- Dark mode: use `dark:` variant (project uses `next-themes` with `class` strategy)
- Responsive: mobile-first — `sm:`, `md:`, `lg:` breakpoints
- Spacing: use Tailwind scale consistently (`gap-4`, `p-6`, `mt-2` etc.)
- Do not hardcode colors — use Tailwind semantic tokens (`bg-background`, `text-foreground`, `border-border`) so dark mode works automatically

```typescript
// ✅
<div className={cn('rounded-lg border p-4', isActive && 'border-primary bg-primary/10')}>

// ❌
<div style={{ backgroundColor: '#fff', padding: '16px' }}>
```

---

## Component Patterns

- One component per file
- Props interface defined above the component, named `[ComponentName]Props`
- Export as named export, not default (except page.tsx files which must be default)

```typescript
interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <div className={cn('rounded-lg border', className)}>
      ...
    </div>
  )
}
```

---

## URL & Navigation

- Use `useRouter` and `useSearchParams` from `next/navigation` in Client Components
- Use `Link` from `next/link` for all internal navigation — never `<a href>`
- Filters and sorting live in URL search params (`?category=clothing&sort=price_asc`)
- Read search params in Server Components via `searchParams` prop

---

## Do Not

- ❌ Use `fetch()` inside Client Components to query your own API — use Prisma in Server Components instead
- ❌ Use `any` type — be explicit or use `unknown`
- ❌ Use relative imports (`../../`)
- ❌ Instantiate `new PrismaClient()` outside of `lib/prisma.ts`
- ❌ Use `console.log` in production code — use `console.error` only for caught errors
- ❌ Hardcode PLN prices as strings — always store as `Float`, display via `formatPrice()`

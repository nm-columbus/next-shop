import { prisma } from '@/lib/prisma'
import ProductGrid from '@/components/ProductGrid'
import type { Category, Product } from '@/lib/types'

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
    category: p.category as Category,
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

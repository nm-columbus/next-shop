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

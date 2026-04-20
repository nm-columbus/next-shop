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

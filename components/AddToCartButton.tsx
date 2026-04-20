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

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

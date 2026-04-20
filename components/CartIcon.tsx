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

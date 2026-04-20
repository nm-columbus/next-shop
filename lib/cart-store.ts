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

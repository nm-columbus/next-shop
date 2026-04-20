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

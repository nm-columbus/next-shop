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

  function handleField(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
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

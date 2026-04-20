'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function DeleteProductButton({
  productId,
}: {
  productId: number
}) {
  const router = useRouter()

  async function handleDelete() {
    await fetch(`/api/products/${productId}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete}>
      Delete
    </Button>
  )
}

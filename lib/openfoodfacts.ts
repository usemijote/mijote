export type OFFProduct = {
  name: string
  brand: string | null
  imageUrl: string | null
  categoryTags: string[]
}

export async function lookupBarcode(barcode: string): Promise<OFFProduct | null> {
  const sanitized = barcode.replace(/\D/g, '')
  if (!sanitized) return null

  const url = `https://world.openfoodfacts.org/api/v2/product/${sanitized}.json?fields=product_name_fr,product_name,brands,image_front_url,image_url,categories_tags`

  let res: Response
  try {
    res = await fetch(url, {
      headers: {
        'User-Agent': 'Mijote/1.0 (https://usemijote.vercel.app)',
      },
      next: { revalidate: 60 * 60 * 24 },
    })
  } catch {
    return null
  }

  if (!res.ok) return null

  const data = await res.json()
  if (data.status === 0 || !data.product) return null

  const p = data.product
  return {
    name: (p.product_name_fr || p.product_name || '').trim(),
    brand: p.brands ? String(p.brands).split(',')[0].trim() : null,
    imageUrl: p.image_front_url || p.image_url || null,
    categoryTags: Array.isArray(p.categories_tags) ? p.categories_tags : [],
  }
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addIngredient(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const nom = String(formData.get('nom') ?? '').trim()
  const categorieId = Number(formData.get('categorie_id'))
  const dateAchatStr = String(formData.get('date_achat') ?? '')
  const datePeremptionOverrideStr = String(formData.get('date_peremption_override') ?? '').trim()
  const quantiteRaw = formData.get('quantite')
  const uniteRaw = formData.get('unite')

  if (!nom) throw new Error('Le nom est obligatoire')
  if (!categorieId) throw new Error('La catégorie est obligatoire')
  if (!dateAchatStr) throw new Error('La date d\'achat est obligatoire')

  let datePeremptionStr: string

  if (datePeremptionOverrideStr) {
    datePeremptionStr = datePeremptionOverrideStr
  } else {
    const { data: categorie, error: catError } = await supabase
      .from('categories_aliments')
      .select('duree_typique_jours')
      .eq('id', categorieId)
      .single()

    if (catError || !categorie) throw new Error('Catégorie introuvable')

    const dateAchat = new Date(dateAchatStr)
    const datePeremption = new Date(dateAchat)
    datePeremption.setDate(datePeremption.getDate() + categorie.duree_typique_jours)
    datePeremptionStr = datePeremption.toISOString().split('T')[0]
  }

  const { error } = await supabase.from('ingredients').insert({
    user_id: user.id,
    nom,
    categorie_id: categorieId,
    date_achat: dateAchatStr,
    date_peremption: datePeremptionStr,
    quantite: quantiteRaw ? Number(quantiteRaw) : null,
    unite: uniteRaw ? String(uniteRaw).trim() || null : null,
  })

  if (error) throw new Error(`Erreur Supabase : ${error.message}`)

  revalidatePath('/ingredients')
  redirect('/ingredients')
}

export async function deleteIngredient(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const id = String(formData.get('id') ?? '')
  if (!id) throw new Error('Identifiant manquant')

  const { error } = await supabase.from('ingredients').delete().eq('id', id)
  if (error) throw new Error(`Erreur Supabase : ${error.message}`)

  revalidatePath('/ingredients')
}

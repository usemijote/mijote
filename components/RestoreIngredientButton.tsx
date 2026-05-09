'use client'

import { toast } from 'sonner'
import { restoreIngredient } from '@/lib/actions/ingredients'

export function RestoreIngredientButton({
  id,
  nom,
}: {
  id: string
  nom: string
}) {
  return (
    <form
      action={async (formData) => {
        try {
          await restoreIngredient(formData)
          toast.success(`${nom} restauré dans le frigo`)
        } catch {
          toast.error(`Erreur — ${nom} non restauré`)
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-zinc-600 hover:text-blue-400 text-sm transition-colors"
        aria-label={`Restaurer ${nom}`}
      >
        ↻ Restaurer
      </button>
    </form>
  )
}

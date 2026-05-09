'use client'

import { toast } from 'sonner'
import { deleteIngredient } from '@/lib/actions/ingredients'

export function DeleteIngredientButton({ id, nom }: { id: string; nom: string }) {
  return (
    <form
      action={async (formData) => {
        try {
          await deleteIngredient(formData)
          toast.success(`${nom} supprimé`)
        } catch {
          toast.error(`Erreur — ${nom} non supprimé`)
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-zinc-600 hover:text-red-400 text-sm transition-colors"
        aria-label={`Supprimer ${nom}`}
      >
        Supprimer
      </button>
    </form>
  )
}

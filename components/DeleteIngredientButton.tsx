'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { deleteIngredient } from '@/lib/actions/ingredients'

export function DeleteIngredientButton({ id, nom }: { id: string; nom: string }) {
  const [showConfirm, setShowConfirm] = useState(false)

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="text-zinc-600 hover:text-red-400 text-sm transition-colors"
        aria-label={`Supprimer ${nom}`}
      >
        Supprimer
      </button>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setShowConfirm(false)}
        className="text-zinc-500 hover:text-zinc-200 text-sm transition-colors"
        type="button"
      >
        Annuler
      </button>
      <form
        action={async (formData) => {
          try {
            await deleteIngredient(formData)
            toast.success(`${nom} supprimé`)
          } catch {
            toast.error(`Erreur — ${nom} non supprimé`)
            setShowConfirm(false)
          }
        }}
      >
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
        >
          Confirmer
        </button>
      </form>
    </div>
  )
}

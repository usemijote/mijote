'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { archiveIngredient } from '@/lib/actions/ingredients'

export function ArchiveIngredientButton({ id, nom }: { id: string; nom: string }) {
  const [showConfirm, setShowConfirm] = useState(false)

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="text-zinc-600 hover:text-emerald-400 text-sm transition-colors"
        aria-label={`Marquer ${nom} comme utilisé`}
      >
        ✓ Utilisé
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
            await archiveIngredient(formData)
            toast.success(`${nom} marqué comme utilisé`)
          } catch {
            toast.error(`Erreur — ${nom} non archivé`)
            setShowConfirm(false)
          }
        }}
      >
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="reason" value="used" />
        <button
          type="submit"
          className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
        >
          Confirmer
        </button>
      </form>
    </div>
  )
}

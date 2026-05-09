'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { archiveIngredient } from '@/lib/actions/ingredients'

type Reason = 'used' | 'wasted'

type Config = {
  idleLabel: string
  confirmLabel: string
  successMessage: (nom: string) => string
  errorMessage: (nom: string) => string
  idleClass: string
  confirmClass: string
  ariaLabel: (nom: string) => string
}

const CONFIG: Record<Reason, Config> = {
  used: {
    idleLabel: '✓ Utilisé',
    confirmLabel: 'Confirmer',
    successMessage: (nom) => `${nom} marqué comme utilisé`,
    errorMessage: (nom) => `Erreur — ${nom} non archivé`,
    idleClass: 'text-zinc-600 hover:text-emerald-400',
    confirmClass: 'text-emerald-400 hover:text-emerald-300',
    ariaLabel: (nom) => `Marquer ${nom} comme utilisé`,
  },
  wasted: {
    idleLabel: '× Gaspillé',
    confirmLabel: 'Confirmer',
    successMessage: (nom) => `${nom} marqué comme gaspillé`,
    errorMessage: (nom) => `Erreur — ${nom} non archivé`,
    idleClass: 'text-zinc-600 hover:text-red-400',
    confirmClass: 'text-red-400 hover:text-red-300',
    ariaLabel: (nom) => `Marquer ${nom} comme gaspillé`,
  },
}

export function ArchiveIngredientButton({
  id,
  nom,
  reason,
}: {
  id: string
  nom: string
  reason: Reason
}) {
  const [showConfirm, setShowConfirm] = useState(false)
  const config = CONFIG[reason]

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className={`text-sm transition-colors ${config.idleClass}`}
        aria-label={config.ariaLabel(nom)}
      >
        {config.idleLabel}
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
            toast.success(config.successMessage(nom))
          } catch {
            toast.error(config.errorMessage(nom))
            setShowConfirm(false)
          }
        }}
      >
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="reason" value={reason} />
        <button
          type="submit"
          className={`text-sm font-medium transition-colors ${config.confirmClass}`}
        >
          {config.confirmLabel}
        </button>
      </form>
    </div>
  )
}

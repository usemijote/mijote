'use client'

import { toast } from 'sonner'
import { upsertPreferences } from '@/lib/actions/preferences'

export function PreferencesForm({
  current,
}: {
  current: {
    alert_hour: number
    alert_days_before: number
    auto_archive_days: number | null
  }
}) {
  return (
    <form
      action={async (formData) => {
        try {
          await upsertPreferences(formData)
          toast.success('Préférences enregistrées')
        } catch {
          toast.error('Erreur — préférences non enregistrées')
        }
      }}
      className="space-y-5"
    >
      <div>
        <label htmlFor="alert_hour" className="block text-sm font-medium text-zinc-300 mb-2">
          Heure du mail quotidien (Paris)
        </label>
        <select
          id="alert_hour"
          name="alert_hour"
          defaultValue={current.alert_hour}
          className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
        >
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={i}>
              {i.toString().padStart(2, '0')}h00
            </option>
          ))}
        </select>
        <p className="text-xs text-zinc-600 mt-1">
          Mijote tournera son cron à cette heure (gère automatiquement l'heure d'été/hiver).
        </p>
      </div>

      <div>
        <label htmlFor="alert_days_before" className="block text-sm font-medium text-zinc-300 mb-2">
          Jours d'avance pour l'alerte
        </label>
        <select
          id="alert_days_before"
          name="alert_days_before"
          defaultValue={current.alert_days_before}
          className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
        >
          <option value={1}>1 jour avant péremption</option>
          <option value={2}>2 jours avant (recommandé)</option>
          <option value={3}>3 jours avant</option>
          <option value={5}>5 jours avant</option>
          <option value={7}>7 jours avant</option>
        </select>
      </div>

      <div>
        <label htmlFor="auto_archive_days" className="block text-sm font-medium text-zinc-300 mb-2">
          Auto-archive en gaspi après…
        </label>
        <select
          id="auto_archive_days"
          name="auto_archive_days"
          defaultValue={current.auto_archive_days ?? ''}
          className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
        >
          <option value="">Jamais (manuel uniquement)</option>
          <option value={3}>3 jours après péremption</option>
          <option value={7}>7 jours après péremption (recommandé)</option>
          <option value={14}>14 jours après péremption</option>
          <option value={30}>30 jours après péremption</option>
        </select>
        <p className="text-xs text-zinc-600 mt-1">
          Les ingrédients périmés depuis plus longtemps que ce seuil sont marqués automatiquement comme gaspillés.
        </p>
      </div>

      <button
        type="submit"
        className="w-full bg-zinc-50 text-zinc-950 px-4 py-2.5 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
      >
        Enregistrer
      </button>
    </form>
  )
}

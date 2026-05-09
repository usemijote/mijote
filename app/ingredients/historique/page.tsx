import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { RestoreIngredientButton } from '@/components/RestoreIngredientButton'

type ArchivedRow = {
  id: string
  nom: string
  archived_at: string
  archived_reason: 'used' | 'wasted' | 'deleted'
  date_peremption: string
  categorie: { nom: string } | null
}

type Filter = 'all' | 'used' | 'wasted'

function formatDateFr(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const REASON_LABEL: Record<ArchivedRow['archived_reason'], string> = {
  used: '✓ Utilisé',
  wasted: '× Gaspillé',
  deleted: 'Supprimé',
}

const REASON_COLOR: Record<ArchivedRow['archived_reason'], string> = {
  used: 'text-emerald-400',
  wasted: 'text-red-400',
  deleted: 'text-zinc-500',
}

export default async function HistoriquePage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>
}) {
  const { reason } = await searchParams
  const filter: Filter = reason === 'used' || reason === 'wasted' ? reason : 'all'

  const supabase = await createClient()

  let query = supabase
    .from('ingredients')
    .select('id, nom, archived_at, archived_reason, date_peremption, categorie:categorie_id(nom)')
    .not('archived_at', 'is', null)
    .order('archived_at', { ascending: false })

  if (filter !== 'all') {
    query = query.eq('archived_reason', filter)
  }

  const { data: items } = await query.returns<ArchivedRow[]>()

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/ingredients"
          className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors"
        >
          ← Mes ingrédients
        </Link>
        <h1 className="text-3xl font-semibold text-zinc-50 tracking-tight mt-1 mb-6">
          Historique
        </h1>

        <div className="flex gap-2 mb-6">
          <FilterTab href="/ingredients/historique" label="Tous" active={filter === 'all'} />
          <FilterTab href="/ingredients/historique?reason=used" label="Utilisés" active={filter === 'used'} />
          <FilterTab href="/ingredients/historique?reason=wasted" label="Gaspillés" active={filter === 'wasted'} />
        </div>

        {!items || items.length === 0 ? (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 text-center">
            <p className="text-zinc-400">Aucun ingrédient archivé pour ce filtre.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((ing) => (
              <li
                key={ing.id}
                className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-50 font-medium truncate">{ing.nom}</p>
                  <p className="text-zinc-500 text-xs mt-1">
                    {ing.categorie?.nom ?? 'Sans catégorie'}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className={REASON_COLOR[ing.archived_reason]}>
                      {REASON_LABEL[ing.archived_reason]}
                    </span>
                    <span className="text-zinc-600">
                      le {formatDateFr(ing.archived_at)}
                    </span>
                  </div>
                </div>

                <RestoreIngredientButton id={ing.id} nom={ing.nom} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}

function FilterTab({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-zinc-50 text-zinc-950'
          : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
      }`}
    >
      {label}
    </Link>
  )
}

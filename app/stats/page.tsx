import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

type IngredientStats = {
  archived_at: string | null
  archived_reason: 'used' | 'wasted' | 'deleted' | null
  categorie: { nom: string } | null
}

export default async function StatsPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('ingredients')
    .select('archived_at, archived_reason, categorie:categorie_id(nom)')
    .returns<IngredientStats[]>()

  const ingredients = data ?? []

  const totalEver = ingredients.length
  const active = ingredients.filter((i) => i.archived_at === null).length
  const used = ingredients.filter((i) => i.archived_reason === 'used').length
  const wasted = ingredients.filter((i) => i.archived_reason === 'wasted').length
  const archived = used + wasted
  const antiWasteRatio = archived > 0 ? Math.round((used / archived) * 100) : null

  const catCounts = new Map<string, number>()
  for (const i of ingredients) {
    const cat = i.categorie?.nom ?? 'Sans catégorie'
    catCounts.set(cat, (catCounts.get(cat) ?? 0) + 1)
  }
  const topCats = Array.from(catCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12">
      <div className="max-w-md mx-auto">
        <Link
          href="/"
          className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors"
        >
          ← Mijote
        </Link>
        <h1 className="text-3xl font-semibold text-zinc-50 tracking-tight mt-1 mb-8">
          Stats
        </h1>

        {totalEver === 0 ? (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 text-center">
            <p className="text-zinc-400 mb-4">
              Pas encore de stats — ajoute tes premiers ingrédients pour les voir.
            </p>
            <Link
              href="/ingredients/scan"
              className="inline-block bg-zinc-50 text-zinc-950 px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-200 transition-colors"
            >
              Scanner
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Dans le frigo" value={active} accent="text-zinc-50" />
              <StatCard label="Total ajoutés" value={totalEver} accent="text-zinc-400" />
              <StatCard label="Utilisés" value={used} accent="text-emerald-400" />
              <StatCard label="Gaspillés" value={wasted} accent="text-red-400" />
            </div>

            {antiWasteRatio !== null && (
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-zinc-400 text-sm">Anti-gaspi</span>
                  <span className="text-zinc-50 font-semibold text-2xl">
                    {antiWasteRatio}%
                  </span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-500"
                    style={{ width: `${antiWasteRatio}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-600 mt-2">
                  Pourcentage des ingrédients archivés que tu as utilisés (vs gaspillés).
                </p>
              </div>
            )}

            {topCats.length > 0 && (
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
                <h2 className="text-zinc-400 text-sm mb-4">Top catégories</h2>
                <ol className="space-y-2">
                  {topCats.map(([cat, count], i) => (
                    <li
                      key={cat}
                      className="flex items-center justify-between"
                    >
                      <span className="text-zinc-50 text-sm">
                        <span className="text-zinc-600 mr-2">{i + 1}.</span>
                        {cat}
                      </span>
                      <span className="text-zinc-500 text-sm">{count}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string
  value: number
  accent: string
}) {
  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
      <div className={`text-3xl font-semibold ${accent}`}>{value}</div>
      <div className="text-zinc-500 text-xs mt-1">{label}</div>
    </div>
  )
}

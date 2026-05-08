import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { deleteIngredient } from '@/lib/actions/ingredients'

type IngredientRow = {
  id: string
  nom: string
  date_achat: string
  date_peremption: string
  quantite: number | null
  unite: string | null
  categorie: { nom: string } | null
}

function joursRestants(datePeremption: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const peremption = new Date(datePeremption)
  peremption.setHours(0, 0, 0, 0)
  const diffMs = peremption.getTime() - today.getTime()
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

function badgeClass(jours: number): string {
  if (jours < 0) return 'bg-red-950 text-red-300 border-red-900'
  if (jours <= 2) return 'bg-orange-950 text-orange-300 border-orange-900'
  if (jours <= 5) return 'bg-yellow-950 text-yellow-300 border-yellow-900'
  return 'bg-zinc-800 text-zinc-300 border-zinc-700'
}

function badgeLabel(jours: number): string {
  if (jours < 0) return `Périmé depuis ${Math.abs(jours)} j`
  if (jours === 0) return 'Périme aujourd\'hui'
  if (jours === 1) return 'Périme demain'
  return `Périme dans ${jours} j`
}

export default async function IngredientsPage() {
  const supabase = await createClient()

  const { data: ingredients } = await supabase
    .from('ingredients')
    .select('id, nom, date_achat, date_peremption, quantite, unite, categorie:categorie_id(nom)')
    .order('date_peremption', { ascending: true })
    .returns<IngredientRow[]>()

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/"
              className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors"
            >
              ← Mijote
            </Link>
            <h1 className="text-3xl font-semibold text-zinc-50 tracking-tight mt-1">
              Mes ingrédients
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/ingredients/nouveau"
              className="text-zinc-400 hover:text-zinc-200 text-sm transition-colors"
            >
              Saisir
            </Link>
            <Link
              href="/ingredients/scan"
              className="bg-zinc-50 text-zinc-950 px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-200 transition-colors"
            >
              Scanner
            </Link>
          </div>
        </div>

        {!ingredients || ingredients.length === 0 ? (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 text-center">
            <p className="text-zinc-400 mb-4">Aucun ingrédient pour l'instant.</p>
            <Link
              href="/ingredients/scan"
              className="inline-block bg-zinc-50 text-zinc-950 px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-200 transition-colors"
            >
              Scanner le premier
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {ingredients.map((ing) => {
              const jours = joursRestants(ing.date_peremption)
              return (
                <li
                  key={ing.id}
                  className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 flex items-start justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <p className="text-zinc-50 font-medium truncate">{ing.nom}</p>
                      {ing.quantite && (
                        <span className="text-zinc-500 text-sm">
                          {ing.quantite}
                          {ing.unite && ` ${ing.unite}`}
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-500 text-xs mt-1">
                      {ing.categorie?.nom ?? 'Sans catégorie'}
                    </p>
                    <span
                      className={`inline-block mt-2 px-2 py-0.5 rounded-md text-xs border ${badgeClass(jours)}`}
                    >
                      {badgeLabel(jours)}
                    </span>
                  </div>

                  <form action={deleteIngredient}>
                    <input type="hidden" name="id" value={ing.id} />
                    <button
                      type="submit"
                      className="text-zinc-600 hover:text-red-400 text-sm transition-colors"
                      aria-label={`Supprimer ${ing.nom}`}
                    >
                      Supprimer
                    </button>
                  </form>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </main>
  )
}

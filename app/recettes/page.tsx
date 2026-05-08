import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

type RecetteRow = {
  id: string
  nom: string
  description: string | null
  temps_preparation_min: number | null
  recette_ingredients: Array<{
    categorie: { nom: string } | null
  }>
}

export default async function RecettesPage() {
  const supabase = await createClient()

  const { data: recettes } = await supabase
    .from('recettes')
    .select('id, nom, description, temps_preparation_min, recette_ingredients(categorie:categorie_id(nom))')
    .order('nom')
    .returns<RecetteRow[]>()

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors"
        >
          ← Mijote
        </Link>
        <h1 className="text-3xl font-semibold text-zinc-50 tracking-tight mt-1 mb-2">
          Recettes
        </h1>
        <p className="text-zinc-500 text-sm mb-8">
          {recettes?.length ?? 0} recettes anti-gaspi
        </p>

        <ul className="space-y-3">
          {recettes?.map((r) => {
            const cats = r.recette_ingredients
              .map((ri) => ri.categorie?.nom)
              .filter(Boolean) as string[]
            return (
              <li key={r.id}>
                <Link
                  href={`/recettes/${r.id}`}
                  className="block bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="text-zinc-50 font-medium">{r.nom}</h2>
                    {r.temps_preparation_min && (
                      <span className="text-zinc-500 text-xs shrink-0">
                        {r.temps_preparation_min} min
                      </span>
                    )}
                  </div>
                  {r.description && (
                    <p className="text-zinc-400 text-sm mt-1 line-clamp-2">
                      {r.description}
                    </p>
                  )}
                  {cats.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {cats.map((cat) => (
                        <span
                          key={cat}
                          className="text-xs px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </main>
  )
}

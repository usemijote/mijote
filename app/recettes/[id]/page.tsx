import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type RecetteDetail = {
  id: string
  nom: string
  description: string | null
  instructions: string
  temps_preparation_min: number | null
  recette_ingredients: Array<{
    categorie: { nom: string; duree_typique_jours: number } | null
  }>
}

export default async function RecetteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: recette } = await supabase
    .from('recettes')
    .select('id, nom, description, instructions, temps_preparation_min, recette_ingredients(categorie:categorie_id(nom, duree_typique_jours))')
    .eq('id', id)
    .single<RecetteDetail>()

  if (!recette) notFound()

  const ingredients = recette.recette_ingredients
    .map((ri) => ri.categorie)
    .filter((c): c is { nom: string; duree_typique_jours: number } => c !== null)

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/recettes"
          className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors"
        >
          ← Recettes
        </Link>
        <h1 className="text-3xl font-semibold text-zinc-50 tracking-tight mt-1 mb-2">
          {recette.nom}
        </h1>
        {recette.description && (
          <p className="text-zinc-400 mb-6">{recette.description}</p>
        )}

        <div className="flex items-center gap-4 mb-8 text-sm text-zinc-500">
          {recette.temps_preparation_min && (
            <span>⏱ {recette.temps_preparation_min} min</span>
          )}
          <span>🥘 {ingredients.length} ingrédients</span>
        </div>

        <section className="mb-8">
          <h2 className="text-zinc-50 font-medium mb-3">Ingrédients</h2>
          <ul className="space-y-2">
            {ingredients.map((cat) => (
              <li
                key={cat.nom}
                className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5"
              >
                <span className="text-zinc-200">{cat.nom}</span>
                <span className="text-zinc-600 text-xs">
                  {cat.duree_typique_jours} j de conservation
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-zinc-50 font-medium mb-3">Préparation</h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <pre className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {recette.instructions}
            </pre>
          </div>
        </section>
      </div>
    </main>
  )
}

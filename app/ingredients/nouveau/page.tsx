import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { addIngredient } from '@/lib/actions/ingredients'

export default async function NouvelIngredientPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories_aliments')
    .select('id, nom, duree_typique_jours')
    .order('nom')

  const today = new Date().toISOString().split('T')[0]

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12">
      <div className="max-w-md mx-auto">
        <Link
          href="/ingredients"
          className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors"
        >
          ← Mes ingrédients
        </Link>
        <h1 className="text-3xl font-semibold text-zinc-50 tracking-tight mt-1 mb-8">
          Nouvel ingrédient
        </h1>

        <form action={addIngredient} className="space-y-5">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-zinc-300 mb-2">
              Nom
            </label>
            <input
              id="nom"
              name="nom"
              type="text"
              required
              placeholder="Ex : Lait Lactel demi-écrémé"
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-50 placeholder-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </div>

          <div>
            <label htmlFor="categorie_id" className="block text-sm font-medium text-zinc-300 mb-2">
              Catégorie
            </label>
            <select
              id="categorie_id"
              name="categorie_id"
              required
              defaultValue=""
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
            >
              <option value="" disabled>
                Choisir une catégorie…
              </option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nom} ({cat.duree_typique_jours} j)
                </option>
              ))}
            </select>
            <p className="text-xs text-zinc-600 mt-1">
              La catégorie détermine la durée de conservation par défaut.
            </p>
          </div>

          <div>
            <label htmlFor="date_achat" className="block text-sm font-medium text-zinc-300 mb-2">
              Date d'achat
            </label>
            <input
              id="date_achat"
              name="date_achat"
              type="date"
              required
              defaultValue={today}
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="quantite" className="block text-sm font-medium text-zinc-300 mb-2">
                Quantité <span className="text-zinc-600 font-normal">(optionnel)</span>
              </label>
              <input
                id="quantite"
                name="quantite"
                type="number"
                step="0.01"
                min="0"
                placeholder="1"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-50 placeholder-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
              />
            </div>
            <div>
              <label htmlFor="unite" className="block text-sm font-medium text-zinc-300 mb-2">
                Unité <span className="text-zinc-600 font-normal">(optionnel)</span>
              </label>
              <input
                id="unite"
                name="unite"
                type="text"
                placeholder="L, g, pièces…"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-50 placeholder-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              href="/ingredients"
              className="flex-1 text-center px-4 py-2.5 border border-zinc-800 text-zinc-300 rounded-lg font-medium hover:bg-zinc-900 transition-colors"
            >
              Annuler
            </Link>
            <button
              type="submit"
              className="flex-1 bg-zinc-50 text-zinc-950 px-4 py-2.5 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

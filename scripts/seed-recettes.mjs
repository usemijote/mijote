// Seed la table recettes + recette_ingredients avec ~30 recettes anti-gaspi
// Run avec : node --env-file=.env.local scripts/seed-recettes.mjs
// Idempotent : supprime tout avant de re-seeder.

import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const recettes = [
  {
    nom: 'Omelette aux herbes',
    description: 'Classique, rapide et qui sauve un fond de frigo.',
    instructions: '1. Battre 3 œufs avec une pincée de sel.\n2. Faire fondre une noix de beurre dans une poêle chaude.\n3. Verser les œufs, parsemer d\'herbes ciselées (persil, ciboulette).\n4. Cuire 3 min à feu moyen, plier en deux et servir.',
    temps_preparation_min: 10,
    ingredients: ['Œufs frais', 'Beurre', 'Légumes feuilles'],
  },
  {
    nom: 'Œufs brouillés crémeux',
    description: 'Les œufs brouillés "à la française" : doux et fondants.',
    instructions: '1. Battre 3 œufs avec 2 cuillères à soupe de lait.\n2. Faire fondre du beurre à feu doux.\n3. Verser les œufs, remuer en continu pendant 5 min.\n4. Retirer du feu quand encore légèrement coulants.',
    temps_preparation_min: 8,
    ingredients: ['Œufs frais', 'Beurre', 'Lait ouvert'],
  },
  {
    nom: 'Salade aux œufs durs',
    description: 'Quand il reste des œufs durs et un peu de salade.',
    instructions: '1. Couper les œufs durs en quartiers.\n2. Laver et essorer la salade.\n3. Couper les tomates en quartiers.\n4. Mélanger, assaisonner avec huile, vinaigre, sel, poivre.',
    temps_preparation_min: 10,
    ingredients: ['Œufs durs cuits', 'Légumes feuilles', 'Tomates'],
  },
  {
    nom: 'Pâtes à la tomate',
    description: 'Le repas du soir qui sauve quand on n\'a plus rien.',
    instructions: '1. Faire cuire les pâtes selon emballage.\n2. Réchauffer la sauce tomate avec un filet d\'huile.\n3. Ajouter les tomates fraîches en dés en fin de cuisson.\n4. Mélanger les pâtes à la sauce.',
    temps_preparation_min: 15,
    ingredients: ['Pâtes ou riz cuits', 'Tomates', 'Sauce ouverte'],
  },
  {
    nom: 'Spaghetti carbonara',
    description: 'Carbonara express avec ce qui reste de la charcuterie.',
    instructions: '1. Cuire les pâtes al dente.\n2. Faire revenir la charcuterie coupée en lardons.\n3. Battre 2 œufs avec du fromage râpé et du poivre.\n4. Hors du feu, mélanger pâtes + œufs + charcuterie. Ne JAMAIS recuire.',
    temps_preparation_min: 15,
    ingredients: ['Pâtes ou riz cuits', 'Œufs frais', 'Charcuterie ouverte', 'Fromage à pâte dure'],
  },
  {
    nom: 'Risotto aux champignons',
    description: 'Risotto crémeux pour finir les champignons.',
    instructions: '1. Faire revenir les champignons émincés au beurre.\n2. Ajouter le riz et nacrer 2 min.\n3. Mouiller au bouillon louche par louche en remuant.\n4. En fin de cuisson, ajouter le fromage râpé. Servir aussitôt.',
    temps_preparation_min: 25,
    ingredients: ['Pâtes ou riz cuits', 'Beurre', 'Fromage à pâte dure', 'Champignons'],
  },
  {
    nom: 'Quiche lorraine',
    description: 'Le grand classique anti-gaspi œufs + lait + charcuterie.',
    instructions: '1. Foncer une pâte brisée dans un moule.\n2. Battre 3 œufs avec 25cl de lait, sel, poivre.\n3. Ajouter la charcuterie en lardons et le fromage râpé.\n4. Verser sur la pâte, cuire 35 min à 180°C.',
    temps_preparation_min: 50,
    ingredients: ['Œufs frais', 'Lait ouvert', 'Fromage à pâte dure', 'Charcuterie ouverte'],
  },
  {
    nom: 'Tarte aux légumes',
    description: 'Une tarte salée pour finir les légumes coupés.',
    instructions: '1. Étaler la pâte dans un moule.\n2. Disposer les légumes par couches.\n3. Battre 2 œufs avec la crème, sel, poivre.\n4. Verser sur les légumes, parsemer de fromage. Cuire 30 min à 180°C.',
    temps_preparation_min: 45,
    ingredients: ['Légumes coupés', 'Œufs frais', 'Crème fraîche ouverte', 'Fromage à pâte dure'],
  },
  {
    nom: 'Croque-monsieur',
    description: 'Le croque parfait : doré dehors, fondant dedans.',
    instructions: '1. Beurrer 2 tranches de pain.\n2. Garnir avec une tranche de charcuterie et du fromage.\n3. Refermer et faire dorer à la poêle 3 min de chaque côté.\n4. Ou cuire au four 8 min à 200°C.',
    temps_preparation_min: 12,
    ingredients: ['Pain de mie', 'Charcuterie ouverte', 'Fromage à pâte dure', 'Beurre'],
  },
  {
    nom: 'Pain perdu',
    description: 'La meilleure façon de sauver du pain rassis.',
    instructions: '1. Battre 2 œufs avec 20cl de lait et un peu de sucre.\n2. Tremper les tranches de pain dedans 30 sec chacune.\n3. Faire dorer à la poêle dans du beurre 2 min par face.\n4. Saupoudrer de sucre ou napper de miel.',
    temps_preparation_min: 12,
    ingredients: ['Pain de mie', 'Œufs frais', 'Lait ouvert', 'Beurre'],
  },
  {
    nom: 'Sandwich club',
    description: 'Le sandwich complet pour un déjeuner rapide.',
    instructions: '1. Toaster 3 tranches de pain.\n2. Tartiner de mayo, poser charcuterie, salade, tomate.\n3. Empiler les couches, presser, couper en triangles.\n4. Maintenir avec des cure-dents.',
    temps_preparation_min: 8,
    ingredients: ['Pain de mie', 'Charcuterie ouverte', 'Tomates', 'Légumes feuilles'],
  },
  {
    nom: 'Soupe de légumes',
    description: 'La soupe qui sauve tous les légumes oubliés du frigo.',
    instructions: '1. Éplucher et couper les légumes en morceaux.\n2. Couvrir d\'eau et porter à ébullition.\n3. Cuire 25 min jusqu\'à ce que tout soit tendre.\n4. Mixer, saler, poivrer.',
    temps_preparation_min: 35,
    ingredients: ['Légumes racines', 'Légumes feuilles'],
  },
  {
    nom: 'Velouté de tomates',
    description: 'Velouté maison express, parfait avec un peu de crème.',
    instructions: '1. Faire revenir les tomates coupées avec un oignon 5 min.\n2. Ajouter 30cl de bouillon, cuire 15 min.\n3. Mixer, ajouter la crème fraîche.\n4. Saler, poivrer, parsemer d\'herbes.',
    temps_preparation_min: 25,
    ingredients: ['Tomates', 'Crème fraîche ouverte'],
  },
  {
    nom: 'Salade composée',
    description: 'Salade complète qui sauve tout ce qui traîne.',
    instructions: '1. Laver salade, couper tomates en quartiers.\n2. Ajouter œufs durs en quartiers et fromage en cubes.\n3. Vinaigrette : huile, vinaigre, moutarde, sel, poivre.\n4. Mélanger délicatement.',
    temps_preparation_min: 12,
    ingredients: ['Légumes feuilles', 'Tomates', 'Œufs durs cuits', 'Fromage à pâte dure'],
  },
  {
    nom: 'Hachis parmentier',
    description: 'Le grand classique enfance qui finit le steak haché.',
    instructions: '1. Faire revenir le steak haché avec oignon. Réserver.\n2. Cuire les pommes de terre à l\'eau, écraser avec beurre et lait.\n3. Tasser la viande dans un plat, recouvrir de purée.\n4. Parsemer de fromage, gratiner 15 min à 200°C.',
    temps_preparation_min: 50,
    ingredients: ['Steak haché', 'Légumes racines', 'Beurre', 'Fromage à pâte dure'],
  },
  {
    nom: 'Sauce bolognaise',
    description: 'Bolognaise maison à servir sur des pâtes.',
    instructions: '1. Faire revenir le steak haché 5 min.\n2. Ajouter la sauce tomate et les tomates fraîches.\n3. Mijoter 30 min à feu doux, saler, poivrer.\n4. Servir sur des pâtes cuites al dente.',
    temps_preparation_min: 40,
    ingredients: ['Steak haché', 'Tomates', 'Sauce ouverte', 'Pâtes ou riz cuits'],
  },
  {
    nom: 'Steak haché à la poêle',
    description: 'Steak haché simple, à servir avec une salade.',
    instructions: '1. Sortir le steak 10 min avant la cuisson.\n2. Saler, poivrer généreusement.\n3. Cuire 2 min de chaque côté à feu vif.\n4. Laisser reposer 1 min avant de servir.',
    temps_preparation_min: 8,
    ingredients: ['Steak haché', 'Beurre'],
  },
  {
    nom: 'Poulet rôti',
    description: 'Poulet rôti maison, tendre et croustillant.',
    instructions: '1. Préchauffer le four à 200°C.\n2. Frotter le poulet de beurre, sel, poivre, thym.\n3. Cuire 1h en arrosant 2-3 fois avec le jus.\n4. Laisser reposer 10 min avant de découper.',
    temps_preparation_min: 75,
    ingredients: ['Volaille crue', 'Beurre'],
  },
  {
    nom: 'Curry de poulet',
    description: 'Curry doux et crémeux pour finir le poulet.',
    instructions: '1. Couper le poulet en cubes, faire dorer à la poêle.\n2. Ajouter les légumes coupés, cuire 5 min.\n3. Verser la crème et le curry en poudre. Mijoter 15 min.\n4. Servir avec du riz.',
    temps_preparation_min: 30,
    ingredients: ['Volaille crue', 'Crème fraîche ouverte', 'Légumes coupés'],
  },
  {
    nom: 'Saumon grillé aux tomates',
    description: 'Saumon express avec accompagnement frais.',
    instructions: '1. Saisir les pavés de saumon côté peau 4 min.\n2. Retourner et cuire 2 min de l\'autre côté.\n3. Pendant ce temps, poêler les tomates avec du beurre.\n4. Servir saumon + tomates + un peu de jus.',
    temps_preparation_min: 15,
    ingredients: ['Poisson cru', 'Beurre', 'Tomates'],
  },
  {
    nom: 'Tartare de saumon',
    description: 'Saumon cru en dés, frais et léger.',
    instructions: '1. Couper le saumon en petits dés.\n2. Mélanger avec citron, échalote, ciboulette, huile d\'olive.\n3. Servir bien froid sur lit de salade.\n4. Accompagner de pain grillé.',
    temps_preparation_min: 15,
    ingredients: ['Poisson cru', 'Légumes feuilles'],
  },
  {
    nom: 'Galettes de légumes',
    description: 'Galettes à la poêle pour finir les légumes coupés.',
    instructions: '1. Râper les légumes, presser pour enlever l\'eau.\n2. Mélanger avec œufs et chapelure.\n3. Former des galettes, cuire à la poêle 3 min par face.\n4. Servir chaud avec une salade.',
    temps_preparation_min: 20,
    ingredients: ['Légumes coupés', 'Œufs frais', 'Pain frais'],
  },
  {
    nom: 'Yaourt aux fruits',
    description: 'Le snack matinal qui finit fruits et yaourts.',
    instructions: '1. Couper les fruits en petits morceaux.\n2. Mélanger avec le yaourt nature.\n3. Ajouter les baies par-dessus.\n4. Sucrer si besoin avec un peu de miel.',
    temps_preparation_min: 5,
    ingredients: ['Yaourt', 'Fruits frais', 'Baies'],
  },
  {
    nom: 'Smoothie banane',
    description: 'Smoothie crémeux quand il reste un peu de tout.',
    instructions: '1. Mettre 1 banane mûre, 1 yaourt et 10cl de lait dans le blender.\n2. Ajouter quelques fruits frais.\n3. Mixer 30 sec jusqu\'à obtenir une texture lisse.\n4. Servir bien frais.',
    temps_preparation_min: 5,
    ingredients: ['Lait ouvert', 'Yaourt', 'Fruits frais'],
  },
  {
    nom: 'Tartine au fromage',
    description: 'Tartine gratinée parfaite pour le brunch.',
    instructions: '1. Toaster les tranches de pain.\n2. Beurrer généreusement.\n3. Couvrir de fromage râpé ou en tranches.\n4. Passer 3 min sous le grill du four.',
    temps_preparation_min: 8,
    ingredients: ['Pain frais', 'Beurre', 'Fromage à pâte dure'],
  },
  {
    nom: 'Soupe à l\'oignon gratinée',
    description: 'La soupe d\'hiver bistro avec gratiné fromage.',
    instructions: '1. Émincer 4 oignons, faire blondir au beurre 15 min.\n2. Ajouter farine et bouillon, mijoter 20 min.\n3. Verser dans des bols, déposer du pain et du fromage.\n4. Gratiner 5 min sous le grill.',
    temps_preparation_min: 45,
    ingredients: ['Légumes racines', 'Beurre', 'Pain frais', 'Fromage à pâte dure'],
  },
  {
    nom: 'Ratatouille',
    description: 'La ratatouille provençale, mijotée doucement.',
    instructions: '1. Couper tous les légumes en dés.\n2. Faire revenir oignon, ail, courgette à l\'huile d\'olive.\n3. Ajouter aubergine, poivron, tomate. Mijoter 30 min.\n4. Ajouter herbes de Provence, ajuster sel, poivre.',
    temps_preparation_min: 50,
    ingredients: ['Tomates', 'Légumes coupés', 'Champignons'],
  },
  {
    nom: 'Salade de pâtes',
    description: 'Salade de pâtes froides pour le déjeuner ou pique-nique.',
    instructions: '1. Cuire les pâtes, refroidir sous l\'eau.\n2. Couper tomates, charcuterie, fromage en dés.\n3. Mélanger pâtes + ingrédients dans un saladier.\n4. Vinaigrette : huile, vinaigre, moutarde, herbes.',
    temps_preparation_min: 20,
    ingredients: ['Pâtes ou riz cuits', 'Tomates', 'Charcuterie ouverte', 'Fromage à pâte dure'],
  },
  {
    nom: 'Frittata aux légumes',
    description: 'Sorte d\'omelette épaisse, parfait pour finir les restes.',
    instructions: '1. Battre 6 œufs avec sel, poivre, fromage râpé.\n2. Faire revenir les légumes coupés à l\'huile 5 min.\n3. Verser les œufs, cuire 5 min sans remuer.\n4. Finir 3 min sous le grill du four.',
    temps_preparation_min: 18,
    ingredients: ['Œufs frais', 'Légumes coupés', 'Fromage à pâte dure'],
  },
  {
    nom: 'Riz cantonais',
    description: 'Pour finir le riz cuit + un peu de tout du frigo.',
    instructions: '1. Couper la charcuterie en petits dés.\n2. Faire sauter à la poêle, ajouter les œufs battus.\n3. Ajouter le riz cuit, mélanger 3 min.\n4. Saler, poivrer, finir avec un trait de sauce soja.',
    temps_preparation_min: 12,
    ingredients: ['Pâtes ou riz cuits', 'Charcuterie ouverte', 'Œufs frais'],
  },
]

console.log(`📋 ${recettes.length} recettes à seeder`)

// 1. Récupérer la map des catégories
const { data: cats, error: catsError } = await supabase
  .from('categories_aliments')
  .select('id, nom')
if (catsError) {
  console.error('Erreur fetch catégories :', catsError.message)
  process.exit(1)
}
const catByName = Object.fromEntries(cats.map((c) => [c.nom, c.id]))

// 2. Vider les tables (idempotent)
console.log('🗑  Nettoyage des recettes existantes...')
await supabase.from('recette_ingredients').delete().gte('categorie_id', 0)
await supabase.from('recettes').delete().gte('temps_preparation_min', 0)

// 3. Insérer chaque recette + ses ingrédients
let inserted = 0
for (const r of recettes) {
  const { data: created, error } = await supabase
    .from('recettes')
    .insert({
      nom: r.nom,
      description: r.description,
      instructions: r.instructions,
      temps_preparation_min: r.temps_preparation_min,
    })
    .select()
    .single()

  if (error || !created) {
    console.error(`❌ ${r.nom} :`, error?.message)
    continue
  }

  const links = r.ingredients
    .map((name) => {
      const id = catByName[name]
      if (!id) console.warn(`  ⚠️  Catégorie inconnue : ${name}`)
      return id ? { recette_id: created.id, categorie_id: id } : null
    })
    .filter(Boolean)

  if (links.length > 0) {
    const { error: linkError } = await supabase
      .from('recette_ingredients')
      .insert(links)
    if (linkError) {
      console.error(`  ❌ Liens ${r.nom} :`, linkError.message)
      continue
    }
  }

  inserted++
  console.log(`✓ ${r.nom} (${links.length} ingrédients)`)
}

console.log(`\n✅ ${inserted}/${recettes.length} recettes seedées`)

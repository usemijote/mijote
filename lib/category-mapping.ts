const TAG_TO_CATEGORY_NAME: Record<string, string> = {
  'en:yogurts': 'Yaourt',
  'en:plant-based-yogurts': 'Yaourt',

  'en:butters': 'Beurre',
  'en:plant-butters': 'Beurre',

  'en:fresh-cheeses': 'Fromage frais',
  'en:soft-cheeses': 'Fromage à pâte molle',
  'en:hard-cheeses': 'Fromage à pâte dure',
  'en:cheeses': 'Fromage à pâte dure',

  'en:creams': 'Crème fraîche ouverte',
  'en:fresh-creams': 'Crème fraîche ouverte',

  'en:milks': 'Lait ouvert',
  'en:fresh-milks': 'Lait ouvert',
  'en:uht-milks': 'Lait UHT non ouvert',

  'en:eggs': 'Œufs frais',
  'en:chicken-eggs': 'Œufs frais',

  'en:minced-meats': 'Steak haché',
  'en:ground-meats': 'Steak haché',
  'en:poultry': 'Volaille crue',
  'en:chickens': 'Volaille crue',
  'en:beef': 'Viande rouge crue',
  'en:pork': 'Viande rouge crue',
  'en:meats': 'Viande rouge crue',
  'en:hams': 'Charcuterie ouverte',
  'en:cured-meats': 'Charcuterie ouverte',
  'en:sausages': 'Charcuterie ouverte',
  'en:cooked-meats': 'Viande cuite',

  'en:fishes': 'Poisson cru',
  'en:fresh-fishes': 'Poisson cru',
  'en:salmons': 'Poisson cru',

  'en:tomatoes': 'Tomates',
  'en:mushrooms': 'Champignons',
  'en:salads': 'Légumes feuilles',
  'en:lettuces': 'Légumes feuilles',
  'en:fresh-vegetables': 'Légumes feuilles',
  'en:carrots': 'Légumes racines',
  'en:potatoes': 'Légumes racines',
  'en:root-vegetables': 'Légumes racines',
  'en:cut-vegetables': 'Légumes coupés',

  'en:berries': 'Baies',
  'en:strawberries': 'Baies',
  'en:raspberries': 'Baies',
  'en:blueberries': 'Baies',
  'en:citrus': 'Agrumes',
  'en:oranges': 'Agrumes',
  'en:lemons': 'Agrumes',
  'en:cut-fruits': 'Fruits coupés',
  'en:fresh-fruits': 'Fruits frais',
  'en:fruits': 'Fruits frais',

  'en:sliced-breads': 'Pain de mie',
  'en:bread-loaves': 'Pain de mie',
  'en:breads': 'Pain frais',
  'en:fresh-breads': 'Pain frais',

  'en:canned-foods': 'Conserve ouverte',
  'en:canned-vegetables': 'Conserve ouverte',
  'en:canned-fishes': 'Conserve ouverte',
  'en:sauces': 'Sauce ouverte',
  'en:tomato-sauces': 'Sauce ouverte',

  'en:cooked-pastas': 'Pâtes ou riz cuits',
  'en:cooked-rices': 'Pâtes ou riz cuits',
  'en:prepared-dishes': 'Plat cuisiné maison',
}

export function suggestCategoryName(categoryTags: string[]): string | null {
  for (const tag of categoryTags) {
    if (TAG_TO_CATEGORY_NAME[tag]) {
      return TAG_TO_CATEGORY_NAME[tag]
    }
  }
  return null
}

// Génère les icônes PWA depuis public/logo-source.png
// Sharp n'est pas une dépendance permanente (build Vercel trop lent).
// Installer temporairement avant de lancer : npm install --no-save sharp
// puis : npm run icons

import sharp from 'sharp'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '..', 'public')
const source = path.join(publicDir, 'logo-source.png')

// Crop centré sur la marmite + check + code-barres (sans le texte "Mijote")
const CROP = { left: 280, top: 80, width: 470, height: 470 }

// Padding autour du crop pour que les éléments rentrent dans le cercle iOS
// (Apple recommande safe area à 80% du carré)
const PADDING_RATIO = 0.13
const BG = { r: 255, g: 255, b: 255, alpha: 1 } // blanc pur, matche le fond du crop

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-16.png', size: 16 },
]

for (const { name, size } of sizes) {
  const padding = Math.round(size * PADDING_RATIO)
  const innerSize = size - 2 * padding

  await sharp(source)
    .extract(CROP)
    .resize(innerSize, innerSize, { fit: 'cover' })
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: BG,
    })
    .png()
    .toFile(path.join(publicDir, name))
  console.log(`✓ ${name} (${size}×${size})`)
}

console.log('\nDone. All icons generated in public/')

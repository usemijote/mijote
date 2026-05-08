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

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-16.png', size: 16 },
]

for (const { name, size } of sizes) {
  await sharp(source)
    .resize(size, size, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, name))
  console.log(`✓ ${name} (${size}×${size})`)
}

console.log('\nDone. All icons generated in public/')

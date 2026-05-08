type Ingredient = {
  nom: string
  date_peremption: string
  categorie: { nom: string } | null
}

function formatDateFr(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function joursRestants(datePeremption: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const peremption = new Date(datePeremption)
  peremption.setHours(0, 0, 0, 0)
  return Math.round((peremption.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function joursLabel(jours: number): string {
  if (jours < 0) return `Périmé depuis ${Math.abs(jours)} j`
  if (jours === 0) return 'aujourd\'hui'
  if (jours === 1) return 'demain'
  return `dans ${jours} j`
}

export function buildExpiryEmail(ingredients: Ingredient[]) {
  const subject = ingredients.length === 1
    ? `1 ingrédient à utiliser bientôt`
    : `${ingredients.length} ingrédients à utiliser bientôt`

  const itemsHtml = ingredients
    .map((ing) => {
      const jours = joursRestants(ing.date_peremption)
      const cat = ing.categorie?.nom ?? ''
      return `
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #27272a;">
            <div style="font-weight: 500; color: #fafafa;">${escapeHtml(ing.nom)}</div>
            ${cat ? `<div style="color: #71717a; font-size: 12px; margin-top: 2px;">${escapeHtml(cat)}</div>` : ''}
          </td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #27272a; text-align: right; vertical-align: top;">
            <div style="color: ${jours <= 1 ? '#fb923c' : '#facc15'}; font-size: 14px; font-weight: 500;">
              Périme ${joursLabel(jours)}
            </div>
            <div style="color: #71717a; font-size: 12px; margin-top: 2px;">
              ${formatDateFr(ing.date_peremption)}
            </div>
          </td>
        </tr>
      `
    })
    .join('')

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8" />
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 24px 16px; background: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table role="presentation" style="max-width: 480px; margin: 0 auto;" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 24px 0;">
            <h1 style="color: #fafafa; font-size: 28px; font-weight: 600; margin: 0 0 4px;">Mijote</h1>
            <p style="color: #71717a; font-size: 14px; margin: 0;">Frigo anti-gaspi</p>
          </td>
        </tr>
        <tr>
          <td style="background: #18181b; border-radius: 16px; border: 1px solid #27272a; padding: 4px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${itemsHtml}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 24px 0; text-align: center;">
            <a href="https://usemijote.vercel.app/ingredients" style="display: inline-block; background: #fafafa; color: #09090b; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px;">
              Voir mon frigo
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding: 16px 0; text-align: center;">
            <p style="color: #52525b; font-size: 12px; margin: 0;">
              Email envoyé par Mijote — frigo anti-gaspi
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  return { subject, html }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

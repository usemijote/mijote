import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'
import { buildExpiryEmail } from '@/lib/email/expiry-notification'

type IngredientRow = {
  nom: string
  date_peremption: string
  categorie: { nom: string } | null
}

type UserPrefs = {
  alert_hour: number
  alert_days_before: number
  auto_archive_days: number | null
}

const DEFAULT_PREFS: UserPrefs = {
  alert_hour: 18,
  alert_days_before: 2,
  auto_archive_days: 7,
}

function getCurrentParisHour(): number {
  // Renvoie l'heure actuelle à Paris (gère DST automatiquement)
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Paris',
    hour: 'numeric',
    hour12: false,
  })
  return parseInt(formatter.format(new Date()), 10)
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY!)
  const admin = createAdminClient()

  const currentParisHour = getCurrentParisHour()

  // Récupérer tous les users
  const { data: usersData, error: usersError } = await admin.auth.admin.listUsers()
  if (usersError) {
    return NextResponse.json({ error: usersError.message }, { status: 500 })
  }

  // Récupérer toutes les préférences (1 seule requête)
  const { data: prefsData } = await admin
    .from('user_preferences')
    .select('user_id, alert_hour, alert_days_before, auto_archive_days')

  const prefsByUserId = new Map<string, UserPrefs>()
  for (const p of prefsData ?? []) {
    prefsByUserId.set(p.user_id, {
      alert_hour: p.alert_hour,
      alert_days_before: p.alert_days_before,
      auto_archive_days: p.auto_archive_days,
    })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().split('T')[0]

  const results: Array<{
    email: string
    status: string
    archived?: number
    sent_count?: number
    error?: string
  }> = []
  let totalAutoArchived = 0

  for (const user of usersData.users) {
    if (!user.email) continue

    const prefs = prefsByUserId.get(user.id) ?? DEFAULT_PREFS

    // Skip si pas l'heure que le user a choisie
    if (prefs.alert_hour !== currentParisHour) {
      continue
    }

    // Auto-archive : ingrédients périmés depuis plus de auto_archive_days
    let userArchivedCount = 0
    if (prefs.auto_archive_days !== null) {
      const thresholdDate = new Date(today)
      thresholdDate.setDate(thresholdDate.getDate() - prefs.auto_archive_days)
      const thresholdStr = thresholdDate.toISOString().split('T')[0]

      const { data: archived } = await admin
        .from('ingredients')
        .update({
          archived_at: new Date().toISOString(),
          archived_reason: 'wasted',
        })
        .eq('user_id', user.id)
        .is('archived_at', null)
        .lt('date_peremption', thresholdStr)
        .select('id')

      userArchivedCount = archived?.length ?? 0
      totalAutoArchived += userArchivedCount
    }

    // Envoyer le mail d'alerte sur les périmant dans 0 à alert_days_before jours
    const inDaysBefore = new Date(today)
    inDaysBefore.setDate(inDaysBefore.getDate() + prefs.alert_days_before)
    const inDaysBeforeStr = inDaysBefore.toISOString().split('T')[0]

    const { data: ingredients, error: ingError } = await admin
      .from('ingredients')
      .select('nom, date_peremption, categorie:categorie_id(nom)')
      .eq('user_id', user.id)
      .is('archived_at', null)
      .gte('date_peremption', todayStr)
      .lte('date_peremption', inDaysBeforeStr)
      .order('date_peremption', { ascending: true })
      .returns<IngredientRow[]>()

    if (ingError) {
      results.push({
        email: user.email,
        status: 'error',
        error: ingError.message,
        archived: userArchivedCount,
      })
      continue
    }

    if (!ingredients || ingredients.length === 0) {
      results.push({
        email: user.email,
        status: 'no_items',
        archived: userArchivedCount,
      })
      continue
    }

    const { subject, html } = buildExpiryEmail(ingredients)

    const { error: sendError } = await resend.emails.send({
      from: 'Mijote <onboarding@resend.dev>',
      to: user.email,
      subject,
      html,
    })

    if (sendError) {
      results.push({
        email: user.email,
        status: 'error',
        error: sendError.message,
        archived: userArchivedCount,
      })
    } else {
      results.push({
        email: user.email,
        status: 'sent',
        sent_count: ingredients.length,
        archived: userArchivedCount,
      })
    }
  }

  return NextResponse.json({
    ran_at: new Date().toISOString(),
    paris_hour: currentParisHour,
    total_auto_archived: totalAutoArchived,
    users_processed: usersData.users.length,
    matched_users: results.length,
    results,
  })
}

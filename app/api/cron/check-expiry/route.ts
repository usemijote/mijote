import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'
import { buildExpiryEmail } from '@/lib/email/expiry-notification'

type IngredientRow = {
  nom: string
  date_peremption: string
  categorie: { nom: string } | null
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY!)
  const admin = createAdminClient()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const inTwoDays = new Date(today)
  inTwoDays.setDate(inTwoDays.getDate() + 2)

  const todayStr = today.toISOString().split('T')[0]
  const inTwoDaysStr = inTwoDays.toISOString().split('T')[0]

  const { data: usersData, error: usersError } = await admin.auth.admin.listUsers()
  if (usersError) {
    return NextResponse.json({ error: usersError.message }, { status: 500 })
  }

  const results: Array<{ email: string; status: 'sent' | 'no_items' | 'error'; count?: number; error?: string }> = []

  for (const user of usersData.users) {
    if (!user.email) {
      results.push({ email: user.id, status: 'no_items' })
      continue
    }

    const { data: ingredients, error: ingError } = await admin
      .from('ingredients')
      .select('nom, date_peremption, categorie:categorie_id(nom)')
      .eq('user_id', user.id)
      .is('archived_at', null)
      .gte('date_peremption', todayStr)
      .lte('date_peremption', inTwoDaysStr)
      .order('date_peremption', { ascending: true })
      .returns<IngredientRow[]>()

    if (ingError) {
      results.push({ email: user.email, status: 'error', error: ingError.message })
      continue
    }

    if (!ingredients || ingredients.length === 0) {
      results.push({ email: user.email, status: 'no_items' })
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
      results.push({ email: user.email, status: 'error', error: sendError.message })
    } else {
      results.push({ email: user.email, status: 'sent', count: ingredients.length })
    }
  }

  return NextResponse.json({
    ran_at: new Date().toISOString(),
    users_processed: usersData.users.length,
    results,
  })
}

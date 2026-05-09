'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function upsertPreferences(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const alertHour = Number(formData.get('alert_hour'))
  const alertDaysBefore = Number(formData.get('alert_days_before'))
  const autoArchiveDaysRaw = formData.get('auto_archive_days')
  const autoArchiveDays =
    autoArchiveDaysRaw && String(autoArchiveDaysRaw).trim()
      ? Number(autoArchiveDaysRaw)
      : null

  if (Number.isNaN(alertHour) || alertHour < 0 || alertHour > 23) {
    throw new Error('Heure invalide')
  }
  if (Number.isNaN(alertDaysBefore) || alertDaysBefore < 1 || alertDaysBefore > 7) {
    throw new Error('Jours d\'avance invalides')
  }
  if (autoArchiveDays !== null && (Number.isNaN(autoArchiveDays) || autoArchiveDays < 0)) {
    throw new Error('Seuil d\'archivage invalide')
  }

  const { error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: user.id,
      alert_hour: alertHour,
      alert_days_before: alertDaysBefore,
      auto_archive_days: autoArchiveDays,
    })

  if (error) throw new Error(`Erreur Supabase : ${error.message}`)

  revalidatePath('/profil')
}

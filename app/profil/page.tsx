import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PreferencesForm } from '@/components/PreferencesForm'

export default async function ProfilPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null // proxy.ts redirige normalement avant
  }

  const { data: prefs } = await supabase
    .from('user_preferences')
    .select('alert_hour, alert_days_before, auto_archive_days')
    .eq('user_id', user.id)
    .maybeSingle<{
      alert_hour: number
      alert_days_before: number
      auto_archive_days: number | null
    }>()

  const current = prefs ?? {
    alert_hour: 18,
    alert_days_before: 2,
    auto_archive_days: 7,
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12">
      <div className="max-w-md mx-auto">
        <Link
          href="/"
          className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors"
        >
          ← Mijote
        </Link>
        <h1 className="text-3xl font-semibold text-zinc-50 tracking-tight mt-1 mb-8">
          Profil
        </h1>

        <section className="mb-8">
          <p className="text-zinc-400 text-sm mb-1">Connecté en tant que</p>
          <p className="text-zinc-50 font-medium break-all">{user.email}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-zinc-50 font-medium mb-4">Préférences</h2>
          <PreferencesForm current={current} />
        </section>

        <section className="pt-6 border-t border-zinc-800">
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="text-sm text-zinc-500 hover:text-red-400 transition-colors"
            >
              Se déconnecter
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}

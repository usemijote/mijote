import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-5xl font-semibold text-zinc-50 tracking-tight mb-2">
          Mijote
        </h1>
        <p className="text-zinc-500 text-sm mb-10">Frigo anti-gaspi</p>

        {user ? (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 text-left">
            <p className="text-zinc-400 text-sm mb-1">Connecté en tant que</p>
            <p className="text-zinc-50 font-medium mb-6 break-all">{user.email}</p>

            <div className="flex items-center justify-between">
              <span className="text-zinc-600 text-xs">
                Le scanner d'ingrédients arrive bientôt.
              </span>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
                >
                  Se déconnecter
                </button>
              </form>
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="inline-block bg-zinc-50 text-zinc-950 px-6 py-2.5 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
          >
            Se connecter
          </Link>
        )}
      </div>
    </main>
  )
}

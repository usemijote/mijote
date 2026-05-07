'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setStatus('error')
      setErrorMsg(error.message)
    } else {
      setStatus('sent')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-semibold text-zinc-50 tracking-tight">Mijote</h1>
          <p className="text-zinc-500 text-sm mt-2">Frigo anti-gaspi</p>
        </div>

        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
          {status === 'sent' ? (
            <div className="text-center py-4">
              <div className="text-3xl mb-3">✉️</div>
              <p className="text-zinc-50 font-medium mb-2">Lien envoyé</p>
              <p className="text-sm text-zinc-400">
                Vérifie ta boîte mail à <span className="text-zinc-200">{email}</span>.
                <br />Le lien expire dans 15 minutes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-300 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton@email.com"
                  disabled={status === 'sending'}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 text-zinc-50 placeholder-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending' || !email}
                className="w-full bg-zinc-50 text-zinc-950 py-2.5 rounded-lg font-medium hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {status === 'sending' ? 'Envoi…' : 'Recevoir le lien de connexion'}
              </button>

              {status === 'error' && (
                <p className="text-sm text-red-400">{errorMsg}</p>
              )}
            </form>
          )}
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          Pas de mot de passe à retenir, juste ton email.
        </p>
      </div>
    </main>
  )
}

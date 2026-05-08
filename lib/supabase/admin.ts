import { createClient } from '@supabase/supabase-js'

// Client Supabase admin avec service_role : bypass RLS, voit toutes les données
// À n'utiliser QUE côté serveur (Route Handlers, Server Actions, cron)
// JAMAIS côté client (sinon n'importe qui peut lire/écrire toute la DB)
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

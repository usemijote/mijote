import Link from 'next/link'
import ScannerClient from './ScannerClient'

export default function ScanPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12">
      <div className="max-w-md mx-auto">
        <Link
          href="/ingredients"
          className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors"
        >
          ← Mes ingrédients
        </Link>
        <h1 className="text-3xl font-semibold text-zinc-50 tracking-tight mt-1 mb-8">
          Scanner un produit
        </h1>

        <ScannerClient />

        <p className="text-center text-xs text-zinc-600 mt-8">
          Pas de code-barres ?{' '}
          <Link href="/ingredients/nouveau" className="text-zinc-400 hover:text-zinc-200 underline">
            Saisir manuellement
          </Link>
        </p>
      </div>
    </main>
  )
}

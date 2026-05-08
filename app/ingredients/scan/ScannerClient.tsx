'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { BarcodeFormat, DecodeHintType } from '@zxing/library'

type Status = 'init' | 'permission_denied' | 'scanning' | 'detected' | 'error'

export default function ScannerClient() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState<Status>('init')
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const hints = new Map<DecodeHintType, unknown>()
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
      BarcodeFormat.QR_CODE,
    ])
    hints.set(DecodeHintType.TRY_HARDER, true)

    const codeReader = new BrowserMultiFormatReader(hints)
    let cancelled = false
    let controls: { stop: () => void } | null = null

    async function start() {
      try {
        const result = await codeReader.decodeFromVideoDevice(
          undefined,
          videoRef.current!,
          (result) => {
            if (cancelled) return
            if (result) {
              const code = result.getText()
              setStatus('detected')
              cancelled = true
              controls?.stop()
              router.push(`/ingredients/nouveau?barcode=${encodeURIComponent(code)}`)
            }
          }
        )
        if (cancelled) {
          result.stop()
          return
        }
        controls = result
        setStatus('scanning')
      } catch (e: unknown) {
        const err = e as { name?: string; message?: string }
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setStatus('permission_denied')
        } else {
          setStatus('error')
          setErrorMsg(err.message ?? 'Erreur inconnue')
        }
      }
    }

    start()

    return () => {
      cancelled = true
      controls?.stop()
    }
  }, [router])

  if (status === 'permission_denied') {
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 text-center">
        <p className="text-zinc-50 font-medium mb-2">Caméra refusée</p>
        <p className="text-zinc-400 text-sm">
          Autorise l'accès à la caméra dans les réglages du navigateur, puis recharge la page.
        </p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="bg-zinc-900 rounded-xl border border-red-900 p-6 text-center">
        <p className="text-red-300 font-medium mb-2">Erreur caméra</p>
        <p className="text-zinc-400 text-sm">{errorMsg}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
        <video
          ref={videoRef}
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-3/4 h-1/3 border-2 border-zinc-50/40 rounded-lg" />
        </div>
      </div>
      <p className="text-center text-zinc-400 text-sm">
        {status === 'detected'
          ? 'Code détecté…'
          : status === 'init'
            ? 'Activation de la caméra…'
            : 'Vise le code-barres au centre du cadre'}
      </p>
    </div>
  )
}

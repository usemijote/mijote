'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

type Status = 'init' | 'unsupported' | 'permission_denied' | 'scanning' | 'detected' | 'error'

declare global {
  interface Window {
    BarcodeDetector?: new (options?: { formats?: string[] }) => {
      detect: (source: HTMLVideoElement) => Promise<{ rawValue: string }[]>
    }
  }
}

export default function ScannerClient() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState<Status>('init')
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.BarcodeDetector) {
      setStatus('unsupported')
      return
    }

    let stream: MediaStream | null = null
    let cancelled = false
    let animationFrameId: number | null = null

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setStatus('scanning')
        }

        const detector = new window.BarcodeDetector!({
          formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128'],
        })

        const loop = async () => {
          if (cancelled || !videoRef.current) return
          try {
            const codes = await detector.detect(videoRef.current)
            if (codes.length > 0) {
              const code = codes[0].rawValue
              setStatus('detected')
              cancelled = true
              stream?.getTracks().forEach((t) => t.stop())
              router.push(`/ingredients/nouveau?barcode=${encodeURIComponent(code)}`)
              return
            }
          } catch {
            // detect peut throw si la vidéo n'est pas prête, on continue
          }
          animationFrameId = requestAnimationFrame(loop)
        }
        loop()
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
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [router])

  if (status === 'unsupported') {
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 text-center">
        <p className="text-zinc-50 font-medium mb-2">Scanner non supporté</p>
        <p className="text-zinc-400 text-sm">
          Ton navigateur ne supporte pas la détection de codes-barres.
          Utilise Safari (iOS 17+) ou Chrome/Edge récent, ou ajoute manuellement.
        </p>
      </div>
    )
  }

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
        {status === 'detected' ? 'Code détecté…' : 'Vise le code-barres au centre du cadre'}
      </p>
    </div>
  )
}

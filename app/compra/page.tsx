'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { Download, CheckCircle, Crown, Monitor, ArrowRight, Shield, Zap } from 'lucide-react'

// TODO: Replace with actual DMG URL (GitHub Releases, Supabase Storage, or CDN)
const DMG_DOWNLOAD_URL = '#'
const APP_VERSION = '3.0.0'

export default function DownloadPage() {
  const supabase = createClient()
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [plan, setPlan] = useState<string>('free')
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [verifyMessage, setVerifyMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser) {
      setUser({ email: authUser.email || '' })

      // Fetch plan status
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan, subscription_status')
        .eq('id', authUser.id)
        .single()

      if (profile) {
        setPlan(profile.plan)
      }
    }
    setLoading(false)
  }

  async function handleVerifyPurchase() {
    setVerifying(true)
    setVerifyMessage(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setVerifyMessage({ type: 'error', text: 'Faça login primeiro para verificar sua compra.' })
        setVerifying(false)
        return
      }

      const res = await fetch(
        'https://bvdbpyjudmkkspcxevlp.supabase.co/functions/v1/verify-purchase',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await res.json()

      if (data.success && data.plan === 'pro') {
        setPlan('pro')
        setVerifyMessage({ type: 'success', text: 'Plano Pro ativado com sucesso!' })
      } else {
        setVerifyMessage({ type: 'info', text: data.message || 'Nenhuma compra encontrada. Verifique se usou o mesmo email.' })
      }
    } catch {
      setVerifyMessage({ type: 'error', text: 'Erro ao verificar. Tente novamente.' })
    }

    setVerifying(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 py-16">
        {/* Logo */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-white font-bold text-2xl">VoxAIgo</span>
          </Link>

          <h1 className="text-4xl font-bold mb-3">
            Obrigado pela sua compra!
          </h1>
          <p className="text-zinc-400 text-lg">
            Siga os passos abaixo para começar a usar o VoxAIgo.
          </p>
        </div>

        {/* Plan status banner */}
        {user && (
          <div className={`rounded-2xl p-5 mb-8 border ${
            plan === 'pro'
              ? 'bg-purple-600/10 border-purple-500/30'
              : 'bg-zinc-900/60 border-zinc-800/60'
          }`}>
            <div className="flex items-center gap-3">
              {plan === 'pro' ? (
                <>
                  <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center">
                    <Crown size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Plano Pro Ativo</p>
                    <p className="text-sm text-purple-300">{user.email} — Transcrições ilimitadas desbloqueadas</p>
                  </div>
                  <CheckCircle size={24} className="text-emerald-400 ml-auto" />
                </>
              ) : (
                <>
                  <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center">
                    <Zap size={20} className="text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Plano Free</p>
                    <p className="text-sm text-zinc-400">{user.email} — 100 transcrições/mês</p>
                  </div>
                </>
              )}
            </div>

            {/* Verify purchase button for non-pro users */}
            {plan !== 'pro' && (
              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <p className="text-sm text-zinc-400 mb-3">
                  Já comprou na Eduzz? Clique para ativar seu plano Pro.
                </p>
                <button
                  onClick={handleVerifyPurchase}
                  disabled={verifying}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium py-2.5 px-5 rounded-xl transition-colors text-sm"
                >
                  {verifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <Shield size={16} />
                      Verificar Compra
                    </>
                  )}
                </button>

                {verifyMessage && (
                  <div className={`mt-3 rounded-xl px-4 py-3 text-sm ${
                    verifyMessage.type === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                      : verifyMessage.type === 'error'
                      ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                      : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                  }`}>
                    {verifyMessage.text}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Steps */}
        <div className="space-y-6">
          {/* Step 1: Create account / Login */}
          <div className={`bg-zinc-900/60 border rounded-2xl p-6 ${
            user ? 'border-emerald-500/30' : 'border-purple-500/30'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                user ? 'bg-emerald-600/20 text-emerald-400' : 'bg-purple-600/20 text-purple-400'
              }`}>
                {user ? <CheckCircle size={20} /> : '1'}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {user ? 'Conta conectada' : 'Crie sua conta'}
                </h3>
                <p className="text-sm text-zinc-400 mb-4">
                  {user
                    ? `Logado como ${user.email}`
                    : 'Use o mesmo email da compra na Eduzz para ativar automaticamente.'}
                </p>
                {!user && (
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-medium py-2.5 px-5 rounded-xl transition-colors text-sm"
                  >
                    Criar conta / Login
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Download */}
          <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center text-sm font-bold text-purple-400 flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Baixe o VoxAIgo para Mac
                </h3>
                <p className="text-sm text-zinc-400 mb-4">
                  macOS 13 (Ventura) ou superior. Instalação em menos de 1 minuto.
                </p>
                <a
                  href={DMG_DOWNLOAD_URL}
                  className="inline-flex items-center gap-3 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  <Download size={20} />
                  <div className="text-left">
                    <span className="block">Baixar VoxAIgo.dmg</span>
                    <span className="text-xs text-zinc-500 font-normal">v{APP_VERSION} — macOS • Apple Silicon + Intel</span>
                  </div>
                  <Monitor size={18} className="text-zinc-400 ml-2" />
                </a>
              </div>
            </div>
          </div>

          {/* Step 3: Login in app */}
          <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center text-sm font-bold text-purple-400 flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Faça login no app
                </h3>
                <p className="text-sm text-zinc-400">
                  Abra o VoxAIgo, clique no ícone na barra de menu e faça login com o{' '}
                  <span className="text-white font-medium">mesmo email</span> da compra.
                  Seu plano Pro será ativado automaticamente.
                </p>
              </div>
            </div>
          </div>

          {/* Step 4: Start using */}
          <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center text-sm font-bold text-purple-400 flex-shrink-0">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Comece a usar!
                </h3>
                <p className="text-sm text-zinc-400">
                  Segure <span className="text-white font-medium">Option + Command</span> e fale.
                  O texto será transcrito e colado automaticamente.
                  Funciona em qualquer app — VS Code, Gmail, WhatsApp, Notion...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Help section */}
        <div className="mt-12 text-center">
          <p className="text-zinc-500 text-sm">
            Problemas? Entre em contato:{' '}
            <a href="mailto:contato@robboliver.pro" className="text-purple-400 hover:text-purple-300 transition-colors">
              contato@robboliver.pro
            </a>
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
              Voltar ao site
            </Link>
            <span className="text-zinc-700">•</span>
            <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
              Meu Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

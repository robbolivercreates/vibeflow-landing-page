'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Crown, Check, Zap, RefreshCw } from 'lucide-react'

interface SubscriptionData {
  plan: string
  status: string
  eduzz_invoice_id: string | null
  expires_at: string | null
}

const EDUZZ_MENSAL = 'https://chk.eduzz.com/39ZQ2OYE9E'
const EDUZZ_ANUAL = 'https://chk.eduzz.com/Z0B57NQ3WA'

const freeFeatures = [
  '100 transcrições/mês',
  'Modo Texto + Código',
  'Português e Inglês',
]

const proFeatures = [
  'Transcrições ilimitadas',
  'Todos os 5 modos (Texto, Código, Email, UX, Comando)',
  '15+ idiomas',
  'Aprendizado de estilo',
  'Snippets personalizados',
  'Conversation Reply',
  'Suporte prioritário',
]

export default function BillingPage() {
  const supabase = createClient()
  const [sub, setSub] = useState<SubscriptionData | null>(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [verifyResult, setVerifyResult] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

  useEffect(() => {
    loadBilling()
  }, [])

  async function loadBilling() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setEmail(user.email || '')

    const { data } = await supabase
      .from('subscriptions')
      .select('plan, status, eduzz_invoice_id, expires_at')
      .eq('user_id', user.id)
      .single()

    if (data) setSub(data)
    setLoading(false)
  }

  async function handleVerifyPurchase() {
    setVerifying(true)
    setVerifyResult(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

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

      if (data.plan === 'pro' || data.plan === 'pro_annual') {
        setVerifyResult('success')
        setSub(prev => prev ? { ...prev, plan: data.plan, status: 'active' } : null)
      } else {
        setVerifyResult('not_found')
      }
    } catch {
      setVerifyResult('error')
    }

    setVerifying(false)
  }

  const isPro = sub?.plan === 'pro' || sub?.plan === 'pro_annual'
  const checkoutUrl = billingCycle === 'monthly' ? EDUZZ_MENSAL : EDUZZ_ANUAL
  const checkoutUrlWithEmail = `${checkoutUrl}?email=${encodeURIComponent(email)}&skip=1`

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Assinatura</h1>
        <p className="text-zinc-400 text-sm mt-1">Gerencie seu plano VoxAIgo.</p>
      </div>

      {/* Current plan status */}
      <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          {isPro ? (
            <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center">
              <Crown size={20} className="text-purple-400" />
            </div>
          ) : (
            <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center">
              <Zap size={20} className="text-zinc-400" />
            </div>
          )}
          <div>
            <p className="text-white font-semibold">
              {isPro ? 'VoxAIgo Pro' : 'VoxAIgo Free'}
            </p>
            <p className="text-xs text-zinc-500">
              {isPro
                ? sub?.plan === 'pro_annual' ? 'Plano anual' : 'Plano mensal'
                : '100 transcrições/mês'}
            </p>
          </div>
          <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${
            isPro && sub?.status === 'active'
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'bg-zinc-800 text-zinc-400'
          }`}>
            {isPro && sub?.status === 'active' ? 'Ativo' : 'Free'}
          </span>
        </div>
      </div>

      {/* Plans comparison */}
      {!isPro && (
        <>
          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-white' : 'text-zinc-500'}`}>Mensal</span>
            <button
              onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-12 h-6 bg-zinc-800 rounded-full transition-colors"
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-purple-500 rounded-full transition-all ${
                billingCycle === 'annual' ? 'left-[26px]' : 'left-0.5'
              }`} />
            </button>
            <span className={`text-sm ${billingCycle === 'annual' ? 'text-white' : 'text-zinc-500'}`}>
              Anual <span className="text-emerald-400 text-xs">-25%</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Free plan */}
            <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-1">Free</h3>
              <p className="text-3xl font-bold text-white">R$0<span className="text-sm text-zinc-500 font-normal">/mês</span></p>
              <ul className="mt-5 space-y-3">
                {freeFeatures.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-zinc-400">
                    <Check size={14} className="text-zinc-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <button disabled className="w-full mt-6 bg-zinc-800 text-zinc-500 font-medium py-2.5 rounded-xl cursor-default">
                Plano atual
              </button>
            </div>

            {/* Pro plan */}
            <div className="bg-zinc-900/60 border-2 border-purple-500/30 rounded-2xl p-6 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                RECOMENDADO
              </span>
              <h3 className="text-lg font-semibold text-white mb-1">Pro</h3>
              <p className="text-3xl font-bold text-white">
                R${billingCycle === 'monthly' ? '19,90' : '14,90'}
                <span className="text-sm text-zinc-500 font-normal">/mês</span>
              </p>
              {billingCycle === 'annual' && (
                <p className="text-xs text-zinc-500">R$178,80 cobrado anualmente</p>
              )}
              <ul className="mt-5 space-y-3">
                {proFeatures.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                    <Check size={14} className="text-purple-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={checkoutUrlWithEmail}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full mt-6 bg-purple-600 hover:bg-purple-500 text-white text-center font-medium py-2.5 rounded-xl transition-colors"
              >
                Assinar Pro
              </a>
            </div>
          </div>
        </>
      )}

      {/* Verify purchase */}
      <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-6">
        <h3 className="text-sm font-medium text-white mb-2">Já comprou?</h3>
        <p className="text-xs text-zinc-400 mb-4">
          Se você fez a compra na Eduzz com o email <span className="text-zinc-300">{email}</span>, clique abaixo para verificar.
        </p>
        <button
          onClick={handleVerifyPurchase}
          disabled={verifying}
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white font-medium py-2.5 px-5 rounded-xl transition-colors"
        >
          <RefreshCw size={16} className={verifying ? 'animate-spin' : ''} />
          {verifying ? 'Verificando...' : 'Verificar compra'}
        </button>

        {verifyResult === 'success' && (
          <div className="mt-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-green-400 text-sm">
            Assinatura Pro ativada com sucesso!
          </div>
        )}
        {verifyResult === 'not_found' && (
          <div className="mt-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 text-yellow-400 text-sm">
            Nenhuma compra encontrada para este email. Verifique se usou o mesmo email na Eduzz.
          </div>
        )}
        {verifyResult === 'error' && (
          <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
            Erro ao verificar. Tente novamente em instantes.
          </div>
        )}
      </div>
    </div>
  )
}

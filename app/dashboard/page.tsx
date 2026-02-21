'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Mic, Clock, TrendingUp, Download, Crown, ArrowRight, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface UsageStats {
  totalTranscriptions: number
  monthlyUsage: number
  monthlyLimit: number
  dailyUsage: number[]
}

interface Subscription {
  plan: string
  status: string
}

export default function DashboardPage() {
  const supabase = createClient()
  const [displayName, setDisplayName] = useState('')
  const [stats, setStats] = useState<UsageStats>({
    totalTranscriptions: 0,
    monthlyUsage: 0,
    monthlyLimit: 100,
    dailyUsage: [],
  })
  const [subscription, setSubscription] = useState<Subscription>({ plan: 'free', status: 'active' })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function handleRefresh() {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setDisplayName(user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Usuário')

    // Load subscription
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('plan, status')
      .eq('user_id', user.id)
      .single()

    if (sub) {
      setSubscription({ plan: sub.plan, status: sub.status })
      if (sub.plan === 'pro' || sub.plan === 'pro_annual') {
        setStats(prev => ({ ...prev, monthlyLimit: Infinity }))
      }
    }

    // Load usage stats
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const { count: monthlyCount } = await supabase
      .from('usage_log')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', startOfMonth)

    const { count: totalCount } = await supabase
      .from('usage_log')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Daily usage for last 7 days
    const dailyUsage: number[] = []
    for (let i = 6; i >= 0; i--) {
      const day = new Date()
      day.setDate(day.getDate() - i)
      const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate()).toISOString()
      const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1).toISOString()

      const { count } = await supabase
        .from('usage_log')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', dayStart)
        .lt('created_at', dayEnd)

      dailyUsage.push(count || 0)
    }

    setStats({
      totalTranscriptions: totalCount || 0,
      monthlyUsage: monthlyCount || 0,
      monthlyLimit: (sub?.plan === 'pro' || sub?.plan === 'pro_annual') ? Infinity : 100,
      dailyUsage,
    })

    setLoading(false)
  }

  const isPro = subscription.plan === 'pro' || subscription.plan === 'pro_annual'
  const maxDaily = Math.max(...stats.dailyUsage, 1)

  // Calculate streak (consecutive days with usage, counting from today backwards)
  const streak = (() => {
    let count = 0
    const usage = [...stats.dailyUsage].reverse() // most recent first
    for (const day of usage) {
      if (day > 0) count++
      else break
    }
    return count
  })()

  const dayLabels = (() => {
    const labels: string[] = []
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      labels.push(days[d.getDay()])
    }
    return labels
  })()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Olá, {displayName} 👋
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Aqui está o resumo da sua conta VoxAIgo.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="text-zinc-500 hover:text-white disabled:opacity-50 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
          title="Atualizar dados"
        >
          <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Projection + Streak + Plan badge */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Time Projection — FIRST, biggest number focus */}
        {(() => {
          const min = Math.round(stats.totalTranscriptions * 0.5)
          const daysActive = stats.dailyUsage.filter(d => d > 0).length || 1
          const avgPerDay = min / daysActive
          const monthMinutes = Math.round(avgPerDay * 30)
          const yearMinutes = Math.round(avgPerDay * 365)
          const yearHours = (yearMinutes / 60).toFixed(1)
          const yearWorkDays = (yearMinutes / 480).toFixed(1) // 8h work day
          const bigNumber = parseFloat(yearHours)
          const monthDisplay = monthMinutes >= 60 ? (monthMinutes / 60).toFixed(1) : monthMinutes.toString()
          const monthUnit = monthMinutes >= 60 ? 'h' : 'min'

          // Growth bars: day → week → month → year (normalized to year)
          const dayVal = avgPerDay
          const weekVal = avgPerDay * 7
          const monthVal = avgPerDay * 30
          const yearVal = avgPerDay * 365
          const barMax = yearVal || 1
          const growthBars = [
            { label: 'Dia', value: dayVal, pct: Math.max((dayVal / barMax) * 100, 4) },
            { label: 'Sem', value: weekVal, pct: Math.max((weekVal / barMax) * 100, 6) },
            { label: 'Mês', value: monthVal, pct: Math.max((monthVal / barMax) * 100, 10) },
            { label: 'Ano', value: yearVal, pct: 100 },
          ]

          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="relative overflow-hidden bg-gradient-to-br from-emerald-600/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-6"
            >
              {/* Glow */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/8 rounded-full blur-[50px] pointer-events-none" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-400">Sua projeção</span>
                </div>

                {min <= 0 ? (
                  <p className="text-sm text-zinc-500">Use o VoxAIgo para ver sua projeção</p>
                ) : (
                  <>
                    {/* Big hero number: hours + days */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <CountUp
                          value={bigNumber}
                          className="text-4xl font-black bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent leading-none"
                        />
                        <span className="text-lg font-bold text-emerald-400/70">h</span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">
                        livres em 1 ano <span className="text-zinc-400 font-medium">= {yearWorkDays} dias de trabalho</span>
                      </p>
                    </div>

                    {/* Ascending growth mini-chart */}
                    <div className="flex items-end gap-1.5 h-12 mb-3">
                      {growthBars.map((bar, i) => (
                        <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${bar.pct}%` }}
                            transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                            className="w-full rounded-t-sm"
                            style={{
                              background: `linear-gradient(to top, rgba(16,185,129,${0.2 + i * 0.15}), rgba(20,184,166,${0.1 + i * 0.12}))`,
                              minHeight: '2px',
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1.5">
                      {growthBars.map((bar) => (
                        <span key={bar.label} className="flex-1 text-center text-[9px] text-zinc-600">{bar.label}</span>
                      ))}
                    </div>

                    {/* Secondary stats */}
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-zinc-800/40 text-[11px]">
                      <span className="text-zinc-500">{Math.round(avgPerDay)} min/dia</span>
                      <span className="text-zinc-700">·</span>
                      <span className="text-emerald-400/80 font-medium">{monthDisplay}{monthUnit}/mês</span>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )
        })()}

        {/* Streak / Continuity */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-gradient-to-br from-orange-600/10 to-amber-500/5 border border-orange-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔥</span>
            <span className="text-sm font-medium text-orange-400">Sequência</span>
          </div>
          <div className="flex items-baseline gap-2">
            <CountUp value={streak} className="text-4xl font-bold text-white" />
            <span className="text-lg text-zinc-400">{streak === 1 ? 'dia' : 'dias'}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            {streak >= 7
              ? 'Incrível! Você está no ritmo!'
              : streak >= 3
                ? 'Boa sequência! Continue assim!'
                : streak > 0
                  ? 'Use todo dia para manter a sequência'
                  : 'Use o VoxAIgo hoje para começar'}
          </p>

          {/* Week dots */}
          <div className="flex gap-2 mt-4">
            {dayLabels.map((label, i) => {
              const hasUsage = stats.dailyUsage[i] > 0
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.05, type: 'spring', stiffness: 300 }}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      hasUsage
                        ? 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/30'
                        : 'bg-zinc-800/60 text-zinc-600'
                    }`}
                  >
                    {hasUsage ? '✓' : '·'}
                  </motion.div>
                  <span className={`text-[9px] ${hasUsage ? 'text-zinc-400' : 'text-zinc-700'}`}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Plan badge */}
        {!isPro ? (
          <Link
            href="/dashboard/billing"
            className="bg-gradient-to-br from-purple-600/10 to-purple-500/5 border border-purple-500/20 rounded-2xl p-6 flex flex-col justify-between group hover:border-purple-500/40 transition-colors"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Crown size={18} className="text-purple-400" />
                <span className="text-sm font-medium text-purple-400">Seu plano</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">Free</p>
              <p className="text-xs text-zinc-400">{stats.monthlyUsage} de 100 transcrições usadas</p>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((stats.monthlyUsage / 100) * 100, 100)}%` }}
                  transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(to right, #8b5cf6, #6366f1)' }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-purple-400 group-hover:text-purple-300">
              <span className="text-sm font-medium">Fazer upgrade para Pro</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ) : (
          <div className="bg-gradient-to-br from-purple-600/10 to-purple-500/5 border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Crown size={18} className="text-purple-400" />
              <span className="text-sm font-medium text-purple-400">Seu plano</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">Pro</p>
            <p className="text-xs text-emerald-400">Transcrições ilimitadas</p>
          </div>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-purple-600/15 rounded-lg flex items-center justify-center">
              <Mic size={16} className="text-purple-400" />
            </div>
            <span className="text-xs text-zinc-500">Total</span>
          </div>
          <CountUp value={stats.totalTranscriptions} className="text-2xl font-bold text-white" />
          <p className="text-xs text-zinc-500 mt-1">transcrições</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-600/15 rounded-lg flex items-center justify-center">
              <TrendingUp size={16} className="text-blue-400" />
            </div>
            <span className="text-xs text-zinc-500">Este mês</span>
          </div>
          <CountUp value={stats.monthlyUsage} className="text-2xl font-bold text-white" />
          <p className="text-xs text-zinc-500 mt-1">
            {isPro ? 'ilimitado' : `de ${stats.monthlyLimit}`}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-emerald-600/15 rounded-lg flex items-center justify-center">
              <Clock size={16} className="text-emerald-400" />
            </div>
            <span className="text-xs text-zinc-500">Tempo economizado</span>
          </div>
          <CountUp value={Math.round(stats.totalTranscriptions * 0.5)} suffix="min" className="text-2xl font-bold text-white" />
          <p className="text-xs text-zinc-500 mt-1">estimativa</p>
        </motion.div>
      </div>

      {/* Usage chart (last 7 days) */}
      <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-medium text-zinc-400">Uso nos últimos 7 dias</h3>
          <span className="text-xs text-zinc-600">
            {stats.dailyUsage.reduce((a, b) => a + b, 0)} transcrições
          </span>
        </div>

        {/* Y-axis labels + bars */}
        <div className="flex gap-3">
          {/* Y-axis */}
          <div className="flex flex-col justify-between h-40 text-[10px] text-zinc-600 py-1">
            <span>{maxDaily}</span>
            <span>{Math.round(maxDaily / 2)}</span>
            <span>0</span>
          </div>

          {/* Bars */}
          <div className="flex-1 flex items-end gap-3 h-40 border-b border-zinc-800/60 relative">
            {/* Horizontal grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="border-t border-zinc-800/40 border-dashed" />
              <div className="border-t border-zinc-800/40 border-dashed" />
              <div />
            </div>

            {stats.dailyUsage.map((count, i) => {
              const barHeight = count > 0 ? Math.max((count / maxDaily) * 100, 6) : 3
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 relative z-10">
                  {/* Count label */}
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
                    className="text-[11px] font-medium text-zinc-400"
                  >
                    {count > 0 ? count : ''}
                  </motion.span>

                  {/* Animated bar */}
                  <div className="w-full flex justify-center" style={{ height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: `${barHeight}%`, opacity: 1 }}
                      transition={{
                        delay: 0.1 + i * 0.08,
                        duration: 0.6,
                        ease: [0.34, 1.56, 0.64, 1],
                      }}
                      className="w-full max-w-[40px] rounded-t-lg relative overflow-hidden"
                      style={{
                        background: count > 0
                          ? 'linear-gradient(to top, rgb(147 51 234 / 0.7), rgb(139 92 246 / 0.35))'
                          : 'rgb(63 63 70 / 0.2)',
                      }}
                    >
                      {/* Shine effect */}
                      {count > 0 && (
                        <motion.div
                          initial={{ x: '-100%' }}
                          animate={{ x: '200%' }}
                          transition={{ delay: 0.8 + i * 0.08, duration: 0.6 }}
                          className="absolute inset-0 w-1/2"
                          style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                          }}
                        />
                      )}
                    </motion.div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Day labels */}
        <div className="flex gap-3 mt-2">
          <div className="w-6" /> {/* Spacer for y-axis */}
          <div className="flex-1 flex gap-3">
            {dayLabels.map((label, i) => (
              <div key={i} className="flex-1 text-center">
                <span className={`text-[11px] ${
                  stats.dailyUsage[i] > 0 ? 'text-zinc-400 font-medium' : 'text-zinc-600'
                }`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Download section */}
      <div id="download" className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Baixar VoxAIgo para Mac</h3>
        <p className="text-sm text-zinc-400 mb-4">
          Instale o app no seu Mac para usar os atalhos globais de voz. macOS 13 (Ventura) ou superior.
        </p>
        <a
          href="/compra"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 px-6 rounded-xl transition-colors"
        >
          <Download size={18} />
          Download macOS (v3.0.0)
        </a>
        <p className="text-xs text-zinc-600 mt-3">
          Windows em breve — entre na lista de espera nas Configurações.
        </p>
      </div>

      {/* Usage bar (free users) */}
      {!isPro && (
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-400">Uso mensal</span>
            <span className="text-sm text-zinc-400">{stats.monthlyUsage} / {stats.monthlyLimit}</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((stats.monthlyUsage / stats.monthlyLimit) * 100, 100)}%` }}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{
                background: stats.monthlyUsage > 80
                  ? 'linear-gradient(to right, #ef4444, #f97316)'
                  : 'linear-gradient(to right, #8b5cf6, #6366f1)',
              }}
            />
          </div>
          {stats.monthlyUsage >= 80 && (
            <p className="text-xs text-orange-400 mt-2">
              Você está chegando no limite. <Link href="/dashboard/billing" className="underline">Faça upgrade</Link> para ilimitado.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// Animated count-up component (supports decimals)
function CountUp({ value, suffix, className }: { value: number; suffix?: string; className?: string }) {
  const [display, setDisplay] = useState('0')
  const decimals = value % 1 !== 0 ? (value.toString().split('.')[1]?.length || 1) : 0

  useEffect(() => {
    if (value === 0) return
    const duration = 800
    const steps = 30
    const increment = value / steps
    let step = 0

    const timer = setInterval(() => {
      step++
      const current = Math.min(increment * step, value)
      setDisplay(decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString())
      if (step >= steps) clearInterval(timer)
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value, decimals])

  return <p className={className}>{display}{suffix || ''}</p>
}


'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Mic, Clock, TrendingUp, Download, Crown, ArrowRight, RefreshCw, Globe, Terminal, Mail, MessageSquare, Palette, FileText, Trophy, Zap, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface UsageStats {
  totalTranscriptions: number
  monthlyUsage: number
  monthlyLimit: number
  dailyUsage: number[]
  modeDistribution: Record<string, number>
  languageDistribution: Record<string, number>
  totalWords: number
  totalOutputChars: number
  avgAudioSeconds: number
  peakHour: number
  dailyRecord: number
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
    monthlyLimit: 75,
    dailyUsage: [],
    modeDistribution: {},
    languageDistribution: {},
    totalWords: 0,
    totalOutputChars: 0,
    avgAudioSeconds: 0,
    peakHour: -1,
    dailyRecord: 0,
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
      if (sub.plan === 'pro_monthly' || sub.plan === 'pro_annual') {
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

    // Fetch all usage_log rows for rich stats (paginate since Supabase caps at 1000)
    let logs: Array<{ mode: string; language: string; output_length: number; audio_duration_seconds: number; created_at: string }> = []
    let offset = 0
    const PAGE_SIZE = 1000
    while (true) {
      const { data: page } = await supabase
        .from('usage_log')
        .select('mode, language, output_length, audio_duration_seconds, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .range(offset, offset + PAGE_SIZE - 1)
      if (!page || page.length === 0) break
      logs = logs.concat(page)
      if (page.length < PAGE_SIZE) break
      offset += PAGE_SIZE
    }

    // Daily usage for last 30 days
    const CHART_DAYS = 30
    const dailyUsage: number[] = []
    for (let i = CHART_DAYS - 1; i >= 0; i--) {
      const day = new Date()
      day.setDate(day.getDate() - i)
      const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime()
      const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1).getTime()
      const count = logs.filter(l => {
        const t = new Date(l.created_at).getTime()
        return t >= dayStart && t < dayEnd
      }).length
      dailyUsage.push(count)
    }

    // Mode distribution
    const modeDistribution: Record<string, number> = {}
    logs.forEach(l => {
      if (l.mode) modeDistribution[l.mode] = (modeDistribution[l.mode] || 0) + 1
    })

    // Language distribution
    const languageDistribution: Record<string, number> = {}
    logs.forEach(l => {
      if (l.language) languageDistribution[l.language] = (languageDistribution[l.language] || 0) + 1
    })

    // Total output chars + estimated words
    const totalOutputChars = logs.reduce((sum, l) => sum + (l.output_length || 0), 0)
    const totalWords = Math.round(totalOutputChars / 5)

    // Average audio duration
    const audioLogs = logs.filter(l => l.audio_duration_seconds && l.audio_duration_seconds > 0)
    const avgAudioSeconds = audioLogs.length > 0
      ? audioLogs.reduce((sum, l) => sum + l.audio_duration_seconds, 0) / audioLogs.length
      : 0

    // Peak hour (most active hour of day)
    const hourCounts: Record<number, number> = {}
    logs.forEach(l => {
      const h = new Date(l.created_at).getHours()
      hourCounts[h] = (hourCounts[h] || 0) + 1
    })
    const peakHour = Object.keys(hourCounts).length > 0
      ? Number(Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0][0])
      : -1

    // Daily record (max transcriptions in a single day)
    const dayCounts: Record<string, number> = {}
    logs.forEach(l => {
      const d = new Date(l.created_at).toISOString().slice(0, 10)
      dayCounts[d] = (dayCounts[d] || 0) + 1
    })
    const dailyRecord = Object.values(dayCounts).length > 0
      ? Math.max(...Object.values(dayCounts))
      : 0

    setStats({
      totalTranscriptions: totalCount || 0,
      monthlyUsage: monthlyCount || 0,
      monthlyLimit: (sub?.plan === 'pro_monthly' || sub?.plan === 'pro_annual') ? Infinity : 75,
      dailyUsage,
      modeDistribution,
      languageDistribution,
      totalWords,
      totalOutputChars,
      avgAudioSeconds,
      peakHour,
      dailyRecord,
    })

    setLoading(false)
  }

  const isPro = subscription.plan === 'pro_monthly' || subscription.plan === 'pro_annual'
  const maxDaily = Math.max(...stats.dailyUsage, 1)

  // Calculate streak (consecutive days with usage, counting from today backwards)
  // Uses the full dailyUsage array (30 days) for accurate long streaks
  const streak = (() => {
    let count = 0
    const usage = [...stats.dailyUsage].reverse() // most recent first
    for (const day of usage) {
      if (day > 0) count++
      else break
    }
    return count
  })()

  const CHART_DAYS = 30

  const dayLabels = (() => {
    const labels: string[] = []
    for (let i = CHART_DAYS - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      labels.push(`${d.getDate()}/${d.getMonth() + 1}`)
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
          const min = Math.round(stats.totalTranscriptions * 1.5)
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
            {streak >= 30
              ? 'Impressionante! Você é um mestre!'
              : streak >= 14
                ? 'Incrível! Você está no ritmo!'
                : streak >= 7
                  ? 'Boa sequência! Continue assim!'
                  : streak > 0
                    ? 'Use todo dia para manter a sequência'
                    : 'Use o VoxAIgo hoje para começar'}
          </p>

          {/* Last 7 days dots */}
          <div className="flex gap-2 mt-4">
            {(() => {
              const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
              const last7 = stats.dailyUsage.slice(-7)
              return last7.map((usage, i) => {
                const d = new Date()
                d.setDate(d.getDate() - (6 - i))
                const label = weekDays[d.getDay()]
                const hasUsage = usage > 0
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.05, type: 'spring', stiffness: 300 }}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${hasUsage
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
              })
            })()}
          </div>
        </motion.div>

        {/* Plan badge */}
        {!isPro ? (
          (() => {
            const limitReached = stats.monthlyUsage >= 75
            return (
              <Link
                href="/dashboard/billing"
                className={`rounded-2xl p-6 flex flex-col justify-between group transition-colors ${
                  limitReached
                    ? 'bg-gradient-to-br from-red-600/10 to-red-500/5 border border-red-500/30 hover:border-red-500/50'
                    : 'bg-gradient-to-br from-purple-600/10 to-purple-500/5 border border-purple-500/20 hover:border-purple-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Crown size={18} className={limitReached ? 'text-red-400' : 'text-purple-400'} />
                    <span className={`text-sm font-medium ${limitReached ? 'text-red-400' : 'text-purple-400'}`}>Seu plano</span>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">Grátis</p>
                  {limitReached ? (
                    <p className="text-xs text-red-400 font-medium">Limite atingido — sem I.A. este mês</p>
                  ) : (
                    <p className="text-xs text-zinc-400">{stats.monthlyUsage} de 75 transcrições usadas</p>
                  )}
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((stats.monthlyUsage / 75) * 100, 100)}%` }}
                      transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: limitReached ? 'linear-gradient(to right, #ef4444, #dc2626)' : 'linear-gradient(to right, #8b5cf6, #6366f1)' }}
                    />
                  </div>
                </div>
                <div className={`flex items-center gap-2 mt-4 group-hover:opacity-80 ${limitReached ? 'text-red-400' : 'text-purple-400 group-hover:text-purple-300'}`}>
                  <span className="text-sm font-medium">{limitReached ? 'Fazer upgrade — desbloquear I.A.' : 'Fazer upgrade para Pro'}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })()
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
          <CountUp value={Math.round(stats.totalTranscriptions * 1.5)} suffix="min" className="text-2xl font-bold text-white" />
          <p className="text-xs text-zinc-500 mt-1">estimativa</p>
        </motion.div>
      </div>

      {/* Usage chart (last 30 days) — Cumulative line chart */}
      {(() => {
        // Build cumulative data (grows upward)
        const cumulative = stats.dailyUsage.reduce<number[]>((acc, val) => {
          acc.push((acc.length > 0 ? acc[acc.length - 1] : 0) + val)
          return acc
        }, [])
        const cMax = Math.max(...cumulative, 1)
        const totalPeriod = stats.dailyUsage.reduce((a, b) => a + b, 0)
        const numDays = stats.dailyUsage.length

        // SVG dimensions
        const W = 700
        const H = 180
        const padX = 0
        const padTop = 10
        const padBottom = 4

        // Build points for smooth curve
        const points = cumulative.map((val, i) => ({
          x: padX + (i / (numDays - 1)) * (W - padX * 2),
          y: padTop + (1 - val / cMax) * (H - padTop - padBottom),
        }))

        // Catmull-Rom to cubic bezier for smooth wave
        function smoothPath(pts: { x: number; y: number }[]) {
          if (pts.length < 2) return ''
          let d = `M ${pts[0].x} ${pts[0].y}`
          for (let i = 0; i < pts.length - 1; i++) {
            const p0 = pts[Math.max(i - 1, 0)]
            const p1 = pts[i]
            const p2 = pts[i + 1]
            const p3 = pts[Math.min(i + 2, pts.length - 1)]
            const cp1x = p1.x + (p2.x - p0.x) / 6
            const cp1y = p1.y + (p2.y - p0.y) / 6
            const cp2x = p2.x - (p3.x - p1.x) / 6
            const cp2y = p2.y - (p3.y - p1.y) / 6
            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
          }
          return d
        }

        const linePath = smoothPath(points)
        const areaPath = `${linePath} L ${points[points.length - 1].x} ${H} L ${points[0].x} ${H} Z`

        // Show labels every 5 days for readability
        const labelInterval = 5

        return (
          <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-zinc-400">Crescimento — últimos 30 dias</h3>
              <span className="text-xs text-zinc-600">
                +{totalPeriod} transcrições
              </span>
            </div>

            <div className="relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-zinc-600 pointer-events-none" style={{ height: H }}>
                <span>{cMax}</span>
                <span>{Math.round(cMax / 2)}</span>
                <span>0</span>
              </div>

              <div className="ml-8">
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  className="w-full overflow-visible"
                  style={{ height: H }}
                  preserveAspectRatio="none"
                >
                  {/* Horizontal grid lines */}
                  <line x1="0" y1={padTop} x2={W} y2={padTop} stroke="rgb(63 63 70 / 0.3)" strokeDasharray="4 4" />
                  <line x1="0" y1={padTop + (H - padTop - padBottom) / 2} x2={W} y2={padTop + (H - padTop - padBottom) / 2} stroke="rgb(63 63 70 / 0.3)" strokeDasharray="4 4" />

                  {/* Gradient fill under curve */}
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(147 51 234)" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="rgb(147 51 234)" stopOpacity="0.02" />
                    </linearGradient>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="rgb(168 85 247)" />
                      <stop offset="100%" stopColor="rgb(217 70 239)" />
                    </linearGradient>
                  </defs>

                  {/* Area fill */}
                  <motion.path
                    d={areaPath}
                    fill="url(#areaGrad)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  />

                  {/* Line */}
                  <motion.path
                    d={linePath}
                    fill="none"
                    stroke="url(#lineGrad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 1.5, ease: 'easeOut' }}
                    style={{ vectorEffect: 'non-scaling-stroke' }}
                  />

                  {/* Data points — show dots at key intervals and on last point */}
                  {points.map((pt, i) => {
                    const isLabelPoint = i === 0 || i === numDays - 1 || i % labelInterval === 0
                    if (!isLabelPoint) return null
                    return (
                      <g key={i}>
                        <motion.circle
                          cx={pt.x}
                          cy={pt.y}
                          r="6"
                          fill="rgb(147 51 234 / 0.2)"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.4 + i * 0.03, duration: 0.4 }}
                        />
                        <motion.circle
                          cx={pt.x}
                          cy={pt.y}
                          r="3"
                          fill="#a855f7"
                          stroke="#18181b"
                          strokeWidth="2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4 + i * 0.03, type: 'spring', stiffness: 300 }}
                        />
                        {/* Cumulative total label on last point */}
                        {i === numDays - 1 && (
                          <motion.text
                            x={pt.x}
                            y={pt.y - 12}
                            textAnchor="end"
                            className="text-[11px] font-bold"
                            fill="#a855f7"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5, duration: 0.5 }}
                          >
                            {cumulative[i]}
                          </motion.text>
                        )}
                      </g>
                    )
                  })}
                </svg>

                {/* Day labels — show every 5 days + first + last */}
                <div className="flex justify-between mt-2">
                  {dayLabels.map((label, i) => {
                    const show = i === 0 || i === numDays - 1 || i % labelInterval === 0
                    return (
                      <span
                        key={i}
                        className="text-[10px] text-zinc-600"
                        style={{
                          width: `${100 / numDays}%`,
                          textAlign: 'center',
                          visibility: show ? 'visible' : 'hidden',
                        }}
                      >
                        {label}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Mode distribution + Language distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mode distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} className="text-purple-400" />
            <h3 className="text-sm font-medium text-zinc-400">Modos mais usados</h3>
          </div>
          {Object.keys(stats.modeDistribution).length === 0 ? (
            <p className="text-sm text-zinc-600">Nenhum dado ainda</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats.modeDistribution)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([mode, count]) => {
                  const maxCount = Math.max(...Object.values(stats.modeDistribution))
                  const pct = (count / maxCount) * 100
                  const modeConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
                    vibe_coder: { label: 'Vibe Coder', color: 'bg-fuchsia-500', icon: <Zap size={12} className="text-fuchsia-400" /> },
                    text: { label: 'Texto', color: 'bg-blue-500', icon: <FileText size={12} className="text-blue-400" /> },
                    email: { label: 'Email', color: 'bg-amber-500', icon: <Mail size={12} className="text-amber-400" /> },
                    code: { label: 'Código', color: 'bg-purple-500', icon: <Terminal size={12} className="text-purple-400" /> },
                    chat: { label: 'Chat', color: 'bg-green-500', icon: <MessageSquare size={12} className="text-green-400" /> },
                    ux_design: { label: 'UX Design', color: 'bg-rose-500', icon: <Palette size={12} className="text-rose-400" /> },
                    formal: { label: 'Formal', color: 'bg-indigo-500', icon: <FileText size={12} className="text-indigo-400" /> },
                    social: { label: 'Social', color: 'bg-pink-500', icon: <MessageSquare size={12} className="text-pink-400" /> },
                    x: { label: 'X / Tweet', color: 'bg-zinc-400', icon: <Terminal size={12} className="text-zinc-300" /> },
                    summary: { label: 'Resumo', color: 'bg-cyan-500', icon: <FileText size={12} className="text-cyan-400" /> },
                    topics: { label: 'Tópicos', color: 'bg-teal-500', icon: <BarChart3 size={12} className="text-teal-400" /> },
                    meeting: { label: 'Reunião', color: 'bg-orange-500', icon: <Globe size={12} className="text-orange-400" /> },
                    translation: { label: 'Tradução', color: 'bg-sky-500', icon: <Globe size={12} className="text-sky-400" /> },
                    creative: { label: 'Criativo', color: 'bg-violet-500', icon: <Zap size={12} className="text-violet-400" /> },
                    custom: { label: 'Meu Modo', color: 'bg-lime-500', icon: <Mic size={12} className="text-lime-400" /> },
                  }
                  const cfg = modeConfig[mode] || { label: mode, color: 'bg-zinc-500', icon: <Mic size={12} className="text-zinc-400" /> }
                  return (
                    <div key={mode}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {cfg.icon}
                          <span className="text-xs text-zinc-300">{cfg.label}</span>
                        </div>
                        <span className="text-xs text-zinc-500">{count}</span>
                      </div>
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.6, duration: 0.6, ease: 'easeOut' }}
                          className={`h-full rounded-full ${cfg.color}`}
                          style={{ opacity: 0.7 }}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </motion.div>

        {/* Language distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-5 flex flex-col h-full max-h-[360px]"
        >
          <div className="flex items-center gap-2 mb-4 shrink-0">
            <div className="w-8 h-8 bg-blue-600/15 rounded-lg flex items-center justify-center">
              <Globe size={16} className="text-blue-400" />
            </div>
            <h3 className="text-sm font-medium text-zinc-300">Idiomas utilizados</h3>
          </div>
          {Object.keys(stats.languageDistribution).length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-zinc-600">Nenhum dado ainda</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              {(() => {
                // Keys = SpeechLanguage.rawValue ('pt', 'en', etc.). Values = display name with flag.
                const langNames: Record<string, string> = {
                  'pt': '🇧🇷 Português',
                  'pt-BR': '🇧🇷 Português (BR)',
                  'en': '🇺🇸 Inglês',
                  'es': '🇪🇸 Espanhol',
                  'fr': '🇫🇷 Francês',
                  'de': '🇩🇪 Alemão',
                  'it': '🇮🇹 Italiano',
                  'nl': '🇳🇱 Holandês',
                  'ru': '🇷🇺 Russo',
                  'ja': '🇯🇵 Japonês',
                  'ko': '🇰🇷 Coreano',
                  'zh': '🇨🇳 Chinês',
                  'ar': '🇸🇦 Árabe',
                  'hi': '🇮🇳 Hindi',
                  'tr': '🇹🇷 Turco',
                  'pl': '🇵🇱 Polonês',
                  'sv': '🇸🇪 Sueco',
                  'no': '🇳🇴 Norueguês',
                  'da': '🇩🇰 Dinamarquês',
                  'fi': '🇫🇮 Finlandês',
                  'cs': '🇨🇿 Tcheco',
                  'el': '🇬🇷 Grego',
                  'he': '🇮🇱 Hebraico',
                  'th': '🇹🇭 Tailandês',
                  'vi': '🇻🇳 Vietnamita',
                  'id': '🇮🇩 Indonésio',
                  'ms': '🇲🇾 Malaio',
                  'uk': '🇺🇦 Ucraniano',
                  'ro': '🇷🇴 Romeno',
                  'hu': '🇭🇺 Húngaro',
                  'ca': '🏴 Catalão'
                }
                const maxCount = Math.max(...Object.values(stats.languageDistribution))
                const colors = [
                  { bg: 'bg-blue-500/10', border: 'border-blue-500/20', bar: 'bg-blue-500' },
                  { bg: 'bg-purple-500/10', border: 'border-purple-500/20', bar: 'bg-purple-500' },
                  { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', bar: 'bg-emerald-500' },
                  { bg: 'bg-amber-500/10', border: 'border-amber-500/20', bar: 'bg-amber-500' },
                  { bg: 'bg-rose-500/10', border: 'border-rose-500/20', bar: 'bg-rose-500' },
                ]

                return Object.entries(stats.languageDistribution)
                  .sort((a, b) => b[1] - a[1])
                  .map(([lang, count], index) => {
                    const pct = (count / maxCount) * 100
                    const rawName = langNames[lang] || `🌐 ${lang.toUpperCase()}`
                    const parts = rawName.split(' ')
                    const displayFlag = parts[0]
                    const displayName = parts.slice(1).join(' ') || lang.toUpperCase()
                    const c = colors[index % colors.length]

                    return (
                      <div key={lang} className="group">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${c.bg} ${c.border} border rounded-xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-zinc-800`}>
                            <span className="text-xl leading-none">{displayFlag}</span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-sm font-medium text-zinc-200 truncate">{displayName}</span>
                              <span className="text-xs font-semibold text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-md border border-zinc-700/50">{count}</span>
                            </div>
                            <div className="h-1.5 bg-zinc-800/80 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ delay: 0.6 + index * 0.05, duration: 0.8, ease: 'easeOut' }}
                                className={`h-full rounded-full ${c.bar}`}
                                style={{ opacity: 0.9 }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
              })()}
            </div>
          )}
        </motion.div>
      </div>

      {/* Extra stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Words generated */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} className="text-cyan-400" />
            <span className="text-xs text-zinc-500">Palavras geradas</span>
          </div>
          <CountUp
            value={stats.totalWords}
            className="text-xl font-bold text-white"
          />
          <p className="text-[10px] text-zinc-600 mt-1">
            ~{(stats.totalOutputChars / 1000).toFixed(1)}k caracteres
          </p>
        </motion.div>

        {/* Avg audio duration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Mic size={14} className="text-pink-400" />
            <span className="text-xs text-zinc-500">Tempo médio</span>
          </div>
          <p className="text-xl font-bold text-white">
            {stats.avgAudioSeconds > 0 ? `${Math.round(stats.avgAudioSeconds)}s` : '—'}
          </p>
          <p className="text-[10px] text-zinc-600 mt-1">por transcrição</p>
        </motion.div>

        {/* Peak hour */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-amber-400" />
            <span className="text-xs text-zinc-500">Horário de pico</span>
          </div>
          <p className="text-xl font-bold text-white">
            {stats.peakHour >= 0 ? `${String(stats.peakHour).padStart(2, '0')}:00` : '—'}
          </p>
          <p className="text-[10px] text-zinc-600 mt-1">
            {stats.peakHour >= 0
              ? stats.peakHour < 12 ? 'manhã' : stats.peakHour < 18 ? 'tarde' : 'noite'
              : 'sem dados'}
          </p>
        </motion.div>

        {/* Daily record */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={14} className="text-yellow-400" />
            <span className="text-xs text-zinc-500">Recorde diário</span>
          </div>
          <CountUp
            value={stats.dailyRecord}
            className="text-xl font-bold text-white"
          />
          <p className="text-[10px] text-zinc-600 mt-1">transcrições em 1 dia</p>
        </motion.div>
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
                background: stats.monthlyUsage >= 75
                  ? 'linear-gradient(to right, #ef4444, #dc2626)'
                  : stats.monthlyUsage >= 60
                  ? 'linear-gradient(to right, #f97316, #fb923c)'
                  : 'linear-gradient(to right, #8b5cf6, #6366f1)',
              }}
            />
          </div>
          {stats.monthlyUsage >= 75 ? (
            <p className="text-xs text-red-400 mt-2">
              Limite atingido. <Link href="/dashboard/billing" className="underline">Faça upgrade</Link> para I.A. ilimitada.
            </p>
          ) : stats.monthlyUsage >= 60 && (
            <p className="text-xs text-orange-400 mt-2">
              Quase no limite. <Link href="/dashboard/billing" className="underline">Faça upgrade</Link> para ilimitado.
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


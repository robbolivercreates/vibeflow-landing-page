'use client'

import { Suspense, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Mail, CheckCircle } from 'lucide-react'

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-vox-gold border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}

type AuthView = 'signin' | 'signup' | 'reset'

function LoginContent() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const authError = searchParams.get('error')

  const [view, setView] = useState<AuthView>('signin')
  const [authMethod, setAuthMethod] = useState<'password' | 'magiclink'>('password')

  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  // State
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(
    authError === 'auth' ? 'Erro na autenticação. Tente novamente.' : null
  )
  const [message, setMessage] = useState<string | null>(null)

  function switchView(newView: AuthView) {
    setView(newView)
    setError(null)
    setMessage(null)
  }

  // ── Google OAuth ──
  async function handleGoogleAuth() {
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) setError(error.message)
  }

  // ── Sign In (password) ──
  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Email ou senha incorretos.'
        : error.message)
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  // ── Magic Link ──
  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
    } else {
      setMessage('Link mágico enviado! Verifique seu email.')
    }
    setLoading(false)
  }

  // ── Sign Up ──
  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: `${firstName} ${lastName}`.trim(),
          first_name: firstName,
          last_name: lastName,
        },
      },
    })
    if (error) {
      setError(error.message)
    } else {
      setMessage('Verifique seu email para confirmar a conta.')
    }
    setLoading(false)
  }

  // ── Reset Password ──
  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/settings`,
    })
    if (error) {
      setError(error.message)
    } else {
      setMessage('Link de redefinição enviado! Verifique seu email.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-vox-gold/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-vox-gold flex items-center justify-center">
              <span className="text-black font-bold text-sm">V</span>
            </div>
            <span className="text-white font-bold text-xl">VoxAIgo</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-zinc-950/80 border border-white/[0.08] rounded-2xl p-8 backdrop-blur-sm shadow-2xl">

          {/* ═══════════════ SIGN IN ═══════════════ */}
          {view === 'signin' && (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white">Bem-vindo de volta</h1>
                <p className="text-zinc-400 text-sm mt-1">Entre na sua conta para continuar</p>
              </div>

              {/* Google */}
              <button
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-3 bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/[0.08] text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                <GoogleIcon />
                Entrar com Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-white/[0.08]" />
                <span className="text-zinc-500 text-xs">ou continue com e-mail</span>
                <div className="flex-1 h-px bg-white/[0.08]" />
              </div>

              {/* Password / Magic Link tabs */}
              <div className="flex bg-zinc-800/50 rounded-lg p-1 mb-5">
                <button
                  onClick={() => setAuthMethod('password')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${authMethod === 'password'
                    ? 'bg-vox-gold text-black shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-300'
                    }`}
                >
                  Senha
                </button>
                <button
                  onClick={() => setAuthMethod('magiclink')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${authMethod === 'magiclink'
                    ? 'bg-vox-gold text-black shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-300'
                    }`}
                >
                  Magic Link
                </button>
              </div>

              {authMethod === 'password' ? (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-zinc-300 text-sm font-medium mb-1.5">E-mail</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="voce@exemplo.com"
                      className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-vox-gold/50 focus:ring-1 focus:ring-vox-gold/20 transition-all"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-zinc-300 text-sm font-medium">Senha</label>
                      <button
                        type="button"
                        onClick={() => switchView('reset')}
                        className="text-vox-gold hover:text-vox-gold-light text-sm transition-colors"
                      >
                        Esqueceu a senha?
                      </button>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="Digite sua senha"
                      className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-vox-gold/50 focus:ring-1 focus:ring-vox-gold/20 transition-all"
                    />
                  </div>

                  <StatusMessages error={error} message={message} />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-vox-gold hover:bg-vox-gold-light disabled:opacity-50 text-black font-semibold py-3 px-4 rounded-xl transition-colors"
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <div>
                    <label className="block text-zinc-300 text-sm font-medium mb-1.5">E-mail</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="voce@exemplo.com"
                      className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-vox-gold/50 focus:ring-1 focus:ring-vox-gold/20 transition-all"
                    />
                  </div>

                  <StatusMessages error={error} message={message} />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-vox-gold hover:bg-vox-gold-light disabled:opacity-50 text-black font-semibold py-3 px-4 rounded-xl transition-colors"
                  >
                    {loading ? 'Enviando...' : (
                      <>
                        <Mail className="w-4 h-4" />
                        Enviar Magic Link
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Switch to Sign Up */}
              <p className="text-center text-zinc-400 text-sm mt-5">
                Não tem uma conta?{' '}
                <button onClick={() => switchView('signup')} className="text-vox-gold hover:text-vox-gold-light font-medium transition-colors">
                  Criar conta
                </button>
              </p>
            </>
          )}

          {/* ═══════════════ SIGN UP ═══════════════ */}
          {view === 'signup' && (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white">Crie sua conta</h1>
                <p className="text-zinc-400 text-sm mt-1">Comece a ditar 5x mais rápido</p>
              </div>

              {/* Google */}
              <button
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-3 bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/[0.08] text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                <GoogleIcon />
                Criar conta com Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-white/[0.08]" />
                <span className="text-zinc-500 text-xs">ou continue com e-mail</span>
                <div className="flex-1 h-px bg-white/[0.08]" />
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                {/* Name row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 text-sm font-medium mb-1.5">Nome</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="João"
                      className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-vox-gold/50 focus:ring-1 focus:ring-vox-gold/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 text-sm font-medium mb-1.5">Sobrenome</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Silva"
                      className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-vox-gold/50 focus:ring-1 focus:ring-vox-gold/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 text-sm font-medium mb-1.5">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="voce@exemplo.com"
                    className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-vox-gold/50 focus:ring-1 focus:ring-vox-gold/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 text-sm font-medium mb-1.5">Senha</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-vox-gold/50 focus:ring-1 focus:ring-vox-gold/20 transition-all"
                  />
                </div>

                <StatusMessages error={error} message={message} />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-vox-gold hover:bg-vox-gold-light disabled:opacity-50 text-black font-semibold py-3 px-4 rounded-xl transition-colors"
                >
                  {loading ? 'Criando...' : 'Criar Conta'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              {/* Switch to Sign In */}
              <p className="text-center text-zinc-400 text-sm mt-5">
                Já tem uma conta?{' '}
                <button onClick={() => switchView('signin')} className="text-vox-gold hover:text-vox-gold-light font-medium transition-colors">
                  Entrar
                </button>
              </p>
            </>
          )}

          {/* ═══════════════ RESET PASSWORD ═══════════════ */}
          {view === 'reset' && (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white">Redefinir sua senha</h1>
                <p className="text-zinc-400 text-sm mt-1">Informe seu e-mail para receber um link de redefinição</p>
              </div>

              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-zinc-300 text-sm font-medium mb-1.5">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="voce@exemplo.com"
                    className="w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-vox-gold/50 focus:ring-1 focus:ring-vox-gold/20 transition-all"
                  />
                </div>

                <StatusMessages error={error} message={message} />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-vox-gold hover:bg-vox-gold-light disabled:opacity-50 text-black font-semibold py-3 px-4 rounded-xl transition-colors"
                >
                  {loading ? 'Enviando...' : 'Enviar Link de Redefinição'}
                </button>
              </form>

              {/* Switch to Sign In */}
              <p className="text-center text-zinc-400 text-sm mt-5">
                Lembrou a senha?{' '}
                <button onClick={() => switchView('signin')} className="text-vox-gold hover:text-vox-gold-light font-medium transition-colors">
                  Entrar
                </button>
              </p>
            </>
          )}
        </div>

        {/* Back to home */}
        <p className="text-center mt-6">
          <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            ← Voltar ao site
          </Link>
        </p>
      </div>
    </div>
  )
}

// ── Shared Components ──

function StatusMessages({ error, message }: { error: string | null; message: string | null }) {
  return (
    <>
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}
      {message && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-green-400 text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          {message}
        </div>
      )}
    </>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { User, Lock, Check } from 'lucide-react'

type Tab = 'profile' | 'password'

export default function SettingsPage() {
  const supabase = createClient()
  const [tab, setTab] = useState<Tab>('profile')

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [provider, setProvider] = useState('')

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Password
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setEmail(user.email || '')
    setFullName(user.user_metadata?.full_name || '')
    setAvatarUrl(user.user_metadata?.avatar_url || null)
    setProvider(user.app_metadata?.provider || 'email')
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)

    await supabase.auth.updateUser({
      data: { full_name: fullName },
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSaved(false)

    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem.')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setPasswordSaving(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setPasswordError(error.message)
    } else {
      setPasswordSaved(true)
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordSaved(false), 3000)
    }
    setPasswordSaving(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
        <p className="text-zinc-400 text-sm mt-1">Gerencie seu perfil e segurança.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'profile' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <User size={16} />
          Perfil
        </button>
        <button
          onClick={() => setTab('password')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'password' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Lock size={16} />
          Senha
        </button>
      </div>

      {/* Profile tab */}
      {tab === 'profile' && (
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-6">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-16 h-16 rounded-full" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-purple-600/30 flex items-center justify-center text-purple-400 text-2xl font-bold">
                {(fullName || email).charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-white font-medium">{fullName || 'Sem nome'}</p>
              <p className="text-zinc-400 text-sm">{email}</p>
              {provider === 'google' && (
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-zinc-800 rounded text-xs text-zinc-400">
                  <svg width="12" height="12" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </span>
              )}
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
            <div>
              <label className="block text-zinc-400 text-sm mb-1">Nome</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-zinc-500 cursor-not-allowed"
              />
              <p className="text-xs text-zinc-600 mt-1">O email não pode ser alterado.</p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium py-2.5 px-5 rounded-xl transition-colors"
            >
              {saved ? (
                <>
                  <Check size={16} />
                  Salvo!
                </>
              ) : saving ? (
                'Salvando...'
              ) : (
                'Salvar alterações'
              )}
            </button>
          </form>
        </div>
      )}

      {/* Password tab */}
      {tab === 'password' && (
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-6">
          {provider === 'google' ? (
            <div className="text-center py-8">
              <Lock size={32} className="text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400">Sua conta usa login com Google.</p>
              <p className="text-zinc-500 text-sm mt-1">A senha é gerenciada pelo Google.</p>
            </div>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <label className="block text-zinc-400 text-sm mb-1">Nova senha</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-1">Confirmar nova senha</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Repita a senha"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {passwordError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {passwordError}
                </div>
              )}
              {passwordSaved && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-green-400 text-sm">
                  Senha alterada com sucesso!
                </div>
              )}

              <button
                type="submit"
                disabled={passwordSaving}
                className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium py-2.5 px-5 rounded-xl transition-colors"
              >
                {passwordSaving ? 'Salvando...' : 'Alterar senha'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

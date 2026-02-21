'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { User } from '@supabase/supabase-js'
import { LayoutDashboard, Settings, CreditCard, Download, LogOut, Menu, X } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Configurações', href: '/dashboard/settings', icon: Settings },
  { label: 'Assinatura', href: '/dashboard/billing', icon: CreditCard },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser(data.user)
      else router.push('/login')
    })
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut({ scope: 'local' })
    router.push('/')
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário'
  const avatarUrl = user?.user_metadata?.avatar_url

  return (
    <div className="min-h-screen bg-black flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-zinc-800/60
        flex flex-col transition-transform lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-zinc-800/60">
          <Image src="/logo.png" alt="VoxAIgo" width={32} height={32} />
          <span className="text-white font-semibold text-lg">VoxAIgo</span>
          <button className="ml-auto lg:hidden text-zinc-400" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-purple-600/15 text-purple-400'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}
                `}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            )
          })}

          <div className="pt-3">
            <Link
              href="/dashboard#download"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors"
            >
              <Download size={18} />
              Baixar App
            </Link>
          </div>
        </nav>

        {/* User + Logout */}
        <div className="border-t border-zinc-800/60 px-3 py-4">
          <div className="flex items-center gap-3 px-3 mb-3">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center text-purple-400 text-sm font-bold">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{displayName}</p>
              <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-zinc-800/60">
          <button onClick={() => setSidebarOpen(true)} className="text-zinc-400 hover:text-white">
            <Menu size={24} />
          </button>
          <Image src="/logo.png" alt="VoxAIgo" width={28} height={28} />
          <span className="text-white font-semibold">VoxAIgo</span>
        </div>

        <div className="p-6 lg:p-8 max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  )
}

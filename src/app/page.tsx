'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Store, DollarSign, Settings, Plus, User, Calendar, ArrowRight, Activity, Bot, AlertTriangle, Menu, X } from 'lucide-react'

interface Restaurant {
  id: string
  name: string
  type: string
  status: string
  tier: string
  agents: Array<{ id: string; status: string }>
}

interface ActivityItem {
  id: string
  type: string
  message: string
  createdAt: string
  restaurant: { name: string }
}

const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/restaurants', label: 'Restaurants', icon: Store },
  { href: '/costs', label: 'Costs', icon: DollarSign },
  { href: '/settings', label: 'Settings', icon: Settings },
]

function Sidebar({ active = '/', mobileOpen, onClose }: { active?: string; mobileOpen?: boolean; onClose?: () => void }) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      <aside className={`fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 p-6 z-50 transition-transform ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-lg font-bold text-gold flex items-center gap-2">
            <Bot size={24} /> Agent Dashboard
          </h1>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white"><X size={20} /></button>
        </div>
        <nav className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                active === href ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}>
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-wider">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
        </div>
        <div className={`p-2 rounded-lg bg-gray-800`}>
          <Icon size={20} className={color} />
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [agentStatuses, setAgentStatuses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [r, a, s] = await Promise.all([
        fetch('/api/restaurants').then(r => r.json()).catch(() => []),
        fetch('/api/activity').then(r => r.json()).catch(() => []),
        fetch('/api/agents/status').then(r => r.json()).catch(() => ({ agents: [] })),
      ])
      setRestaurants(r)
      setActivities(a)
      setAgentStatuses(s.agents || [])
    } catch {} finally { setLoading(false) }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Auto-refresh every 30s
    return () => clearInterval(interval)
  }, [fetchData])

  const totalRestaurants = restaurants.length
  const activeAgents = agentStatuses.filter(a => a.realStatus === 'running').length || restaurants.reduce((sum, r) => sum + r.agents.filter(a => a.status === 'running').length, 0)
  const issues = agentStatuses.filter(a => a.dbStatus === 'active' && a.realStatus === 'offline').length

  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar active="/" mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className="lg:ml-64 p-4 lg:p-8">
        {/* Mobile header */}
        <div className="flex items-center gap-3 mb-6 lg:hidden">
          <button onClick={() => setMobileOpen(true)} className="text-gray-400 hover:text-white"><Menu size={24} /></button>
          <h2 className="text-xl font-bold text-white">Dashboard</h2>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-gray-400 text-sm mt-1">Overview of your restaurant AI agents</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Restaurants" value={String(totalRestaurants)} icon={Store} color="text-gold" />
          <StatCard label="Active Agents" value={String(activeAgents)} icon={Bot} color="text-green-400" />
          <StatCard label="Monthly Cost" value="$0.00" icon={DollarSign} color="text-yellow-400" />
          <StatCard label="Issues" value={String(issues)} icon={AlertTriangle} color="text-red-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity size={16} /> Recent Activity
            </h3>
            {activities.length > 0 ? (
              <div className="space-y-3">
                {activities.slice(0, 8).map((a) => (
                  <div key={a.id} className="flex items-start gap-3 py-2 border-b border-gray-800/50 last:border-0">
                    <div className="mt-0.5">
                      {a.type === 'action' && <ArrowRight size={14} className="text-gold" />}
                      {a.type === 'error' && <AlertTriangle size={14} className="text-red-400" />}
                      {a.type === 'insight' && <Activity size={14} className="text-blue-400" />}
                      {!['action', 'error', 'insight'].includes(a.type) && <Activity size={14} className="text-gray-400" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm truncate">{a.message}</p>
                      <p className="text-gray-500 text-xs">{a.restaurant?.name} — {new Date(a.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-8">No activity yet. Add a restaurant to get started.</p>
            )}
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Bot size={16} /> Agent Status
            </h3>
            {restaurants.length > 0 ? (
              <div className="space-y-3">
                {restaurants.map((r) => {
                  const realStatus = agentStatuses.find(s => s.id === r.id)
                  const isOnline = realStatus?.realStatus === 'running'
                  const hasIssue = realStatus?.dbStatus === 'active' && !isOnline
                  return (
                    <Link key={r.id} href={`/restaurants/${r.id}`}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                      <div>
                        <p className="text-white text-sm font-medium">{r.name}</p>
                        <p className="text-gray-500 text-xs">
                          {r.agents.length} agent{r.agents.length !== 1 ? 's' : ''}
                          {realStatus?.activeSessions ? ` — ${realStatus.activeSessions} active` : ''}
                          {realStatus?.realCost ? ` — $${realStatus.realCost.toFixed(2)}` : ''}
                        </p>
                      </div>
                      <span className={`w-2 h-2 rounded-full ${
                        hasIssue ? 'bg-red-400' : isOnline ? 'bg-green-400' : 'bg-gray-600'
                      }`} />
                    </Link>
                  )
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-8">No agents running.</p>
            )}
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-brown-800 to-brown-900 rounded-xl p-8 border border-brown-700">
          <h3 className="text-xl font-bold text-white mb-2">Get Started</h3>
          <p className="text-gray-300 text-sm mb-4">Add your first restaurant to start running AI agents.</p>
          <Link href="/restaurants"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-gray-900 text-sm font-semibold rounded-lg hover:bg-yellow-500 transition-colors">
            <Plus size={16} /> Add Restaurant
          </Link>
        </div>
      </main>
    </div>
  )
}

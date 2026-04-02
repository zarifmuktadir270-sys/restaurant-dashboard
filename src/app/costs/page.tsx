'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Store, DollarSign, Settings, Bot, Receipt, Menu, X } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/restaurants', label: 'Restaurants', icon: Store },
  { href: '/costs', label: 'Costs', icon: DollarSign },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function CostsPage() {
  const [costs, setCosts] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    fetch('/api/costs').then(r => r.json()).then(setCosts).finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-950">
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 p-6 z-50 transition-transform ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-lg font-bold text-gold flex items-center gap-2"><Bot size={24} /> Agent Dashboard</h1>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-gray-400 hover:text-white"><X size={20} /></button>
        </div>
        <nav className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                href === '/costs' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}><Icon size={18} /> {label}</Link>
          ))}
        </nav>
      </aside>

      <main className="lg:ml-64 p-4 lg:p-8">
        <div className="flex items-center gap-3 mb-6 lg:hidden">
          <button onClick={() => setMobileOpen(true)} className="text-gray-400 hover:text-white"><Menu size={24} /></button>
          <h2 className="text-xl font-bold text-white">Costs</h2>
        </div>

        <h2 className="text-2xl font-bold text-white mb-1 hidden lg:block">Cost Tracking</h2>
        <p className="text-gray-400 text-sm mb-8 hidden lg:block">Monitor API spend across all restaurants</p>

        {loading ? <div className="text-gray-400">Loading...</div> : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <p className="text-gray-400 text-xs uppercase tracking-wider">Total This Month</p>
                <p className="text-2xl font-bold text-gold mt-1">${(costs?.totalCost || 0).toFixed(2)}</p>
              </div>
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <p className="text-gray-400 text-xs uppercase tracking-wider">Restaurants</p>
                <p className="text-2xl font-bold text-white mt-1">{costs?.byRestaurant?.length || 0}</p>
              </div>
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <p className="text-gray-400 text-xs uppercase tracking-wider">API Calls</p>
                <p className="text-2xl font-bold text-white mt-1">{costs?.costCount || 0}</p>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Receipt size={16} /> Cost by Restaurant
              </h3>
              {costs?.byRestaurant?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                        <th className="pb-3">Restaurant</th>
                        <th className="pb-3">Tokens</th>
                        <th className="pb-3 text-right">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {costs.byRestaurant.map((r: any, i: number) => (
                        <tr key={i} className="border-b border-gray-800/50 last:border-0">
                          <td className="py-3 text-white text-sm">{r.name}</td>
                          <td className="py-3 text-gray-400 text-sm">{r.tokens.toLocaleString()}</td>
                          <td className="py-3 text-gold text-right text-sm font-medium">${r.cost.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-8">No costs recorded yet</p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Store, DollarSign, Settings as SettingsIcon, Bot, Key, DollarSign as Budget, FileText, Menu, X } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/restaurants', label: 'Restaurants', icon: Store },
  { href: '/costs', label: 'Costs', icon: DollarSign },
  { href: '/settings', label: 'Settings', icon: SettingsIcon },
]

export default function SettingsPage() {
  const [config, setConfig] = useState({
    defaultModel: 'gpt-4o', openaiKey: '', maxBudgetPerRestaurant: 50, alertThreshold: 80,
  })
  const [mobileOpen, setMobileOpen] = useState(false)

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
                href === '/settings' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}><Icon size={18} /> {label}</Link>
          ))}
        </nav>
      </aside>

      <main className="lg:ml-64 p-4 lg:p-8">
        <div className="flex items-center gap-3 mb-6 lg:hidden">
          <button onClick={() => setMobileOpen(true)} className="text-gray-400 hover:text-white"><Menu size={24} /></button>
          <h2 className="text-xl font-bold text-white">Settings</h2>
        </div>

        <h2 className="text-2xl font-bold text-white mb-1 hidden lg:block">Settings</h2>
        <p className="text-gray-400 text-sm mb-8 hidden lg:block">Configure global settings for all agents</p>

        <div className="max-w-2xl space-y-6">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Key size={16} /> AI Model Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Default Model</label>
                <select value={config.defaultModel} onChange={(e) => setConfig({ ...config, defaultModel: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-gold focus:outline-none">
                  <option value="gpt-4o">GPT-4o (Recommended)</option>
                  <option value="gpt-4o-mini">GPT-4o Mini (Budget)</option>
                  <option value="claude-sonnet-4-5">Claude Sonnet</option>
                  <option value="claude-haiku">Claude Haiku (Budget)</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">OpenAI API Key</label>
                <input type="password" value={config.openaiKey}
                  onChange={(e) => setConfig({ ...config, openaiKey: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-gold focus:outline-none"
                  placeholder="sk-..." />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Budget size={16} /> Budget Controls
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Max Monthly Budget ($)</label>
                <input type="number" value={config.maxBudgetPerRestaurant}
                  onChange={(e) => setConfig({ ...config, maxBudgetPerRestaurant: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-gold focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Alert at % of Budget</label>
                <input type="number" value={config.alertThreshold}
                  onChange={(e) => setConfig({ ...config, alertThreshold: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-gold focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText size={16} /> Shared Agent Templates
            </h3>
            <p className="text-gray-400 text-xs mb-4">Instructions shared across all restaurant agents.</p>
            <div className="space-y-2">
              {['GUARDRAILS.md', 'ANALYST_SKILL.md', 'WRITER_SKILL.md', 'DAILY_ROUTINE.md'].map(file => (
                <div key={file} className="flex items-center justify-between py-2.5 px-4 bg-gray-800 rounded-lg">
                  <span className="text-white text-sm font-mono">{file}</span>
                  <button className="text-gold text-xs hover:underline">Edit</button>
                </div>
              ))}
            </div>
          </div>

          <button className="px-6 py-2.5 bg-gold text-gray-900 text-sm font-semibold rounded-lg hover:bg-yellow-500 transition-colors">
            Save Settings
          </button>
        </div>
      </main>
    </div>
  )
}

'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Page() {
  const [data, setData] = useState<any[]>([])
  useEffect(() => {
    fetch('/api/restaurants').then(r => r.json()).then(d => setData(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <div style={{ width: 240, background: '#111', borderRight: '1px solid #222', padding: 24, position: 'fixed', height: '100%' }}>
          <h2 style={{ color: '#C8A96E', fontSize: 16, fontWeight: 700, marginBottom: 32 }}>Agent Dashboard</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Link href="/" style={{ color: 'white', textDecoration: 'none', padding: '10px 16px', borderRadius: 8, fontSize: 14, background: '#222' }}>Dashboard</Link>
            <Link href="/restaurants" style={{ color: '#888', textDecoration: 'none', padding: '10px 16px', borderRadius: 8, fontSize: 14 }}>Restaurants</Link>
            <Link href="/costs" style={{ color: '#888', textDecoration: 'none', padding: '10px 16px', borderRadius: 8, fontSize: 14 }}>Costs</Link>
            <Link href="/settings" style={{ color: '#888', textDecoration: 'none', padding: '10px 16px', borderRadius: 8, fontSize: 14 }}>Settings</Link>
          </nav>
        </div>
        <div style={{ marginLeft: 240, padding: 32, flex: 1 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Dashboard</h1>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
            {[
              { label: 'Restaurants', value: data.length, color: '#C8A96E' },
              { label: 'Agents', value: data.reduce((s: number, r: any) => s + (r.agents?.length || 0), 0), color: '#22c55e' },
              { label: 'Cost', value: '$0.00', color: '#eab308' },
              { label: 'Issues', value: 0, color: '#ef4444' },
            ].map(s => (
              <div key={s.label} style={{ background: '#111', padding: 20, borderRadius: 12, border: '1px solid #222' }}>
                <p style={{ color: '#666', fontSize: 12, textTransform: 'uppercase' }}>{s.label}</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: s.color, marginTop: 4 }}>{s.value}</p>
              </div>
            ))}
          </div>
          <Link href="/restaurants" style={{ display: 'inline-block', padding: '12px 24px', background: '#C8A96E', color: '#111', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
            + Add Restaurant
          </Link>
        </div>
      </div>
    </div>
  )
}

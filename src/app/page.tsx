'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch('/api/restaurants')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalAgents = data.reduce((s, r) => s + (r.agents?.length || 0), 0);
  const totalSpent = data.reduce((s, r) => s + (r.spent || 0), 0);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', fontFamily: 'system-ui' }}>
      {/* Mobile Header */}
      <div style={{ display: 'none', padding: '12px 16px', background: '#111', borderBottom: '1px solid #222', justifyContent: 'space-between', alignItems: 'center' }} className="mobile-header">
        <h2 style={{ color: '#C8A96E', fontSize: 14, fontWeight: 700 }}>Agent Dashboard</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer' }}>
          {sidebarOpen ? '×' : '☰'}
        </button>
      </div>

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar - Desktop */}
        <div style={{ width: 240, background: '#111', borderRight: '1px solid #222', padding: 24, display: 'flex', flexDirection: 'column' }} className="desktop-sidebar">
          <h2 style={{ color: '#C8A96E', fontSize: 16, fontWeight: 700, marginBottom: 32 }}>Agent Dashboard</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
            <Link href="/" style={{ color: 'white', textDecoration: 'none', padding: '10px 16px', borderRadius: 8, fontSize: 14, background: '#222' }}>Dashboard</Link>
            <Link href="/restaurants" style={{ color: '#888', textDecoration: 'none', padding: '10px 16px', borderRadius: 8, fontSize: 14 }}>Restaurants</Link>
            <Link href="/costs" style={{ color: '#888', textDecoration: 'none', padding: '10px 16px', borderRadius: 8, fontSize: 14 }}>Costs</Link>
            <Link href="/settings" style={{ color: '#888', textDecoration: 'none', padding: '10px 16px', borderRadius: 8, fontSize: 14 }}>Settings</Link>
          </nav>
          
          {/* Settings at bottom */}
          <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid #222' }}>
            <p style={{ color: '#666', fontSize: 11, marginBottom: 8 }}>SYSTEM</p>
            <Link href="/settings" style={{ color: '#666', textDecoration: 'none', fontSize: 12 }}>Configuration</Link>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: 32, minWidth: 0 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Dashboard</h1>
          
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }} className="stats-grid">
            <div style={{ background: '#111', padding: 20, borderRadius: 12, border: '1px solid #222' }}>
              <p style={{ color: '#666', fontSize: 12, textTransform: 'uppercase' }}>Restaurants</p>
              <p style={{ fontSize: 28, fontWeight: 700, color: '#C8A96E', marginTop: 4 }}>{loading ? '...' : data.length}</p>
            </div>
            <div style={{ background: '#111', padding: 20, borderRadius: 12, border: '1px solid #222' }}>
              <p style={{ color: '#666', fontSize: 12, textTransform: 'uppercase' }}>Agents</p>
              <p style={{ fontSize: 28, fontWeight: 700, color: '#22c55e', marginTop: 4 }}>{loading ? '...' : totalAgents}</p>
            </div>
            <div style={{ background: '#111', padding: 20, borderRadius: 12, border: '1px solid #222' }}>
              <p style={{ color: '#666', fontSize: 12, textTransform: 'uppercase' }}>Cost</p>
              <p style={{ fontSize: 28, fontWeight: 700, color: '#eab308', marginTop: 4 }}>${loading ? '...' : totalSpent.toFixed(2)}</p>
            </div>
            <div style={{ background: '#111', padding: 20, borderRadius: 12, border: '1px solid #222' }}>
              <p style={{ color: '#666', fontSize: 12, textTransform: 'uppercase' }}>Issues</p>
              <p style={{ fontSize: 28, fontWeight: 700, color: '#ef4444', marginTop: 4 }}>0</p>
            </div>
          </div>

          <Link href="/restaurants" style={{ display: 'inline-block', padding: '12px 24px', background: '#C8A96E', color: '#111', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
            + Add Restaurant
          </Link>

          {/* Quick Actions */}
          <div style={{ marginTop: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Quick Actions</h3>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/restaurants" style={{ padding: '12px 20px', background: '#111', border: '1px solid #222', borderRadius: 8, color: 'white', textDecoration: 'none', fontSize: 14 }}>Manage Restaurants</Link>
              <Link href="/settings" style={{ padding: '12px 20px', background: '#111', border: '1px solid #222', borderRadius: 8, color: 'white', textDecoration: 'none', fontSize: 14 }}>API Settings</Link>
              <Link href="/costs" style={{ padding: '12px 20px', background: '#111', border: '1px solid #222', borderRadius: 8, color: 'white', textDecoration: 'none', fontSize: 14 }}>View Costs</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-header { display: flex !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 769px) {
          .mobile-header { display: none !important; }
        }
      `}</style>
    </div>
  );
}
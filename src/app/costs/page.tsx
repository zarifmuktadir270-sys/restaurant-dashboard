'use client';
import Link from 'next/link';

export default function Costs() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <div style={{ width: 240, background: '#111', borderRight: '1px solid #222', padding: 24, position: 'fixed', height: '100%' }}>
          <h2 style={{ color: '#C8A96E', fontSize: 16, fontWeight: 700, marginBottom: 32 }}>Agent Dashboard</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Link href="/" style={{ color: '#888', textDecoration: 'none', padding: '10px 16px', borderRadius: 8, fontSize: 14 }}>Dashboard</Link>
            <Link href="/restaurants" style={{ color: '#888', textDecoration: 'none', padding: '10px 16px', borderRadius: 8, fontSize: 14 }}>Restaurants</Link>
            <Link href="/costs" style={{ color: 'white', textDecoration: 'none', padding: '10px 16px', borderRadius: 8, fontSize: 14, background: '#222' }}>Costs</Link>
            <Link href="/settings" style={{ color: '#888', textDecoration: 'none', padding: '10px 16px', borderRadius: 8, fontSize: 14 }}>Settings</Link>
          </nav>
        </div>
        <div style={{ marginLeft: 240, padding: 32, flex: 1 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Cost Tracking</h1>
          <p style={{ color: '#666', marginTop: 8 }}>No costs recorded yet.</p>
        </div>
      </div>
    </div>
  );
}
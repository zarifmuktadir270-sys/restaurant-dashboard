'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('api');
  const [config, setConfig] = useState({
    openaiKey: '',
    anthropicKey: '',
    deepseekKey: '',
    telegramBot: '',
    defaultModel: 'gpt-5.4',
    maxBudget: 500,
  });

  const providers = [
    { id: 'openai', name: 'OpenAI', models: ['GPT-5.4', 'GPT-5.4-nano'] },
    { id: 'anthropic', name: 'Anthropic', models: ['Claude 4 Opus', 'Claude 4 Sonnet'] },
    { id: 'deepseek', name: 'DeepSeek', models: ['DeepSeek R1'] },
    { id: 'google', name: 'Google', models: ['Gemini 2.0 Pro'] },
  ];

  const save = () => {
    alert('Settings saved!');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar */}
        <div style={{ width: 240, background: '#111', borderRight: '1px solid #222', padding: 24, flexShrink: 0 }}>
          <h2 style={{ color: '#C8A96E', fontSize: 16, fontWeight: 700, marginBottom: 32 }}>Agent Dashboard</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Link href="/" style={{ color: '#888', textDecoration: 'none', padding: '10px 16px', borderRadius: 8, fontSize: 14 }}>Dashboard</Link>
            <Link href="/restaurants" style={{ color: '#888', textDecoration: 'none', padding: '10px 16px', borderRadius: 8, fontSize: 14 }}>Restaurants</Link>
            <Link href="/costs" style={{ color: '#888', textDecoration: 'none', padding: '10px 16px', borderRadius: 8, fontSize: 14 }}>Costs</Link>
            <Link href="/settings" style={{ color: 'white', textDecoration: 'none', padding: '10px 16px', borderRadius: 8, fontSize: 14, background: '#222' }}>Settings</Link>
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: 32, overflow: 'auto' }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Settings</h1>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid #222', paddingBottom: 8 }}>
            {['api', 'models', 'channels', 'agents'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ 
                padding: '10px 20px', 
                background: activeTab === tab ? '#222' : 'transparent', 
                border: 'none', 
                borderRadius: 8,
                color: activeTab === tab ? 'white' : '#666', 
                cursor: 'pointer',
                fontSize: 14,
                textTransform: 'capitalize'
              }}>
                {tab === 'api' ? 'API Keys' : tab === 'channels' ? 'Channels' : tab === 'agents' ? 'Agents' : 'Models'}
              </button>
            ))}
          </div>

          {/* API Keys Tab */}
          {activeTab === 'api' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 600 }}>
              <div>
                <label style={{ display: 'block', color: '#888', fontSize: 12, marginBottom: 8 }}>OpenAI API Key</label>
                <input type="password" value={config.openaiKey} onChange={e => setConfig({...config, openaiKey: e.target.value})}
                  placeholder="sk-..." style={{ width: '100%', padding: '12px 16px', background: '#111', border: '1px solid #333', borderRadius: 8, color: 'white', fontSize: 14 }} />
              </div>
              <div>
                <label style={{ display: 'block', color: '#888', fontSize: 12, marginBottom: 8 }}>Anthropic API Key</label>
                <input type="password" value={config.anthropicKey} onChange={e => setConfig({...config, anthropicKey: e.target.value})}
                  placeholder="sk-ant-..." style={{ width: '100%', padding: '12px 16px', background: '#111', border: '1px solid #333', borderRadius: 8, color: 'white', fontSize: 14 }} />
              </div>
              <div>
                <label style={{ display: 'block', color: '#888', fontSize: 12, marginBottom: 8 }}>DeepSeek API Key</label>
                <input type="password" value={config.deepseekKey} onChange={e => setConfig({...config, deepseekKey: e.target.value})}
                  placeholder="sk-..." style={{ width: '100%', padding: '12px 16px', background: '#111', border: '1px solid #333', borderRadius: 8, color: 'white', fontSize: 14 }} />
              </div>
              <button onClick={save} style={{ padding: '12px 24px', background: '#C8A96E', border: 'none', borderRadius: 8, color: '#111', fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' }}>
                Save API Keys
              </button>
            </div>
          )}

          {/* Models Tab */}
          {activeTab === 'models' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Default Model Selection</h3>
              {providers.map(p => (
                <div key={p.id} style={{ background: '#111', padding: 16, borderRadius: 8, border: '1px solid #222' }}>
                  <h4 style={{ color: '#C8A96E', fontSize: 14, marginBottom: 12 }}>{p.name}</h4>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {p.models.map(m => (
                      <button key={m} style={{ 
                        padding: '8px 16px', 
                        background: config.defaultModel === m ? '#C8A96E' : '#222', 
                        border: '1px solid #333',
                        borderRadius: 8, 
                        color: config.defaultModel === m ? '#111' : '#888', 
                        cursor: 'pointer',
                        fontSize: 13,
                      }}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={save} style={{ padding: '12px 24px', background: '#C8A96E', border: 'none', borderRadius: 8, color: '#111', fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start', marginTop: 8 }}>
                Save Model Settings
              </button>
            </div>
          )}

          {/* Channels Tab */}
          {activeTab === 'channels' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600 }}>
              <div style={{ background: '#111', padding: 20, borderRadius: 12, border: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ color: 'white', fontSize: 16, marginBottom: 4 }}>Telegram</h4>
                  <p style={{ color: '#666', fontSize: 13 }}>Connect Telegram bots for restaurant owners</p>
                </div>
                <button style={{ padding: '8px 16px', background: '#22c55e', border: 'none', borderRadius: 8, color: 'white', fontSize: 13, cursor: 'pointer' }}>Configure</button>
              </div>
              <div style={{ background: '#111', padding: 20, borderRadius: 12, border: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ color: 'white', fontSize: 16, marginBottom: 4 }}>WhatsApp</h4>
                  <p style={{ color: '#666', fontSize: 13 }}>Connect WhatsApp Business API</p>
                </div>
                <button style={{ padding: '8px 16px', background: '#222', border: '1px solid #333', borderRadius: 8, color: '#666', fontSize: 13, cursor: 'pointer' }}>Connect</button>
              </div>
              <div style={{ background: '#111', padding: 20, borderRadius: 12, border: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ color: 'white', fontSize: 16, marginBottom: 4 }}>Discord</h4>
                  <p style={{ color: '#666', fontSize: 13 }}>Connect Discord bots</p>
                </div>
                <button style={{ padding: '8px 16px', background: '#222', border: '1px solid #333', borderRadius: 8, color: '#666', fontSize: 13, cursor: 'pointer' }}>Connect</button>
              </div>
            </div>
          )}

          {/* Agents Tab */}
          {activeTab === 'agents' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Global Agent Settings</h3>
              <div style={{ background: '#111', padding: 20, borderRadius: 12, border: '1px solid #222' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ color: 'white' }}>Max Agents per Restaurant</span>
                  <span style={{ color: '#C8A96E' }}>7</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ color: 'white' }}>Default Temperature</span>
                  <span style={{ color: '#C8A96E' }}>0.7</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ color: 'white' }}>Max Tokens</span>
                  <span style={{ color: '#C8A96E' }}>4096</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'white' }}>Auto-Start Agents</span>
                  <span style={{ color: '#22c55e' }}>Enabled</span>
                </div>
              </div>
              <button onClick={save} style={{ padding: '12px 24px', background: '#C8A96E', border: 'none', borderRadius: 8, color: '#111', fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' }}>
                Save Agent Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
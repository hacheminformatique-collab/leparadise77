import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ textAlign: 'center', color: 'white', maxWidth: '700px', width: '100%' }}>
        <div style={{ fontSize: '60px', marginBottom: '16px' }}>✨</div>
        <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#c9a84c', marginBottom: '8px', letterSpacing: '2px' }}>LE PARADISE</h1>
        <p style={{ fontSize: '18px', color: '#aaa', marginBottom: '48px', letterSpacing: '1px' }}>Salle de réception — Nanteuil les Meaux</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/devis')}
            className="btn btn-primary btn-lg"
            style={{ width: '320px', justifyContent: 'center', fontSize: '18px', padding: '18px 32px' }}
          >
            📋 Obtenir un devis
          </button>

          <button
            onClick={() => navigate('/admin')}
            className="btn"
            style={{ width: '320px', justifyContent: 'center', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', fontSize: '14px' }}
          >
            🔐 Espace administrateur
          </button>
        </div>

        <div style={{ marginTop: '60px', fontSize: '13px', color: '#666', lineHeight: '1.8' }}>
          <p>SARL AFM — 5 avenue Fridingen, 77100 Nanteuil les Meaux</p>
          <p>📞 0782281582 — ✉️ contact@leparadise77.fr</p>
        </div>
      </div>
    </div>
  )
}

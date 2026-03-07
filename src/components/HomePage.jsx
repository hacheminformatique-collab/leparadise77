import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSettings } from '../utils/storage'

export default function HomePage() {
  const navigate = useNavigate()
  const settings = getSettings()
  const nomSalle = (settings.nom || 'LE PARADISE').toUpperCase()

  const [showClientInput, setShowClientInput] = useState(false)
  const [devisIdInput, setDevisIdInput] = useState('')
  const [clientError, setClientError] = useState('')
  const [showStaffInput, setShowStaffInput] = useState(false)
  const [staffIdInput, setStaffIdInput] = useState('')
  const [staffError, setStaffError] = useState('')

  function handleEspaceClient() {
    if (!devisIdInput.trim()) {
      setClientError('Veuillez saisir votre numéro de devis.')
      return
    }
    setClientError('')
    navigate(`/espace-client/${devisIdInput.trim()}`)
  }

  function handleEspaceStaff() {
    if (!staffIdInput.trim()) {
      setStaffError('Veuillez saisir votre identifiant staff.')
      return
    }
    setStaffError('')
    navigate(`/espace-staff/${staffIdInput.trim()}`)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ textAlign: 'center', color: 'white', maxWidth: '700px', width: '100%' }}>
        <div style={{ fontSize: '60px', marginBottom: '16px' }}>✨</div>
        <h1 style={{ fontSize: '42px', fontWeight: '800', color: '#c9a84c', marginBottom: '8px', letterSpacing: '3px', textTransform: 'uppercase' }}>{nomSalle}</h1>
        <p style={{ fontSize: '18px', color: '#ddd', marginBottom: '48px', letterSpacing: '1px' }}>Votre expérience commence ici</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/admin')}
            className="btn"
            style={{ width: '320px', justifyContent: 'center', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', fontSize: '16px', padding: '16px 32px' }}
          >
            🔐 Admin
          </button>

          <button
            onClick={() => navigate('/devis')}
            className="btn btn-primary btn-lg"
            style={{ width: '320px', justifyContent: 'center', fontSize: '16px', padding: '16px 32px' }}
          >
            📋 Devis
          </button>

          <button
            onClick={() => setShowClientInput((v) => !v)}
            className="btn"
            style={{ width: '320px', justifyContent: 'center', background: 'rgba(201,168,76,0.2)', color: '#c9a84c', border: '1px solid #c9a84c', fontSize: '16px', padding: '16px 32px' }}
          >
            👤 Espace client
          </button>

          <button
            onClick={() => setShowStaffInput((v) => !v)}
            className="btn"
            style={{ width: '320px', justifyContent: 'center', background: 'rgba(255,255,255,0.07)', color: '#aaa', border: '1px solid rgba(255,255,255,0.2)', fontSize: '16px', padding: '16px 32px' }}
          >
            👷 Espace staff
          </button>
        </div>

        {showClientInput && (
          <div style={{ marginTop: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px', maxWidth: '320px', margin: '24px auto 0' }}>
            <p style={{ color: '#ddd', fontSize: '14px', marginBottom: '10px' }}>Saisissez votre numéro de devis :</p>
            <input
              type="text"
              value={devisIdInput}
              onChange={(e) => setDevisIdInput(e.target.value)}
              placeholder="Ex: DEV-20240101-001"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #c9a84c', background: 'rgba(255,255,255,0.9)', marginBottom: '10px', fontSize: '14px', boxSizing: 'border-box' }}
              onKeyDown={(e) => e.key === 'Enter' && handleEspaceClient()}
            />
            {clientError && <p style={{ color: '#f5a623', fontSize: '13px', marginBottom: '8px' }}>{clientError}</p>}
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={handleEspaceClient}
            >
              Accéder →
            </button>
          </div>
        )}

        {showStaffInput && (
          <div style={{ marginTop: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px', maxWidth: '320px', margin: '24px auto 0' }}>
            <p style={{ color: '#ddd', fontSize: '14px', marginBottom: '10px' }}>Saisissez votre identifiant staff :</p>
            <input
              type="text"
              value={staffIdInput}
              onChange={(e) => setStaffIdInput(e.target.value)}
              placeholder="Identifiant fourni par le manager"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.9)', marginBottom: '10px', fontSize: '14px', boxSizing: 'border-box' }}
              onKeyDown={(e) => e.key === 'Enter' && handleEspaceStaff()}
            />
            {staffError && <p style={{ color: '#f5a623', fontSize: '13px', marginBottom: '8px' }}>{staffError}</p>}
            <button
              className="btn"
              style={{ width: '100%', justifyContent: 'center', background: '#1a1a2e', color: 'white' }}
              onClick={handleEspaceStaff}
            >
              Accéder →
            </button>
          </div>
        )}

        <div style={{ marginTop: '60px', fontSize: '13px', color: '#666', lineHeight: '1.8' }}>
          <p>SARL AFM — 5 avenue Fridingen, 77100 Nanteuil les Meaux</p>
          <p>📞 0782281582 — ✉️ contact@leparadise77.fr</p>
        </div>
      </div>
    </div>
  )
}

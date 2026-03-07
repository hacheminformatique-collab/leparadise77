import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSettings } from '../utils/storage'

export default function HomePage() {
  const navigate = useNavigate()
  const settings = getSettings()
  const nomSalle = settings.nom || 'Le Paradise'

  const [showClientInput, setShowClientInput] = useState(false)
  const [devisIdInput, setDevisIdInput] = useState('')
  const [clientError, setClientError] = useState('')
  const [showStaffInput, setShowStaffInput] = useState(false)
  const [staffIdInput, setStaffIdInput] = useState('')
  const [staffError, setStaffError] = useState('')

  function handleEspaceClient() {
    if (!devisIdInput.trim()) { setClientError('Veuillez saisir votre numéro de devis.'); return }
    setClientError('')
    navigate(`/espace-client/${devisIdInput.trim()}`)
  }

  function handleEspaceStaff() {
    if (!staffIdInput.trim()) { setStaffError('Veuillez saisir votre identifiant staff.'); return }
    setStaffError('')
    navigate(`/espace-staff/${staffIdInput.trim()}`)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #14142a 0%, #1c1c3a 55%, #10101e 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Subtle background pattern */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(184,151,74,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(184,151,74,0.04) 0%, transparent 45%)',
      }} />

      {/* Top horizontal rule */}
      <div style={{ position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)', width: '320px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(184,151,74,0.35)' }} />
        <div style={{ color: 'rgba(184,151,74,0.5)', fontSize: '14px', letterSpacing: '0.3em' }}>✦</div>
        <div style={{ flex: 1, height: '1px', background: 'rgba(184,151,74,0.35)' }} />
      </div>

      <div style={{ textAlign: 'center', color: 'white', maxWidth: '620px', width: '100%', position: 'relative', zIndex: 1 }}>

        {/* Logo / Brand */}
        <p style={{
          fontSize: '11px',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'rgba(184,151,74,0.7)',
          marginBottom: '12px',
          fontFamily: 'var(--font-body)',
          fontWeight: '700',
        }}>
          Salle de réception
        </p>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
          fontWeight: '400',
          color: '#fff',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          lineHeight: 1,
          marginBottom: '8px',
        }}>
          {nomSalle}
        </h1>

        {/* Gold ornament */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', margin: '18px 0 36px' }}>
          <div style={{ width: '60px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(184,151,74,0.8))' }} />
          <div style={{ color: 'var(--gold)', fontSize: '16px', letterSpacing: '0.2em' }}>✦</div>
          <div style={{ width: '60px', height: '1px', background: 'linear-gradient(to left, transparent, rgba(184,151,74,0.8))' }} />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>

          <button onClick={() => navigate('/devis')} className="btn btn-primary btn-lg" style={{ width: '300px', justifyContent: 'center', fontSize: '13px' }}>
            Demander un devis
          </button>

          <button onClick={() => setShowClientInput((v) => !v)} className="btn btn-outline btn-lg" style={{ width: '300px', justifyContent: 'center', fontSize: '13px' }}>
            Espace client
          </button>

          {showClientInput && (
            <div style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(184,151,74,0.3)',
              borderRadius: '12px',
              padding: '22px',
              width: '300px',
              textAlign: 'left',
            }}>
              <p style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '10px', fontWeight: '700' }}>
                N° de devis
              </p>
              <input
                type="text"
                value={devisIdInput}
                onChange={(e) => setDevisIdInput(e.target.value)}
                placeholder="DEV-20240101-001"
                onKeyDown={(e) => e.key === 'Enter' && handleEspaceClient()}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '6px',
                  border: '1.5px solid rgba(184,151,74,0.4)',
                  background: 'rgba(255,255,255,0.08)',
                  color: 'white', fontSize: '14px', marginBottom: '10px',
                  outline: 'none', fontFamily: 'var(--font-body)',
                }}
              />
              {clientError && <p style={{ color: '#f5a623', fontSize: '12px', marginBottom: '8px' }}>{clientError}</p>}
              <button className="btn btn-primary w-100" style={{ justifyContent: 'center', fontSize: '12px' }} onClick={handleEspaceClient}>
                Accéder →
              </button>
            </div>
          )}

          <button onClick={() => setShowStaffInput((v) => !v)} className="btn btn-sm btn-ghost" style={{ width: '300px', justifyContent: 'center', fontSize: '11px', marginTop: '4px' }}>
            Espace staff
          </button>

          {showStaffInput && (
            <div style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              padding: '22px',
              width: '300px',
              textAlign: 'left',
            }}>
              <p style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '10px', fontWeight: '700' }}>
                Identifiant staff
              </p>
              <input
                type="text"
                value={staffIdInput}
                onChange={(e) => setStaffIdInput(e.target.value)}
                placeholder="ID fourni par le manager"
                onKeyDown={(e) => e.key === 'Enter' && handleEspaceStaff()}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '6px',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.06)',
                  color: 'white', fontSize: '14px', marginBottom: '10px',
                  outline: 'none', fontFamily: 'var(--font-body)',
                }}
              />
              {staffError && <p style={{ color: '#f5a623', fontSize: '12px', marginBottom: '8px' }}>{staffError}</p>}
              <button
                className="btn w-100"
                style={{ justifyContent: 'center', fontSize: '12px', background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}
                onClick={handleEspaceStaff}
              >
                Accéder →
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div style={{ marginTop: '60px', padding: '20px 0', borderTop: '1px solid rgba(184,151,74,0.2)' }}>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', lineHeight: '2' }}>
            SARL AFM — 5 avenue Fridingen, 77100 Nanteuil les Meaux<br />
            📞 0782281582 — ✉️ contact@leparadise77.fr
          </p>
        </div>
      </div>

      {/* Admin link — discreet */}
      <button
        onClick={() => navigate('/admin')}
        style={{
          position: 'absolute', bottom: '20px', right: '24px',
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)',
          fontSize: '11px', cursor: 'pointer', letterSpacing: '0.1em',
          fontFamily: 'var(--font-body)',
        }}
      >
        Admin
      </button>
    </div>
  )
}

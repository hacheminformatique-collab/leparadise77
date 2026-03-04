import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSettings, getLoginAttempts, saveLoginAttempts } from '../utils/storage'

export default function AdminLogin() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function isBlocked() {
    const attempts = getLoginAttempts()
    if (attempts.blockedUntil && Date.now() < attempts.blockedUntil) {
      const mins = Math.ceil((attempts.blockedUntil - Date.now()) / 60000)
      return `Trop de tentatives. Réessayez dans ${mins} minute(s).`
    }
    return null
  }

  function handleSubmit(e) {
    e.preventDefault()
    const blocked = isBlocked()
    if (blocked) { setError(blocked); return }

    const settings = getSettings()
    if (pin === settings.pin) {
      saveLoginAttempts({ count: 0, blockedUntil: null })
      navigate('/dashboard')
    } else {
      const attempts = getLoginAttempts()
      const newCount = (attempts.count || 0) + 1
      if (newCount >= 3) {
        saveLoginAttempts({ count: 0, blockedUntil: Date.now() + 10 * 60 * 1000 })
        setError('Trop de tentatives. Compte bloqué 10 minutes.')
      } else {
        saveLoginAttempts({ count: newCount, blockedUntil: null })
        setError(`Code incorrect. ${3 - newCount} tentative(s) restante(s).`)
      }
      setPin('')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="card" style={{ maxWidth: '380px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>🔐</div>
          <h2 style={{ color: '#1a1a2e', fontWeight: '800' }}>Espace Admin</h2>
          <p className="text-muted">LE PARADISE</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Code PIN</label>
            <input
              type="password"
              className="form-control"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              maxLength={10}
              style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '6px' }}
              autoFocus
            />
          </div>

          {error && (
            <div style={{ background: '#fff3f3', border: '1px solid #f5c6cb', borderRadius: '8px', padding: '10px 14px', color: '#721c24', fontSize: '13px', marginBottom: '16px' }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100" style={{ justifyContent: 'center' }}>
            Se connecter
          </button>
        </form>

        <button
          onClick={() => navigate('/')}
          style={{ display: 'block', margin: '16px auto 0', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '13px' }}
        >
          ← Retour à l&apos;accueil
        </button>
      </div>
    </div>
  )
}

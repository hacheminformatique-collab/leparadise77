export default function CartFloat({ data }) {
  const nbPersonnes = data.nbPersonnes || 0
  const prixSalle = data.prixSalle || 0
  const menuTotal = (data.menus || []).reduce((sum, m) => sum + (m.tarif || 0), 0) * nbPersonnes
  const gateauTotal = (data.gateau?.tarif || 0) * nbPersonnes
  const prestationsTotal = (data.prestations || []).reduce((sum, p) => sum + (p.tarif || 0), 0)
  const totalTTC = prixSalle + menuTotal + gateauTotal + prestationsTotal

  if (totalTTC === 0) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: '#1a1a2e',
      color: 'white',
      borderRadius: '16px',
      padding: '16px 24px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      zIndex: 100,
      minWidth: '200px',
    }}>
      <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '4px' }}>🛒 Total estimé</div>
      <div style={{ fontSize: '24px', fontWeight: '800', color: '#c9a84c' }}>
        {totalTTC.toLocaleString('fr-FR')} €
      </div>
      <div style={{ fontSize: '11px', color: '#666' }}>TTC — {nbPersonnes} pers.</div>
    </div>
  )
}

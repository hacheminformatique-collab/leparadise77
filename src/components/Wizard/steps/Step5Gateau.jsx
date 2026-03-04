import { getGateaux } from '../../../utils/storage'

export default function Step5Gateau({ data, onChange, onNext, onBack }) {
  const gateaux = getGateaux()
  const nbPersonnes = data.nbPersonnes || 0

  function handleSelect(gateau) {
    onChange('gateau', gateau)
  }

  return (
    <div>
      <h2 style={{ marginBottom: '8px', color: '#1a1a2e' }}>Pièce montée / Gâteau</h2>
      <p className="text-muted mb-3">Choisissez votre gâteau pour {nbPersonnes} personnes</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {gateaux.map((g) => {
          const isSelected = data.gateau?.id === g.id
          const total = g.tarif * nbPersonnes
          return (
            <div
              key={g.id}
              onClick={() => handleSelect(g)}
              style={{
                border: isSelected ? '2px solid #c9a84c' : '2px solid #e0e0e0',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                background: isSelected ? '#fdf3d9' : 'white',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>🎂</div>
              <div style={{ fontWeight: '600', marginBottom: '8px' }}>{g.nomGateau}</div>
              <div style={{ fontWeight: '800', color: g.tarif > 0 ? '#c9a84c' : '#27ae60', fontSize: '18px' }}>
                {g.tarif > 0 ? `${g.tarif} €/pers.` : 'Gratuit'}
              </div>
              {g.tarif > 0 && nbPersonnes > 0 && (
                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                  Total : {total.toLocaleString('fr-FR')} €
                </div>
              )}
              {isSelected && <div style={{ color: '#b8860b', fontWeight: '600', fontSize: '13px', marginTop: '10px' }}>✅ Sélectionné</div>}
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="btn btn-outline" onClick={onBack}>← Retour</button>
        <button
          className="btn btn-primary btn-lg"
          onClick={onNext}
          disabled={!data.gateau}
          style={{ opacity: data.gateau ? 1 : 0.5 }}
        >
          Suivant →
        </button>
      </div>
    </div>
  )
}

export default function Step2Event({ data, onChange, onNext, onBack }) {
  const typeOptions = [
    'Mariage', 'Anniversaire', 'Baptême', 'Communion', 'Fiançailles',
    'Séminaire', 'Réunion', 'Anniversaire d\'entreprise', 'Autre'
  ]

  function handleSubmit(e) {
    e.preventDefault()
    if (!data.typeEvenement || !data.dateEvenement || !data.nbPersonnes) return
    onNext()
  }

  return (
    <div>
      <h2 style={{ marginBottom: '8px', color: '#1a1a2e' }}>Votre événement</h2>
      <p className="text-muted mb-3">Dites-nous en plus sur votre événement</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Type d&apos;événement *</label>
          <select className="form-control" value={data.typeEvenement || ''} onChange={(e) => onChange('typeEvenement', e.target.value)} required>
            <option value="">-- Choisir --</option>
            {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Date de l&apos;événement *</label>
          <input
            type="date"
            className="form-control"
            value={data.dateEvenement || ''}
            onChange={(e) => onChange('dateEvenement', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label>Heure de début</label>
            <input type="time" className="form-control" value={data.heureDebut || ''} onChange={(e) => onChange('heureDebut', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Heure de fin</label>
            <input type="time" className="form-control" value={data.heureFin || ''} onChange={(e) => onChange('heureFin', e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label>Nombre de personnes *</label>
          <input
            type="number"
            className="form-control"
            value={data.nbPersonnes || ''}
            onChange={(e) => onChange('nbPersonnes', parseInt(e.target.value) || '')}
            min={1}
            max={500}
            required
          />
        </div>

        <div className="form-group">
          <label>Informations complémentaires</label>
          <textarea
            className="form-control"
            rows={3}
            value={data.commentaire || ''}
            onChange={(e) => onChange('commentaire', e.target.value)}
            placeholder="Précisez vos besoins particuliers..."
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          <button type="button" className="btn btn-outline" onClick={onBack}>← Retour</button>
          <button type="submit" className="btn btn-primary btn-lg">Suivant →</button>
        </div>
      </form>
    </div>
  )
}

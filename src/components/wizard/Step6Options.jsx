export default function Step6Options({ prestations, selected, onToggle, onNext, onBack }) {
  return (
    <div className="wizard-step">
      <h2 className="step-title">Options &amp; Prestations</h2>
      <p className="step-subtitle">Sélection facultative</p>

      <div className="cards-grid">
        {prestations.map((p) => {
          const isSel = selected.some((s) => s.id === p.id);
          return (
            <div
              key={p.id}
              className={`card option-card ${isSel ? "card-selected" : ""}`}
              onClick={() => onToggle(p)}
            >
              <h3 className="card-title">{p.nom}</h3>
              {p.description && <p className="card-desc">{p.description}</p>}
              <div className="card-price">{p.prix.toLocaleString("fr-FR")} €</div>
              {isSel && <div className="card-check">✓</div>}
            </div>
          );
        })}
      </div>

      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onBack}>
          ← Retour
        </button>
        <button className="btn btn-primary" onClick={onNext}>
          Suivant →
        </button>
      </div>
    </div>
  );
}

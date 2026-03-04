import { getSallePrice } from "../../utils/pricing";

export default function Step3Formule({ formules, event, selectedFormule, onSelect, onNext, onBack }) {
  function handleNext() {
    if (!selectedFormule) {
      alert("Veuillez choisir une formule.");
      return;
    }
    onNext();
  }

  return (
    <div className="wizard-step">
      <h2 className="step-title">Choisir votre formule</h2>
      <div className="cards-grid">
        {formules.map((f) => {
          const price = getSallePrice(event.date, f.seche);
          const isSelected = selectedFormule?.id === f.id;
          return (
            <div
              key={f.id}
              className={`card formule-card ${isSelected ? "card-selected" : ""}`}
              onClick={() => onSelect(f)}
            >
              <h3 className="card-title">{f.nom}</h3>
              <p className="card-desc">{f.description}</p>
              <div className="card-price">{price.toLocaleString("fr-FR")} € TTC</div>
              {event.date && (
                <div className="card-detail">
                  {new Date(event.date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              )}
              {isSelected && <div className="card-check">✓</div>}
            </div>
          );
        })}
      </div>
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onBack}>
          ← Retour
        </button>
        <button className="btn btn-primary" onClick={handleNext}>
          Suivant →
        </button>
      </div>
    </div>
  );
}

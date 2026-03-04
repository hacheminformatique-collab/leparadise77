import { useState } from "react";

export default function Step5Gateau({ gateaux, selectedGateau, onSelect, onNext, onBack }) {
  const [showSaveur, setShowSaveur] = useState(false);
  const [pendingGateau, setPendingGateau] = useState(null);
  const [saveur, setSaveur] = useState("");

  function handleCardClick(g) {
    if (g.aucun) {
      onSelect(g, "");
    } else {
      setPendingGateau(g);
      setSaveur(selectedGateau?.id === g.id ? (selectedGateau.saveur || "") : "");
      setShowSaveur(true);
    }
  }

  function confirmSaveur() {
    if (!saveur.trim()) {
      alert("Veuillez indiquer la saveur souhaitée.");
      return;
    }
    onSelect(pendingGateau, saveur);
    setShowSaveur(false);
  }

  return (
    <div className="wizard-step">
      <h2 className="step-title">Choisir votre gâteau</h2>

      <div className="cards-grid">
        {gateaux.map((g) => {
          const isSelected = selectedGateau?.id === g.id;
          return (
            <div
              key={g.id}
              className={`card gateau-card ${isSelected ? "card-selected" : ""} ${g.aucun ? "card-none" : ""}`}
              onClick={() => handleCardClick(g)}
            >
              <h3 className="card-title">{g.nom}</h3>
              {g.description && <p className="card-desc">{g.description}</p>}
              {!g.aucun && (
                <div className="card-price">{g.prix.toLocaleString("fr-FR")} €</div>
              )}
              {isSelected && !g.aucun && selectedGateau?.saveur && (
                <div className="card-detail">Saveur: {selectedGateau.saveur}</div>
              )}
              {isSelected && <div className="card-check">✓</div>}
            </div>
          );
        })}
      </div>

      {showSaveur && (
        <div className="modal-overlay" onClick={() => setShowSaveur(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Quelle saveur souhaitez-vous ?</h3>
            <p className="modal-desc">{pendingGateau?.nom}</p>
            <div className="form-group">
              <input
                value={saveur}
                onChange={(e) => setSaveur(e.target.value)}
                className="input"
                placeholder="Ex: Vanille, Chocolat, Fraise..."
                autoFocus
              />
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setShowSaveur(false)}>
                Annuler
              </button>
              <button className="btn btn-primary" onClick={confirmSaveur}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onBack}>
          ← Retour
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (!selectedGateau) {
              alert("Veuillez sélectionner un gâteau ou l'option sans gâteau.");
              return;
            }
            onNext();
          }}
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}

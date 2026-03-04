export default function Step4Menu({ menu, event, selectedItems, onToggle, onNext, onBack }) {
  const adultes = parseInt(event.adultes) || 0;
  const enfants = parseInt(event.enfants) || 0;

  function getTotal() {
    return selectedItems.reduce((sum, item) => {
      const guests = item.sectionId === "cocktail" ? adultes + enfants : adultes;
      return sum + item.prix * guests;
    }, 0);
  }

  function isSelected(itemId) {
    return selectedItems.some((i) => i.id === itemId);
  }

  return (
    <div className="wizard-step">
      <h2 className="step-title">Menu Traiteur</h2>
      <p className="step-subtitle">
        Adultes: {adultes} | Enfants: {enfants} | Prix par personne
      </p>

      {menu.map((section) => (
        <div key={section.id} className="menu-section">
          <h3 className="section-title">{section.nom}</h3>
          <div className="cards-grid">
            {section.items.map((item) => {
              const guests = section.id === "cocktail" ? adultes + enfants : adultes;
              const total = item.prix * guests;
              const sel = isSelected(item.id);
              return (
                <div
                  key={item.id}
                  className={`card menu-card ${sel ? "card-selected" : ""}`}
                  onClick={() => onToggle({ ...item, sectionId: section.id })}
                >
                  <h4 className="card-title">{item.nom}</h4>
                  <div className="card-price">{item.prix} €/pers</div>
                  <div className="card-detail">
                    Total: {total.toLocaleString("fr-FR")} €
                  </div>
                  {sel && <div className="card-check">✓</div>}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="step-total">
        Sous-total menu : {getTotal().toLocaleString("fr-FR")} € TTC
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

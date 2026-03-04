const EVENT_TYPES = [
  "Mariage",
  "Anniversaire",
  "Baptême",
  "Séminaire",
  "Réception privée",
  "Fiançailles",
  "Communion",
  "Autre",
];

export default function Step2Event({ data, onChange, onNext, onBack }) {
  function handleChange(e) {
    const { name, value } = e.target;
    let v = value;
    if ((name === "adultes" || name === "enfants") && parseInt(v) > 300) v = "300";
    onChange({ ...data, [name]: v });
  }

  function handleNext(e) {
    e.preventDefault();
    if (!data.date) {
      alert("Veuillez sélectionner une date.");
      return;
    }
    if (!data.adultes || parseInt(data.adultes) < 1) {
      alert("Veuillez indiquer le nombre d'adultes.");
      return;
    }
    onNext();
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="wizard-step">
      <h2 className="step-title">Votre événement</h2>
      <form onSubmit={handleNext} className="form-grid">
        <div className="form-group">
          <label>Type d'événement</label>
          <select
            name="type"
            value={data.type || ""}
            onChange={handleChange}
            className="input"
          >
            <option value="">-- Choisir --</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Date de l'événement *</label>
          <input
            name="date"
            type="date"
            value={data.date || ""}
            onChange={handleChange}
            className="input"
            min={today}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Nombre d'adultes * (max 300)</label>
            <input
              name="adultes"
              type="number"
              value={data.adultes || ""}
              onChange={handleChange}
              className="input"
              min={1}
              max={300}
              required
            />
          </div>
          <div className="form-group">
            <label>Nombre d'enfants (max 300)</label>
            <input
              name="enfants"
              type="number"
              value={data.enfants || "0"}
              onChange={handleChange}
              className="input"
              min={0}
              max={300}
            />
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onBack}>
            ← Retour
          </button>
          <button type="submit" className="btn btn-primary">
            Suivant →
          </button>
        </div>
      </form>
    </div>
  );
}

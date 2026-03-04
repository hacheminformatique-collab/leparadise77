export default function Step1Client({ data, onChange, onNext }) {
  const fields = [
    { name: "nom", label: "Nom *", type: "text" },
    { name: "prenom", label: "Prénom *", type: "text" },
    { name: "telephone", label: "Téléphone *", type: "tel" },
    { name: "email", label: "Email *", type: "email" },
  ];

  function handleChange(e) {
    onChange({ ...data, [e.target.name]: e.target.value });
  }

  function handleNext(e) {
    e.preventDefault();
    if (!data.nom || !data.prenom || !data.telephone || !data.email) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    onNext();
  }

  return (
    <div className="wizard-step">
      <h2 className="step-title">Vos coordonnées</h2>
      <form onSubmit={handleNext} className="form-grid">
        {fields.map(({ name, label, type }) => (
          <div key={name} className="form-group">
            <label>{label}</label>
            <input
              name={name}
              type={type}
              value={data[name] || ""}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
        ))}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Suivant →
          </button>
        </div>
      </form>
    </div>
  );
}

import { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function MesInfos() {
  const { businessInfo, setBusinessInfo } = useApp();
  const [form, setForm] = useState({ ...businessInfo });
  const [saved, setSaved] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setBusinessInfo(form);
    setSaved(true);
  }

  return (
    <div className="tab-content">
      <h2 className="tab-title">Mes Informations</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        {[
          { name: "nom", label: "Nom de l'établissement" },
          { name: "societe", label: "Raison sociale" },
          { name: "adresse", label: "Adresse" },
          { name: "codePostal", label: "Code postal" },
          { name: "ville", label: "Ville" },
          { name: "telephone", label: "Téléphone" },
          { name: "email", label: "Email" },
          { name: "siret", label: "SIRET" },
          { name: "rcs", label: "RCS" },
        ].map(({ name, label }) => (
          <div key={name} className="form-group">
            <label>{label}</label>
            <input
              name={name}
              value={form[name] || ""}
              onChange={handleChange}
              className="input"
            />
          </div>
        ))}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Sauvegarder
          </button>
          {saved && <span className="success-msg">✓ Enregistré</span>}
        </div>
      </form>
    </div>
  );
}

import { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function Prestation() {
  const { prestations, setPrestations } = useApp();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nom: "", prix: "", description: "" });

  function startEdit(p) {
    setEditing(p.id);
    setForm({ nom: p.nom, prix: p.prix, description: p.description || "" });
  }

  function startAdd() {
    setEditing("new");
    setForm({ nom: "", prix: "", description: "" });
  }

  function handleSave() {
    if (!form.nom.trim()) return;
    const item = { ...form, prix: parseFloat(form.prix) || 0 };
    if (editing === "new") {
      setPrestations([...prestations, { id: Date.now().toString(), ...item }]);
    } else {
      setPrestations(prestations.map((p) => (p.id === editing ? { ...p, ...item } : p)));
    }
    setEditing(null);
  }

  function handleDelete(id) {
    if (confirm("Supprimer cette prestation ?")) {
      setPrestations(prestations.filter((p) => p.id !== id));
    }
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2 className="tab-title">Prestations</h2>
        <button className="btn btn-primary btn-sm" onClick={startAdd}>
          + Ajouter
        </button>
      </div>

      {editing && (
        <div className="edit-card">
          <h3>{editing === "new" ? "Nouvelle prestation" : "Modifier"}</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Nom</label>
              <input
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                className="input"
              />
            </div>
            <div className="form-group">
              <label>Prix (€)</label>
              <input
                type="number"
                value={form.prix}
                onChange={(e) => setForm({ ...form, prix: e.target.value })}
                className="input"
                min={0}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input"
            />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary btn-sm" onClick={handleSave}>
              Sauvegarder
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="items-list">
        {prestations.map((p) => (
          <div key={p.id} className="item-row">
            <div className="item-info">
              <strong>{p.nom}</strong>
              <span className="item-desc">{p.description}</span>
              <span className="item-price">{p.prix} €</span>
            </div>
            <div className="item-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => startEdit(p)}>
                Modifier
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

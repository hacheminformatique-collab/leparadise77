import { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function FormuleSalle() {
  const { formules, setFormules } = useApp();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nom: "", description: "", seche: false });

  function startEdit(f) {
    setEditing(f.id);
    setForm({ nom: f.nom, description: f.description, seche: f.seche });
  }

  function startAdd() {
    setEditing("new");
    setForm({ nom: "", description: "", seche: false });
  }

  function handleSave() {
    if (!form.nom.trim()) return;
    if (editing === "new") {
      setFormules([
        ...formules,
        { id: Date.now().toString(), ...form },
      ]);
    } else {
      setFormules(
        formules.map((f) =>
          f.id === editing ? { ...f, ...form } : f
        )
      );
    }
    setEditing(null);
  }

  function handleDelete(id) {
    if (confirm("Supprimer cette formule ?")) {
      setFormules(formules.filter((f) => f.id !== id));
    }
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2 className="tab-title">Formules Salle</h2>
        <button className="btn btn-primary btn-sm" onClick={startAdd}>
          + Ajouter
        </button>
      </div>

      {editing && (
        <div className="edit-card">
          <h3>{editing === "new" ? "Nouvelle formule" : "Modifier"}</h3>
          <div className="form-group">
            <label>Nom</label>
            <input
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              className="input"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input"
              rows={2}
            />
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={form.seche}
                onChange={(e) => setForm({ ...form, seche: e.target.checked })}
              />
              {" "}Location sèche (sans traiteur)
            </label>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary btn-sm" onClick={handleSave}>
              Sauvegarder
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setEditing(null)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="items-list">
        {formules.map((f) => (
          <div key={f.id} className="item-row">
            <div className="item-info">
              <strong>{f.nom}</strong>
              <span className="item-desc">{f.description}</span>
              {f.seche && <span className="badge">Sèche</span>}
            </div>
            <div className="item-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => startEdit(f)}>
                Modifier
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(f.id)}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function Gateau() {
  const { gateaux, setGateaux } = useApp();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nom: "", prix: "", description: "", aucun: false });

  function startEdit(g) {
    setEditing(g.id);
    setForm({ nom: g.nom, prix: g.prix, description: g.description || "", aucun: !!g.aucun });
  }

  function startAdd() {
    setEditing("new");
    setForm({ nom: "", prix: "", description: "", aucun: false });
  }

  function handleSave() {
    if (!form.nom.trim()) return;
    const item = { ...form, prix: parseFloat(form.prix) || 0 };
    if (editing === "new") {
      setGateaux([...gateaux, { id: Date.now().toString(), ...item }]);
    } else {
      setGateaux(gateaux.map((g) => (g.id === editing ? { ...g, ...item } : g)));
    }
    setEditing(null);
  }

  function handleDelete(id) {
    if (confirm("Supprimer ce gâteau ?")) {
      setGateaux(gateaux.filter((g) => g.id !== id));
    }
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2 className="tab-title">Gâteaux</h2>
        <button className="btn btn-primary btn-sm" onClick={startAdd}>
          + Ajouter
        </button>
      </div>

      {editing && (
        <div className="edit-card">
          <h3>{editing === "new" ? "Nouveau gâteau" : "Modifier"}</h3>
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
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={form.aucun}
                onChange={(e) => setForm({ ...form, aucun: e.target.checked })}
              />
              {" "}Option "sans gâteau"
            </label>
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
        {gateaux.map((g) => (
          <div key={g.id} className="item-row">
            <div className="item-info">
              <strong>{g.nom}</strong>
              <span className="item-desc">{g.description}</span>
              <span className="item-price">{g.prix > 0 ? `${g.prix} €` : "Gratuit"}</span>
              {g.aucun && <span className="badge">Sans gâteau</span>}
            </div>
            <div className="item-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => startEdit(g)}>
                Modifier
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(g.id)}>
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function MenuTraiteur() {
  const { menu, setMenu } = useApp();
  const [activeSection, setActiveSection] = useState(menu[0]?.id || "");
  const [editingItem, setEditingItem] = useState(null);
  const [itemForm, setItemForm] = useState({ nom: "", prix: "" });
  const [editingSection, setEditingSection] = useState(null);
  const [sectionForm, setSectionForm] = useState("");

  const section = menu.find((s) => s.id === activeSection);

  function saveItem() {
    if (!itemForm.nom.trim() || !itemForm.prix) return;
    setMenu(
      menu.map((s) => {
        if (s.id !== activeSection) return s;
        if (editingItem === "new") {
          return {
            ...s,
            items: [
              ...s.items,
              { id: Date.now().toString(), nom: itemForm.nom, prix: parseFloat(itemForm.prix) },
            ],
          };
        }
        return {
          ...s,
          items: s.items.map((it) =>
            it.id === editingItem
              ? { ...it, nom: itemForm.nom, prix: parseFloat(itemForm.prix) }
              : it
          ),
        };
      })
    );
    setEditingItem(null);
  }

  function deleteItem(itemId) {
    setMenu(
      menu.map((s) =>
        s.id === activeSection
          ? { ...s, items: s.items.filter((it) => it.id !== itemId) }
          : s
      )
    );
  }

  function saveSection() {
    if (!sectionForm.trim()) return;
    if (editingSection === "new") {
      const newS = { id: Date.now().toString(), nom: sectionForm, items: [] };
      setMenu([...menu, newS]);
      setActiveSection(newS.id);
    } else {
      setMenu(menu.map((s) => (s.id === editingSection ? { ...s, nom: sectionForm } : s)));
    }
    setEditingSection(null);
  }

  function deleteSection(id) {
    if (confirm("Supprimer cette section et tous ses éléments ?")) {
      const next = menu.filter((s) => s.id !== id);
      setMenu(next);
      setActiveSection(next[0]?.id || "");
    }
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2 className="tab-title">Menu Traiteur</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            setEditingSection("new");
            setSectionForm("");
          }}
        >
          + Section
        </button>
      </div>

      {editingSection && (
        <div className="edit-card">
          <h3>{editingSection === "new" ? "Nouvelle section" : "Renommer"}</h3>
          <div className="form-group">
            <input
              value={sectionForm}
              onChange={(e) => setSectionForm(e.target.value)}
              className="input"
              placeholder="Nom de la section"
            />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary btn-sm" onClick={saveSection}>
              Sauvegarder
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setEditingSection(null)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="menu-layout">
        <div className="menu-sections">
          {menu.map((s) => (
            <div
              key={s.id}
              className={`section-tab ${s.id === activeSection ? "active" : ""}`}
              onClick={() => setActiveSection(s.id)}
            >
              <span>{s.nom}</span>
              <div className="section-tab-actions">
                <button
                  className="btn-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingSection(s.id);
                    setSectionForm(s.nom);
                  }}
                  title="Renommer"
                >
                  ✏️
                </button>
                <button
                  className="btn-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSection(s.id);
                  }}
                  title="Supprimer"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="menu-items">
          {section && (
            <>
              <div className="tab-header">
                <h3>{section.nom}</h3>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setEditingItem("new");
                    setItemForm({ nom: "", prix: "" });
                  }}
                >
                  + Élément
                </button>
              </div>

              {editingItem && (
                <div className="edit-card">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nom</label>
                      <input
                        value={itemForm.nom}
                        onChange={(e) => setItemForm({ ...itemForm, nom: e.target.value })}
                        className="input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Prix (€/pers)</label>
                      <input
                        type="number"
                        value={itemForm.prix}
                        onChange={(e) => setItemForm({ ...itemForm, prix: e.target.value })}
                        className="input"
                        min={0}
                        step={0.5}
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button className="btn btn-primary btn-sm" onClick={saveItem}>
                      Sauvegarder
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setEditingItem(null)}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              <div className="items-list">
                {section.items.map((it) => (
                  <div key={it.id} className="item-row">
                    <div className="item-info">
                      <strong>{it.nom}</strong>
                      <span className="item-price">{it.prix} €/pers</span>
                    </div>
                    <div className="item-actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                          setEditingItem(it.id);
                          setItemForm({ nom: it.nom, prix: it.prix });
                        }}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteItem(it.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

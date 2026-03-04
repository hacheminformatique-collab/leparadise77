import { getMenus } from '../../../utils/storage'

const SECTION_ORDER = ['Cocktail de bienvenu', 'Entrée', 'Plats', 'Desserts', 'Menu enfants', 'Boissons']

export default function Step4Menu({ data, onChange, onNext, onBack }) {
  const allMenus = getMenus()
  const selected = data.menus || []
  const nbPersonnes = data.nbPersonnes || 0

  const sections = SECTION_ORDER.filter((s) => allMenus.some((m) => m.section === s))

  function isSelected(menuId) {
    return selected.some((m) => m.id === menuId)
  }

  function toggle(menu) {
    if (isSelected(menu.id)) {
      onChange('menus', selected.filter((m) => m.id !== menu.id))
    } else {
      // For sections where only one can be chosen (cocktail, entrée, plat, dessert, menu enfants)
      const singleSections = ['Cocktail de bienvenu', 'Entrée', 'Plats', 'Desserts', 'Menu enfants']
      if (singleSections.includes(menu.section)) {
        const others = selected.filter((m) => m.section !== menu.section)
        onChange('menus', [...others, menu])
      } else {
        // Boissons: multiple allowed
        onChange('menus', [...selected, menu])
      }
    }
  }

  const menuTotal = selected.reduce((sum, m) => sum + (m.tarif || 0), 0) * nbPersonnes

  return (
    <div>
      <h2 style={{ marginBottom: '8px', color: '#1a1a2e' }}>Composition des menus</h2>
      <p className="text-muted mb-3">Choisissez un élément par section ({nbPersonnes} personnes)</p>

      {sections.map((section) => {
        const items = allMenus.filter((m) => m.section === section)
        const multipleAllowed = section === 'Boissons'
        return (
          <div key={section} style={{ marginBottom: '24px' }}>
            <h4 style={{ color: '#1a1a2e', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
              {section} {multipleAllowed ? '(plusieurs possibles)' : '(1 choix)'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              {items.map((item) => {
                const sel = isSelected(item.id)
                return (
                  <div
                    key={item.id}
                    onClick={() => toggle(item)}
                    style={{
                      border: sel ? '2px solid #c9a84c' : '1px solid #ddd',
                      borderRadius: '10px',
                      padding: '16px',
                      cursor: 'pointer',
                      background: sel ? '#fdf3d9' : 'white',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{item.nomMenu}</div>
                    {item.description && <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>{item.description}</div>}
                    <div style={{ fontWeight: '700', color: item.tarif > 0 ? '#c9a84c' : '#27ae60' }}>
                      {item.tarif > 0 ? `${item.tarif} €/pers.` : 'Inclus'}
                    </div>
                    {sel && <div style={{ color: '#b8860b', fontSize: '12px', marginTop: '6px' }}>✅</div>}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {menuTotal > 0 && (
        <div style={{ background: '#fdf3d9', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Total menus ({nbPersonnes} pers.)</span>
            <strong style={{ color: '#c9a84c', fontSize: '20px' }}>{menuTotal.toLocaleString('fr-FR')} € TTC</strong>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
        <button className="btn btn-outline" onClick={onBack}>← Retour</button>
        <button className="btn btn-primary btn-lg" onClick={onNext}>Suivant →</button>
      </div>
    </div>
  )
}

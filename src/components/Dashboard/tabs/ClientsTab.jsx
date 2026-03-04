import { useState } from 'react'
import { getClients, saveClients } from '../../../utils/storage'
import { generatePDF } from '../../PDF/generatePDF'

export default function ClientsTab() {
  const [clients, setClients] = useState(getClients())
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  function handleDelete(id) {
    if (!confirm('Supprimer ce devis ?')) return
    const updated = clients.filter((c) => c.id !== id)
    saveClients(updated)
    setClients(updated)
    if (selected?.id === id) setSelected(null)
  }

  function handleStatusChange(id, status) {
    const updated = clients.map((c) => c.id === id ? { ...c, status } : c)
    saveClients(updated)
    setClients(updated)
    if (selected?.id === id) setSelected({ ...selected, status })
  }

  const filtered = clients.filter((c) =>
    (c.nom || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.prenom || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.devisNumber || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase())
  )

  const statusColor = (s) => {
    if (s === 'signé') return 'badge-green'
    if (s === 'annulé') return 'badge-red'
    return 'badge-gold'
  }

  return (
    <div>
      <div className="flex-between mb-3">
        <h3 style={{ color: '#1a1a2e' }}>Clients & Devis ({clients.length})</h3>
        <input
          className="form-control"
          placeholder="🔍 Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '240px' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 420px' : '1fr', gap: '20px' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>N° Devis</th>
                <th>Client</th>
                <th>Date événement</th>
                <th>Total TTC</th>
                <th>Statut</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(c)}>
                  <td><strong style={{ color: '#c9a84c' }}>{c.devisNumber}</strong></td>
                  <td>{c.prenom} {c.nom}</td>
                  <td>{c.dateEvenement ? new Date(c.dateEvenement).toLocaleDateString('fr-FR') : '—'}</td>
                  <td><strong>{(c.totalTTC || 0).toLocaleString('fr-FR')} €</strong></td>
                  <td>
                    <span className={`badge ${statusColor(c.status)}`}>{c.status || 'en cours'}</span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-sm btn-outline" onClick={() => generatePDF(c)} title="PDF">📄</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)} title="Supprimer">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center text-muted" style={{ padding: '32px' }}>Aucun devis trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className="card" style={{ position: 'sticky', top: '0', alignSelf: 'start', maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="flex-between mb-2">
              <h4 style={{ color: '#1a1a2e' }}>{selected.devisNumber}</h4>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }} onClick={() => setSelected(null)}>✕</button>
            </div>

            <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
              <p><strong>Client :</strong> {selected.prenom} {selected.nom}</p>
              <p><strong>Email :</strong> {selected.email}</p>
              <p><strong>Téléphone :</strong> {selected.telephone}</p>
              <p><strong>Événement :</strong> {selected.typeEvenement}</p>
              <p><strong>Date :</strong> {selected.dateEvenement ? new Date(selected.dateEvenement).toLocaleDateString('fr-FR') : '—'}</p>
              <p><strong>Invités :</strong> {selected.nbPersonnes}</p>
              <p><strong>Formule :</strong> {selected.formule?.nomFormule}</p>
              {selected.menus?.length > 0 && (
                <div>
                  <strong>Menus :</strong>
                  <ul style={{ paddingLeft: '16px' }}>
                    {selected.menus.map((m) => (
                      <li key={m.id}>{m.nomMenu} — {m.tarif > 0 ? `${m.tarif} €/pers.` : 'Inclus'}</li>
                    ))}
                  </ul>
                </div>
              )}
              {selected.gateau && <p><strong>Gâteau :</strong> {selected.gateau.nomGateau}</p>}
              {selected.prestations?.length > 0 && (
                <div>
                  <strong>Prestations :</strong>
                  <ul style={{ paddingLeft: '16px' }}>
                    {selected.prestations.map((p) => (
                      <li key={p.id}>{p.nomPresta} — {p.tarif} €</li>
                    ))}
                  </ul>
                </div>
              )}
              <hr style={{ margin: '12px 0' }} />
              <p><strong>Total TTC :</strong> <span style={{ color: '#c9a84c', fontWeight: '700', fontSize: '18px' }}>{(selected.totalTTC || 0).toLocaleString('fr-FR')} €</span></p>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Statut du devis</label>
              <select
                className="form-control"
                value={selected.status || 'en cours'}
                onChange={(e) => handleStatusChange(selected.id, e.target.value)}
              >
                <option value="en cours">En cours</option>
                <option value="signé">Signé</option>
                <option value="annulé">Annulé</option>
              </select>
            </div>

            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              <button className="btn btn-primary btn-sm w-100" style={{ justifyContent: 'center' }} onClick={() => generatePDF(selected)}>
                📄 Télécharger le devis PDF
              </button>
            </div>

            <div style={{ marginTop: '8px' }}>
              <p style={{ fontSize: '12px', color: '#888' }}>
                Lien espace client :
              </p>
              <input
                className="form-control"
                readOnly
                value={`${window.location.origin}/espace-client/${selected.id}`}
                style={{ fontSize: '11px' }}
                onClick={(e) => e.target.select()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

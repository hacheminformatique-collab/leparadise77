import { useState } from 'react'
import { getClients, saveClients } from '../../../utils/storage'
import { generatePDF } from '../../PDF/generatePDF'

function getDocsKey(devisId) { return `paradise_docs_${devisId}` }
function getDocs(devisId) {
  try { return JSON.parse(localStorage.getItem(getDocsKey(devisId))) || {} } catch { return {} }
}

function formatMoney(n) {
  return Number(n || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €'
}

function Voyant({ ok }) {
  return (
    <span style={{
      display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%',
      background: ok ? '#27ae60' : '#e74c3c', marginRight: '6px', flexShrink: 0,
    }} title={ok ? 'Reçu' : 'Manquant'} />
  )
}

function calcTotal(devis) {
  const nbAdultes = parseInt(devis.nbAdultes) || devis.nbPersonnes || 0
  const nbEnfants = parseInt(devis.nbEnfants) || 0
  const nbP = nbAdultes + nbEnfants
  const prixSalle = devis.prixSalle || 0
  const menuTotal = (devis.menus || []).reduce((s, m) => {
    if (!m.tarif) return s
    if (m.section === 'Cocktail de bienvenu') return s + m.tarif * (nbAdultes + nbEnfants)
    if (m.section === 'Menu enfants') return s + m.tarif * nbEnfants
    if (m.section === 'Boissons') return s
    return s + m.tarif * nbAdultes
  }, 0)
  const gateauTotal = (devis.gateau?.tarif || 0) * nbP
  const prestationsTotal = (devis.prestations || []).reduce((s, p) => s + (p.tarif || 0), 0)
  return prixSalle + menuTotal + gateauTotal + prestationsTotal
}

export default function ClientsTab() {
  const [clients, setClients] = useState(getClients())
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [newPayment, setNewPayment] = useState({ date: new Date().toISOString().split('T')[0], montant: '', mode: 'Virement' })

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
    if (selected?.id === id) setSelected((prev) => ({ ...prev, status }))
  }

  function handleAddPayment() {
    const montant = parseFloat(newPayment.montant)
    if (!montant || montant <= 0) return
    const payment = { ...newPayment, montant }
    const updated = clients.map((c) =>
      c.id === selected.id ? { ...c, payments: [...(c.payments || []), payment] } : c
    )
    saveClients(updated)
    setClients(updated)
    const updatedSelected = updated.find((c) => c.id === selected.id)
    setSelected(updatedSelected)
    setNewPayment({ date: new Date().toISOString().split('T')[0], montant: '', mode: 'Virement' })
  }

  function handleDeletePayment(idx) {
    const updated = clients.map((c) =>
      c.id === selected.id ? { ...c, payments: (c.payments || []).filter((_, i) => i !== idx) } : c
    )
    saveClients(updated)
    setClients(updated)
    const updatedSelected = updated.find((c) => c.id === selected.id)
    setSelected(updatedSelected)
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
          <div className="card" style={{ position: 'sticky', top: '0', alignSelf: 'start', maxHeight: '90vh', overflowY: 'auto' }}>
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
              <p><strong>Total TTC :</strong> <span style={{ color: '#c9a84c', fontWeight: '700', fontSize: '18px' }}>{formatMoney(calcTotal(selected))}</span></p>
            </div>

            {/* Payments section */}
            <div style={{ marginTop: '16px' }}>
              <h5 style={{ color: '#1a1a2e', marginBottom: '10px' }}>💳 Règlements</h5>
              {(selected.payments || []).length === 0 && (
                <p style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>Aucun règlement enregistré</p>
              )}
              {(selected.payments || []).map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid #eee' }}>
                  <span>{new Date(p.date).toLocaleDateString('fr-FR')} — {p.mode}</span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: '#27ae60', fontWeight: '600' }}>{formatMoney(p.montant)}</span>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c', fontSize: '14px' }} onClick={() => handleDeletePayment(i)}>✕</button>
                  </div>
                </div>
              ))}
              {/* Solde */}
              {(() => {
                const total = calcTotal(selected)
                const paid = (selected.payments || []).reduce((s, p) => s + p.montant, 0)
                const solde = total - paid
                return (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontWeight: '700', fontSize: '14px' }}>
                    <span>Solde restant</span>
                    <span style={{ color: solde <= 0 ? '#27ae60' : '#e74c3c' }}>{formatMoney(Math.max(0, solde))}</span>
                  </div>
                )
              })()}
              {/* Add payment form */}
              <div style={{ marginTop: '12px', background: '#f8f5f0', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Ajouter un règlement</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#888' }}>Date</label>
                    <input type="date" className="form-control" value={newPayment.date} onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })} style={{ fontSize: '12px', padding: '6px 10px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#888' }}>Montant (€)</label>
                    <input type="number" className="form-control" value={newPayment.montant} onChange={(e) => setNewPayment({ ...newPayment, montant: e.target.value })} placeholder="0" style={{ fontSize: '12px', padding: '6px 10px' }} />
                  </div>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <label style={{ fontSize: '11px', color: '#888' }}>Mode de paiement</label>
                  <select className="form-control" value={newPayment.mode} onChange={(e) => setNewPayment({ ...newPayment, mode: e.target.value })} style={{ fontSize: '12px', padding: '6px 10px' }}>
                    <option>Virement</option>
                    <option>Chèque</option>
                    <option>Espèces</option>
                    <option>CB</option>
                  </select>
                </div>
                <button className="btn btn-primary btn-sm w-100" style={{ justifyContent: 'center' }} onClick={handleAddPayment}>+ Ajouter</button>
              </div>
            </div>

            {/* Documents status */}
            <div style={{ marginTop: '16px' }}>
              <h5 style={{ color: '#1a1a2e', marginBottom: '10px' }}>📎 Documents client</h5>
              {(() => {
                const docs = getDocs(selected.id)
                return (
                  <div style={{ fontSize: '13px' }}>
                    {[['cni_recto', "CNI recto"], ['cni_verso', "CNI verso"], ['assurance', "Attestation assurance"]].map(([key, label]) => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #eee' }}>
                        <Voyant ok={!!docs[key]} />
                        <span>{label}</span>
                        <span style={{ marginLeft: 'auto', fontSize: '11px', color: docs[key] ? '#27ae60' : '#e74c3c' }}>
                          {docs[key] ? '✅ Reçu' : '⏳ Manquant'}
                        </span>
                      </div>
                    ))}
                  </div>
                )
              })()}
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

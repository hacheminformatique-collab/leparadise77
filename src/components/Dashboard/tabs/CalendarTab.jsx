import { useState } from 'react'
import { getClients, saveClients, getStaff } from '../../../utils/storage'

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

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

function calcBoissonQty(nomBoisson, nbPersonnes) {
  if (nomBoisson === 'Eau de source') return Math.ceil((nbPersonnes / 10) * 2)
  if (nomBoisson === 'Thé et Café') return null
  return Math.ceil((nbPersonnes / 10) * 1.5)
}

function calcBreadOrder(nbPersonnes) {
  const nbPains = Math.ceil(nbPersonnes * 1.5)
  const cout = nbPains * 0.165
  return { nbPains, cout }
}

function formatMoney(n) {
  return Number(n || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €'
}

function EventDetailModal({ ev, allClients, onClose, onUpdate, onDelete }) {
  const staff = getStaff()
  const [assignedStaff, setAssignedStaff] = useState(ev.assignedStaff || [])
  const [saved, setSaved] = useState(false)
  const [editing, setEditing] = useState(false)
  const [newDate, setNewDate] = useState(ev.dateEvenement ? ev.dateEvenement.slice(0, 10) : '')
  const [newStatus, setNewStatus] = useState(ev.status || 'en cours')

  const nbAdultes = parseInt(ev.nbAdultes) || ev.nbPersonnes || 0
  const nbEnfants = parseInt(ev.nbEnfants) || 0
  const nbPersonnes = nbAdultes + nbEnfants
  const total = calcTotal(ev)
  const bread = calcBreadOrder(nbPersonnes)

  const masseSalariale = assignedStaff.reduce((s, sid) => {
    const member = staff.find((st) => st.id === sid)
    return s + (member?.tarifEvenement || 0)
  }, 0)

  function toggleStaff(id) {
    setAssignedStaff((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id])
    setSaved(false)
  }

  function handleSave() {
    const updated = allClients.map((c) =>
      c.id === ev.id ? { ...c, assignedStaff, dateEvenement: newDate || c.dateEvenement, status: newStatus } : c
    )
    saveClients(updated)
    onUpdate(updated)
    setSaved(true)
  }

  function handleDelete() {
    if (!confirm('Supprimer cet événement / devis ?')) return
    const updated = allClients.filter((c) => c.id !== ev.id)
    saveClients(updated)
    onDelete(updated)
    onClose()
  }

  const boissonsMenu = (ev.menus || []).filter((m) => m.section === 'Boissons')

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3 className="modal-title">📅 {ev.typeEvenement} — {ev.prenom} {ev.nom}</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '13px', color: '#888' }}>Date</div>
            {editing ? (
              <input type="date" className="form-control" value={newDate} onChange={(e) => setNewDate(e.target.value)} style={{ fontSize: '13px' }} />
            ) : (
              <div style={{ fontWeight: '600' }}>{ev.dateEvenement ? new Date(ev.dateEvenement).toLocaleDateString('fr-FR') : '—'}</div>
            )}
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#888' }}>Statut</div>
            {editing ? (
              <select className="form-control" value={newStatus} onChange={(e) => setNewStatus(e.target.value)} style={{ fontSize: '13px' }}>
                <option value="en cours">En cours</option>
                <option value="signé">Signé</option>
                <option value="annulé">Annulé</option>
              </select>
            ) : (
              <span style={{ color: ev.status === 'signé' ? '#27ae60' : '#c9a84c', fontWeight: '600' }}>{ev.status || 'en cours'}</span>
            )}
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#888' }}>Convives</div>
            <div style={{ fontWeight: '600' }}>{nbAdultes} adultes{nbEnfants > 0 ? ` + ${nbEnfants} enfants` : ''}</div>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#888' }}>Total TTC</div>
            <div style={{ fontWeight: '700', color: '#c9a84c' }}>{formatMoney(total)}</div>
          </div>
        </div>

        {ev.formule && (
          <div style={{ background: '#f8f5f0', borderRadius: '8px', padding: '10px', marginBottom: '12px', fontSize: '13px' }}>
            <strong>Formule :</strong> {ev.formule.nomFormule}
          </div>
        )}

        <div style={{ background: '#fdf3d9', borderRadius: '8px', padding: '10px', marginBottom: '12px', fontSize: '13px' }}>
          <strong>🥖 Commande pain :</strong> {bread.nbPains} pains ({formatMoney(bread.cout)})
          <div style={{ fontSize: '11px', color: '#888' }}>Calcul : {nbPersonnes} pers. × 1,5 = {bread.nbPains} pains × 0,165€</div>
        </div>

        {boissonsMenu.length > 0 && (
          <div style={{ background: '#e8f4f8', borderRadius: '8px', padding: '10px', marginBottom: '12px', fontSize: '13px' }}>
            <strong>🍾 Boissons :</strong>
            <ul style={{ margin: '6px 0 0 16px' }}>
              {boissonsMenu.map((b) => {
                const qty = calcBoissonQty(b.nomMenu, nbPersonnes)
                return (
                  <li key={b.id}>
                    {b.nomMenu} : {qty !== null ? `${qty} bouteilles` : 'Machine à disposition'}
                    {qty !== null && <span style={{ color: '#888', fontSize: '11px', marginLeft: '6px' }}>({b.nomMenu === 'Eau de source' ? `${nbPersonnes}/10 × 2` : `${nbPersonnes}/10 × 1,5`})</span>}
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        <div style={{ marginBottom: '12px' }}>
          <h5 style={{ marginBottom: '8px', fontSize: '14px' }}>👷 Staff assigné</h5>
          {staff.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#888' }}>Aucun employé. Ajoutez du staff dans l&apos;onglet Staff.</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {staff.map((s) => {
                const isAssigned = assignedStaff.includes(s.id)
                return (
                  <button key={s.id} type="button" onClick={() => toggleStaff(s.id)} style={{
                    padding: '6px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
                    background: isAssigned ? '#1a1a2e' : '#eee',
                    color: isAssigned ? 'white' : '#444',
                    border: isAssigned ? '2px solid #c9a84c' : '2px solid transparent',
                    fontWeight: isAssigned ? '700' : '400',
                  }}>
                    {s.prenom} {s.nom} ({s.poste}) — {s.tarifEvenement || 0}€{isAssigned ? ' ✓' : ''}
                  </button>
                )
              })}
            </div>
          )}
          {assignedStaff.length > 0 && (
            <div style={{ marginTop: '10px', background: '#f8f5f0', borderRadius: '8px', padding: '10px', fontSize: '13px' }}>
              <strong>💰 Masse salariale :</strong> <span style={{ color: '#e74c3c', fontWeight: '700' }}>{formatMoney(masseSalariale)}</span>
              <div style={{ color: '#888', fontSize: '11px', marginTop: '2px' }}>Marge estimée : {formatMoney(total - masseSalariale)}</div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {!editing ? (
            <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>✏️ Modifier</button>
          ) : (
            <button className="btn btn-outline btn-sm" onClick={() => setEditing(false)}>Annuler modif.</button>
          )}
          <button className="btn btn-primary btn-sm" onClick={handleSave}>{saved ? '✅ Sauvegardé' : '💾 Sauvegarder'}</button>
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>🗑️ Supprimer</button>
        </div>
      </div>
    </div>
  )
}

export default function CalendarTab() {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [allClients, setAllClients] = useState(getClients())
  const [dragSource, setDragSource] = useState(null)

  const clients = allClients.filter((c) => c.dateEvenement && c.status !== 'annulé')
  const eventsByDate = {}
  clients.forEach((c) => {
    const key = c.dateEvenement ? c.dateEvenement.slice(0, 10) : null
    if (!key) return
    if (!eventsByDate[key]) eventsByDate[key] = []
    eventsByDate[key].push(c)
  })

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
    else setViewMonth((m) => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
    else setViewMonth((m) => m + 1)
  }

  const firstDay = new Date(viewYear, viewMonth, 1)
  const startDow = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  function toDateKey(year, month, day) {
    const mm = String(month + 1).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    return `${year}-${mm}-${dd}`
  }

  function dateKey(day) { return toDateKey(viewYear, viewMonth, day) }
  function isToday(day) { return today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day }

  function handleDrop(day) {
    if (!dragSource || !day) return
    const newDate = dateKey(day)
    const updated = allClients.map((c) => c.id === dragSource.id ? { ...c, dateEvenement: newDate } : c)
    saveClients(updated)
    setAllClients(updated)
    setDragSource(null)
  }

  function handleUpdate(updated) {
    setAllClients(updated)
    if (selectedEvent) {
      const refreshed = updated.find((c) => c.id === selectedEvent.id)
      if (refreshed) setSelectedEvent(refreshed)
    }
  }

  return (
    <div>
      <h3 style={{ marginBottom: '8px', color: '#1a1a2e' }}>📅 Calendrier des événements</h3>
      <p style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>
        💡 Glissez-déposez un événement pour le reporter. Cliquez pour voir les détails et assigner le staff.
      </p>

      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1a1a2e', padding: '16px 24px' }}>
          <button type="button" onClick={prevMonth} style={{ background: 'none', border: 'none', color: '#c9a84c', cursor: 'pointer', fontSize: '24px', lineHeight: 1 }}>‹</button>
          <span style={{ color: 'white', fontWeight: '700', fontSize: '20px' }}>{MONTHS[viewMonth]} {viewYear}</span>
          <button type="button" onClick={nextMonth} style={{ background: 'none', border: 'none', color: '#c9a84c', cursor: 'pointer', fontSize: '24px', lineHeight: 1 }}>›</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#f8f5f0', borderBottom: '1px solid #eee' }}>
          {DAYS.map((d) => (
            <div key={d} style={{ textAlign: 'center', padding: '10px 0', fontSize: '13px', fontWeight: '700', color: '#888' }}>{d}</div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0 }}>
          {cells.map((day, i) => {
            const key = day ? dateKey(day) : null
            const events = key ? (eventsByDate[key] || []) : []
            const hasEvent = events.length > 0
            const tod = day && isToday(day)
            return (
              <div
                key={i}
                style={{
                  minHeight: '90px', padding: '8px',
                  borderRight: '1px solid #eee', borderBottom: '1px solid #eee',
                  background: hasEvent ? '#fdf3d9' : tod ? '#f0f7ef' : 'white',
                  cursor: day ? 'pointer' : 'default',
                }}
                onDragOver={(e) => { if (day) e.preventDefault() }}
                onDrop={() => handleDrop(day)}
              >
                {day && (
                  <>
                    <div style={{ fontWeight: tod ? '800' : '400', fontSize: '14px', color: tod ? '#27ae60' : hasEvent ? '#b8860b' : '#222', marginBottom: '4px' }}>
                      {day}
                    </div>
                    {events.map((ev, idx) => (
                      <div
                        key={idx}
                        draggable
                        onDragStart={(e) => { e.stopPropagation(); setDragSource(ev) }}
                        onDragEnd={() => setDragSource(null)}
                        onClick={(e) => { e.stopPropagation(); setSelectedEvent(ev) }}
                        style={{
                          background: dragSource?.id === ev.id ? '#b8860b' : '#c9a84c',
                          color: 'white', borderRadius: '4px',
                          padding: '2px 6px', fontSize: '11px', marginBottom: '2px',
                          overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                          cursor: 'grab', userSelect: 'none',
                        }}
                        title="Glisser pour déplacer"
                      >
                        {ev.prenom} {ev.nom} — {ev.typeEvenement}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {selectedEvent && (
        <EventDetailModal
          ev={selectedEvent}
          allClients={allClients}
          onClose={() => setSelectedEvent(null)}
          onUpdate={handleUpdate}
          onDelete={(updated) => setAllClients(updated)}
        />
      )}
    </div>
  )
}

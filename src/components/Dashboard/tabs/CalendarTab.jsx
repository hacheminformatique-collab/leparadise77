import { useState } from 'react'
import { getClients } from '../../../utils/storage'

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export default function CalendarTab() {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedEvent, setSelectedEvent] = useState(null)

  const clients = getClients().filter((c) => c.dateEvenement && c.status !== 'annulé')

  // Build a map: "YYYY-MM-DD" -> [devis, ...]
  const eventsByDate = {}
  clients.forEach((c) => {
    const key = c.dateEvenement?.slice(0, 10)
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

  function dateKey(day) {
    return toDateKey(viewYear, viewMonth, day)
  }

  function isToday(day) {
    return today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day
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

  return (
    <div>
      <h3 style={{ marginBottom: '20px', color: '#1a1a2e' }}>📅 Calendrier des événements</h3>

      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1a1a2e', padding: '16px 24px' }}>
          <button type="button" onClick={prevMonth} style={{ background: 'none', border: 'none', color: '#c9a84c', cursor: 'pointer', fontSize: '24px', lineHeight: 1 }}>‹</button>
          <span style={{ color: 'white', fontWeight: '700', fontSize: '20px' }}>{MONTHS[viewMonth]} {viewYear}</span>
          <button type="button" onClick={nextMonth} style={{ background: 'none', border: 'none', color: '#c9a84c', cursor: 'pointer', fontSize: '24px', lineHeight: 1 }}>›</button>
        </div>

        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#f8f5f0', borderBottom: '1px solid #eee' }}>
          {DAYS.map((d) => (
            <div key={d} style={{ textAlign: 'center', padding: '10px 0', fontSize: '13px', fontWeight: '700', color: '#888' }}>{d}</div>
          ))}
        </div>

        {/* Day cells */}
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
                  minHeight: '90px',
                  padding: '8px',
                  borderRight: '1px solid #eee',
                  borderBottom: '1px solid #eee',
                  background: hasEvent ? '#fdf3d9' : tod ? '#f0f7ef' : 'white',
                  cursor: hasEvent ? 'pointer' : 'default',
                  verticalAlign: 'top',
                }}
                onClick={() => hasEvent && setSelectedEvent({ day, events })}
              >
                {day && (
                  <>
                    <div style={{
                      fontWeight: tod ? '800' : '400',
                      fontSize: '14px',
                      color: tod ? '#27ae60' : hasEvent ? '#b8860b' : '#222',
                      marginBottom: '4px',
                    }}>
                      {day}
                    </div>
                    {events.map((ev, idx) => (
                      <div key={idx} style={{
                        background: '#c9a84c',
                        color: 'white',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        fontSize: '11px',
                        marginBottom: '2px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}>
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

      {/* Event detail panel */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <button className="modal-close" onClick={() => setSelectedEvent(null)}>✕</button>
            <h3 className="modal-title">
              📅 {new Date(`${dateKey(selectedEvent.day)}T00:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
            {selectedEvent.events.map((ev) => {
              const total = calcTotal(ev)
              const nbAdultes = parseInt(ev.nbAdultes) || ev.nbPersonnes || 0
              const nbEnfants = parseInt(ev.nbEnfants) || 0
              return (
                <div key={ev.id} style={{ marginBottom: '20px', padding: '16px', background: '#f8f5f0', borderRadius: '10px', borderLeft: '4px solid #c9a84c' }}>
                  <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '8px', color: '#1a1a2e' }}>
                    {ev.prenom} {ev.nom}
                  </div>
                  <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#555' }}>
                    <div><strong>Événement :</strong> {ev.typeEvenement}</div>
                    <div><strong>Convives :</strong> {nbAdultes} adulte{nbAdultes > 1 ? 's' : ''}{nbEnfants > 0 ? ` + ${nbEnfants} enfant${nbEnfants > 1 ? 's' : ''}` : ''}</div>
                    <div><strong>Formule :</strong> {ev.formule?.nomFormule}</div>
                    {ev.heureDebut && <div><strong>Horaires :</strong> {ev.heureDebut} — {ev.heureFin}</div>}
                    <div><strong>Total TTC :</strong> <span style={{ color: '#c9a84c', fontWeight: '800' }}>{total.toLocaleString('fr-FR')} €</span></div>
                    <div><strong>N° Devis :</strong> {ev.devisNumber}</div>
                    <div><strong>Statut :</strong> <span style={{ color: ev.status === 'signé' ? '#27ae60' : '#c9a84c' }}>{ev.status || 'en cours'}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

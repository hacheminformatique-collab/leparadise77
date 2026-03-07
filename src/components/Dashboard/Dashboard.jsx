import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MesInfosTab from './tabs/MesInfosTab'
import MotDePasseTab from './tabs/MotDePasseTab'
import FormuleSalleTab from './tabs/FormuleSalleTab'
import MenuTab from './tabs/MenuTab'
import GateauTab from './tabs/GateauTab'
import PrestationTab from './tabs/PrestationTab'
import ClientsTab from './tabs/ClientsTab'
import CalendarTab from './tabs/CalendarTab'
import StaffTab from './tabs/StaffTab'
import StockTab from './tabs/StockTab'
import MatieresTab from './tabs/MatieresTab'
import ComptabiliteTab from './tabs/ComptabiliteTab'

const TABS = [
  { id: 'clients',    icon: '👥', label: 'Clients & Devis' },
  { id: 'calendar',   icon: '📅', label: 'Calendrier' },
  { id: 'compta',     icon: '📊', label: 'Comptabilité' },
  { id: 'staff',      icon: '👷', label: 'Staff' },
  { id: 'stock',      icon: '📦', label: 'Stock' },
  { id: 'matieres',   icon: '🥩', label: 'Matières premières' },
  { id: 'formules',   icon: '🏛️', label: 'Formules' },
  { id: 'menus',      icon: '🍽️', label: 'Menus' },
  { id: 'gateaux',    icon: '🎂', label: 'Gâteaux' },
  { id: 'prestations',icon: '🎵', label: 'Prestations' },
  { id: 'infos',      icon: '⚙️', label: 'Mes Infos' },
  { id: 'motdepasse', icon: '🔑', label: 'Code PIN' },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('clients')
  const navigate = useNavigate()

  function renderTab() {
    switch (activeTab) {
      case 'clients':     return <ClientsTab />
      case 'calendar':    return <CalendarTab />
      case 'compta':      return <ComptabiliteTab />
      case 'staff':       return <StaffTab />
      case 'stock':       return <StockTab />
      case 'matieres':    return <MatieresTab />
      case 'formules':    return <FormuleSalleTab />
      case 'menus':       return <MenuTab />
      case 'gateaux':     return <GateauTab />
      case 'prestations': return <PrestationTab />
      case 'infos':       return <MesInfosTab />
      case 'motdepasse':  return <MotDePasseTab />
      default: return null
    }
  }

  const activeTabDef = TABS.find((t) => t.id === activeTab)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header style={{
        background: 'var(--dark)',
        color: 'white',
        padding: '0 32px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        boxShadow: '0 2px 12px rgba(28,28,46,0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Gold ornament */}
          <div style={{ width: '2px', height: '32px', background: 'var(--gold)' }} />
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: '600',
              fontSize: '20px',
              color: 'var(--gold)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              lineHeight: 1.1,
            }}>
              Le Paradise
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Administration
            </div>
          </div>
        </div>

        <button
          onClick={() => { sessionStorage.removeItem('adminAuth'); navigate('/') }}
          className="btn btn-sm btn-ghost"
          style={{ letterSpacing: '0.08em' }}
        >
          Déconnexion
        </button>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <nav style={{
          width: '230px',
          background: 'var(--white)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          overflowY: 'auto',
          padding: '16px 0',
        }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  textAlign: 'left',
                  padding: '11px 20px',
                  border: 'none',
                  cursor: 'pointer',
                  background: isActive ? 'var(--gold-pale)' : 'transparent',
                  color: isActive ? 'var(--gold)' : 'var(--text-light)',
                  fontWeight: isActive ? '700' : '400',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  letterSpacing: isActive ? '0.02em' : '0',
                  borderLeft: isActive ? '3px solid var(--gold)' : '3px solid transparent',
                  transition: 'all 0.15s',
                  borderRadius: '0 6px 6px 0',
                  marginRight: '8px',
                }}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = '#faf8f2'; e.currentTarget.style.color = 'var(--text)' } }}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-light)' } }}
              >
                <span style={{ fontSize: '15px', flexShrink: 0 }}>{tab.icon}</span>
                {tab.label}
              </button>
            )
          })}
        </nav>

        {/* ── Main content ────────────────────────────────────────────────── */}
        <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto', minWidth: 0 }}>
          {/* Page title */}
          <div style={{ marginBottom: '28px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '600', letterSpacing: '0.02em', color: 'var(--dark)' }}>
              {activeTabDef?.icon} {activeTabDef?.label}
            </h2>
          </div>
          {renderTab()}
        </main>
      </div>
    </div>
  )
}

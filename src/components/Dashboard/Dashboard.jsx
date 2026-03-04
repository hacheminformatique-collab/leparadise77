import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MesInfosTab from './tabs/MesInfosTab'
import MotDePasseTab from './tabs/MotDePasseTab'
import FormuleSalleTab from './tabs/FormuleSalleTab'
import MenuTab from './tabs/MenuTab'
import GateauTab from './tabs/GateauTab'
import PrestationTab from './tabs/PrestationTab'
import ClientsTab from './tabs/ClientsTab'

const TABS = [
  { id: 'clients', label: '👥 Clients & Devis' },
  { id: 'formules', label: '🏛️ Formules' },
  { id: 'menus', label: '🍽️ Menus' },
  { id: 'gateaux', label: '🎂 Gâteaux' },
  { id: 'prestations', label: '🎵 Prestations' },
  { id: 'infos', label: '⚙️ Mes Infos' },
  { id: 'motdepasse', label: '🔑 Code PIN' },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('clients')
  const navigate = useNavigate()

  function renderTab() {
    switch (activeTab) {
      case 'clients': return <ClientsTab />
      case 'formules': return <FormuleSalleTab />
      case 'menus': return <MenuTab />
      case 'gateaux': return <GateauTab />
      case 'prestations': return <PrestationTab />
      case 'infos': return <MesInfosTab />
      case 'motdepasse': return <MotDePasseTab />
      default: return null
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f5f0' }}>
      {/* Header */}
      <div style={{ background: '#1a1a2e', color: 'white', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>✨</span>
          <div>
            <div style={{ fontWeight: '800', fontSize: '18px', color: '#c9a84c' }}>LE PARADISE</div>
            <div style={{ fontSize: '12px', color: '#aaa' }}>Administration</div>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="btn"
          style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', fontSize: '13px' }}
        >
          🚪 Déconnexion
        </button>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
        {/* Sidebar */}
        <div style={{ width: '220px', background: 'white', borderRight: '1px solid #eee', padding: '20px 0', flexShrink: 0 }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '12px 20px', border: 'none', cursor: 'pointer',
                background: activeTab === tab.id ? '#fdf3d9' : 'transparent',
                color: activeTab === tab.id ? '#b8860b' : '#444',
                fontWeight: activeTab === tab.id ? '700' : '400',
                borderLeft: activeTab === tab.id ? '3px solid #c9a84c' : '3px solid transparent',
                fontSize: '14px',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {renderTab()}
        </div>
      </div>
    </div>
  )
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './components/HomePage'
import AdminLogin from './components/AdminLogin'
import Dashboard from './components/Dashboard/Dashboard'
import WizardForm from './components/Wizard/WizardForm'
import EspaceClient from './components/EspaceClient/EspaceClient'
import EspaceStaff from './components/EspaceStaff/EspaceStaff'
import { initDefaults } from './utils/storage'

initDefaults()

function ProtectedDashboard() {
  if (!sessionStorage.getItem('adminAuth')) {
    return <Navigate to="/admin" replace />
  }
  return <Dashboard />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/dashboard" element={<ProtectedDashboard />} />
        <Route path="/devis" element={<WizardForm />} />
        <Route path="/espace-client/:devisId" element={<EspaceClient />} />
        <Route path="/espace-staff/:staffId" element={<EspaceStaff />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

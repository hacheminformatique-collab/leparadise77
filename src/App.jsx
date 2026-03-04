import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import AdminLogin from './components/AdminLogin'
import Dashboard from './components/Dashboard/Dashboard'
import WizardForm from './components/Wizard/WizardForm'
import EspaceClient from './components/EspaceClient/EspaceClient'
import { initDefaults } from './utils/storage'

initDefaults()

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/devis" element={<WizardForm />} />
        <Route path="/espace-client/:devisId" element={<EspaceClient />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

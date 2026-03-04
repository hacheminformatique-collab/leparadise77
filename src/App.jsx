import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import DevisWizard from "./pages/DevisWizard";
import ClientSpace from "./pages/ClientSpace";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/devis" element={<DevisWizard />} />
          <Route path="/client" element={<ClientSpace />} />
          <Route path="/client/:devisId" element={<ClientSpace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

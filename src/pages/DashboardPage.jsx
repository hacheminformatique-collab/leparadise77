import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MesInfos from "../components/dashboard/MesInfos";
import MotDePasse from "../components/dashboard/MotDePasse";
import FormuleSalle from "../components/dashboard/FormuleSalle";
import MenuTraiteur from "../components/dashboard/MenuTraiteur";
import Gateau from "../components/dashboard/Gateau";
import Prestation from "../components/dashboard/Prestation";
import Clients from "../components/dashboard/Clients";

const TABS = [
  { id: "infos", label: "MES INFOS" },
  { id: "password", label: "MOT DE PASSE" },
  { id: "formule", label: "FORMULE SALLE" },
  { id: "menu", label: "MENU" },
  { id: "gateau", label: "GÂTEAU" },
  { id: "prestation", label: "PRESTATION" },
  { id: "clients", label: "CLIENTS" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("infos");
  const navigate = useNavigate();

  function renderTab() {
    switch (activeTab) {
      case "infos": return <MesInfos />;
      case "password": return <MotDePasse />;
      case "formule": return <FormuleSalle />;
      case "menu": return <MenuTraiteur />;
      case "gateau": return <Gateau />;
      case "prestation": return <Prestation />;
      case "clients": return <Clients />;
      default: return null;
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <button className="btn btn-ghost btn-sm back-btn" onClick={() => navigate("/")}>
          ← Accueil
        </button>
        <h1 className="dashboard-title">Tableau de bord</h1>
      </div>

      <div className="dashboard-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "tab-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="dashboard-content">{renderTab()}</div>
    </div>
  );
}

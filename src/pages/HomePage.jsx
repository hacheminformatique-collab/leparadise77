import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import PinLogin from "../components/PinLogin";

export default function HomePage() {
  const { businessInfo } = useApp();
  const navigate = useNavigate();
  const [showPin, setShowPin] = useState(false);

  function handleAdminSuccess() {
    setShowPin(false);
    navigate("/dashboard");
  }

  return (
    <div className="home-page">
      <div className="home-content">
        <div className="home-logo-area">
          <h1 className="home-title">
            {(businessInfo?.nom || "LE PARADISE").toUpperCase()}
          </h1>
          <div className="home-divider" />
          <p className="home-subtitle">Votre expérience commence ici</p>
        </div>

        <div className="home-buttons">
          <button
            className="btn btn-primary home-btn"
            onClick={() => setShowPin(true)}
          >
            Administration
          </button>
          <button
            className="btn btn-secondary home-btn"
            onClick={() => navigate("/devis")}
          >
            Créer un devis
          </button>
          <button
            className="btn btn-ghost home-btn"
            onClick={() => navigate("/client")}
          >
            Espace Client
          </button>
        </div>
      </div>

      {showPin && (
        <PinLogin onSuccess={handleAdminSuccess} onClose={() => setShowPin(false)} />
      )}
    </div>
  );
}

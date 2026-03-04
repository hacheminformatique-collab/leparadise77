import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Step1Client from "../components/wizard/Step1Client";
import Step2Event from "../components/wizard/Step2Event";
import Step3Formule from "../components/wizard/Step3Formule";
import Step4Menu from "../components/wizard/Step4Menu";
import Step5Gateau from "../components/wizard/Step5Gateau";
import Step6Options from "../components/wizard/Step6Options";
import Step7Summary from "../components/wizard/Step7Summary";
import CartBar from "../components/wizard/CartBar";
import { getSallePrice, generateDevisNumber } from "../utils/pricing";

const STEP_LABELS = [
  "Coordonnées",
  "Événement",
  "Formule",
  "Menu",
  "Gâteau",
  "Options",
  "Récapitulatif",
];

export default function DevisWizard() {
  const { formules, menu, gateaux, prestations, businessInfo, saveDevis } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [client, setClient] = useState({ nom: "", prenom: "", telephone: "", email: "" });
  const [event, setEvent] = useState({ type: "", date: "", adultes: "", enfants: "0" });
  const [formule, setFormule] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [gateau, setGateau] = useState(null);
  const [gateauSaveur, setGateauSaveur] = useState("");
  const [selectedPrestations, setSelectedPrestations] = useState([]);
  const [devisNumber] = useState(() => generateDevisNumber());

  const isSeche = formule?.seche;
  const adultes = parseInt(event.adultes) || 0;
  const enfants = parseInt(event.enfants) || 0;

  const sallePrice = formule ? getSallePrice(event.date, isSeche) : 0;
  const menuTotal = menuItems.reduce((sum, item) => {
    const guests = item.sectionId === "cocktail" ? adultes + enfants : adultes;
    return sum + item.prix * guests;
  }, 0);

  const cart = {
    salle: sallePrice,
    menuItems,
    menuTotal,
    gateau: gateau && !gateau.aucun ? gateau : null,
    gateauSaveur,
    prestations: selectedPrestations,
  };

  const devis = {
    numero: devisNumber,
    client,
    event,
    formule,
    cart,
  };

  function toggleMenuItem(item) {
    setMenuItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      return exists ? prev.filter((i) => i.id !== item.id) : [...prev, item];
    });
  }

  function togglePrestation(p) {
    setSelectedPrestations((prev) => {
      const exists = prev.find((i) => i.id === p.id);
      return exists ? prev.filter((i) => i.id !== p.id) : [...prev, p];
    });
  }

  function handleFormuleSelect(f) {
    setFormule(f);
    // Reset downstream if changing formule
    setMenuItems([]);
    setGateau(null);
    setGateauSaveur("");
  }

  function goToStep(s) {
    setStep(s);
    window.scrollTo(0, 0);
  }

  function nextFromFormule() {
    if (isSeche) {
      goToStep(6); // Skip menu & gateau for location seche
    } else {
      goToStep(4);
    }
  }

  function backFromMenu() {
    goToStep(3);
  }

  function backFromGateau() {
    goToStep(4);
  }

  function backFromOptions() {
    if (isSeche) {
      goToStep(3);
    } else {
      goToStep(5);
    }
  }

  function backFromSummary() {
    goToStep(6);
  }

  function handleSave(signedDevis) {
    saveDevis(signedDevis);
    navigate(`/client/${encodeURIComponent(signedDevis.numero)}`);
  }

  const showCart = step >= 3 && cart.salle > 0;

  return (
    <div className="wizard-page">
      <div className="wizard-header">
        <button className="btn btn-ghost btn-sm back-btn" onClick={() => navigate("/")}>
          ← Accueil
        </button>
        <h1 className="wizard-title">Créer un devis</h1>
      </div>

      {/* Step indicator */}
      <div className="step-indicator">
        {STEP_LABELS.map((label, idx) => {
          const stepNum = idx + 1;
          // Determine if step should be shown (skip 4 and 5 if seche)
          const skipped = isSeche && (stepNum === 4 || stepNum === 5);
          if (skipped) return null;
          const active = step === stepNum;
          const done = step > stepNum;
          return (
            <div
              key={stepNum}
              className={`step-dot ${active ? "active" : ""} ${done ? "done" : ""}`}
            >
              <div className="step-dot-circle">{done ? "✓" : stepNum}</div>
              <div className="step-dot-label">{label}</div>
            </div>
          );
        })}
      </div>

      <div className="wizard-body">
        {step === 1 && (
          <Step1Client
            data={client}
            onChange={setClient}
            onNext={() => goToStep(2)}
          />
        )}
        {step === 2 && (
          <Step2Event
            data={event}
            onChange={setEvent}
            onNext={() => goToStep(3)}
            onBack={() => goToStep(1)}
          />
        )}
        {step === 3 && (
          <Step3Formule
            formules={formules}
            event={event}
            selectedFormule={formule}
            onSelect={handleFormuleSelect}
            onNext={nextFromFormule}
            onBack={() => goToStep(2)}
          />
        )}
        {step === 4 && (
          <Step4Menu
            menu={menu}
            event={event}
            selectedItems={menuItems}
            onToggle={toggleMenuItem}
            onNext={() => goToStep(5)}
            onBack={backFromMenu}
          />
        )}
        {step === 5 && (
          <Step5Gateau
            gateaux={gateaux}
            selectedGateau={gateau ? { ...gateau, saveur: gateauSaveur } : null}
            onSelect={(g, s) => { setGateau(g); setGateauSaveur(s); }}
            onNext={() => goToStep(6)}
            onBack={backFromGateau}
          />
        )}
        {step === 6 && (
          <Step6Options
            prestations={prestations}
            selected={selectedPrestations}
            onToggle={togglePrestation}
            onNext={() => goToStep(7)}
            onBack={backFromOptions}
          />
        )}
        {step === 7 && (
          <Step7Summary
            devis={devis}
            businessInfo={businessInfo}
            onBack={backFromSummary}
            onSave={handleSave}
          />
        )}
      </div>

      {showCart && <CartBar cart={cart} formule={formule} />}
    </div>
  );
}

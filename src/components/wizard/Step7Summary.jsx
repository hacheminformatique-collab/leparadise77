import { useState } from "react";
import { calculateTVA } from "../../utils/pricing";
import SignatureModal from "../SignatureModal";
import { generatePDF } from "../../utils/pdfUtils";

export default function Step7Summary({ devis, businessInfo, onBack, onSave }) {
  const [showSig, setShowSig] = useState(false);

  const { cart, client, event, formule } = devis;
  const adultes = parseInt(event?.adultes) || 0;
  const enfants = parseInt(event?.enfants) || 0;

  const tva = calculateTVA(
    cart.salle || 0,
    cart.menuTotal || 0,
    cart.gateau?.prix || 0,
    (cart.prestations || []).reduce((s, p) => s + p.prix, 0)
  );

  function handleEmail() {
    const doc = generatePDF(devis, businessInfo, null);
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const subject = encodeURIComponent(`Devis ${devis.numero} - LE PARADISE`);
    const body = encodeURIComponent(
      `Bonjour ${client.prenom},\n\nVeuillez trouver ci-joint votre devis ${devis.numero}.\n\nCordialement,\nLE PARADISE`
    );
    window.open(`mailto:${client.email}?subject=${subject}&body=${body}`);
    window.open(url);
  }

  function handleSign(sigDataUrl) {
    setShowSig(false);
    const doc = generatePDF({ ...devis, signatureDataUrl: sigDataUrl }, businessInfo, sigDataUrl);
    doc.save(`devis-${devis.numero}.pdf`);
    onSave({ ...devis, signatureDataUrl: sigDataUrl, signedAt: new Date().toISOString() });
  }

  function fmt(n) {
    return n.toFixed(2).replace(".", ",") + " €";
  }

  return (
    <div className="wizard-step summary-step">
      <h2 className="step-title">Récapitulatif de votre devis</h2>
      <div className="devis-number">N° {devis.numero}</div>

      {/* Client */}
      <div className="summary-section">
        <h3>Client</h3>
        <p>
          {client.prenom} {client.nom} — {client.telephone} — {client.email}
        </p>
      </div>

      {/* Événement */}
      <div className="summary-section">
        <h3>Événement</h3>
        <p>
          {event.type || "–"} — {event.date ? new Date(event.date).toLocaleDateString("fr-FR") : "–"}
          {" "}— {adultes} adulte(s), {enfants} enfant(s)
        </p>
      </div>

      {/* Items */}
      <div className="summary-section">
        <h3>Détail</h3>
        <table className="summary-table">
          <thead>
            <tr>
              <th>Désignation</th>
              <th>TVA</th>
              <th>Prix TTC</th>
            </tr>
          </thead>
          <tbody>
            {cart.salle > 0 && (
              <tr>
                <td>{formule?.nom || "Location salle"}</td>
                <td>20%</td>
                <td>{fmt(cart.salle)}</td>
              </tr>
            )}
            {(cart.menuItems || []).map((item) => {
              const guests = item.sectionId === "cocktail" ? adultes + enfants : adultes;
              return (
                <tr key={item.id}>
                  <td>
                    {item.nom} (×{guests})
                  </td>
                  <td>10%</td>
                  <td>{fmt(item.prix * guests)}</td>
                </tr>
              );
            })}
            {cart.gateau && cart.gateau.prix > 0 && (
              <tr>
                <td>
                  {cart.gateau.nom}
                  {cart.gateauSaveur ? ` – ${cart.gateauSaveur}` : ""}
                </td>
                <td>10%</td>
                <td>{fmt(cart.gateau.prix)}</td>
              </tr>
            )}
            {(cart.prestations || []).map((p) => (
              <tr key={p.id}>
                <td>{p.nom}</td>
                <td>20%</td>
                <td>{fmt(p.prix)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TVA recap */}
      <div className="summary-section tva-section">
        <h3>Détail TVA</h3>
        <div className="tva-row">
          <span>Total HT</span>
          <span>{fmt(tva.totalHT)}</span>
        </div>
        {tva.salleTVA > 0 && (
          <div className="tva-row">
            <span>TVA 20% (salle &amp; options)</span>
            <span>{fmt(tva.salleTVA + tva.prestationsTVA)}</span>
          </div>
        )}
        {tva.traiteurTVA + tva.gateauTVA > 0 && (
          <div className="tva-row">
            <span>TVA 10% (traiteur &amp; gâteau)</span>
            <span>{fmt(tva.traiteurTVA + tva.gateauTVA)}</span>
          </div>
        )}
        <div className="tva-row total-row">
          <span>TOTAL TTC</span>
          <span>{fmt(tva.totalTTC)}</span>
        </div>
      </div>

      <div className="form-actions summary-actions">
        <button className="btn btn-ghost" onClick={onBack}>
          ← Retour
        </button>
        <button className="btn btn-secondary" onClick={handleEmail}>
          ✉ Envoyer par email
        </button>
        <button className="btn btn-primary" onClick={() => setShowSig(true)}>
          ✍ Signer &amp; Valider
        </button>
      </div>

      {showSig && (
        <SignatureModal onSign={handleSign} onClose={() => setShowSig(false)} />
      )}
    </div>
  );
}

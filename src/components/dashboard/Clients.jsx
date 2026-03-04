import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { calculateTVA } from "../../utils/pricing";
import { generatePDF } from "../../utils/pdfUtils";

export default function Clients() {
  const { devis, setDevis, businessInfo } = useApp();
  const [selected, setSelected] = useState(null);
  const [paymentInput, setPaymentInput] = useState("");

  const d = devis.find((d) => d.numero === selected);

  function addPayment() {
    const amount = parseFloat(paymentInput);
    if (!amount || amount <= 0) return;
    setDevis(
      devis.map((dev) => {
        if (dev.numero !== selected) return dev;
        const payments = [...(dev.payments || []), { amount, date: new Date().toISOString() }];
        return { ...dev, payments };
      })
    );
    setPaymentInput("");
  }

  function downloadPDF(dev) {
    const doc = generatePDF(dev, businessInfo, dev.signatureDataUrl || null);
    doc.save(`devis-${dev.numero}.pdf`);
  }

  function getTotal(dev) {
    const tva = calculateTVA(
      dev.cart?.salle || 0,
      dev.cart?.menuTotal || 0,
      dev.cart?.gateau?.prix || 0,
      (dev.cart?.prestations || []).reduce((s, p) => s + p.prix, 0)
    );
    return tva.totalTTC;
  }

  function getPaid(dev) {
    return (dev.payments || []).reduce((s, p) => s + p.amount, 0);
  }

  function getClientSpaceUrl(dev) {
    return `${window.location.origin}/client/${encodeURIComponent(dev.numero)}`;
  }

  return (
    <div className="tab-content">
      <h2 className="tab-title">Clients &amp; Devis</h2>

      <div className="clients-layout">
        <div className="clients-list">
          {devis.length === 0 && (
            <p className="empty-msg">Aucun devis pour l'instant.</p>
          )}
          {devis.map((dev) => {
            const total = getTotal(dev);
            const paid = getPaid(dev);
            const remaining = total - paid;
            return (
              <div
                key={dev.numero}
                className={`client-row ${selected === dev.numero ? "active" : ""}`}
                onClick={() => setSelected(dev.numero)}
              >
                <div className="client-row-main">
                  <strong>
                    {dev.client.prenom} {dev.client.nom}
                  </strong>
                  <span className="devis-num">{dev.numero}</span>
                </div>
                <div className="client-row-meta">
                  <span>Total: {total.toFixed(2)} €</span>
                  <span
                    className={`payment-badge ${remaining <= 0 ? "paid" : "unpaid"}`}
                  >
                    {remaining <= 0 ? "✓ Soldé" : `Reste: ${remaining.toFixed(2)} €`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {d && (
          <div className="client-detail">
            <h3>
              {d.client.prenom} {d.client.nom}
            </h3>
            <p>
              <strong>Email:</strong> {d.client.email}
            </p>
            <p>
              <strong>Téléphone:</strong> {d.client.telephone}
            </p>
            <p>
              <strong>Devis:</strong> {d.numero}
            </p>
            <p>
              <strong>Total TTC:</strong> {getTotal(d).toFixed(2)} €
            </p>
            <p>
              <strong>Payé:</strong> {getPaid(d).toFixed(2)} €
            </p>
            <p>
              <strong>Solde restant:</strong>{" "}
              {Math.max(0, getTotal(d) - getPaid(d)).toFixed(2)} €
            </p>

            <div className="payment-section">
              <h4>Enregistrer un paiement</h4>
              <div className="form-row">
                <input
                  type="number"
                  value={paymentInput}
                  onChange={(e) => setPaymentInput(e.target.value)}
                  className="input"
                  placeholder="Montant (€)"
                  min={0}
                />
                <button className="btn btn-primary btn-sm" onClick={addPayment}>
                  Valider
                </button>
              </div>
            </div>

            {(d.payments || []).length > 0 && (
              <div className="payments-history">
                <h4>Historique des paiements</h4>
                {d.payments.map((p, i) => (
                  <div key={i} className="payment-item">
                    <span>{new Date(p.date).toLocaleDateString("fr-FR")}</span>
                    <span>{p.amount.toFixed(2)} €</span>
                  </div>
                ))}
              </div>
            )}

            <div className="client-actions">
              <button className="btn btn-primary btn-sm" onClick={() => downloadPDF(d)}>
                📄 Télécharger le devis
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  navigator.clipboard.writeText(getClientSpaceUrl(d));
                  alert("Lien copié !");
                }}
              >
                🔗 Copier le lien client
              </button>
            </div>

            {d.documents && (
              <div className="documents-status">
                <h4>Documents</h4>
                {["ci_recto", "ci_verso", "assurance"].map((key) => (
                  <div key={key} className="doc-status">
                    <span
                      className={`doc-indicator ${d.documents[key] ? "green" : "red"}`}
                    />
                    <span>
                      {key === "ci_recto"
                        ? "CI Recto"
                        : key === "ci_verso"
                        ? "CI Verso"
                        : "Attestation assurance"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

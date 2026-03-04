import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { generatePDF } from "../utils/pdfUtils";
import { calculateTVA } from "../utils/pricing";

const BANK_DETAILS = {
  beneficiaire: "SARL AFM",
  iban: "FR76 3000 3036 3700 0206 4882 801",
  bic: "SOGEFRPP",
  banque: "Société Générale",
};

const WHATSAPP = "33782281582";

export default function ClientSpace() {
  const { devisId } = useParams();
  const navigate = useNavigate();
  const { devis, setDevis, businessInfo } = useApp();
  const [activeDoc, setActiveDoc] = useState("ci_recto");
  const fileRef = useRef();

  const d = devis.find((dev) => dev.numero === decodeURIComponent(devisId || ""));

  if (!d) {
    return (
      <div className="client-space-page">
        <div className="client-notfound">
          <h2>Espace client introuvable</h2>
          <p>Le devis demandé n'existe pas ou le lien est invalide.</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const tva = calculateTVA(
    d.cart?.salle || 0,
    d.cart?.menuTotal || 0,
    d.cart?.gateau?.prix || 0,
    (d.cart?.prestations || []).reduce((s, p) => s + p.prix, 0)
  );
  const total = tva.totalTTC;
  const paid = (d.payments || []).reduce((s, p) => s + p.amount, 0);
  const remaining = Math.max(0, total - paid);

  const docs = d.documents || {};

  const DOC_LABELS = {
    ci_recto: "Pièce d'identité (recto)",
    ci_verso: "Pièce d'identité (verso)",
    assurance: "Attestation d'assurance RC",
  };

  function downloadPDF() {
    const doc = generatePDF(d, businessInfo, d.signatureDataUrl || null);
    doc.save(`devis-${d.numero}.pdf`);
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const updated = {
        ...d,
        documents: { ...docs, [activeDoc]: ev.target.result },
      };
      setDevis(devis.map((dev) => (dev.numero === d.numero ? updated : dev)));
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="client-space-page">
      <div className="client-space-header">
        <button className="btn btn-ghost btn-sm back-btn" onClick={() => navigate("/")}>
          ← Accueil
        </button>
        <h1 className="client-space-title">Espace Client</h1>
      </div>

      <div className="client-space-body">
        <div className="cs-welcome">
          <h2>
            Bonjour {d.client.prenom} {d.client.nom}
          </h2>
          <p className="cs-devis-num">Devis n° {d.numero}</p>
        </div>

        {/* Balance */}
        <div className="cs-card balance-card">
          <h3>💰 Solde</h3>
          <div className="balance-details">
            <div className="balance-row">
              <span>Total TTC</span>
              <strong>{total.toFixed(2)} €</strong>
            </div>
            <div className="balance-row">
              <span>Payé</span>
              <strong className="paid">{paid.toFixed(2)} €</strong>
            </div>
            <div className="balance-row balance-remaining">
              <span>Reste à payer</span>
              <strong className={remaining > 0 ? "unpaid" : "paid"}>
                {remaining.toFixed(2)} €
              </strong>
            </div>
          </div>
        </div>

        {/* PDF Download */}
        <div className="cs-card">
          <h3>📄 Votre devis signé</h3>
          <button className="btn btn-primary" onClick={downloadPDF}>
            Télécharger le PDF
          </button>
        </div>

        {/* Documents */}
        <div className="cs-card">
          <h3>📎 Documents à fournir</h3>
          <div className="doc-tabs">
            {Object.entries(DOC_LABELS).map(([key, label]) => (
              <button
                key={key}
                className={`doc-tab-btn ${activeDoc === key ? "active" : ""}`}
                onClick={() => setActiveDoc(key)}
              >
                <span
                  className={`doc-indicator ${docs[key] ? "green" : "red"}`}
                />
                {label}
              </button>
            ))}
          </div>
          <div className="doc-upload-area">
            {docs[activeDoc] ? (
              <div className="doc-preview">
                <p className="doc-uploaded">✓ Document téléversé</p>
                {docs[activeDoc].startsWith("data:image") && (
                  <img src={docs[activeDoc]} alt="document" className="doc-img" />
                )}
              </div>
            ) : (
              <p className="doc-missing">Aucun document fourni pour cette catégorie.</p>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*,application/pdf"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
            <button
              className="btn btn-secondary"
              onClick={() => fileRef.current.click()}
            >
              {docs[activeDoc] ? "Remplacer" : "Téléverser"}
            </button>
          </div>
        </div>

        {/* Bank details */}
        <div className="cs-card bank-card">
          <h3>🏦 Coordonnées bancaires</h3>
          <div className="bank-details">
            <div className="bank-row">
              <span>Bénéficiaire</span>
              <strong>{BANK_DETAILS.beneficiaire}</strong>
            </div>
            <div className="bank-row">
              <span>IBAN</span>
              <strong>{BANK_DETAILS.iban}</strong>
            </div>
            <div className="bank-row">
              <span>BIC</span>
              <strong>{BANK_DETAILS.bic}</strong>
            </div>
            <div className="bank-row">
              <span>Banque</span>
              <strong>{BANK_DETAILS.banque}</strong>
            </div>
            <div className="bank-row">
              <span>Référence</span>
              <strong>{d.numero}</strong>
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="cs-card">
          <h3>💬 Nous contacter</h3>
          <a
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Bonjour, je vous contacte concernant mon devis ${d.numero}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
          >
            📱 Contacter via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

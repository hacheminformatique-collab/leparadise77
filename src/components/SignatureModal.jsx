import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function SignatureModal({ onSign, onClose }) {
  const sigRef = useRef();

  function handleValidate() {
    if (sigRef.current.isEmpty()) {
      alert("Veuillez signer avant de valider.");
      return;
    }
    const dataUrl = sigRef.current.getTrimmedCanvas().toDataURL("image/png");
    onSign(dataUrl);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box sig-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Signature électronique</h2>
        <p className="sig-subtitle">Bon pour accord</p>
        <div className="sig-wrapper">
          <SignatureCanvas
            ref={sigRef}
            canvasProps={{ className: "sig-canvas" }}
            penColor="#0a0a0a"
          />
        </div>
        <div className="sig-actions">
          <button
            className="btn btn-secondary"
            onClick={() => sigRef.current.clear()}
          >
            Effacer
          </button>
          <button className="btn btn-primary" onClick={handleValidate}>
            Valider &amp; Générer le PDF
          </button>
        </div>
      </div>
    </div>
  );
}

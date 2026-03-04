import { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function MotDePasse() {
  const { pin, setPin } = useApp();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (current !== pin) {
      setMsg({ type: "error", text: "Code actuel incorrect." });
      return;
    }
    if (!/^\d{4}$/.test(next)) {
      setMsg({ type: "error", text: "Le nouveau code doit contenir 4 chiffres." });
      return;
    }
    if (next !== confirm) {
      setMsg({ type: "error", text: "Les codes ne correspondent pas." });
      return;
    }
    setPin(next);
    setCurrent("");
    setNext("");
    setConfirm("");
    setMsg({ type: "success", text: "Code PIN mis à jour." });
  }

  return (
    <div className="tab-content">
      <h2 className="tab-title">Changer le mot de passe</h2>
      <form onSubmit={handleSubmit} className="form-grid form-narrow">
        <div className="form-group">
          <label>Code actuel</label>
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="input"
          />
        </div>
        <div className="form-group">
          <label>Nouveau code (4 chiffres)</label>
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className="input"
          />
        </div>
        <div className="form-group">
          <label>Confirmer le nouveau code</label>
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="input"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Mettre à jour
          </button>
          {msg && (
            <span className={msg.type === "error" ? "error-msg" : "success-msg"}>
              {msg.text}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

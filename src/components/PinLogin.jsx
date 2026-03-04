import { useState, useRef } from "react";
import { storage } from "../utils/storage";

export default function PinLogin({ onSuccess, onClose }) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(() => {
    const lockout = storage.getLockout();
    if (lockout.lockedUntil && Date.now() < lockout.lockedUntil) {
      return lockout.lockedUntil;
    }
    return null;
  });
  const refs = [useRef(), useRef(), useRef(), useRef()];

  function remaining() {
    if (!locked) return 0;
    // eslint-disable-next-line react-hooks/purity
    return Math.ceil((locked - Date.now()) / 1000);
  }

  function handleDigit(i, val) {
    if (locked) return;
    const v = val.replace(/\D/, "").slice(-1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 3) refs[i + 1].current?.focus();
    if (i === 3 && v) {
      const pin = [...next.slice(0, 3), v].join("");
      validate(pin);
    }
  }

  function handleKeyDown(i, e) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs[i - 1].current?.focus();
    }
  }

  function validate(pin) {
    const stored = storage.getPin();
    if (pin === stored) {
      storage.setLockout({ attempts: 0, lockedUntil: null });
      onSuccess();
    } else {
      const lockout = storage.getLockout();
      const attempts = (lockout.attempts || 0) + 1;
      if (attempts >= 3) {
        // eslint-disable-next-line react-hooks/purity
        const lockedUntil = Date.now() + 10 * 60 * 1000;
        storage.setLockout({ attempts, lockedUntil });
        setLocked(lockedUntil);
        setError("3 tentatives échouées. Verrouillé 10 minutes.");
      } else {
        storage.setLockout({ attempts, lockedUntil: null });
        setError(`Code incorrect. ${3 - attempts} tentative(s) restante(s).`);
      }
      setDigits(["", "", "", ""]);
      refs[0].current?.focus();
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box pin-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Accès Administrateur</h2>
        <p className="pin-subtitle">Entrez votre code PIN à 4 chiffres</p>

        {locked && remaining() > 0 ? (
          <p className="error-msg">
            Accès verrouillé. Réessayez dans {Math.ceil(remaining() / 60)} min {remaining() % 60} sec.
          </p>
        ) : (
          <>
            <div className="pin-inputs">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={refs[i]}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  className="pin-input"
                  onChange={(e) => handleDigit(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  autoFocus={i === 0}
                />
              ))}
            </div>
            {error && <p className="error-msg">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}

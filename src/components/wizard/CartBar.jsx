import { calculateTVA } from "../../utils/pricing";

export default function CartBar({ cart, event, formule }) {
  const adultes = parseInt(event?.adultes) || 0;
  const enfants = parseInt(event?.enfants) || 0;

  const tva = calculateTVA(
    cart.salle || 0,
    cart.menuTotal || 0,
    cart.gateau?.prix || 0,
    (cart.prestations || []).reduce((s, p) => s + p.prix, 0)
  );

  const items = [];
  if (cart.salle > 0) items.push({ label: formule?.nom || "Salle", price: cart.salle });
  if (cart.menuTotal > 0) items.push({ label: "Menu traiteur", price: cart.menuTotal });
  if (cart.gateau?.prix > 0) items.push({ label: cart.gateau.nom, price: cart.gateau.prix });
  (cart.prestations || []).forEach((p) => items.push({ label: p.nom, price: p.prix }));

  if (items.length === 0) return null;

  return (
    <div className="cart-bar">
      <div className="cart-bar-inner">
        <div className="cart-items">
          {items.map((item, i) => (
            <span key={i} className="cart-item">
              {item.label}: <strong>{item.price.toLocaleString("fr-FR")} €</strong>
            </span>
          ))}
        </div>
        <div className="cart-total">
          Total: <strong>{tva.totalTTC.toLocaleString("fr-FR")} € TTC</strong>
        </div>
      </div>
    </div>
  );
}

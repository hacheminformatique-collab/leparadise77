/**
 * Returns the salle price (TTC) based on event date and whether formule is "seche".
 * Basse saison: décembre–mars
 * Haute saison: avril–novembre
 */
export function getSallePrice(date, isSeche) {
  if (!date) return 0;
  const d = new Date(date);
  const month = d.getMonth() + 1; // 1-12
  const day = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

  const basseSaison = month === 12 || month <= 3;

  // Prices: [avecPrestation, seche]
  let price;
  if (day === 5) {
    // Vendredi
    price = basseSaison ? [2500, 1500] : [3500, 2500];
  } else if (day === 6) {
    // Samedi
    price = basseSaison ? [3500, 2500] : [4500, 3000];
  } else {
    // Dim-Jeudi
    price = basseSaison ? [2000, 1000] : [2500, 1500];
  }

  return isSeche ? price[1] : price[0];
}

/**
 * Calculate menu total (TTC) for given selections and number of guests.
 */
export function getMenuTotal(selectedItems, adultes, enfants) {
  if (!selectedItems || selectedItems.length === 0) return 0;
  return selectedItems.reduce((sum, item) => {
    const guests = item.sectionId === "cocktail" && enfants > 0
      ? adultes + enfants
      : adultes;
    return sum + item.prix * guests;
  }, 0);
}

/**
 * Calculate TVA breakdown from TTC prices.
 * tva20: salle + prestations
 * tva10: traiteur + gateaux
 */
export function calculateTVA(salleTTC, traiteurTTC, gateauTTC, prestationsTTC) {
  const salleHT = salleTTC / 1.2;
  const salleTVA = salleTTC - salleHT;

  const traiteurHT = traiteurTTC / 1.1;
  const traiteurTVA = traiteurTTC - traiteurHT;

  const gateauHT = gateauTTC / 1.1;
  const gateauTVA = gateauTTC - gateauHT;

  const prestationsHT = prestationsTTC / 1.2;
  const prestationsTVA = prestationsTTC - prestationsHT;

  const totalHT = salleHT + traiteurHT + gateauHT + prestationsHT;
  const totalTVA = salleTVA + traiteurTVA + gateauTVA + prestationsTVA;
  const totalTTC = salleTTC + traiteurTTC + gateauTTC + prestationsTTC;

  return {
    salleHT,
    salleTVA,
    traiteurHT,
    traiteurTVA,
    gateauHT,
    gateauTVA,
    prestationsHT,
    prestationsTVA,
    totalHT,
    totalTVA,
    totalTTC,
  };
}

export function generateDevisNumber() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return `DEV-${yyyy}${mm}${dd}-${rand}`;
}

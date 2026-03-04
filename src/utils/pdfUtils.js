import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { calculateTVA } from "./pricing";
import { CGV_TEXT } from "./defaultData";

const COMPANY = {
  societe: "SARL AFM",
  enseigne: "LE PARADISE",
  adresse: "5 avenue Fridingen",
  ville: "77100 Nanteuil les Meaux",
  rcs: "RCS de Meaux : 904543816",
  tel: "0782281582",
  email: "contact@leparadise77.fr",
};

function formatEuro(n) {
  return Number(n).toFixed(2).replace(".", ",") + " €";
}

export function generatePDF(devis, businessInfo, signatureDataUrl) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const margin = 15;

  // ─── Header ───────────────────────────────────────────────────────
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, W, 35, "F");
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(businessInfo?.nom || COMPANY.enseigne, W / 2, 14, { align: "center" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(255, 255, 255);
  doc.text(
    `${COMPANY.societe} – ${COMPANY.adresse}, ${COMPANY.ville} – ${COMPANY.rcs}`,
    W / 2,
    22,
    { align: "center" }
  );
  doc.text(`Tél: ${COMPANY.tel}  |  ${COMPANY.email}`, W / 2, 28, {
    align: "center",
  });

  let y = 42;

  // ─── Devis number + date ──────────────────────────────────────────
  doc.setTextColor(10, 10, 10);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`DEVIS N° ${devis.numero}`, margin, y);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Date : ${new Date().toLocaleDateString("fr-FR")}`,
    W - margin,
    y,
    { align: "right" }
  );

  y += 8;

  // ─── Client info ──────────────────────────────────────────────────
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, y, W - margin * 2, 24, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(10, 10, 10);
  doc.text("CLIENT", margin + 3, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    `${devis.client.prenom} ${devis.client.nom}`,
    margin + 3,
    y + 13
  );
  doc.text(
    `Tél: ${devis.client.telephone}  |  Email: ${devis.client.email}`,
    margin + 3,
    y + 19
  );

  // Event info on the right
  doc.setFont("helvetica", "bold");
  doc.text("ÉVÉNEMENT", W - margin - 70, y + 6);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Type: ${devis.event.type || "-"}`,
    W - margin - 70,
    y + 13
  );
  doc.text(
    `Date: ${devis.event.date ? new Date(devis.event.date).toLocaleDateString("fr-FR") : "-"}  |  Adultes: ${devis.event.adultes}  Enfants: ${devis.event.enfants}`,
    W - margin - 70,
    y + 19
  );

  y += 30;

  // ─── Cart items table ─────────────────────────────────────────────
  const rows = [];

  // Salle
  if (devis.cart.salle > 0) {
    rows.push([
      devis.formule?.nom || "Location salle",
      "1",
      formatEuro(devis.cart.salle / 1.2),
      "20%",
      formatEuro(devis.cart.salle),
    ]);
  }

  // Menu items
  if (devis.cart.menuItems && devis.cart.menuItems.length > 0) {
    devis.cart.menuItems.forEach((item) => {
      const guests = devis.event.adultes + (item.sectionId !== "cocktail" ? 0 : devis.event.enfants);
      const total = item.prix * guests;
      rows.push([
        `${item.nom} (x${guests})`,
        guests.toString(),
        formatEuro(item.prix),
        "10%",
        formatEuro(total),
      ]);
    });
  }

  // Gateau
  if (devis.cart.gateau && devis.cart.gateau.prix > 0) {
    const label = devis.cart.gateauSaveur
      ? `${devis.cart.gateau.nom} – ${devis.cart.gateauSaveur}`
      : devis.cart.gateau.nom;
    rows.push([
      label,
      "1",
      formatEuro(devis.cart.gateau.prix / 1.1),
      "10%",
      formatEuro(devis.cart.gateau.prix),
    ]);
  }

  // Prestations
  if (devis.cart.prestations && devis.cart.prestations.length > 0) {
    devis.cart.prestations.forEach((p) => {
      rows.push([
        p.nom,
        "1",
        formatEuro(p.prix / 1.2),
        "20%",
        formatEuro(p.prix),
      ]);
    });
  }

  autoTable(doc, {
    startY: y,
    head: [["Désignation", "Qté", "Prix HT", "TVA", "Prix TTC"]],
    body: rows,
    theme: "striped",
    headStyles: { fillColor: [10, 10, 10], textColor: [212, 175, 55], fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 15, halign: "center" },
      2: { cellWidth: 30, halign: "right" },
      3: { cellWidth: 20, halign: "center" },
      4: { cellWidth: 30, halign: "right" },
    },
    margin: { left: margin, right: margin },
  });

  y = doc.lastAutoTable.finalY + 8;

  // ─── TVA breakdown ────────────────────────────────────────────────
  const tvaRows = [];
  const tva = calculateTVA(
    devis.cart.salle || 0,
    devis.cart.menuTotal || 0,
    devis.cart.gateau?.prix || 0,
    (devis.cart.prestations || []).reduce((s, p) => s + p.prix, 0)
  );

  if (devis.cart.salle > 0) {
    tvaRows.push(["Location salle (20%)", formatEuro(tva.salleHT), formatEuro(tva.salleTVA), formatEuro(devis.cart.salle)]);
  }
  const traiteurTotal = (devis.cart.menuTotal || 0) + (devis.cart.gateau?.prix || 0);
  if (traiteurTotal > 0) {
    tvaRows.push(["Traiteur & gâteau (10%)", formatEuro(tva.traiteurHT + tva.gateauHT), formatEuro(tva.traiteurTVA + tva.gateauTVA), formatEuro(traiteurTotal)]);
  }
  const prestTotal = (devis.cart.prestations || []).reduce((s, p) => s + p.prix, 0);
  if (prestTotal > 0) {
    tvaRows.push(["Prestations (20%)", formatEuro(tva.prestationsHT), formatEuro(tva.prestationsTVA), formatEuro(prestTotal)]);
  }

  autoTable(doc, {
    startY: y,
    head: [["Catégorie", "Total HT", "TVA", "Total TTC"]],
    body: tvaRows,
    theme: "plain",
    headStyles: { fillColor: [240, 230, 200], textColor: [10, 10, 10], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      1: { halign: "right" },
      2: { halign: "right" },
      3: { halign: "right" },
    },
    margin: { left: margin, right: margin },
    tableWidth: 100,
  });

  y = doc.lastAutoTable.finalY + 5;

  // ─── Grand total ──────────────────────────────────────────────────
  doc.setFillColor(10, 10, 10);
  doc.rect(W - margin - 80, y, 80, 12, "F");
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL TTC :", W - margin - 45, y + 8);
  doc.text(formatEuro(tva.totalTTC), W - margin - 3, y + 8, { align: "right" });

  y += 18;

  // ─── Acompte / solde ──────────────────────────────────────────────
  doc.setTextColor(10, 10, 10);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const acompte = devis.acompte || 1500;
  const solde = tva.totalTTC - acompte;
  doc.text(`Acompte à la signature : ${formatEuro(acompte)}`, margin, y);
  doc.text(`Solde restant dû : ${formatEuro(solde > 0 ? solde : 0)}`, margin, y + 6);

  y += 18;

  // ─── Signature ────────────────────────────────────────────────────
  if (signatureDataUrl) {
    doc.setFontSize(9);
    doc.text("Bon pour accord – Signature du client :", margin, y);
    y += 4;
    try {
      doc.addImage(signatureDataUrl, "PNG", margin, y, 70, 30);
    } catch {}
    y += 35;
  } else {
    doc.setFontSize(9);
    doc.text("Bon pour accord – Signature du client :", margin, y);
    doc.rect(margin, y + 3, 70, 25);
    y += 35;
  }

  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "Ce devis est valable 30 jours. La signature vaut acceptation des CGV ci-jointes.",
    margin,
    y
  );

  // ─── CGV pages ────────────────────────────────────────────────────
  doc.addPage();
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, W, 18, "F");
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("CONDITIONS GÉNÉRALES DE VENTE", W / 2, 12, { align: "center" });

  doc.setTextColor(10, 10, 10);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");

  const lines = doc.splitTextToSize(CGV_TEXT, W - margin * 2);
  let cgvY = 24;
  const lineHeight = 4;
  const pageHeight = 297;
  const bottomMargin = 20;

  for (const line of lines) {
    if (cgvY + lineHeight > pageHeight - bottomMargin) {
      doc.addPage();
      cgvY = margin;
    }
    doc.text(line, margin, cgvY);
    cgvY += lineHeight;
  }

  // Signature on last CGV page
  cgvY += 8;
  if (cgvY + 40 > pageHeight - bottomMargin) {
    doc.addPage();
    cgvY = margin;
  }

  doc.setFontSize(9);
  doc.text("Lu et approuvé – Signature :", margin, cgvY);
  if (signatureDataUrl) {
    try {
      doc.addImage(signatureDataUrl, "PNG", margin, cgvY + 3, 70, 25);
    } catch {}
  } else {
    doc.rect(margin, cgvY + 3, 70, 25);
  }

  return doc;
}

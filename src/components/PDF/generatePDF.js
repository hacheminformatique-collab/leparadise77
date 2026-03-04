import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { getSettings } from '../../utils/storage'

const CGV = `CONDITIONS GÉNÉRALES DE VENTE

1. OBJET
Les présentes conditions générales de vente s'appliquent à toutes les prestations conclues par la SARL AFM (Le Paradise) avec ses clients.

2. RÉSERVATION ET ACOMPTE
La réservation est confirmée à la réception d'un acompte de 30% du montant total TTC du devis, accompagné du contrat signé. Sans ces éléments, la date reste disponible pour d'autres clients.

3. SOLDE
Le solde du montant total est dû 30 jours avant la date de l'événement. En cas de non-paiement, la SARL AFM se réserve le droit d'annuler la réservation sans remboursement de l'acompte.

4. ANNULATION PAR LE CLIENT
- Annulation plus de 90 jours avant l'événement : remboursement de l'acompte à hauteur de 50%.
- Annulation entre 30 et 90 jours : l'acompte reste acquis à la SARL AFM.
- Annulation moins de 30 jours : le montant total du devis est dû.

5. ANNULATION PAR LE PARADISE
En cas d'annulation par Le Paradise pour un cas de force majeure, l'intégralité des sommes versées sera remboursée.

6. RESPONSABILITÉS
Le client est responsable de tous les dommages causés aux locaux, au matériel et aux équipements mis à disposition. Une caution de 1500€ sera demandée le jour de l'événement. Elle sera restituée après vérification des locaux.

7. CAPACITÉ
La capacité maximale de la salle est de 250 personnes. Tout dépassement est interdit.

8. HORAIRES
Les événements se terminent au plus tard à 5h00 du matin. Tout dépassement entraîne une facturation supplémentaire de 200€ par heure.

9. TRAITEUR
Sauf accord préalable, seuls les prestataires agréés par Le Paradise sont autorisés à intervenir dans les locaux.

10. LITIGE
Tout litige relatif à l'interprétation ou l'exécution du présent contrat sera soumis aux tribunaux compétents de Meaux.

SARL AFM — 5 avenue Fridingen, 77100 Nanteuil les Meaux
RCS de Meaux : 904543816 — contact@leparadise77.fr`

function formatMoney(n) {
  return Number(n || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

function vatBreakdown(ttc, rate) {
  const ht = ttc / (1 + rate)
  const tva = ttc - ht
  return { ht, tva, ttc }
}

export function generatePDF(devis) {
  const settings = getSettings()
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  let y = 20

  // ---- Header ----
  doc.setFillColor(26, 26, 46)
  doc.rect(0, 0, pageW, 40, 'F')
  doc.setTextColor(201, 168, 76)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('LE PARADISE', 20, 18)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(200, 200, 200)
  doc.text('Salle de réception — Nanteuil les Meaux', 20, 26)
  doc.text('5 avenue Fridingen, 77100 Nanteuil les Meaux', 20, 32)
  doc.text('Tel: 0782281582 | contact@leparadise77.fr', 20, 38)

  // Devis title on right
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('DEVIS', pageW - 20, 18, { align: 'right' })
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(devis.devisNumber || '', pageW - 20, 26, { align: 'right' })
  const dateStr = new Date(devis.createdAt || Date.now()).toLocaleDateString('fr-FR')
  doc.text(`Date: ${dateStr}`, pageW - 20, 32, { align: 'right' })

  y = 50

  // ---- Client info ----
  doc.setTextColor(50, 50, 50)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('CLIENT', 20, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  y += 6
  doc.text(`${devis.prenom || ''} ${devis.nom || ''}`, 20, y); y += 5
  if (devis.adresse) { doc.text(devis.adresse, 20, y); y += 5 }
  if (devis.codePostal || devis.ville) { doc.text(`${devis.codePostal || ''} ${devis.ville || ''}`, 20, y); y += 5 }
  doc.text(`Email: ${devis.email || ''}`, 20, y); y += 5
  doc.text(`Tél: ${devis.telephone || ''}`, 20, y); y += 10

  // ---- Event info ----
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('ÉVÉNEMENT', 20, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  y += 6
  const evDate = devis.dateEvenement ? new Date(devis.dateEvenement).toLocaleDateString('fr-FR') : '—'
  doc.text(`Type: ${devis.typeEvenement || '—'}`, 20, y)
  doc.text(`Date: ${evDate}`, 110, y)
  y += 5
  doc.text(`Nombre de personnes: ${devis.nbPersonnes || '—'}`, 20, y)
  if (devis.heureDebut) doc.text(`Horaires: ${devis.heureDebut} — ${devis.heureFin || ''}`, 110, y)
  y += 5
  doc.text(`Formule: ${devis.formule?.nomFormule || '—'}`, 20, y)
  y += 12

  // ---- Pricing table ----
  const nbPersonnes = devis.nbPersonnes || 0
  const prixSalle = devis.prixSalle || 0
  const menuTotal = (devis.menus || []).reduce((s, m) => s + (m.tarif || 0), 0) * nbPersonnes
  const gateauTotal = (devis.gateau?.tarif || 0) * nbPersonnes
  const traiteurTotal = menuTotal + gateauTotal
  const prestationsTotal = (devis.prestations || []).reduce((s, p) => s + (p.tarif || 0), 0)

  const salle = vatBreakdown(prixSalle, 0.20)
  const traiteur = vatBreakdown(traiteurTotal, 0.10)
  const options = vatBreakdown(prestationsTotal, 0.20)
  const totalHT = salle.ht + traiteur.ht + options.ht
  const totalTVA = salle.tva + traiteur.tva + options.tva
  const totalTTC = prixSalle + traiteurTotal + prestationsTotal

  const rows = []
  if (prixSalle > 0) {
    rows.push([
      `Location salle\n${devis.formule?.nomFormule || ''}`,
      '20%',
      formatMoney(salle.ht),
      formatMoney(salle.tva),
      formatMoney(prixSalle),
    ])
  }

  // Menu details
  if ((devis.menus || []).length > 0) {
    const menuLines = (devis.menus || []).filter((m) => m.tarif > 0).map((m) => `${m.nomMenu} (${m.tarif}€/pers.)`).join('\n')
    if (menuLines && menuTotal > 0) {
      const menuHT = vatBreakdown(menuTotal, 0.10)
      rows.push([
        `Traiteur — Menus\n${menuLines}\n(${nbPersonnes} personnes)`,
        '10%',
        formatMoney(menuHT.ht),
        formatMoney(menuHT.tva),
        formatMoney(menuTotal),
      ])
    }
  }

  if (gateauTotal > 0) {
    const gateauHT = vatBreakdown(gateauTotal, 0.10)
    rows.push([
      `Gâteau — ${devis.gateau?.nomGateau || ''}\n(${nbPersonnes} personnes × ${devis.gateau?.tarif}€)`,
      '10%',
      formatMoney(gateauHT.ht),
      formatMoney(gateauHT.tva),
      formatMoney(gateauTotal),
    ])
  }

  for (const p of (devis.prestations || [])) {
    const pHT = vatBreakdown(p.tarif, 0.20)
    rows.push([
      `${p.nomPresta}\n${p.description || ''}`,
      '20%',
      formatMoney(pHT.ht),
      formatMoney(pHT.tva),
      formatMoney(p.tarif),
    ])
  }

  autoTable(doc, {
    startY: y,
    head: [['Désignation', 'TVA', 'HT', 'TVA €', 'TTC']],
    body: rows,
    foot: [
      ['', 'Sous-total HT', formatMoney(totalHT), '', ''],
      ['', 'TVA', formatMoney(totalTVA), '', ''],
      ['', 'TOTAL TTC', '', '', formatMoney(totalTTC)],
    ],
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [26, 26, 46], textColor: [255, 255, 255] },
    footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 15, halign: 'center' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 25, halign: 'right' },
      4: { cellWidth: 30, halign: 'right' },
    },
  })

  y = doc.lastAutoTable.finalY + 12

  // ---- Bank info ----
  const bank = settings.bankInfo || {}
  if (bank.iban) {
    if (y > pageH - 60) { doc.addPage(); y = 20 }
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(50, 50, 50)
    doc.text('RÈGLEMENT', 20, y)
    doc.setFont('helvetica', 'normal')
    y += 5
    doc.setFontSize(9)
    if (bank.titulaire) { doc.text(`Titulaire: ${bank.titulaire}`, 20, y); y += 4 }
    doc.text(`IBAN: ${bank.iban}`, 20, y); y += 4
    if (bank.bic) { doc.text(`BIC: ${bank.bic}`, 20, y); y += 4 }
    y += 8
  }

  // ---- CGV ----
  doc.addPage()
  y = 20
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(26, 26, 46)
  doc.text('CONDITIONS GÉNÉRALES DE VENTE', 20, y)
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(60, 60, 60)
  const lines = doc.splitTextToSize(CGV, pageW - 40)
  lines.forEach((line) => {
    if (y > pageH - 20) { doc.addPage(); y = 20 }
    doc.text(line, 20, y)
    y += 4
  })

  // ---- Footer on all pages ----
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `SARL AFM — 5 avenue Fridingen, 77100 Nanteuil les Meaux — RCS Meaux: 904543816`,
      pageW / 2, pageH - 8, { align: 'center' }
    )
    doc.text(`Page ${i} / ${pageCount}`, pageW - 15, pageH - 8, { align: 'right' })
  }

  doc.save(`${devis.devisNumber || 'devis'}.pdf`)
}

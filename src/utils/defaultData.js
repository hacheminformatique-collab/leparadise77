export const DEFAULT_PIN = "2205";

export const DEFAULT_BUSINESS_INFO = {
  nom: "LE PARADISE",
  adresse: "5 avenue Fridingen",
  codePostal: "77100",
  ville: "Nanteuil les Meaux",
  telephone: "0782281582",
  email: "contact@leparadise77.fr",
  siret: "904 543 816",
  rcs: "RCS de Meaux : 904543816",
  societe: "SARL AFM",
};

export const DEFAULT_FORMULES = [
  {
    id: "1",
    nom: "Location sèche",
    description: "Location de la salle uniquement, sans prestation traiteur",
    seche: true,
  },
  {
    id: "2",
    nom: "Location avec prestation",
    description: "Location de la salle avec traiteur et services inclus",
    seche: false,
  },
];

export const DEFAULT_MENU_SECTIONS = [
  {
    id: "cocktail",
    nom: "Cocktail",
    items: [
      { id: "c1", nom: "Cocktail Prestige", prix: 25 },
      { id: "c2", nom: "Cocktail Standard", prix: 18 },
      { id: "c3", nom: "Cocktail Enfant", prix: 10 },
    ],
  },
  {
    id: "entrees",
    nom: "Entrées",
    items: [
      { id: "e1", nom: "Buffet d'entrées varié", prix: 15 },
      { id: "e2", nom: "Foie gras et accompagnements", prix: 22 },
    ],
  },
  {
    id: "plats",
    nom: "Plats",
    items: [
      { id: "p1", nom: "Agneau rôti aux herbes", prix: 35 },
      { id: "p2", nom: "Poulet fermier en sauce", prix: 28 },
      { id: "p3", nom: "Poisson du marché", prix: 32 },
    ],
  },
  {
    id: "desserts",
    nom: "Desserts",
    items: [
      { id: "d1", nom: "Dessert buffet gourmand", prix: 12 },
      { id: "d2", nom: "Chariot de mignardises", prix: 8 },
    ],
  },
  {
    id: "boissons",
    nom: "Boissons",
    items: [
      { id: "b1", nom: "Open bar premium", prix: 20 },
      { id: "b2", nom: "Boissons soft uniquement", prix: 8 },
      { id: "b3", nom: "Champagne à table", prix: 15 },
    ],
  },
];

export const DEFAULT_GATEAUX = [
  {
    id: "g1",
    nom: "Pièce montée classique",
    prix: 350,
    description: "Pièce montée traditionnelle choux",
  },
  {
    id: "g2",
    nom: "Wedding cake 3 étages",
    prix: 450,
    description: "Gâteau de mariage élégant",
  },
  {
    id: "g3",
    nom: "Naked cake floral",
    prix: 380,
    description: "Gâteau nu décoré de fleurs",
  },
  {
    id: "g4",
    nom: "Gâteau personnalisé",
    prix: 500,
    description: "Création sur mesure selon vos envies",
  },
  {
    id: "g0",
    nom: "Continuer sans gâteau",
    prix: 0,
    description: "Aucun gâteau pour cet événement",
    aucun: true,
  },
];

export const DEFAULT_PRESTATIONS = [
  { id: "pr1", nom: "DJ", prix: 800, description: "DJ professionnel pour la soirée" },
  {
    id: "pr2",
    nom: "Fumée lourde",
    prix: 150,
    description: "Effet fumée lourde spectaculaire",
  },
  {
    id: "pr3",
    nom: "Jet de scène",
    prix: 100,
    description: "Jets de confettis ou pétales",
  },
  {
    id: "pr4",
    nom: "Photobooth",
    prix: 450,
    description: "Photobooth avec accessoires",
  },
  {
    id: "pr5",
    nom: "Videobooth 360",
    prix: 250,
    description: "Cabine vidéo 360 degrés",
  },
];

export const CGV_TEXT = `CONDITIONS GÉNÉRALES DE LOCATION ET DE PRESTATIONS - LE PARADISE RÉCEPTION

ARTICLE 1 : OBJET ET IDENTITÉ DU PRESTATAIRE
Les presentes conditions regissent les relations contractuelles entre la societe AFM (Enseigne PARADISE), SARL au capital de 7 500,00 EUR, immatriculee au RCS de Meaux sous le SIRET 904 543 816, dont le siege social est situe au 5 avenue FRIDINGEN 77100 NANTEUIL LES MEAUX, et le Client (particulier ou professionnel). Elles s appliquent de plein droit a toutes les prestations de location de salle (seche ou avec options), de restauration (Traiteur) et de services evenementiels proposees par AFM.

ARTICLE 2 : DESTINATION DES LIEUX
Le lieu de reception est exclusivement destine a accueillir l evenement precise sur le devis (mariage, anniversaire, bapteme, seminaire, reception privee...). Les locaux sont loues a titre prive et temporaire pour la duree strictement definie au contrat. Toute modification de l objet de l evenement sans accord ecrit de AFM peut entrainer l annulation immediate du contrat.

ARTICLE 3 : ÉQUIPEMENTS ET INVENTAIRE DÉTAILLÉ DU MATÉRIEL
Le Client declare parfaitement connaitre les lieux loues pour les avoir visites et examines. Ils les acceptent dans l etat ou ils se trouvent au moment de la signature.

ARTICLE 4 : DURÉE, HORAIRES ET FLEXIBILITÉ
La fin de l evenement est fixee a l heure mentionnee au devis. Tout depassement au-dela du temps de courtoisie raisonnable sera facture 150EUR TTC par heure entamee.

ARTICLE 5 : MODALITÉS DE PAIEMENT ET FISCALITÉ
Un acompte de 1 500 EUR minimum est exigible a la signature pour bloquer la date de maniere ferme et definitive. Le solde total doit etre regle au plus tard 45 jours calendaires avant l evenement.

ARTICLE 6 : ANNULATION PAR LE CLIENT ET RÈGLES STRICTES
En cas d annulation de l evenement par le Client, quelle qu en soit la cause, les acomptes verses restent definitivement acquises a la societe AFM. Le contrat est donc ferme et definitif des sa signature.

ARTICLE 7 : NOMBRE DE CONVIVES ET AJUSTEMENTS
Le nombre exact de convives doit etre confirme par ecrit au plus tard 15 jours ouvrables avant l evenement. Toute demande d augmentation du nombre de convives apres ce delai est soumise a l accord d AFM.

ARTICLE 8 : DÉPÔT DE GARANTIE (CAUTION) ET DÉGRADATIONS
Un depot de garantie d un montant de 3 000 EUR, verse par cheque a l ordre de AFM, est exige au plus tard le jour de l evenement. Ce cheque n est pas encaisse a la reception.

ARTICLE 9 : RESPONSABILITÉ, HYGIÈNE ET ASSURANCES
Le Client s engage a fournir une attestation d assurance Responsabilite Civile au plus tard 30 jours avant l evenement. AFM decline toute responsabilite en cas de vol, perte ou dommage subi par les biens personnels du Client.

ARTICLE 10 : SÉCURITÉ, ORDRE PUBLIC ET RESPONSABILITÉ PÉNALE
L usage de flammes reelles, chichas, encens, cierges magiques est strictement interdit sur l ensemble du site. Seules les bougies a technologie LED sont autorisees.

ARTICLE 11 : CESSION ET SOUS-LOCATION
Toute cession du contrat ou sous-location de la salle est strictement interdite.

ARTICLE 12 : FORCE MAJEURE ET INCIDENTS TECHNIQUES
En cas d evenement imprevisible, la prestation pourra etre reportee via un avoir de 12 mois. Aucun remboursement ne pourra etre exige.

ARTICLE 13 : RÉSOLUTION DU CONTRAT ET LITIGES
Tout litige sera porte exclusivement devant le Tribunal de MEAUX (77), seul competent.

ARTICLE 14 : PROTECTION DES DONNÉES (RGPD)
Les informations collectees sont necessaires pour la gestion de votre reservation.

AFM - PARADISE - 5 AVENUE FRIDINGEN, 77100 NANTEUIL LES MEAUX
SARL au capital de 7 500,00 EUR - SIREN 904 543 816`;

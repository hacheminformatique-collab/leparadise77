const KEYS = {
  settings: 'paradise_settings',
  formules: 'paradise_formules',
  menus: 'paradise_menus',
  gateaux: 'paradise_gateaux',
  prestations: 'paradise_prestations',
  clients: 'paradise_clients',
  loginAttempts: 'paradise_login_attempts',
}

const DEFAULTS = {
  settings: {
    nom: 'LE PARADISE',
    pin: '2205',
    bankInfo: {
      iban: '',
      bic: '',
      titulaire: '',
    },
    whatsapp: '',
  },
  formules: [
    { id: '1', nomFormule: 'Location sèche', contenuFormule: 'Déco + vaisselles + nettoyage', photo: '' },
    { id: '2', nomFormule: 'Location avec prestation', contenuFormule: 'Déco + vaisselles + prestation + nettoyage', photo: '' },
  ],
  menus: [
    { id: '1', section: 'Cocktail de bienvenu', nomMenu: 'Cocktail starter', tarif: 5, description: '5/6 pcs par personne', photo: '' },
    { id: '2', section: 'Cocktail de bienvenu', nomMenu: 'Cocktail medium', tarif: 7, description: '8/9 pcs par personne', photo: '' },
    { id: '3', section: 'Cocktail de bienvenu', nomMenu: 'Cocktail premium', tarif: 9, description: '10/12 pcs par personne', photo: '' },
    { id: '4', section: 'Entrée', nomMenu: 'Salade composée méditerranéenne', tarif: 12, description: 'plat central', photo: '' },
    { id: '5', section: 'Entrée', nomMenu: 'Burrata du chef', tarif: 13, description: "à l'assiette", photo: '' },
    { id: '6', section: 'Entrée', nomMenu: 'Bouchée à la reine forestière', tarif: 13, description: "à l'assiette", photo: '' },
    { id: '7', section: 'Entrée', nomMenu: 'Salade tunisienne', tarif: 12, description: 'plat central', photo: '' },
    { id: '8', section: 'Plats', nomMenu: 'Poulet olives', tarif: 15, description: 'plat central', photo: '' },
    { id: '9', section: 'Plats', nomMenu: 'Suprême de volaille', tarif: 19, description: "à l'assiette, 2 accompagnements au choix", photo: '' },
    { id: '10', section: 'Plats', nomMenu: 'Tajine aux pruneaux', tarif: 19, description: 'plat central', photo: '' },
    { id: '11', section: 'Desserts', nomMenu: 'Plateaux de fruit', tarif: 8, description: '', photo: '' },
    { id: '12', section: 'Desserts', nomMenu: 'Trilogie du Paradise', tarif: 9, description: '', photo: '' },
    { id: '13', section: 'Menu enfants', nomMenu: 'Nuggets frites + compote', tarif: 20, description: '', photo: '' },
    { id: '14', section: 'Boissons', nomMenu: 'Eau de source', tarif: 0, description: '', photo: '' },
    { id: '15', section: 'Boissons', nomMenu: 'Coca', tarif: 0, description: '', photo: '' },
    { id: '16', section: 'Boissons', nomMenu: 'Thé et Café', tarif: 0, description: '', photo: '' },
  ],
  gateaux: [
    { id: '1', nomGateau: 'Gâteau 1', tarif: 4, photo: '' },
    { id: '2', nomGateau: 'Gâteau 2', tarif: 4, photo: '' },
    { id: '3', nomGateau: 'Gâteau 3', tarif: 4.5, photo: '' },
    { id: '4', nomGateau: 'Gâteau 4', tarif: 4.5, photo: '' },
    { id: '5', nomGateau: 'Continuer sans gâteau', tarif: 0, photo: '' },
  ],
  prestations: [
    { id: '1', nomPresta: 'DJ', tarif: 800, description: 'pour animer votre soirée', photo: '' },
    { id: '2', nomPresta: 'Fumée lourde', tarif: 150, description: 'pour vos slow et ouverture de bal', photo: '' },
    { id: '3', nomPresta: 'Jet de scène', tarif: 100, description: 'pour animer votre slow ou wedding cake', photo: '' },
    { id: '4', nomPresta: 'Photobooth', tarif: 450, description: 'garder un souvenir', photo: '' },
    { id: '5', nomPresta: 'Videobooth360', tarif: 250, description: 'garder un souvenir', photo: '' },
  ],
  clients: [],
  loginAttempts: { count: 0, blockedUntil: null },
}

function get(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function initDefaults() {
  Object.entries(KEYS).forEach(([name, key]) => {
    if (localStorage.getItem(key) === null) {
      save(key, DEFAULTS[name])
    }
  })
}

export const getSettings = () => get(KEYS.settings) || DEFAULTS.settings
export const saveSettings = (data) => save(KEYS.settings, data)

export const getFormules = () => get(KEYS.formules) || DEFAULTS.formules
export const saveFormules = (data) => save(KEYS.formules, data)

export const getMenus = () => get(KEYS.menus) || DEFAULTS.menus
export const saveMenus = (data) => save(KEYS.menus, data)

export const getGateaux = () => get(KEYS.gateaux) || DEFAULTS.gateaux
export const saveGateaux = (data) => save(KEYS.gateaux, data)

export const getPrestations = () => get(KEYS.prestations) || DEFAULTS.prestations
export const savePrestations = (data) => save(KEYS.prestations, data)

export const getClients = () => get(KEYS.clients) || []
export const saveClients = (data) => save(KEYS.clients, data)

export const getLoginAttempts = () => get(KEYS.loginAttempts) || DEFAULTS.loginAttempts
export const saveLoginAttempts = (data) => save(KEYS.loginAttempts, data)

export function generateDevisNumber() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const dateStr = `${yyyy}${mm}${dd}`

  const clients = getClients()
  const todayPrefix = `DEV-${dateStr}-`
  const todayDevis = clients.filter((c) => c.devisNumber && c.devisNumber.startsWith(todayPrefix))
  const nextNum = String(todayDevis.length + 1).padStart(3, '0')
  return `${todayPrefix}${nextNum}`
}

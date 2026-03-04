import {
  DEFAULT_PIN,
  DEFAULT_BUSINESS_INFO,
  DEFAULT_FORMULES,
  DEFAULT_MENU_SECTIONS,
  DEFAULT_GATEAUX,
  DEFAULT_PRESTATIONS,
} from "./defaultData";

const KEYS = {
  PIN: "lp77_pin",
  BUSINESS: "lp77_business",
  FORMULES: "lp77_formules",
  MENU: "lp77_menu",
  GATEAUX: "lp77_gateaux",
  PRESTATIONS: "lp77_prestations",
  CLIENTS: "lp77_clients",
  DEVIS: "lp77_devis",
  LOCKOUT: "lp77_lockout",
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getPin: () => load(KEYS.PIN, DEFAULT_PIN),
  setPin: (pin) => save(KEYS.PIN, pin),

  getBusinessInfo: () => load(KEYS.BUSINESS, DEFAULT_BUSINESS_INFO),
  setBusinessInfo: (info) => save(KEYS.BUSINESS, info),

  getFormules: () => load(KEYS.FORMULES, DEFAULT_FORMULES),
  setFormules: (formules) => save(KEYS.FORMULES, formules),

  getMenu: () => load(KEYS.MENU, DEFAULT_MENU_SECTIONS),
  setMenu: (menu) => save(KEYS.MENU, menu),

  getGateaux: () => load(KEYS.GATEAUX, DEFAULT_GATEAUX),
  setGateaux: (gateaux) => save(KEYS.GATEAUX, gateaux),

  getPrestations: () => load(KEYS.PRESTATIONS, DEFAULT_PRESTATIONS),
  setPrestations: (prestations) => save(KEYS.PRESTATIONS, prestations),

  getClients: () => load(KEYS.CLIENTS, []),
  setClients: (clients) => save(KEYS.CLIENTS, clients),

  getDevis: () => load(KEYS.DEVIS, []),
  setDevis: (devis) => save(KEYS.DEVIS, devis),

  getLockout: () => load(KEYS.LOCKOUT, { attempts: 0, lockedUntil: null }),
  setLockout: (lockout) => save(KEYS.LOCKOUT, lockout),
};

import { createContext, useContext, useState, useEffect } from "react";
import { storage } from "../utils/storage";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [pin, setPin] = useState(() => storage.getPin());
  const [businessInfo, setBusinessInfo] = useState(() => storage.getBusinessInfo());
  const [formules, setFormules] = useState(() => storage.getFormules());
  const [menu, setMenu] = useState(() => storage.getMenu());
  const [gateaux, setGateaux] = useState(() => storage.getGateaux());
  const [prestations, setPrestations] = useState(() => storage.getPrestations());
  const [clients, setClients] = useState(() => storage.getClients());
  const [devis, setDevis] = useState(() => storage.getDevis());

  useEffect(() => { storage.setPin(pin); }, [pin]);
  useEffect(() => { storage.setBusinessInfo(businessInfo); }, [businessInfo]);
  useEffect(() => { storage.setFormules(formules); }, [formules]);
  useEffect(() => { storage.setMenu(menu); }, [menu]);
  useEffect(() => { storage.setGateaux(gateaux); }, [gateaux]);
  useEffect(() => { storage.setPrestations(prestations); }, [prestations]);
  useEffect(() => { storage.setClients(clients); }, [clients]);
  useEffect(() => { storage.setDevis(devis); }, [devis]);

  function saveDevis(newDevis) {
    setDevis((prev) => {
      const idx = prev.findIndex((d) => d.numero === newDevis.numero);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newDevis;
        return updated;
      }
      return [...prev, newDevis];
    });

    // Upsert client
    setClients((prev) => {
      const exists = prev.find((c) => c.email === newDevis.client.email);
      if (exists) return prev;
      return [...prev, { ...newDevis.client, id: newDevis.client.email, devisIds: [] }];
    });
  }

  return (
    <AppContext.Provider
      value={{
        pin, setPin,
        businessInfo, setBusinessInfo,
        formules, setFormules,
        menu, setMenu,
        gateaux, setGateaux,
        prestations, setPrestations,
        clients, setClients,
        devis, setDevis,
        saveDevis,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

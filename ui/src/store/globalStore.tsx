import React, { createContext } from "react";
import { useLocalStore } from "mobx-react-lite";

interface GlobalStoreContextProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (value: boolean) => void;
  instanceDisplayCount: number;
  setInstanceDisplayCount: (value: number) => void;
}

export const globalStoreContext = createContext({} as GlobalStoreContextProps);

export const StoreProvider = ({ children }) => {
  const store = useLocalStore(() => ({
    // Update Modal
    isUpdateModalOpen: false,
    setIsUpdateModalOpen(value: boolean) {
      store.isUpdateModalOpen = value;
    },

    // Display count
    instanceDisplayCount: 2,
    setInstanceDisplayCount(value: number) {
      store.instanceDisplayCount = value;
    },
  }));

  return (
    <globalStoreContext.Provider value={store}>
      {children}
    </globalStoreContext.Provider>
  );
};

import APP_CONFIG from "@config/appConfig";
import { useLocalObservable } from "mobx-react-lite";
import React, { createContext } from "react";

interface GlobalStoreContextProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (value: boolean) => void;

  serverDisplayCount: number;
  setServerDisplayCount: (value: number) => void;

  displayVersions: string[] | undefined;
  setDisplayVersions: (value: string[]) => void;

  showMoreInfo: boolean;
  setShowMoreInfo: (value: boolean) => void;

  orderBy: string;
  setOrderBy: (value: string) => void;

  keyLocation: string;
  setKeyLocation: (value: string, checkForTrailingSlash?: boolean) => void;
}

export const globalStoreContext = createContext({} as GlobalStoreContextProps);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const getDefaultValue = (
    localValue: string,
    defaultValue: string | boolean | number,
  ) => {
    return localStorage.getItem(localValue) !== null
      ? localStorage.getItem(localValue)
      : defaultValue;
  };

  const store = useLocalObservable(() => ({
    // Update Modal
    isUpdateModalOpen: false,
    setIsUpdateModalOpen(value: boolean) {
      store.isUpdateModalOpen = value;
    },

    // Display count
    serverDisplayCount: getDefaultValue(
      `serverDisplayCount`,
      APP_CONFIG.DEFAULTS.SERVER_DISPLAY_COUNT,
    ),
    setServerDisplayCount(value: number) {
      store.serverDisplayCount = value;
      localStorage.setItem(`serverDisplayCount`, value.toString());
    },

    // Display versions
    displayVersions: undefined as string[] | undefined,
    setDisplayVersions(value: string[] | undefined) {
      store.displayVersions = value;
    },

    // Display versions
    showMoreInfo: getDefaultValue(
      `showMoreInfo`,
      APP_CONFIG.DEFAULTS.SHOW_MORE_INFO,
    ),
    setShowMoreInfo(value: boolean) {
      store.showMoreInfo = value;
      localStorage.setItem(`showMoreInfo`, value.toString());
    },

    // Display versions
    orderBy: getDefaultValue(`orderBy`, APP_CONFIG.DEFAULTS.ORDER_BY),
    setOrderBy(value: string) {
      store.orderBy = value;
      localStorage.setItem(`orderBy`, value);
    },

    // Display versions
    keyLocation: getDefaultValue(
      `keyLocation`,
      APP_CONFIG.DEFAULTS.KEY_LOCATION,
    ),
    setKeyLocation(value: string, checkForTrailingSlash = false) {
      if (checkForTrailingSlash && !value.endsWith(`/`)) value += `/`;
      store.keyLocation = value;
      localStorage.setItem(`keyLocation`, value);
    },
  }));

  return (
    <globalStoreContext.Provider value={store}>
      {children}
    </globalStoreContext.Provider>
  );
};

import { useLocalObservable } from "mobx-react-lite";
import React, { createContext } from "react";

import APP_CONFIG from "../../appConfig";

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

  resetToDefaultValues: () => void;
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

    // Display more info
    showMoreInfo:
      getDefaultValue(`showMoreInfo`, APP_CONFIG.DEFAULTS.SHOW_MORE_INFO) ===
      `true`,
    setShowMoreInfo(value: boolean) {
      store.showMoreInfo = value;
      localStorage.setItem(`showMoreInfo`, value.toString());
    },

    // Server order
    orderBy: getDefaultValue(`orderBy`, APP_CONFIG.DEFAULTS.ORDER_BY),
    setOrderBy(value: string) {
      store.orderBy = value;
      localStorage.setItem(`orderBy`, value);
    },

    // Key file location
    keyLocation: getDefaultValue(
      `keyLocation`,
      APP_CONFIG.DEFAULTS.KEY_LOCATION,
    ),
    setKeyLocation(value: string, checkForTrailingSlash = false) {
      if (checkForTrailingSlash && !value.endsWith(`/`)) value += `/`;
      store.keyLocation = value;
      localStorage.setItem(`keyLocation`, value);
    },

    resetToDefaultValues() {
      store.setServerDisplayCount(APP_CONFIG.DEFAULTS.SERVER_DISPLAY_COUNT);
      store.setShowMoreInfo(APP_CONFIG.DEFAULTS.SHOW_MORE_INFO);
      store.setOrderBy(APP_CONFIG.DEFAULTS.ORDER_BY);
      store.setKeyLocation(APP_CONFIG.DEFAULTS.KEY_LOCATION);
      localStorage.removeItem(`keyLocation`);
      localStorage.removeItem(`orderBy`);
      localStorage.removeItem(`showMoreInfo`);
      localStorage.removeItem(`serverDisplayCount`);
    },
  }));

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <globalStoreContext.Provider value={store}>
      {children}
    </globalStoreContext.Provider>
  );
};

import React, { createContext, useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { APP_CONFIG } from "../../../config";

export const initialState = {
  pageData: [],
  urlEnvParams: [],
  urlVersionParams: [],
  urlSortBy: "stackName",
  keyLocation: "~/.ssh/",
  showAdvanced: false,
  instanceDisplayCount: 2,
  rememberSettings: false,
  updateRememberSettings: (rememberSettings: boolean) => {},
  updateKeyLocation: (keyLocation: string) => {},
  updateShowAdvanced: (show: boolean) => {},
  updateInstanceDisplayCount: (value: number) => {},
  updateUrlParams: (params: { key: string; value: string | [] }) => {},
  setDataCalledAt: (time: number) => {},
};

export const StateContext = createContext(initialState);

export const StateProvider = ({ children }) => {
  // URL Params
  const [urlEnvParams, setUrlEnvParams] = useState(initialState.urlEnvParams);
  const [urlVersionParams, setUrlVersionParams] = useState(
    initialState.urlVersionParams,
  );
  const urlParams = new URLSearchParams(window.location.search);
  const getUrlParams = () => {
    if (urlParams.has("env")) {
      setUrlEnvParams(urlParams.get("env").split(","));
    }
    if (urlParams.has("version")) {
      setUrlVersionParams(urlParams.get("version").split(","));
    }
    if (urlParams.has("sortBy")) {
      setUrlSortBy(urlParams.get("sortBy"));
    }
  };

  const updateUrlParams = (params: { key: string; value: string }) => {
    urlParams.set(params.key, params.value.toString());
    history.pushState({}, null, `?${decodeURIComponent(urlParams.toString())}`);
    getUrlParams();
  };
  useEffect(() => {
    getUrlParams();
  }, []);

  // User Settings
  const getInitialRememberSettings = () => {
    if (localStorage.getItem("rememberSettings") === "true") {
      return true;
    }
    return initialState.rememberSettings;
  };
  const [rememberSettings, setRememberSettings] = useState(
    getInitialRememberSettings(),
  );
  const updateRememberSettings = (setting: boolean) => {
    setRememberSettings(setting);
    localStorage.setItem("rememberSettings", setting.toString());
  };

  const [urlSortBy, setUrlSortBy] = useState(initialState.urlSortBy);

  // Show Advanced data on cards
  const getInitialShowAdvanced = () => {
    if (rememberSettings && localStorage.getItem("showAdvanced") === "true") {
      return true;
    } else if (
      urlParams.has("showAdvanced") &&
      urlParams.get("showAdvanced") === "true"
    ) {
      return true;
    }
    return initialState.showAdvanced;
  };
  const [showAdvanced, setShowAdvanced] = useState(getInitialShowAdvanced());
  const updateShowAdvanced = (setting: boolean) => {
    setShowAdvanced(setting);
    if (rememberSettings) {
      localStorage.setItem("showAdvanced", setting.toString());
    }
    updateUrlParams({ key: "showAdvanced", value: setting.toString() });
  };

  // Show number of instances on cards
  const getInitialInstanceDisplayCount = () => {
    if (rememberSettings) {
      return Number(localStorage.getItem("instanceDisplayCount"));
    } else if (urlParams.has("instanceDisplayCount")) {
      return Number(urlParams.get("instanceDisplayCount"));
    }
    return initialState.instanceDisplayCount;
  };
  const [instanceDisplayCount, setInstanceDisplayCount] = useState(
    getInitialInstanceDisplayCount(),
  );
  const updateInstanceDisplayCount = (setting: number) => {
    setInstanceDisplayCount(setting);
    if (rememberSettings) {
      localStorage.setItem("instanceDisplayCount", setting.toString());
    }
    updateUrlParams({ key: "instanceDisplayCount", value: setting.toString() });
  };

  // Customise key file location
  const getInitialKeyLocation = () => {
    if (rememberSettings && localStorage.getItem("keyLocation")) {
      return localStorage.getItem("keyLocation");
    } else if (urlParams.has("keyLocation")) {
      return urlParams.get("keyLocation");
    }
    return initialState.keyLocation;
  };
  const [keyLocation, setUrlKeyLocation] = useState(getInitialKeyLocation());
  const updateKeyLocation = (keyLocation: string) => {
    setUrlKeyLocation(keyLocation);
    if (rememberSettings) {
      localStorage.setItem("keyLocation", keyLocation);
    }
    updateUrlParams({ key: "keyLocation", value: keyLocation });
  };

  // Page data
  const [pageData, setPageData] = useState(initialState.pageData);
  const [dataCalledAt, setDataCalledAt] = useState(new Date().getTime());
  const [data, loading] = useFetch(APP_CONFIG.DATA_URL, dataCalledAt);
  useEffect(() => {
    setPageData(data);
  }, [loading]);

  // Data to expose to rest of app
  const providerObject = {
    ...initialState,
    keyLocation,
    rememberSettings,
    updateRememberSettings,
    pageData,
    setDataCalledAt,
    updateKeyLocation,
    updateUrlParams,
    urlEnvParams,
    urlSortBy,
    showAdvanced,
    urlVersionParams,
    instanceDisplayCount,
    updateShowAdvanced,
  };

  return (
    <StateContext.Provider value={providerObject}>
      {children}
    </StateContext.Provider>
  );
};

import React, { createContext, useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { APP_CONFIG } from "../config";

export const defaultValues = {
  pageData: [],
  sidebarData: [],
  urlEnvParams: [],
  urlVersionParams: [],
  urlSearchParams: [],
  updatePageData: () => {},
  updateSidebarData: () => {},
};

export const StateContext = createContext(defaultValues);

export const StateProvider = ({ children }) => {
  const [pageData, setPageData] = useState(defaultValues.pageData);
  const [sidebarData, setSidebarData] = useState(defaultValues.sidebarData);

  const [urlEnvParams, setUrlEnvParams] = useState([]);
  const [urlVersionParams, setUrlVersionParams] = useState([]);
  const [urlSearchParams, setUrlSearchParams] = useState(null);

  const updatePageData = () => {
    const [data, loading] = useFetch(APP_CONFIG.DATA_URL);
    useEffect(() => {
      setPageData(data);
    }, [loading]);
  };

  const updateSidebarData = () => {
    const [data, loading] = useFetch(APP_CONFIG.SIDEBAR_URL);
    useEffect(() => {
      setSidebarData(data);
    }, [loading]);
  };

  const urlParams = new URLSearchParams(window.location.search);
  const getUrlParams = () => {
    if (urlParams.has("env")) {
      setUrlEnvParams(urlParams.get("env").split(","));
    }
    if (urlParams.has("version")) {
      setUrlVersionParams(urlParams.get("version").split(","));
    }
    if (urlParams.has("search")) {
      setUrlSearchParams(urlParams.get("search"));
    }
  };
  useEffect(() => {
    getUrlParams();
  }, []);

  return (
    <StateContext.Provider
      value={{
        ...defaultValues,
        pageData,
        sidebarData,
        urlEnvParams,
        urlVersionParams,
        urlSearchParams,
        updatePageData,
        updateSidebarData,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

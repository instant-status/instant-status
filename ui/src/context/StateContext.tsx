import React, { createContext, useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { APP_CONFIG } from "../config";

export const defaultValues = {
  pageData: [],
  urlEnvParams: [],
  urlVersionParams: [],
  updateUrlParams: (params: object) => {},
};

export const StateContext = createContext(defaultValues);

export const StateProvider = ({ children }) => {
  const [pageData, setPageData] = useState(defaultValues.pageData);

  const [urlEnvParams, setUrlEnvParams] = useState(defaultValues.urlEnvParams);
  const [urlVersionParams, setUrlVersionParams] = useState(
    defaultValues.urlVersionParams,
  );

  const [data, loading] = useFetch(APP_CONFIG.DATA_URL);
  useEffect(() => {
    setPageData(data);
  }, [loading]);

  const urlParams = new URLSearchParams(window.location.search);
  const getUrlParams = () => {
    if (urlParams.has("env")) {
      setUrlEnvParams(urlParams.get("env").split(","));
    }
    if (urlParams.has("version")) {
      setUrlVersionParams(urlParams.get("version").split(","));
    }
  };

  const updateUrlParams = (params: { key: string; value: string }) => {
    console.log("params.value", params.value.toString());
    urlParams.set(params.key, params.value.toString());
    console.log("urlParams", urlParams);
    history.pushState({}, null, `?${decodeURIComponent(urlParams.toString())}`);
    getUrlParams();
  };

  useEffect(() => {
    getUrlParams();
  }, []);

  return (
    <StateContext.Provider
      value={{
        ...defaultValues,
        pageData,
        urlEnvParams,
        urlVersionParams,
        updateUrlParams,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

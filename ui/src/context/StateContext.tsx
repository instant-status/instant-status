import React, { createContext, useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { APP_CONFIG } from "../config";

export const initialState = {
  pageData: [],
  urlEnvParams: [],
  urlVersionParams: [],
  urlSortByParams: [],
  updateUrlParams: (params: object) => {},
};

export const StateContext = createContext(initialState);

export const StateProvider = ({ children }) => {
  const [pageData, setPageData] = useState(initialState.pageData);

  const [urlEnvParams, setUrlEnvParams] = useState(initialState.urlEnvParams);
  const [urlVersionParams, setUrlVersionParams] = useState(
    initialState.urlVersionParams,
  );
  const [urlSortByParams, setUrlSortByParams] = useState(
    initialState.urlSortByParams,
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
    if (urlParams.has("sortBy")) {
      setUrlSortByParams(urlParams.get("sortBy").split(","));
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

  return (
    <StateContext.Provider
      value={{
        ...initialState,
        pageData,
        urlEnvParams,
        urlVersionParams,
        updateUrlParams,
        urlSortByParams,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

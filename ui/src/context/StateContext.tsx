import React, { createContext, useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";

export const defaultValues = {
  pageData: [],
  updatePageData: () => {}
};

export const StateContext = createContext(defaultValues);

export const StateProvider = ({ children }) => {
  const [pageData, setPageData] = useState(defaultValues.pageData);

  const updatePageData = () => {
    const [data, loading] = useFetch("http://localhost:3000/instances");
    useEffect(() => {
      setPageData(data);
    }, [loading]);
  };

  return (
    <StateContext.Provider
      value={{
        ...defaultValues,
        updatePageData,
        pageData
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

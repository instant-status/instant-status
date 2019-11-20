import { useEffect, useState } from "react";

const useFetch = (url: string, update: any) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  console.log("error", error);

  useEffect(() => {
    const token =
      localStorage.getItem("user") !== "null"
        ? JSON.parse(localStorage.getItem("user")).id_token
        : null;
    const fetchData = async () => {
      try {
        const res = await fetch(url, {
          headers: new Headers({
            authorization: `Bearer ${token}`
          })
        });
        const json = await res.json();
        setResponse(json);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, update);
  return { response };
};

export default useFetch;

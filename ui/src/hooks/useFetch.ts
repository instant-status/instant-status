import { useEffect, useState } from "react";

const useFetch = (url: string, update: any) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const token =
      localStorage.getItem("user") &&
      JSON.parse(localStorage.getItem("user")).id_token;
    const fetchData = async () => {
      try {
        const res = await fetch(url, {
          headers: new Headers({
            Authorization: token
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
  return { response, error };
};

export default useFetch;

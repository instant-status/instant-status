import { useEffect, useState } from "react";

function useFetch(url: string, reload?: any) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchUrl(token: string) {
    const response = await fetch(url, {
      credentials: "same-origin",
      headers: new Headers({
        authorization: `Bearer ${token}`,
      }),
    });
    const json = await response.json();
    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    const token = localStorage.getItem("bearer");
    setLoading(true);
    fetchUrl(token);
  }, [reload] || []);

  return [data, loading] as [typeof data, typeof loading];
}

export default useFetch;

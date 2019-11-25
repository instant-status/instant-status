import { useEffect, useState } from "react";

function useFetch(url: string, reload?: any) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchUrl() {
    const response = await fetch(url, {
      credentials: "same-origin",
    });
    const json = await response.json();
    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    fetchUrl();
  }, reload || []);

  return [data, loading] as [typeof data, typeof loading];
}

export default useFetch;

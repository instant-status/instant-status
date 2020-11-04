import Cookies from "js-cookie";
import { useEffect, useState } from "react";

function useFetch(url: string, watch: string) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchUrl(token: string) {
    const response = await fetch(url, {
      credentials: `same-origin`,
      headers: new Headers({
        authorization: `Bearer ${token}`,
      }),
    });
    const json = await response.json();
    if (response.status !== 200) {
      setData([{ error: `Unauthorised` }]);
    } else {
      setData(json);
    }
    setLoading(false);
  }

  useEffect(() => {
    const token = localStorage.getItem(`bearer`) || Cookies.get(`Auth-Bearer`);
    setLoading(true);
    fetchUrl(token);
  }, [watch] || []);

  return [data, loading] as [typeof data, typeof loading];
}

export default useFetch;

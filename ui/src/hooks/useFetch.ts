import Cookies from "js-cookie";

const fetchUrl = async (url: string) => {
  const response = await fetch(url, {
    credentials: `same-origin`,
    headers: new Headers({
      authorization: `Bearer ${
        localStorage.getItem(`bearer`) || Cookies.get(`Auth-Bearer`)
      }`,
    }),
  });
  return await response.json();
};

export default fetchUrl;

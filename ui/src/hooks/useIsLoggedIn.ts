import Cookies from "js-cookie";

const useIsLoggedIn = () => {
  const isLoggedIn =
    Boolean(localStorage.getItem(`bearer`)) ||
    Boolean(Cookies.get(`Auth-Bearer`));
  return { isLoggedIn };
};

export default useIsLoggedIn;

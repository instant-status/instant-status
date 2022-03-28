import Cookies from "js-cookie";

import APP_CONFIG from "../../appConfig";

const useIsLoggedIn = () => {
  const isLoggedIn = Boolean(Cookies.get(APP_CONFIG.COOKIE_NAME));
  return { isLoggedIn };
};

export default useIsLoggedIn;

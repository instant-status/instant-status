import Cookies from "js-cookie";
import React, { memo, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

import APP_CONFIG from "../../../appConfig";

const Logout = () => {
  const location = useLocation();

  console.log(location);

  useEffect(() => {
    Cookies.remove(APP_CONFIG.COOKIE_NAME);
  }, []);

  return (
    <Navigate to="/login" state={{ from: location.search }} replace={true} />
  );
};

export default memo(Logout);

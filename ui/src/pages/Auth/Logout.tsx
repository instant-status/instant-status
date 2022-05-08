import Cookies from "js-cookie";
import React, { memo, useEffect } from "react";
import { Navigate } from "react-router-dom";

import APP_CONFIG from "../../../appConfig";

const Logout = () => {
  useEffect(() => {
    Cookies.remove(APP_CONFIG.COOKIE_NAME);
  }, []);

  return <Navigate to="/login" replace={true} />;
};

export default memo(Logout);

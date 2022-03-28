import Cookies from "js-cookie";
import React, { memo, useEffect } from "react";
import { Redirect } from "react-router-dom";

import APP_CONFIG from "../../../appConfig";

const Logout = () => {
  useEffect(() => {
    Cookies.remove(APP_CONFIG.COOKIE_NAME);
  }, []);
  return <Redirect to="/login" push={true} />;
};

export default memo(Logout);

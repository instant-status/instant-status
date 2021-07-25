import APP_CONFIG from "@config/appConfig";
import { memo } from "react";

const AutoLogin = () => {
  window.location.href = APP_CONFIG.GOOGLE_AUTH_URL;
  return null;
};

export default memo(AutoLogin);

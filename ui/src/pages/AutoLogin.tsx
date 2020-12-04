import { memo } from "react";

import APP_CONFIG from "../config";

const AutoLogin = () => {
  window.location.href = APP_CONFIG.GOOGLE_AUTH_URL;
  return null;
};

export default memo(AutoLogin);

import { memo } from "react";

import APP_CONFIG from "../../../appConfig";

const AutoLogin = () => {
  window.location.href = APP_CONFIG.GOOGLE_AUTH_URL || `/login`;
  return null;
};

export default memo(AutoLogin);

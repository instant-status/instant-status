import { APP_CONFIG } from "../../config";

export const isRequestAuthenticated = request => {
  if (request.token === APP_CONFIG.BEARER_TOKEN) {
    return true;
  }

  return false;
};

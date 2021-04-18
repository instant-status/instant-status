import Cookies from "js-cookie";
import APP_CONFIG from "../../../config/appConfig";

const apiFetch = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      credentials: `same-origin`,
      authorization: `Bearer ${
        localStorage.getItem(`bearer`) || Cookies.get(`Auth-Bearer`)
      }`,
    },
  });
  return await response.json();
};

const apiPost = async (url: string, body: any) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      credentials: `same-origin`,
      authorization: `Bearer ${
        localStorage.getItem(`bearer`) || Cookies.get(`Auth-Bearer`)
      }`,
    },
  });
  return await response.json();
};

const apiGetStacks = () => {
  return apiFetch(`${APP_CONFIG.DATA_URL}/instances?groupBy=stack_id`);
};

const apiCreateUpdate = (payload: { body: any }) => {
  return apiPost(`${APP_CONFIG.DATA_URL}/v2/update/create`, payload.body);
};

const apiGetStacksAvailableForUpdate = () => {
  return apiFetch(`${APP_CONFIG.DATA_URL}/v2/stacks/available-for-update`);
};

const apiGetUpdatingStacks = () => {
  return apiFetch(`${APP_CONFIG.DATA_URL}/v2/stacks/updating`);
};

export default {
  apiGetStacks,
  apiCreateUpdate,
  apiGetStacksAvailableForUpdate,
  apiGetUpdatingStacks,
};

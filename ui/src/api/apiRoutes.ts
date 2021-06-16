import APP_CONFIG from "@config/appConfig";
import Cookies from "js-cookie";

const apiFetch = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      "Content-type": `application/json; charset=UTF-8`,
      credentials: `same-origin`,
      authorization: `Bearer ${
        localStorage.getItem(`bearer`) || Cookies.get(`Auth-Bearer`)
      }`,
    },
  });
  return await response.json();
};

const apiPost = async <T>(url: string, body: T) => {
  const response = await fetch(url, {
    method: `POST`,
    body: JSON.stringify(body),
    headers: {
      "Content-type": `application/json; charset=UTF-8`,
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

export interface CreateUpdateProps {
  stack_ids: string[];
  run_migrations: boolean;
  update_app_to: string;
  update_xapi_to: string;
}

const apiCreateUpdate = (payload: { body: CreateUpdateProps }) => {
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

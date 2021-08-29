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
  return apiFetch(`${APP_CONFIG.DATA_URL}/v2/servers?groupBy=stack_id`);
};

export interface CreateUpdateProps {
  stack_ids: number[];
  run_migrations: boolean;
  update_app_to: string;
  update_xapi_to: string;
}

const apiGetStacksList = () => {
  return apiFetch(`${APP_CONFIG.DATA_URL}/v2/stacks`);
};

const apiCreateStack = (payload: { body: CreateUpdateProps }) => {
  return apiPost(`${APP_CONFIG.DATA_URL}/v2/stack`, payload.body);
};

const apiCreateUpdate = (payload: { body: CreateUpdateProps }) => {
  return apiPost(`${APP_CONFIG.DATA_URL}/v2/update/create`, payload.body);
};

export default {
  apiGetStacksList,
  apiCreateStack,
  apiGetStacks,
  apiCreateUpdate,
};

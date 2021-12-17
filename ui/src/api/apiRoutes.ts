import Cookies from "js-cookie";

import APP_CONFIG from "../../appConfig";

const apiFetch = async (url: string) => {
  const bearer =
    localStorage.getItem(`bearer`) || Cookies.get(APP_CONFIG.COOKIE_NAME);

  const response = await fetch(url, {
    headers: {
      "Content-type": `application/json; charset=UTF-8`,
      credentials: `same-origin`,
      ...(bearer && { authorization: `Bearer ${bearer}` }),
    },
  });
  const data = await response;

  if (data.status === 401) {
    window.location.href = `/logout`;
  }
  return data.json();
};

const apiPost = async <T>(url: string, body: T) => {
  const bearer =
    localStorage.getItem(`bearer`) || Cookies.get(APP_CONFIG.COOKIE_NAME);

  const response = await fetch(url, {
    method: `POST`,
    body: JSON.stringify(body),
    headers: {
      "Content-type": `application/json; charset=UTF-8`,
      credentials: `same-origin`,
      ...(bearer && { authorization: `Bearer ${bearer}` }),
    },
  });
  const data = await response;

  if (data.status === 401) {
    window.location.href = `/logout`;
  }
  return data.json();
};

export interface CreateUpdateProps {
  stack_ids: number[];
  run_migrations: boolean;
  update_app_to: string;
  update_xapi_to: string;
}

export interface CreateStackProps {
  stack_names: string[];
  run_migrations: boolean;
  update_app_to: string;
  update_xapi_to: string;
}

const apiGetStacksList = () => {
  return apiFetch(`${APP_CONFIG.DATA_URL}/v2/stacks`);
};

const apiGetStacksMetadata = () => {
  return apiFetch(`${APP_CONFIG.DATA_URL}/v2/metadata`);
};

const apiCreateStack = (payload: { body: CreateStackProps }) => {
  return apiPost(`${APP_CONFIG.DATA_URL}/v2/stack`, payload.body);
};

const apiCreateUpdate = (payload: { body: CreateUpdateProps }) => {
  return apiPost(`${APP_CONFIG.DATA_URL}/v2/update/create`, payload.body);
};

export default {
  apiGetStacksList,
  apiGetStacksMetadata,
  apiCreateStack,
  apiCreateUpdate,
};

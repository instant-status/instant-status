import Cookies from "js-cookie";

import APP_CONFIG from "../../appConfig";

const apiFetch = async (url: string) => {
  const bearer = Cookies.get(APP_CONFIG.COOKIE_NAME);

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
  const bearer = Cookies.get(APP_CONFIG.COOKIE_NAME);

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
}

export interface CreateStackProps {
  name: string;
  run_migrations: boolean;
  update_app_to: string;
}

export interface DeleteStacksProps {
  stack_ids: number[];
}

export interface UpdateUserProps {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  roles: number[];
}

export type CreateUserProps = Omit<UpdateUserProps, `id`>;

export interface DeleteUsersProps {
  user_ids: number[];
}

export interface UpdateRoleProps {
  id: number;
  name: string;
  view_stacks: string[];
  update_stacks: string[];
  view_stack_environments: string[];
  update_stack_environments: string[];
}

export type CreateRoleProps = Omit<UpdateRoleProps, `id`>;

export interface DeleteRolesProps {
  role_ids: number[];
}

const apiGetStacksList = () => {
  return apiFetch(`${APP_CONFIG.DATA_URL}/v2/stacks`);
};

const apiGetAvailableStacksAndEnvironments = () => {
  return apiFetch(
    `${APP_CONFIG.DATA_URL}/v2/stack/get-available-stacks-and-environments`,
  );
};

const apiGetUsers = () => {
  return apiFetch(`${APP_CONFIG.DATA_URL}/v2/admin/users`);
};

const apiCreateUser = (payload: { body: CreateUserProps }) => {
  return apiPost(`${APP_CONFIG.DATA_URL}/v2/admin/user/create`, payload.body);
};

const apiEditUser = (payload: { body: UpdateUserProps }) => {
  return apiPost(`${APP_CONFIG.DATA_URL}/v2/admin/user/edit`, payload.body);
};

const apiDeleteUsers = (payload: { body: DeleteUsersProps }) => {
  return apiPost(`${APP_CONFIG.DATA_URL}/v2/admin/users/delete`, payload.body);
};

const apiGetStacksMetadata = () => {
  return apiFetch(`${APP_CONFIG.DATA_URL}/v2/metadata`);
};

const apiGetRoles = () => {
  return apiFetch(`${APP_CONFIG.DATA_URL}/v2/admin/roles`);
};

const apiCreateRole = (payload: { body: CreateRoleProps }) => {
  return apiPost(`${APP_CONFIG.DATA_URL}/v2/admin/role/create`, payload.body);
};

const apiUpdateRole = (payload: { body: UpdateRoleProps }) => {
  return apiPost(`${APP_CONFIG.DATA_URL}/v2/admin/role/edit`, payload.body);
};

const apiDeleteRoles = (payload: { body: DeleteRolesProps }) => {
  return apiPost(`${APP_CONFIG.DATA_URL}/v2/admin/roles/delete`, payload.body);
};

const apiCreateStack = (payload: { body: CreateStackProps }) => {
  return apiPost(`${APP_CONFIG.DATA_URL}/v2/stack`, payload.body);
};

const apiDeleteStacks = (payload: { body: DeleteStacksProps }) => {
  return apiPost(`${APP_CONFIG.DATA_URL}/v2/admin/stacks/delete`, payload.body);
};

const apiCreateUpdate = (payload: { body: CreateUpdateProps }) => {
  return apiPost(`${APP_CONFIG.DATA_URL}/v2/update/create`, payload.body);
};

export default {
  apiGetStacksList,
  apiGetStacksMetadata,
  apiGetAvailableStacksAndEnvironments,
  apiCreateUser,
  apiGetRoles,
  apiCreateRole,
  apiUpdateRole,
  apiDeleteRoles,
  apiEditUser,
  apiGetUsers,
  apiDeleteUsers,
  apiCreateStack,
  apiDeleteStacks,
  apiCreateUpdate,
};

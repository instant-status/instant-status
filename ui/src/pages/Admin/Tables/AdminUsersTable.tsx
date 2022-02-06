import moment from "moment";
import React, { memo, useState } from "react";
import { useMutation } from "react-query";

import apiRoutes, {
  CreateUserProps,
  DeleteUsersProps,
  UpdateUserProps,
} from "../../../api/apiRoutes";
import { SmallButton } from "../../../components/Controls/Buttons";
import MultiSelectInput from "../../../components/Controls/MultiSelectInput";
import TextInput from "../../../components/Controls/TextInput";
import Stack from "../../../components/Layout/Stack";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Tables/AdminTable";
import theme from "../../../utils/theme";
export interface NewUserProps {
  isInCreateMode?: boolean;
}

export interface UserProps extends NewUserProps {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_super_admin: boolean;
  roles: { id: number; name: string }[];
  created_at: string;
}

interface AdminUsersTableProps {
  users: UserProps[];
  availableRoles: { id: number; name: string }[];
  onSuccess: () => void;
  onCancel?: () => void;
}

const UserRow = (props: {
  user: UserProps;
  availableRoles: AdminUsersTableProps[`availableRoles`];
  onSuccess: AdminUsersTableProps[`onSuccess`];
  onCancel: AdminUsersTableProps[`onCancel`];
}) => {
  const [isInEditMode, setIsEditMode] = useState(props.user.isInCreateMode);

  const [firstName, setFirstName] = useState(props.user.first_name);
  const [lastName, setLastName] = useState(props.user.last_name);
  const [email, setEmail] = useState(props.user.email);
  const [roles, setRoles] = useState(
    (props.user.roles || []).map((role) => ({
      label: role.name,
      value: role.id,
    })),
  );

  const updateUserMutation = useMutation((payload: UpdateUserProps) =>
    apiRoutes.apiEditUser({ body: payload }),
  );

  const createUserMutation = useMutation((payload: CreateUserProps) =>
    apiRoutes.apiCreateUser({ body: payload }),
  );

  const deleteUsersMutation = useMutation((payload: DeleteUsersProps) =>
    apiRoutes.apiDeleteUsers({ body: payload }),
  );

  const clearForm = () => {
    setFirstName(props.user.first_name);
    setLastName(props.user.last_name);
    setEmail(props.user.email);
    setRoles(
      (props.user.roles || []).map((role) => ({
        label: role.name,
        value: role.id,
      })),
    );
    setIsEditMode(false);
    props.onCancel?.();
  };

  const updateOrCreateUser = () => {
    if (firstName && lastName && email) {
      if (props.user.isInCreateMode) {
        createUserMutation.mutate(
          {
            first_name: firstName,
            last_name: lastName,
            email,
            roles: roles.map((role) => role.value),
          },
          {
            onSuccess: () => {
              props.onSuccess && props.onSuccess();
              clearForm();
            },
          },
        );
      } else {
        updateUserMutation.mutate(
          {
            id: props.user.id,
            first_name: firstName,
            last_name: lastName,
            email,
            roles: roles.map((role) => role.value),
          },
          {
            onSuccess: () => {
              props.onSuccess && props.onSuccess();
              clearForm();
            },
          },
        );
      }
    }
  };

  const deleteUser = () => {
    const canDelete = confirm(
      `Are you sure you want to delete "${props.user.email}"`,
    );
    if (canDelete) {
      deleteUsersMutation.mutate(
        { user_ids: [props.user.id] },
        { onSuccess: () => props.onSuccess?.() },
      );
    }
  };

  return (
    <TableRow>
      <TableCell>{props.user.is_super_admin ? `👑 ` : ``}</TableCell>
      <TableCell>
        {isInEditMode ? (
          <TextInput
            value={firstName}
            name="firstName"
            onChange={(event) => setFirstName(event.target.value)}
            label="First Name"
            required={true}
          />
        ) : (
          props.user.first_name
        )}
      </TableCell>
      <TableCell>
        {isInEditMode ? (
          <TextInput
            value={lastName}
            name="lastName"
            onChange={(event) => setLastName(event.target.value)}
            label="Last Name"
            required={true}
          />
        ) : (
          props.user.last_name
        )}
      </TableCell>
      <TableCell>
        {isInEditMode ? (
          <TextInput
            value={email}
            name="email"
            type="email"
            onChange={(event) => setEmail(event.target.value)}
            label="Email"
            required={true}
          />
        ) : (
          props.user.email
        )}
      </TableCell>
      <TableCell>
        {isInEditMode ? (
          <MultiSelectInput
            label="Roles"
            options={props.availableRoles.map((role) => ({
              label: role.name,
              value: role.id,
            }))}
            onChange={setRoles}
            value={roles}
          />
        ) : (
          props.user.roles?.map((role) => role.name).join(`, `)
        )}
      </TableCell>
      <TableCell title={props.user.created_at}>
        {props.user.created_at ? moment(props.user.created_at).fromNow() : ``}
      </TableCell>
      <TableCell>
        {isInEditMode ? (
          <Stack spacing={2}>
            <SmallButton
              $color={theme.color.lightOne}
              $variant="primary"
              $size="small"
              onClick={updateOrCreateUser}
            >
              {props.user.isInCreateMode ? `Add` : `Save`}
            </SmallButton>
            <SmallButton
              $color={theme.color.lightOne}
              $variant="ghost"
              $size="small"
              onClick={clearForm}
            >
              Cancel
            </SmallButton>
          </Stack>
        ) : (
          <Stack spacing={2}>
            <SmallButton
              $color={theme.color.lightOne}
              $variant="ghost"
              $size="small"
              onClick={() => setIsEditMode(true)}
            >
              Edit
            </SmallButton>
            <SmallButton
              $color={theme.color.red}
              $variant="ghost"
              $size="small"
              onClick={deleteUser}
            >
              Delete
            </SmallButton>
          </Stack>
        )}
      </TableCell>
    </TableRow>
  );
};

const AdminUsersTable = (props: AdminUsersTableProps) => {
  return (
    <Table>
      <thead>
        <tr>
          <TableHeader></TableHeader>
          <TableHeader width="15%">First Name</TableHeader>
          <TableHeader width="15%">Last Name</TableHeader>
          <TableHeader width="25%">Email</TableHeader>
          <TableHeader width="25%">Roles</TableHeader>
          <TableHeader width="10%">Created At</TableHeader>
          <TableHeader width="10%">Actions</TableHeader>
        </tr>
      </thead>
      <tbody>
        {props.users
          .sort((a, b) => a.id - b.id)
          .map((user) => {
            return (
              <UserRow
                key={user.id || `new`}
                user={user}
                availableRoles={props.availableRoles}
                onSuccess={props.onSuccess}
                onCancel={props.onCancel}
              />
            );
          })}
      </tbody>
    </Table>
  );
};

export default memo(AdminUsersTable);

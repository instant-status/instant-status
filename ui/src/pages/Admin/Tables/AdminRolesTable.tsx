import React, { memo, useState } from "react";
import { useMutation } from "react-query";

import apiRoutes, {
  CreateRoleProps,
  DeleteRolesProps,
  UpdateRoleProps,
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
import { NewRowProps } from "../../../globalTypes";
import theme from "../../../utils/theme";

export interface RoleProps extends NewRowProps {
  id: number;
  name: string;
  view_stacks: any[];
  update_stacks: any[];
  view_stack_environments: string[];
  update_stack_environments: string[];
  _count: {
    usersWithThisRole: any[];
  };
}

interface AdminRolesTableProps {
  roles: RoleProps[];
  availableEnvironments: string[];
  availableStacks: {
    id: number;
    name: string;
  }[];
  onSuccess: () => void;
  onCancel?: () => void;
}

const UserRow = (props: {
  role: RoleProps;
  availableEnvironments: AdminRolesTableProps[`availableEnvironments`];
  availableStacks: AdminRolesTableProps[`availableStacks`];
  onSuccess: AdminRolesTableProps[`onSuccess`];
  onCancel: AdminRolesTableProps[`onCancel`];
}) => {
  const [isInEditMode, setIsEditMode] = useState(props.role.isInCreateMode);

  const [name, setName] = useState(props.role.name);
  const [viewStackEnvironments, setViewStackEnvironments] = useState(
    (props.role.view_stack_environments || []).map((role) => ({
      label: role,
      value: role,
    })),
  );
  const [updateStackEnvironments, setUpdateStackEnvironments] = useState(
    (props.role.update_stack_environments || []).map((role) => ({
      label: role,
      value: role,
    })),
  );
  const [viewStacks, setViewStacks] = useState(
    (props.role.view_stacks || []).map((role) => ({
      label: role.name,
      value: role.id,
    })),
  );
  const [updateStacks, setUpdateStacks] = useState(
    (props.role.update_stacks || []).map((role) => ({
      label: role.name,
      value: role.id,
    })),
  );

  const updateRoleMutation = useMutation((payload: UpdateRoleProps) =>
    apiRoutes.apiUpdateRole({ body: payload }),
  );

  const createRoleMutation = useMutation((payload: CreateRoleProps) =>
    apiRoutes.apiCreateRole({ body: payload }),
  );

  const deleteRolesMutation = useMutation((payload: DeleteRolesProps) =>
    apiRoutes.apiDeleteRoles({ body: payload }),
  );

  const clearForm = () => {
    setName(props.role.name);
    setViewStackEnvironments(
      (props.role.view_stack_environments || []).map((stack) => ({
        label: stack,
        value: stack,
      })),
    );
    setUpdateStackEnvironments(
      (props.role.update_stack_environments || []).map((stack) => ({
        label: stack,
        value: stack,
      })),
    );
    setViewStacks(
      (props.role.view_stacks || []).map((stack) => ({
        label: stack.name,
        value: stack.id,
      })),
    );
    setUpdateStacks(
      (props.role.update_stacks || []).map((stack) => ({
        label: stack.name,
        value: stack.id,
      })),
    );
    setIsEditMode(false);
    props.onCancel?.();
  };

  const updateOrCreateUser = () => {
    if (name) {
      if (props.role.isInCreateMode) {
        createRoleMutation.mutate(
          {
            name: name,
            view_stack_environments: viewStackEnvironments.map(
              (item) => item.value,
            ),
            update_stack_environments: updateStackEnvironments.map(
              (item) => item.value,
            ),
            update_stacks: updateStacks.map((item) => item.value),
            view_stacks: viewStacks.map((item) => item.value),
          },
          {
            onSuccess: () => {
              props.onSuccess && props.onSuccess();
              clearForm();
            },
          },
        );
      } else {
        updateRoleMutation.mutate(
          {
            id: props.role.id,
            name: name,
            view_stack_environments: viewStackEnvironments.map(
              (item) => item.value,
            ),
            update_stack_environments: updateStackEnvironments.map(
              (item) => item.value,
            ),
            update_stacks: updateStacks.map((item) => item.value),
            view_stacks: viewStacks.map((item) => item.value),
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

  const deleteRole = () => {
    const canDelete = confirm(
      `Are you sure you want to delete "${props.role.name}"`,
    );
    if (canDelete) {
      deleteRolesMutation.mutate(
        { role_ids: [props.role.id] },
        { onSuccess: () => props.onSuccess?.() },
      );
    }
  };

  return (
    <TableRow>
      <TableCell></TableCell>
      <TableCell>
        {isInEditMode ? (
          <TextInput
            value={name}
            name="name"
            onChange={(event) => setName(event.target.value)}
            label="Name"
            required={true}
          />
        ) : (
          props.role.name
        )}
      </TableCell>
      <TableCell>
        {isInEditMode ? (
          <MultiSelectInput
            label="View Stack Environments"
            options={props.availableEnvironments.map((role) => ({
              label: role,
              value: role,
            }))}
            onChange={setViewStackEnvironments}
            value={viewStackEnvironments}
          />
        ) : (
          props.role.view_stack_environments
            ?.map((environment) => environment)
            .join(`, `)
        )}
      </TableCell>
      <TableCell>
        {isInEditMode ? (
          <MultiSelectInput
            label="Update Stack Environments"
            options={props.availableEnvironments.map((role) => ({
              label: role,
              value: role,
            }))}
            onChange={setUpdateStackEnvironments}
            value={updateStackEnvironments}
          />
        ) : (
          props.role.update_stack_environments
            ?.map((environment) => environment)
            .join(`, `)
        )}
      </TableCell>
      <TableCell>
        {isInEditMode ? (
          <MultiSelectInput
            label="View Stacks"
            options={props.availableStacks.map((role) => ({
              label: role.name,
              value: role.id,
            }))}
            onChange={setViewStacks}
            value={viewStacks}
          />
        ) : (
          props.role.view_stacks
            ?.map((environment) => environment.name)
            .join(`, `)
        )}
      </TableCell>
      <TableCell>
        {isInEditMode ? (
          <MultiSelectInput
            label="Update Stacks"
            options={props.availableStacks.map((role) => ({
              label: role.name,
              value: role.id,
            }))}
            onChange={setUpdateStacks}
            value={updateStacks}
          />
        ) : (
          props.role.update_stacks
            ?.map((environment) => environment.name)
            .join(`, `)
        )}
      </TableCell>
      <TableCell>{props.role?._count?.usersWithThisRole || ``}</TableCell>
      <TableCell>
        {isInEditMode ? (
          <Stack spacing={2}>
            <SmallButton
              $color={theme.color.lightOne}
              $variant="primary"
              $size="small"
              onClick={updateOrCreateUser}
            >
              {props.role.isInCreateMode ? `Add` : `Save`}
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
              onClick={deleteRole}
            >
              Delete
            </SmallButton>
          </Stack>
        )}
      </TableCell>
    </TableRow>
  );
};

const AdminUsersTable = (props: AdminRolesTableProps) => {
  return (
    <Table>
      <thead>
        <tr>
          <TableHeader width=""></TableHeader>
          <TableHeader width="10%">Name</TableHeader>
          <TableHeader width="20%">View Environments</TableHeader>
          <TableHeader width="20%">Update Environments</TableHeader>
          <TableHeader width="15%">View Stacks</TableHeader>
          <TableHeader width="15%">Update Stacks</TableHeader>
          <TableHeader width="10%">Users</TableHeader>
          <TableHeader width="10%">Actions</TableHeader>
        </tr>
      </thead>
      <tbody>
        {props.roles
          .sort((a, b) => a.id - b.id)
          .map((role) => {
            return (
              <UserRow
                key={role.id || `new`}
                role={role}
                availableStacks={props.availableStacks}
                availableEnvironments={props.availableEnvironments}
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

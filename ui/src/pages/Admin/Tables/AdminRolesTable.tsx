import React, { memo, useState } from "react";
import { useMutation } from "react-query";

import apiRoutes, {
  CreateRoleProps,
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
import theme from "../../../utils/theme";

export interface NewRoleProps {
  isInCreateMode?: boolean;
}

export interface RoleProps extends NewRoleProps {
  id: number;
  name: string;
  view_stacks: any[];
  update_stacks: any[];
  view_stack_enviroments: string[];
  update_stack_enviroments: string[];
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
  const [viewStackEnviroments, setViewStackEnviroments] = useState(
    (props.role.view_stack_enviroments || []).map((role) => ({
      label: role,
      value: role,
    })),
  );
  const [updateStackEnviroments, setUpdateStackEnviroments] = useState(
    (props.role.update_stack_enviroments || []).map((role) => ({
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

  const clearForm = () => {
    setName(props.role.name);
    setViewStackEnviroments(
      (props.role.view_stack_enviroments || []).map((stack) => ({
        label: stack,
        value: stack,
      })),
    );
    setUpdateStackEnviroments(
      (props.role.update_stack_enviroments || []).map((stack) => ({
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
            view_stack_enviroments: viewStackEnviroments.map(
              (item) => item.value,
            ),
            update_stack_enviroments: updateStackEnviroments.map(
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
            view_stack_enviroments: viewStackEnviroments.map(
              (item) => item.value,
            ),
            update_stack_enviroments: updateStackEnviroments.map(
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
            label="View Stack Enviroments"
            options={props.availableEnvironments.map((role) => ({
              label: role,
              value: role,
            }))}
            onChange={setViewStackEnviroments}
            value={viewStackEnviroments}
          />
        ) : (
          props.role.view_stack_enviroments
            ?.map((environment) => environment)
            .join(`, `)
        )}
      </TableCell>
      <TableCell>
        {isInEditMode ? (
          <MultiSelectInput
            label="Update Stack Enviroments"
            options={props.availableEnvironments.map((role) => ({
              label: role,
              value: role,
            }))}
            onChange={setUpdateStackEnviroments}
            value={updateStackEnviroments}
          />
        ) : (
          props.role.update_stack_enviroments
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
          <SmallButton
            $color={theme.color.lightOne}
            $variant="ghost"
            $size="small"
            onClick={() => setIsEditMode(true)}
          >
            Edit
          </SmallButton>
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

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import React, { useState } from "react";
import { useMutation } from "react-query";
import styled from "styled-components";

import apiRoutes, {
  CreateStackProps,
  DeleteStacksProps,
} from "../../../api/apiRoutes";
import { SmallButton } from "../../../components/Controls/Buttons";
import Checkbox from "../../../components/Controls/Checkbox";
import TextInput from "../../../components/Controls/TextInput";
import Stack from "../../../components/Layout/Stack";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Tables/AdminTable";
import { NewRowProps, StackProps } from "../../../globalTypes";
import useToggle from "../../../hooks/useToggle";
import removeWhiteSpace from "../../../utils/removeWhiteSpace";

dayjs.extend(relativeTime);
dayjs.extend(utc);

const HelperLabel = styled.span`
  font-size: 14px;
  opacity: 0.6;
`;

const StackRow = (props: {
  stack: StackProps & NewRowProps;
  existingStackNames: AdminStacksTableProps[`existingStackNames`];
  onSuccess: AdminStacksTableProps[`onSuccess`];
  onCancel: AdminStacksTableProps[`onCancel`];
}) => {
  const [stackName, setStackName] = useState(``);
  const [appVersion, setAppVersion] = useState(``);
  const [runMigrations, toggleRunMigrations] = useToggle(false);
  const [isInEditMode, setIsEditMode] = useState(props.stack.isInCreateMode);

  const createStackMutation = useMutation((payload: CreateStackProps) =>
    apiRoutes.apiCreateStack({ body: payload }),
  );

  const deleteStackMutation = useMutation((payload: DeleteStacksProps) =>
    apiRoutes.apiDeleteStacks({ body: payload }),
  );

  const deleteStack = () => {
    const canDelete = confirm(
      `Are you sure you want to delete "${props.stack.name}"`,
    );
    if (canDelete) {
      deleteStackMutation.mutate(
        { stack_ids: [props.stack.id] },
        { onSuccess: () => props.onSuccess?.() },
      );
    }
  };

  const clearForm = () => {
    setStackName(``);
    setAppVersion(``);
    toggleRunMigrations(true);

    setIsEditMode(false);
    props.onCancel?.();
  };

  const createStack = () => {
    const stackNameAlreadyInUse = props.existingStackNames.includes(stackName);
    if (appVersion && stackName && !stackNameAlreadyInUse) {
      createStackMutation.mutate(
        {
          name: stackName,
          run_migrations: runMigrations,
          update_app_to: appVersion,
        },
        {
          onSuccess: () => {
            props.onSuccess && props.onSuccess();
            clearForm();
          },
        },
      );
    }
  };

  const runningAppVersion =
    props.stack?.servers?.find((server) => server.server_app_version)
      ?.server_app_version || ``;

  const updatingToAppVersion =
    props.stack?.updates?.find((update) => update.update_app_to)
      ?.update_app_to || ``;

  const isUpdating = Boolean(
    props.stack?.servers?.find(
      (server) => server.server_update_progress !== 100,
    ) ||
      props.stack?.updates?.find((update) => update.server_count === 0) ||
      false,
  );

  return (
    <TableRow key={props.stack.id}>
      <TableCell />
      <TableCell>
        {isInEditMode ? (
          <TextInput
            value={stackName}
            name="stackName"
            onChange={(event) => setStackName(event.target.value)}
            label="Stack Name"
            required={true}
          />
        ) : (
          props.stack.name
        )}
      </TableCell>
      <TableCell>
        {isInEditMode ? (
          <TextInput
            value={appVersion}
            name="appVersion"
            onChange={(event) =>
              setAppVersion(removeWhiteSpace(event.target.value))
            }
            label="app Version"
            required={true}
          />
        ) : (
          <>
            {runningAppVersion}
            {isUpdating ? (
              <>
                {runningAppVersion && <br />}
                <HelperLabel>
                  {runningAppVersion
                    ? `(updating to ${updatingToAppVersion})`
                    : `(will be ${updatingToAppVersion})`}
                </HelperLabel>
              </>
            ) : null}
          </>
        )}
      </TableCell>
      <TableCell>
        {isInEditMode && (
          <Checkbox
            checked={runMigrations}
            name="runMigrations"
            label="Run Migrations"
            onClick={() => toggleRunMigrations()}
          />
        )}
      </TableCell>
      <TableCell title={props.stack.created_at}>
        {props.stack.created_at
          ? dayjs.utc(props.stack.created_at).fromNow()
          : ``}
      </TableCell>
      <TableCell>
        {isInEditMode ? (
          <Stack spacing={2}>
            <SmallButton
              $color={`--color-parchment`}
              $variant="primary"
              $size="small"
              onClick={createStack}
            >
              {props.stack.isInCreateMode ? `Add` : `Save`}
            </SmallButton>
            <SmallButton
              $color={`--color-parchment`}
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
              $color={`--color-red`}
              $variant="ghost"
              $size="small"
              onClick={deleteStack}
            >
              Delete
            </SmallButton>
          </Stack>
        )}
      </TableCell>
    </TableRow>
  );
};

interface AdminStacksTableProps {
  stacks: StackProps[];
  existingStackNames: string[];
  onSuccess: () => void;
  onCancel?: () => void;
}

const AdminStacksTable = (props: AdminStacksTableProps) => {
  return (
    <Table>
      <thead>
        <tr>
          <TableHeader />
          <TableHeader width="20%">Stack Name</TableHeader>
          <TableHeader width="20%">app Version</TableHeader>
          <TableHeader width="20%" />
          <TableHeader width="20%">Created At</TableHeader>
          <TableHeader width="20%">Actions</TableHeader>
        </tr>
      </thead>
      <tbody>
        {props.stacks
          .sort((a, b) => b.id - a.id)
          .map((stack) => {
            return (
              <StackRow
                key={stack.id || `new`}
                stack={stack}
                existingStackNames={props.existingStackNames}
                onSuccess={props.onSuccess}
                onCancel={props.onCancel}
              />
            );
          })}
      </tbody>
    </Table>
  );
};

export default AdminStacksTable;

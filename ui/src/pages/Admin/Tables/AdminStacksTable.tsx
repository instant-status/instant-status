import moment from "moment";
import React, { memo } from "react";
import styled from "styled-components";

import { SmallButton } from "../../../components/Controls/Buttons";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Tables/AdminTable";
import { StackProps } from "../../../globalTypes";
import theme from "../../../utils/theme";

const HelperLabel = styled.span`
  font-size: 14px;
  opacity: 0.6;
`;

interface AdminStacksTable {
  stacks: StackProps[];
}

const AdminStacksTable = (props: AdminStacksTable) => {
  return (
    <Table>
      <thead>
        <tr>
          <TableHeader>Stack Names</TableHeader>
          <TableHeader>app Version</TableHeader>
          <TableHeader>xAPI Version</TableHeader>
          <TableHeader>Created</TableHeader>
          <TableHeader>Actions</TableHeader>
        </tr>
      </thead>
      <tbody>
        {props.stacks
          .sort((a, b) => b.created_at.localeCompare(a.created_at))
          .map((stack) => {
            const runningAppVersion =
              stack.servers.find((server) => server.server_app_version)
                ?.server_app_version || ``;
            const runningXAPIVersion =
              stack.servers.find((server) => server.server_xapi_version)
                ?.server_xapi_version || ``;

            const updatingToAppVersion =
              stack.updates.find((update) => update.update_app_to)
                ?.update_app_to || ``;
            const updatingToXAPIVersion =
              stack.updates.find((update) => update.update_xapi_to)
                ?.update_xapi_to || ``;

            const isUpdating = Boolean(
              stack.servers.find(
                (server) => server.server_update_progress !== 100,
              ) || stack.updates.find((update) => update.server_count === 0),
            );

            return (
              <TableRow key={stack.id}>
                <TableCell>{stack.name}</TableCell>
                <TableCell>
                  {runningAppVersion}
                  {isUpdating ? (
                    <>
                      <br />
                      <HelperLabel>
                        (updating to {updatingToAppVersion})
                      </HelperLabel>
                    </>
                  ) : null}
                </TableCell>
                <TableCell>
                  {runningXAPIVersion}
                  {isUpdating ? (
                    <>
                      <br />
                      <HelperLabel>
                        (updating to {updatingToXAPIVersion})
                      </HelperLabel>
                    </>
                  ) : null}
                </TableCell>
                <TableCell title={stack.created_at}>
                  {moment(stack.created_at).fromNow()}
                </TableCell>
                <TableCell>
                  <SmallButton
                    $color={theme.color.red}
                    $variant="ghost"
                    $size="small"
                    disabled={true}
                    onClick={() => console.log(`Delete stack`)}
                  >
                    Delete
                  </SmallButton>
                </TableCell>
              </TableRow>
            );
          })}
      </tbody>
    </Table>
  );
};

export default memo(AdminStacksTable);

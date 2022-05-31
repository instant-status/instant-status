import { Updates } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import React from "react";
import styled from "styled-components";

import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Tables/AdminTable";

dayjs.extend(relativeTime);
dayjs.extend(utc);

const Limit = styled.div`
  color: var(--color-parchment);
  padding: 1rem;
`;

const StackRow = (props: { update: Updates }) => {
  return (
    <TableRow>
      <TableCell>{props.update.stackId.name}</TableCell>
      <TableCell>
        {props.update.server_finished_count} of {props.update.server_count}
      </TableCell>
      <TableCell>{props.update.update_app_to}</TableCell>
      <TableCell>
        {/* <NavLink
          to={`/admin/users?email=${props.update.update_requested_by}`}
          style={{ color: `#fff` }}
        > */}
        {props.update.update_requested_by}
        {/* </NavLink> */}
      </TableCell>
      <TableCell title={props.update?.created_at ?? ``}>
        {props.update.created_at
          ? dayjs.utc(props.update.created_at).fromNow()
          : ``}
      </TableCell>
      <TableCell>{props.update.run_migrations ? `Yes` : `No`}</TableCell>
      <TableCell>{props.update.is_cancelled ? `Yes` : ``}</TableCell>
    </TableRow>
  );
};

const AdminStackUpdatesTable = (props: {
  updates: Updates[];
  totalCount: number;
}) => {
  return (
    <>
      <Table>
        <thead>
          <tr>
            <TableHeader width="15%">Stack Name</TableHeader>
            <TableHeader width="5%">Updated</TableHeader>
            <TableHeader width="20%">Version</TableHeader>
            <TableHeader width="28%">Requested By</TableHeader>
            <TableHeader width="12%">Requested At</TableHeader>
            <TableHeader width="10%">Migrations?</TableHeader>
            <TableHeader width="10%">Cancelled?</TableHeader>
          </tr>
        </thead>
        <tbody>
          {props.updates
            .sort((a, b) => b.id - a.id)
            .map((update) => {
              return <StackRow key={update.id} update={update} />;
            })}
        </tbody>
      </Table>
      <Limit>
        Showing {props.updates.length} of {props.totalCount} updates
      </Limit>
    </>
  );
};

export default AdminStackUpdatesTable;

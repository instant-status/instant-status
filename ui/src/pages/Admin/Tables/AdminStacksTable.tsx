import { transparentize } from "polished";
import React, { memo } from "react";
import styled from "styled-components";

import { SmallButton } from "../../../components/Controls/Buttons";
import theme from "../../../utils/theme";

const Table = styled.table`
  background-color: ${theme.color.darkOne};
  width: 100%;
  padding: 14px 20px;
  border-radius: 10px;
  color: ${theme.color.lightOne};
`;

const TableCell = styled.td`
  padding: 6px 12px;
  width: 100%;
  border-bottom: 1px solid ${transparentize(0.8, theme.color.lightOne)};
  border-top: 0;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: ${transparentize(0.9, theme.color.lightOne)};
  }
`;

const TableHeader = styled.th`
  font-weight: 600;
  font-size: 1.3rem;
  padding: 6px 12px;
  border-bottom: 1px solid ${transparentize(0.8, theme.color.lightOne)};
  text-align: left;
`;

interface AdminStacksTable {
  stacks: { stack_id: string; created_at: string }[];
}

const AdminStacksTable = (props: AdminStacksTable) => {
  return (
    <Table>
      <thead>
        <tr>
          <TableHeader>Stack ID</TableHeader>
          <TableHeader>Actions</TableHeader>
        </tr>
      </thead>
      <tbody>
        {props.stacks
          .sort((a, b) => b.created_at.localeCompare(a.created_at))
          .map((update) => (
            <TableRow key={update.stack_id}>
              <TableCell>{update.stack_id}</TableCell>
              <TableCell>
                <SmallButton
                  $color="red"
                  $variant="ghost"
                  $size="small"
                  disabled={true}
                  onClick={() => console.log(`Delete stack`)}
                >
                  Delete
                </SmallButton>
              </TableCell>
            </TableRow>
          ))}
      </tbody>
    </Table>
  );
};

export default memo(AdminStacksTable);

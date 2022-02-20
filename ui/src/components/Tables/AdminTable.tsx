import { transparentize } from "polished";
import styled from "styled-components";

import theme from "../../utils/theme";

export const Table = styled.table`
  background-color: ${theme.color.darkOne};
  width: 100%;
  padding: 14px 20px;
  border-radius: 10px;
  color: ${theme.color.lightOne};
  border-collapse: collapse;
`;

export const TableCell = styled.td`
  padding: 6px 12px;
  border-bottom: 1px solid ${transparentize(0.8, theme.color.lightOne)};
  border-top: 0;
`;

export const TableRow = styled.tr`
  &:hover {
    background-color: ${transparentize(0.9, theme.color.lightOne)};
  }
`;

export const TableHeader = styled.th<{ width?: string }>`
  font-weight: 600;
  font-size: 1.3rem;
  padding: 16px 12px;
  border-bottom: 1px solid ${transparentize(0.8, theme.color.lightOne)};
  text-align: left;
`;

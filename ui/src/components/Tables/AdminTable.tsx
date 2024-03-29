import { cssVar, transparentize } from "polished";
import styled from "styled-components";

export const Table = styled.table`
  background-color: var(--color-midnight);
  width: 100%;
  padding: 14px 20px;
  border-radius: 10px;
  color: var(--color-parchment);
  border-collapse: collapse;
`;

export const TableCell = styled.td`
  padding: 6px 12px;
  border-bottom: 1px solid
    ${transparentize(0.8, cssVar(`--color-parchment`).toString())};
  border-top: 0;
`;

export const TableRow = styled.tr<{ $highlighted?: boolean }>`
  ${(props) =>
    props.$highlighted &&
    `background-color: ${transparentize(
      0.9,
      cssVar(`--color-parchment`).toString(),
    )}`};

  &:hover {
    background-color: ${transparentize(
      0.9,
      cssVar(`--color-parchment`).toString(),
    )};
  }
`;

export const TableHeader = styled.th<{ width?: string }>`
  font-weight: 600;
  font-size: 1.3rem;
  padding: 16px 12px;
  border-bottom: 1px solid
    ${transparentize(0.8, cssVar(`--color-parchment`).toString())};
  text-align: left;
`;

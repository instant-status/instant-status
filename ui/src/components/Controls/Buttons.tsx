import styled from "styled-components";

import { spacing } from "../Layout/spacing";

const ButtonBase = styled.button`
  padding: 0.7rem 3rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: ${spacing[9]};
  color: ${(props) => props.theme.color.lightOne};
  background-color: transparent;
  border: 4px solid ${(props) => props.theme.color.lightOne};
  transition: background-color 0.3s, color 0.3s;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const GhostButton = styled(ButtonBase)`
  &:hover:not(:disabled) {
    color: ${(props) => props.theme.color.darkTwo};
    background-color: ${(props) => props.theme.color.lightOne};
  }
`;

export const SidebarButton = styled(ButtonBase)`
  padding: 0.4rem 1rem;
  border-width: 2px;
  font-size: 16px;

  &:hover:not(:disabled) {
    color: ${(props) => props.theme.color.darkTwo};
    background-color: ${(props) => props.theme.color.lightOne};
  }
`;

export const UpdateButton = styled(ButtonBase)`
  color: ${(props) => props.theme.color.purple};
  border: 4px solid ${(props) => props.theme.color.purple};

  &:hover:not(:disabled) {
    color: ${(props) => props.theme.color.darkTwo};
    background-color: ${(props) => props.theme.color.purple};
  }
`;

export const BackButton = styled(GhostButton)`
  border-width: 2px;
`;

export const CancelButton = styled(GhostButton)`
  color: ${(props) => props.theme.color.red};
  border: 4px solid ${(props) => props.theme.color.red};

  &:hover:not(:disabled) {
    color: ${(props) => props.theme.color.darkTwo};
    background-color: ${(props) => props.theme.color.red};
  }
`;

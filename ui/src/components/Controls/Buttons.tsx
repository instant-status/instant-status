import styled, { css, keyframes } from "styled-components";

import theme from "../../utils/theme";
import { spacing } from "../Layout/spacing";

const pulseAnimation = (props: { $color: string }) => keyframes`
0% {
  box-shadow: 0 0 0 0px ${props.$color};
}
100% {
  box-shadow: 0 0 0 10px rgba(0,0,0,0);
}
`;

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
  color: ${(props) => props.theme.color.darkTwo};
  background-color: ${(props) => props.theme.color.purple};
  border: 4px solid ${(props) => props.theme.color.purple};

  &:hover:not(:disabled) {
    animation: ${pulseAnimation({ $color: theme.color.purple })} 1s infinite;
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

export const DeleteButton = styled(GhostButton)`
  color: ${(props) => props.theme.color.red};
  border: 2px solid ${(props) => props.theme.color.red};
  font-size: 16px;
  padding: 0.4rem 1rem;
  font-weight: 600;

  &:hover:not(:disabled) {
    color: ${(props) => props.theme.color.darkTwo};
    background-color: ${(props) => props.theme.color.red};
  }
`;

interface SmallButtonProps {
  $variant: `primary` | `ghost`;
  $color: string;
  $size?: `small` | `default`;
}

export const SmallButton = styled.button<SmallButtonProps>`
  border-radius: 12px;
  cursor: pointer;

  color: ${(props) =>
    props.$variant === `ghost` ? props.$color : theme.color.darkTwo};
  background-color: ${(props) =>
    props.$variant === `ghost` ? `transparent` : props.$color};
  border: 2px solid ${(props) => props.$color};
  transition: background-color 0.3s, color 0.3s;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  padding: ${(props) =>
    props.$size === `small` ? `0.4rem 0.8rem` : `0.4rem 4rem`};
  font-size: 16px;

  font-weight: 600;

  ${(props) =>
    props.$variant === `primary` &&
    css`
      &:hover:not(:disabled) {
        animation: ${pulseAnimation({ $color: props.$color })} 1s infinite;
      }
    `}
`;

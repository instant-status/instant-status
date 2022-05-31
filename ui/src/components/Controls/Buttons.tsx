import styled, { css, keyframes } from "styled-components";

import { spacing } from "../Layout/spacing";

const pulseAnimation = (props: { $color: string }) => keyframes`
0% {
  box-shadow: 0 0 0 0px var(${props.$color});
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
  color: var(--color-parchment);
  background-color: transparent;
  border: 4px solid var(--color-parchment);
  transition: background-color 0.3s, color 0.3s;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const GhostButton = styled(ButtonBase)`
  &:hover:not(:disabled) {
    color: var(--color-twilight);
    background-color: var(--color-parchment);
  }
`;

export const SidebarButton = styled(ButtonBase)`
  padding: 0.4rem 1rem;
  border-width: 2px;
  font-size: 16px;

  &:hover:not(:disabled) {
    color: var(--color-twilight);
    background-color: var(--color-parchment);
  }
`;

export const UpdateButton = styled(ButtonBase)`
  color: var(--color-twilight);
  background-color: var(--color-purple);
  border: 4px solid var(--color-purple);

  &:hover:not(:disabled) {
    animation: ${pulseAnimation({ $color: `--color-purple` })} 1s infinite;
  }
`;

export const BackButton = styled(GhostButton)`
  border-width: 2px;
`;

export const CancelButton = styled(GhostButton)`
  color: var(--color-red);
  border: 4px solid var(--color-red);

  &:hover:not(:disabled) {
    color: var(--color-twilight);
    background-color: var(--color-red);
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

  color: var(
    ${(props) =>
      props.$variant === `ghost` ? props.$color : `--color-twilight`}
  );
  background-color: ${(props) =>
    props.$variant === `ghost` ? `transparent` : `var(${props.$color})`};
  border: 2px solid var(${(props) => props.$color});
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

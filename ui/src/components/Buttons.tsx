import styled from "styled-components";
import { spacing } from "./spacing";

const ButtonBase = styled.button`
  padding: 0.7rem 3rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: ${spacing[9]};
  color: #fff;
  background-color: transparent;
  border: 4px solid #fff;
  transition: background-color 0.3s, color 0.3s;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const GhostButton = styled(ButtonBase)`
  &:hover:not(:disabled) {
    color: #191e2a;
    background-color: #fff;
  }
`;

export const UpdateButton = styled(ButtonBase)`
  color: #00ab4e;
  border: 4px solid #00ab4e;

  &:hover:not(:disabled) {
    color: #191e2a;
    background-color: #00ab4e;
  }
`;

export const BackButton = styled(GhostButton)`
  border-width: 2px;
`;

export const CancelButton = styled(GhostButton)`
  color: #ee2f01;
  border: 4px solid #ee2f01;

  &:hover:not(:disabled) {
    color: #191e2a;
    background-color: #ee2f01;
  }
`;

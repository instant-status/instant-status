import styled from "styled-components";

export const InputBoxContainer = styled.label<{ $backgroudColour?: string }>`
  display: flex;
  flex-direction: column;
  ${(props) =>
    props.$backgroudColour && `background-color: ${props.$backgroudColour}`};
  padding: 12px;
  border-radius: 6px;
`;

export const Label = styled.span`
  font-size: 16px;
  margin-bottom: 6px;

  & > b {
    font-weight: 600;
  }
`;

import styled from "styled-components";

export const InputBoxContainer = styled.label<{ $backgroundColor?: string }>`
  display: flex;
  flex-direction: column;
  ${(props) =>
    props.$backgroundColor &&
    `background-color: var(${props.$backgroundColor})`};
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

import styled from "styled-components";

export const InputBoxContainer = styled.label`
  display: flex;
  flex-direction: column;
  margin: 0 20px 10px 0;
  background-color: ${props => props.theme.color.darkTwo};
  padding: 12px;
  border-radius: 6px;
`;

export const Label = styled.span`
  font-size: 16px;
  margin-bottom: 6px;
`;

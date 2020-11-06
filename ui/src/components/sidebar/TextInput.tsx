import React from "react";
import styled from "styled-components";

import { InputBoxContainer, Label } from "../shared/SettingsInputs";

const InputBox = styled.input`
  font-size: 16px;
  background-color: ${(props) => props.theme.color.darkOne};
  padding: 8px 12px;
  border: none;
  color: ${(props) => props.theme.color.lightOne};
  border-radius: 6px;
`;

const TextInput = (props: {
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}) => {
  return (
    <InputBoxContainer>
      <Label>{props.label}</Label>
      <InputBox
        onChange={props.onChange}
        onBlur={props.onBlur}
        type="text"
        value={props.value}
      />
    </InputBoxContainer>
  );
};

export default TextInput;

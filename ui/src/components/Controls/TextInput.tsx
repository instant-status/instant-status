import React from "react";
import styled from "styled-components";

import theme from "../../utils/theme";
import { InputBoxContainer, Label } from "../Layout/SettingsInputs";

const InputBox = styled.input<{ $disabled?: boolean; $isDarkMode: boolean }>`
  font-size: 16px;
  background-color: ${(props) =>
    props.$isDarkMode ? props.theme.color.darkOne : props.theme.color.lightOne};
  padding: 8px 12px;
  border: none;
  color: ${(props) =>
    props.$isDarkMode ? props.theme.color.lightOne : props.theme.color.darkOne};
  border-radius: 6px;
  width: 100%;
  ${(props) => props.$disabled && `pointer-events: none`};
`;

interface TextInputProps {
  label: string | React.ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  name: string;
  defaultValue?: string;
  disabled?: boolean;
  theme?: `dark` | `light`;
  type?: string;
  required?: boolean;
}

const TextInput = (props: TextInputProps) => {
  return (
    <InputBoxContainer
      $backgroudColour={props.theme === `dark` ? theme.color.darkTwo : ``}
    >
      <Label>{props.label}</Label>
      <InputBox
        $isDarkMode={props.theme === `dark`}
        onChange={props.onChange}
        onBlur={props.onBlur}
        type={props.type || `text`}
        value={props.value}
        defaultValue={props.defaultValue}
        name={props.name}
        readOnly={props.disabled}
        autoComplete="off"
        required={props.required}
      />
    </InputBoxContainer>
  );
};

export default TextInput;

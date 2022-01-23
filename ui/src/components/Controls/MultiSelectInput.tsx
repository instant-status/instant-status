import React from "react";
import Select from "react-dropdown-select";
import styled from "styled-components";

import theme from "../../utils/theme";
import { InputBoxContainer, Label } from "../Layout/SettingsInputs";

const InputBox = styled(Select)`
  font-size: 16px;
  background-color: ${(props) => props.theme.color.lightOne};
  padding: 8px 12px;
  color: ${(props) => props.theme.color.darkOne};
  width: 100%;
  border: none !important;
  border-radius: 6px !important;

  .react-dropdown-select-option {
    background-color: ${theme.color.cyan};
    border-radius: 6px;
  }

  .react-dropdown-select-input::placeholder {
    font-size: 16px;
  }

  .react-dropdown-select-dropdown {
    background-color: ${theme.color.lightOne};
    border: none;
    border-radius: 6px;
  }

  .react-dropdown-select-item {
    border-color: #d7c6b8;
    padding: 10px 16px;
  }

  .react-dropdown-select-item.react-dropdown-select-item-selected {
    background: ${theme.color.cyan};
  }
`;

interface MultiSelectInputProps {
  label: string | React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChange: (value: any[]) => void;
  value?: {
    label: string;
    value: string | number;
  }[];
  options: any;
  theme?: `dark` | `light`;
}

const MultiSelectInput = (props: MultiSelectInputProps) => {
  return (
    <InputBoxContainer
      $backgroudColour={props.theme === `dark` ? theme.color.darkTwo : ``}
    >
      <Label>{props.label}</Label>
      <InputBox
        multi={true}
        searchable={true}
        options={props.options}
        onChange={props.onChange}
        values={props.value || []}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        autoComplete="off"
      />
    </InputBoxContainer>
  );
};

export default MultiSelectInput;

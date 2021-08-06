import React from "react";
import styled from "styled-components";

import IconClose from "../Icons/IconClose";
import { InputBoxContainer, Label } from "../Layout/SettingsInputs";

const InputBox = styled.div<{ $disabled?: boolean }>`
  font-size: 16px;
  background-color: ${(props) => props.theme.color.darkOne};
  padding: 8px 12px;
  border: none;
  color: ${(props) => props.theme.color.lightOne};
  border-radius: 6px;
  width: 100%;
  max-width: 276px;
  display: flex;
  flex-wrap: wrap;
  ${(props) => props.$disabled && `pointer-events: none`};
`;

const InputTag = styled.div<{ $disabled?: boolean }>`
  font-size: 16px;
  background-color: ${(props) => props.theme.color.darkTwo};
  padding: 8px 12px;
  color: ${(props) => props.theme.color.lightOne};
  border-radius: 6px;
  margin: 0 4px 4px 0;
  display: flex;
  border: none;
  ${(props) => props.$disabled && `pointer-events: none`};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.color.red};
  }
`;

const Icon = styled(IconClose)`
  margin-left: 4px;
`;

const Input = styled.input<{ $disabled?: boolean }>`
  font-size: 16px;
  background-color: ${(props) => props.theme.color.darkOne};
  padding: 0;
  border: none;
  color: ${(props) => props.theme.color.lightOne};
  ${(props) => props.$disabled && `pointer-events: none`};
  padding: 2px;

  &:focus {
    outline: none;
  }
`;

const TagInput = (props: {
  label: string;
  name: string;
  values: string[];
  onKeyUp: (event: React.KeyboardEvent) => void;
  removeValue: (value: string) => void;
}) => {
  return (
    <InputBoxContainer>
      <Label>{props.label}</Label>
      <InputBox>
        {props.values.map((value) => (
          <InputTag
            key={`${value}`}
            onClick={() => props.removeValue(value)}
            // type="button"
          >
            <span>{value}</span>
            <Icon width="16px" color="#fff" />
          </InputTag>
        ))}
        <Input name={props.name} onKeyUp={(event) => props.onKeyUp(event)} />
      </InputBox>
    </InputBoxContainer>
  );
};

export default TagInput;

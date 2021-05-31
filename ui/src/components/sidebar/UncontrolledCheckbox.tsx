import React from "react";
import styled from "styled-components";
import Stack from "../Stack";

const CheckboxContainer = styled.label<{ $disabled: boolean }>`
  ${(props) => props.$disabled && "font-style: italic;"};
  ${(props) => props.$disabled && "opacity: 0.7;"};
  align-items: center;
  break-inside: avoid;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  display: flex;
  user-select: none;
`;

const HiddenCheckbox = styled.input`
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 10px;
`;

const Box = styled.div<{ $isChecked: boolean; $disabled: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 6px;
  margin: 8px;
  background-color: ${(props) =>
    props.$isChecked ? props.theme.color.lightOne : props.theme.color.darkOne};
  transition: background-color 100ms;
  border: 1px solid ${(props) => props.theme.color.lightOne};
  ${(props) => props.$disabled && "opacity: 0.2;"};
`;

const Label = styled.span`
  font-size: 16px;
`;

const HelperLabel = styled.span`
  font-size: 14px;
  opacity: 0.6;
`;

interface CheckboxProps {
  label: string;
  checked: boolean;
  name: string;
  helperLabel?: string;
  disabled?: boolean;
  visuallyDisabled?: boolean;
  onClick: (value: string) => void;
}

const UncontrolledCheckbox = (props: CheckboxProps) => {
  return (
    <CheckboxContainer $disabled={props.visuallyDisabled}>
      <HiddenCheckbox
        type="checkbox"
        name={props.name}
        checked={props.checked}
        onChange={() => props.onClick(props.name)}
        disabled={props.disabled}
      />
      <Box $isChecked={props.checked} $disabled={props.visuallyDisabled} />
      <Stack direction="down">
        <Label>{props.label}</Label>
        <HelperLabel>{props.helperLabel}</HelperLabel>
      </Stack>
    </CheckboxContainer>
  );
};

export default UncontrolledCheckbox;

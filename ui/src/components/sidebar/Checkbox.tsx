import React, { forwardRef } from "react";
import styled from "styled-components";
import useCombinedRefs from "../../hooks/useCombinedRefs";
import Stack from "../Stack";

const CheckboxContainer = styled.label<{ $disabled: boolean }>`
  display: flex;
  align-items: center;
  user-select: none;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  ${(props) => props.$disabled && "opacity: 0.7;"};
  ${(props) => props.$disabled && "font-style: italic;"};
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
  defaultChecked?: boolean;
  label: string;
  value?: string;
  name: string;
  helperLabel?: string;
  disabled?: boolean;
  faded?: boolean;
  callback?: (isChecked: boolean) => void;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (props, forwardedRef) => {
    const [checked, setChecked] = React.useState(props.defaultChecked || false);

    const innerRef = React.useRef(null);
    const combinedRef = useCombinedRefs(forwardedRef, innerRef);

    const onChange = (event) => {
      if (!props.disabled) {
        setChecked(event.target.checked);

        if (typeof props.callback === "function") {
          props.callback(checked);
        }
      }
    };

    return (
      <CheckboxContainer $disabled={props.faded}>
        <HiddenCheckbox
          ref={combinedRef}
          type="checkbox"
          name={props.name}
          defaultChecked={checked}
          onChange={(event) => onChange(event)}
        />
        <Box $isChecked={checked} $disabled={props.faded} />
        <Stack direction="down">
          <Label>{props.label}</Label>
          <HelperLabel>{props.helperLabel}</HelperLabel>
        </Stack>
      </CheckboxContainer>
    );
  },
);

export default Checkbox;

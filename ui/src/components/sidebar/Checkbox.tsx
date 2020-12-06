import React from "react";
import styled from "styled-components";

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  user-select: none;
  cursor: pointer;
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

const Box = styled.div<{ isChecked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 6px;
  margin: 8px;
  background-color: ${(props) =>
    props.isChecked ? props.theme.color.lightOne : props.theme.color.darkOne};
  transition: background-color 100ms;
  border: 1px solid ${(props) => props.theme.color.lightOne};
`;

const Label = styled.span`
  font-size: 16px;
`;

const Checkbox = (props: {
  isChecked: boolean;
  label: string;
  onChange: () => void;
  value: string;
}) => {
  return (
    <CheckboxContainer>
      <HiddenCheckbox
        type="checkbox"
        checked={props.isChecked}
        onChange={props.onChange}
      />
      <Box isChecked={props.isChecked} />
      <Label>{props.label}</Label>
    </CheckboxContainer>
  );
};

export default Checkbox;

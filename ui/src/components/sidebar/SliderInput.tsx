import React from "react";
import styled from "styled-components";
import { InputBoxContainer, Label } from "../shared/SettingsInputs";

const Output = styled.span`
  font-size: 12px;
  opacity: 0.5;
`;

const SliderInput = (props: {
  label: string;
  onChange: (event: any) => void;
  value: number;
  total: number;
}) => {
  return (
    <InputBoxContainer>
      <Label>
        {props.label}{" "}
        <Output>
          (showing {props.value} out of {"4"})
        </Output>
      </Label>
      <input
        min="0"
        max={props.total}
        onChange={props.onChange}
        value={props.value}
        step="1"
        type="range"
      />
    </InputBoxContainer>
  );
};

export default SliderInput;

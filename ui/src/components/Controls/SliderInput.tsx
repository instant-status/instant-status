import React from "react";
import styled from "styled-components";

import theme from "../../utils/theme";
import { InputBoxContainer, Label } from "../Layout/SettingsInputs";

const Output = styled.span`
  font-size: 12px;
  opacity: 0.5;
`;

const SliderInput = (props: {
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: number;
  total: number;
}) => {
  return (
    <InputBoxContainer $backgroundColor={theme.color.darkTwo}>
      <Label>
        {props.label}
        {` `}
        <Output>
          (showing {props.value} out of {props.total})
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

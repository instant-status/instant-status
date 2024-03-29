import React, { ChangeEvent } from "react";

import { InputBoxContainer, Label } from "../Layout/SettingsInputs";

interface SelectInputProps {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const SelectInput = (props: SelectInputProps) => {
  return (
    <InputBoxContainer $backgroundColor={`--color-twilight`}>
      <Label>{props.label}</Label>
      <select onChange={props.onChange} value={props.value}>
        <option value="name">Stack A{` --> `}Z</option>
        <option value="!name">Stack Z{` --> `}A</option>
        <option value="!stack.server_app_version">
          Version New{` --> `}Old
        </option>
        <option value="stack.server_app_version">
          Version Old{` --> `}New
        </option>
      </select>
    </InputBoxContainer>
  );
};

export default SelectInput;

import React, { ChangeEvent } from "react";

import { InputBoxContainer, Label } from "../shared/SettingsInputs";

const SelectInput = (props: {
  label: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}) => {
  return (
    <InputBoxContainer>
      <Label>{props.label}</Label>
      <select onChange={props.onChange}>
        <option value="stack_id">Stack A{`->`}Z</option>
        <option value="!stack_id">Stack Z{`->`}A</option>
        <option value="server_app_version">Version New{`->`}Old</option>
        <option value="!server_app_version">Version Old{`->`}New</option>
      </select>
    </InputBoxContainer>
  );
};

export default SelectInput;

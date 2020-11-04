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
        <option value="stackName">Stack A`{`->`}`Z</option>
        <option value="!stackName">Stack Z`{`->`}`A</option>
        <option value="instanceVersion">Version New`{`->`}`Old</option>
        <option value="!instanceVersion">Version Old`{`->`}`New</option>
      </select>
    </InputBoxContainer>
  );
};

export default SelectInput;

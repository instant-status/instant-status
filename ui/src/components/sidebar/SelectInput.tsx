import React from "react";
import { InputBoxContainer, Label } from "../shared/SettingsInputs";

const SelectInput = (props: {
  label: string;
  onChange: (event: any) => void;
}) => {
  return (
    <InputBoxContainer>
      <Label>{props.label}</Label>
      <select onChange={props.onChange}>
        <option value="stackName">Stack A->Z</option>
        <option value="!stackName">Stack Z->A</option>
        <option value="instanceVersion">Version New->Old</option>
        <option value="!instanceVersion">Version Old->New</option>
      </select>
    </InputBoxContainer>
  );
};

export default SelectInput;

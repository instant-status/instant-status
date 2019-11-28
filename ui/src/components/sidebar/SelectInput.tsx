import React from "react";
import styled from "styled-components";

const InputBoxContainer = styled.label`
  display: flex;
  flex-direction: column;
  margin: 0 20px 10px 0;
`;

const Label = styled.span`
  font-size: 16px;
  margin-bottom: 6px;
`;

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
        <option value="instanceVersion">Instance New->Old</option>
        <option value="!instanceVersion">Instance Old->new</option>
        <option value="instanceHealthCode">Health Good->Bad</option>
        <option value="!instanceHealthCode">Health Bad->Good</option>
        <option value="instanceVersion">Version New->Old</option>
        <option value="!instanceVersion">Version Old->New</option>
      </select>
    </InputBoxContainer>
  );
};

export default SelectInput;

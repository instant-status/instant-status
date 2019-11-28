import React from "react";
import styled from "styled-components";

const InputBoxContainer = styled.label`
  display: flex;
  flex-direction: column;
  margin: 0 20px 10px 0;
`;

const InputBox = styled.input`
  font-size: 16px;
  background-color: ${props => props.theme.color.darkTwo};
  padding: 8px 12px;
  border: none;
  color: ${props => props.theme.color.lightOne};
  border-radius: 6px;
`;

const Label = styled.span`
  font-size: 16px;
  margin-bottom: 6px;
`;

const TextInput = (props: {
  label: string;
  onChange: (event: any) => void;
  value: string;
}) => {
  return (
    <InputBoxContainer>
      <Label>{props.label}</Label>
      <InputBox onChange={props.onChange} type="text" value={props.value} />
    </InputBoxContainer>
  );
};

export default TextInput;

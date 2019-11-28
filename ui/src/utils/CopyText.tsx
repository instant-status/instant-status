import React from "react";
import styled from "styled-components";

const Link = styled.span`
  cursor: pointer;
  padding: 0 4px;
  transition: all 0.2s ease-in-out;
  border-radius: 6px;
  :active {
    background: ${props => props.theme.color.lightOne};
    color: ${props => props.theme.color.darkOne};
    transition: content 0.2s ease-in-out;
  }
  > * {
    transition: all 0.2s ease-in-out;
    :active {
      background: ${props => props.theme.color.lightOne};
      color: ${props => props.theme.color.darkOne};
      transition: content 0.2s ease-in-out;
    }
  }
`;

const copy = (text: string) => {
  navigator.clipboard.writeText(text);
};

export interface CopyButtonProps {
  children: React.ReactNode | React.ReactNode[] | string;
  value: string;
}

const CopyText = ({ value, children }: CopyButtonProps) => {
  return (
    <Link title={value} onClick={() => copy(value)}>
      {children}
    </Link>
  );
};

export default CopyText;

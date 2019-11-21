import React from "react";
import styled from "styled-components";

const CardBackground = styled.div`
  background: ${({ theme }) => theme.color.darkOne};
  border-radius: 2px;
  padding: 10px 16px;
  color: ${({ theme }) => theme.color.lightOne};
  box-shadow: ${({ theme }) => theme.shadow.card};
  width: 300px;
`;

const Card = props => {
  return (
    <CardBackground>
      {props.stack.ec2TagStackLower}
      <br />
      {props.stack.tag}
      {/* {props.stack.entries().forEach(element => {
        return element;
      })} */}
    </CardBackground>
  );
};

export default Card;

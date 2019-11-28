import React from "react";
import styled from "styled-components";
import { lighten } from "polished";

const Header = styled.header`
  padding: 10px 16px;
  display: flex;
  border-bottom: 1px solid ${props => lighten(0.1, props.theme.color.darkOne)};
  justify-content: space-between;
`;

const StackName = styled.h2`
  margin: 0;
  font-size: 28px;
  font-weight: 400;
`;

const StackLogo = styled.div<{ image: string }>`
  background: url(${props => props.image}) center center no-repeat;
  background-size: contain;
  padding: 16px 28px;
`;

const CardHeader = (props: { stackName: string }) => {
  return (
    <Header>
      <StackName>{props.stackName}</StackName>
      <StackLogo image={`../../images/${props.stackName}.svg`} />
    </Header>
  );
};

export default CardHeader;

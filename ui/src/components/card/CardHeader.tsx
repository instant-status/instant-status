import { lighten } from "polished";
import React from "react";
import styled from "styled-components";

const Header = styled.header`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${(props) => lighten(0.1, props.theme.color.darkOne)};
  justify-content: space-between;
`;

const StackId = styled.h2`
  padding: 0 16px;
  margin: 0;
  font-size: 28px;
  font-weight: 400;
  width: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StackLogo = styled.div<{ image: string }>`
  background: url(${(props) => props.image}) center center no-repeat;
  background-size: cover;
  height: 58px;
  width: 58px;
  flex-shrink: 0;
`;

const CardHeader = (props: { stackId: string; stackLogo?: string }) => {
  return (
    <Header>
      <StackLogo image={props.stackLogo} />
      <StackId>{props.stackId}</StackId>
    </Header>
  );
};

export default CardHeader;

import { cssVar, lighten } from "polished";
import React from "react";
import styled from "styled-components";

const Header = styled.header`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${lighten(0.1, cssVar(`--color-darkOne`).toString())};
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

const StackLogo = styled.div<{ image?: string }>`
  background: url(${(props) => props.image}) center center no-repeat;
  background-size: cover;
  height: 64px;
  width: 64px;
  flex-shrink: 0;
`;

const StackServerCount = styled.div`
  font-size: 14px;
  margin-top: -2px;
  color: var(--color-blue);
`;

const CardHeader = (props: {
  stackId?: string;
  stackLogo?: string;
  stackServerCount?: number;
}) => {
  return (
    <Header>
      <StackLogo image={props.stackLogo} />
      <StackId>
        {props.stackId}
        <StackServerCount>
          {props.stackServerCount}
          {props.stackServerCount !== 1 ? ` servers` : ` server`}
        </StackServerCount>
      </StackId>
    </Header>
  );
};

export default CardHeader;

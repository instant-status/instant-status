import React from "react";
import styled from "styled-components";
import { APP_CONFIG } from "../../../../config";

const Header = styled.header`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const Logo = styled.div`
  width: 100%;
  max-width: 60px;
  margin-right: 10px;
`;

const PageInfo = styled.div`
  font-size: 14px;
`;

const AppInfo = styled.div`
  flex: none;
`;

const AppName = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: normal;
  line-height: 1em;
`;

const SidebarHeader = (props: {
  stackCount: number;
  instanceCount: number;
}) => {
  return (
    <Header>
      <Logo onClick={() => (window.location.href = `/`)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 100 100"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="7.1"
            stroke="#fff"
            fill="none"
          >
            <path d="M0 50h25l6-12 10 37 15-55 10 38 5-8h29" />
            <path opacity=".3" d="M-2 55h25l7-11 10 36 14-54 10 37 5-8h29" />
          </g>
        </svg>
      </Logo>
      <AppInfo>
        <AppName>{APP_CONFIG.APP_NAME}</AppName>
        <PageInfo>
          {props.stackCount} Stacks / {props.instanceCount} Instances
        </PageInfo>
      </AppInfo>
    </Header>
  );
};

export default SidebarHeader;

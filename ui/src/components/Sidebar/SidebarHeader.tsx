import APP_CONFIG from "@config/appConfig";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import theme from "../../utils/theme";

const Header = styled.header`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding-left: 20px;
`;

const Logo = styled(Link)`
  width: 100%;
  max-width: 50px;
  margin-right: 10px;
  flex-shrink: 0;
  cursor: pointer;
`;

const PageInfo = styled.div`
  font-size: 14px;
`;

const AppInfo = styled.div`
  flex: none;
`;

const AppName = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  line-height: 1em;
`;

const SidebarHeader = (props: { stackCount: number; serverCount: number }) => {
  return (
    <Header>
      <Logo to={`/`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 100 100"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="7"
            stroke={theme.color.lightOne}
            fill="none"
          >
            <path d="M4 50h21l6-12 10 37 15-55 10 38 5-8h25" />
            <path d="M4 55h19l7-11 10 36 14-54 10 37 5-8h27" opacity="0.3" />
          </g>
        </svg>
      </Logo>
      <AppInfo>
        <AppName>{APP_CONFIG.APP_NAME}</AppName>
        <PageInfo>
          {props.stackCount} {props.stackCount !== 1 ? `Stacks` : `Stack`} /
          {` `}
          {props.serverCount} {props.serverCount !== 1 ? `Servers` : `Server`}
        </PageInfo>
      </AppInfo>
    </Header>
  );
};

export default SidebarHeader;

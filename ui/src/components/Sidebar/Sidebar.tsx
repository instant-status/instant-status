import { observer } from "mobx-react-lite";
import React from "react";
import { Navigate, useLocation } from "react-router";
import styled from "styled-components";

import IconAdmin from "../Icons/IconAdmin";
import IconHistory from "../Icons/IconHistory";
import IconHome from "../Icons/IconHome";
import Stack from "../Layout/Stack";
import SidebarHeader from "./SidebarHeader";
import SidebarTab from "./SidebarTab";

const Aside = styled.aside`
  background-color: ${(props) => props.theme.color.darkOne};
  width: 290px;
  height: 100vh;
  position: fixed;
  color: ${(props) => props.theme.color.lightOne};
  padding: 20px 0 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const AsideGhost = styled.div`
  width: 290px;
  flex: none;
`;

const FooterContainer = styled.div`
  margin-top: auto;
  padding: 20px 0 0;
  text-align: center;
  font-size: 14px;
`;

const Footer = styled.footer`
  padding: 6px 0;
  text-align: center;
  font-size: 14px;
  background-color: darkcyan;
`;

const A = styled.a`
  color: ${(props) => props.theme.color.lightOne};
`;

interface SidebarProps {
  stackCount: number;
  serverCount: number;
  isSuperAdmin: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

const Sidebar = observer((props: SidebarProps) => {
  const location = useLocation();

  if (
    location.pathname.startsWith(`/admin`) &&
    !props.isLoading &&
    !props.isSuperAdmin
  ) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Aside>
        <SidebarHeader
          stackCount={props.stackCount}
          serverCount={props.serverCount}
        />
        {props.children}
        <FooterContainer>
          <Stack direction="down">
            <Stack>
              <SidebarTab
                to="/"
                label="Home"
                icon={<IconHome width="30px" />}
              />
              <SidebarTab
                to="/history"
                label="History"
                icon={<IconHistory width="30px" />}
              />
              {props.isSuperAdmin && (
                <SidebarTab
                  to="/admin"
                  label="Admin"
                  icon={<IconAdmin width="30px" />}
                />
              )}
            </Stack>
            <Stack justify="center" align="baseline" as={Footer}>
              <A
                href="https://github.com/instant-status/instant-status"
                rel="noopener noreferrer"
                title="Instant-Status on GitHub"
              >
                Instant Status
              </A>
              : Made With ⚡
            </Stack>
          </Stack>
        </FooterContainer>
      </Aside>
      <AsideGhost />
    </>
  );
});

export default Sidebar;

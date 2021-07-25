import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";

import SidebarHeader from "./SidebarHeader";

const Aside = styled.aside`
  background-color: ${(props) => props.theme.color.darkOne};
  width: 290px;
  height: 100vh;
  position: fixed;
  color: ${(props) => props.theme.color.lightOne};
  padding: 20px 0 20px 20px;
  display: flex;
  flex-direction: column;
`;

const AsideGhost = styled.div`
  width: 290px;
  flex: none;
`;

const Footer = styled.footer`
  margin: auto 20px 0 0;
  text-align: center;
  opacity: 0.8;
  font-size: 14px;
`;

const A = styled.a`
  color: ${(props) => props.theme.color.lightOne};
`;

interface SidebarProps {
  stackCount: number;
  serverCount: number;
  children: React.ReactNode;
}

const Sidebar = observer((props: SidebarProps) => {
  return (
    <>
      <Aside>
        <SidebarHeader
          stackCount={props.stackCount}
          serverCount={props.serverCount}
        />
        {props.children}
        <Footer>
          <A
            href="https://github.com/instant-status/instant-status"
            rel="noopener noreferrer"
            title="Instant-Status on GitHub"
          >
            Instant Status
          </A>
          : Made With ⚡
        </Footer>
      </Aside>
      <AsideGhost />
    </>
  );
});

export default Sidebar;

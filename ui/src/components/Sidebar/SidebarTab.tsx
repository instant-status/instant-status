import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const Tab = styled(NavLink)`
  width: 100%;
  display: flex;
  flex-direction: column;
  border: none;
  border-radius: 10px 10px 0 0;
  align-items: center;
  cursor: pointer;
  color: var(--color-parchment);
  fill: var(--color-parchment);
  text-decoration: none;
  padding: 0.5rem 0;
  transition: background-color 0.15s ease-out;
  font-size: 1.5em;
  background-color: var(--color-midnight);

  :hover {
    background-color: var(--color-nautical);
  }

  &.active {
    background-color: var(--color-parchment);
    color: var(--color-nautical);
    fill: var(--color-nautical);
  }
`;

const Text = styled.div`
  font-size: 0.6em;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.4px;
`;

interface SidebarTabProps {
  label: string;
  icon: React.ReactNode;
  to: string;
}

const SidebarTab = (props: SidebarTabProps) => {
  return (
    <Tab to={props.to}>
      {props.icon}
      <Text>{props.label}</Text>
    </Tab>
  );
};

export default SidebarTab;

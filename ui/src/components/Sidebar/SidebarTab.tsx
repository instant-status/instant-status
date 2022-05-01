import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const Tab = styled(NavLink)`
  width: 100%;
  display: flex;
  flex-direction: column;
  border: none;
  align-items: center;
  cursor: pointer;
  color: ${({ theme }) => theme.color.lightOne};
  fill: ${({ theme }) => theme.color.lightOne};
  text-decoration: none;
  padding: 0.5rem 0;
  transition: background-color 0.15s ease-out;
  font-size: 1.5em;
  background-color: ${({ theme }) => theme.color.darkOne};

  :hover {
    background-color: ${({ theme }) => theme.color.darkTwo};
  }

  &.active {
    background-color: ${({ theme }) => theme.color.lightOne};
    color: ${({ theme }) => theme.color.darkTwo};
    fill: ${({ theme }) => theme.color.darkTwo};
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

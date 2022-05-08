import { NavLink } from "react-router-dom";
import styled from "styled-components";

const SidebarListTab = styled(NavLink)`
  cursor: pointer;
  color: ${(props) => props.theme.color.lightOne};

  padding: 0.6rem 1.4rem;
  font-size: 1.13rem;
  text-decoration: none;
  color: lightseagreen;

  &:hover:not(:disabled) {
    color: ${(props) => props.theme.color.lightOne};
    background-color: ${(props) => props.theme.color.darkTwo};
  }

  margin-left: 20px;
  border-radius: 12px 0 0 12px;

  &.active {
    background-color: ${(props) => props.theme.color.darkTwo};
    color: ${(props) => props.theme.color.lightOne};
  }
`;

export default SidebarListTab;

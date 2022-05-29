import { NavLink } from "react-router-dom";
import styled from "styled-components";

const SidebarListTab = styled(NavLink)`
  cursor: pointer;
  color: var(--color-lightOne);

  padding: 0.6rem 1.4rem;
  font-size: 1.13rem;
  text-decoration: none;
  color: lightseagreen;

  &:hover:not(:disabled) {
    color: var(--color-lightOne);
    background-color: var(--color-darkTwo);
  }

  margin-left: 20px;
  border-radius: 12px 0 0 12px;

  &.active {
    background-color: var(--color-darkTwo);
    color: var(--color-lightOne);
  }
`;

export default SidebarListTab;

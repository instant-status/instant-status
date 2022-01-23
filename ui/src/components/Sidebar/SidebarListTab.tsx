import { NavLink } from "react-router-dom";
import styled from "styled-components";

import theme from "../../utils/theme";

const SidebarListTab = styled(NavLink).attrs({
  activeStyle: {
    backgroundColor: theme.color.darkTwo,
    color: theme.color.lightOne,
  },
})`
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
`;

export default SidebarListTab;

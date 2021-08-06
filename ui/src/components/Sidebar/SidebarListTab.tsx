import { lighten } from "polished";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

import theme from "../../utils/theme";

const SidebarListTab = styled(NavLink).attrs({
  activeStyle: {
    backgroundColor: theme.color.darkTwo,
  },
})`
  cursor: pointer;
  color: ${(props) => props.theme.color.lightOne};

  padding: 0.6rem 1.4rem;
  font-size: 1.13rem;
  /* font-weight: 600; */
  text-decoration: none;
  color: lightseagreen;

  &:hover:not(:disabled) {
    color: #fff;
    background-color: ${(props) => props.theme.color.darkTwo};
  }

  margin-left: 20px;
  border-radius: 12px 0 0 12px;
`;

export default SidebarListTab;

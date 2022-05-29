import { NavLink } from "react-router-dom";
import styled from "styled-components";

const SidebarListTab = styled(NavLink)`
  cursor: pointer;
  color: var(--color-parchment);

  padding: 0.6rem 1.4rem;
  font-size: 1.13rem;
  text-decoration: none;
  color: var(--color-lightseagreen);

  &:hover:not(:disabled) {
    color: var(--color-parchment);
    background-color: var(--color-nautical);
  }

  margin-left: 20px;
  border-radius: 12px 0 0 12px;

  &.active {
    background-color: var(--color-nautical);
    color: var(--color-parchment);
  }
`;

export default SidebarListTab;

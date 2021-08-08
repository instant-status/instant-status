import { lighten } from "polished";
import styled from "styled-components";

const SidebarSectionHeader = styled.h3`
  font-size: 14px;
  font-weight: 400;
  border-bottom: 1px solid ${(props) => lighten(0.1, props.theme.color.darkOne)};
  padding-bottom: 4px;
  text-transform: uppercase;
`;

export default SidebarSectionHeader;

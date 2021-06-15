import styled, { css } from "styled-components";

import { spacing } from "./spacing";

type DirectionProps = "up" | "down" | "left" | "right";

type AlignProps = "start" | "end" | "center" | "fill" | "baseline";
type JustifyProps =
  | "start"
  | "end"
  | "center"
  | "fill"
  | "spaceBetween"
  | "spaceAround"
  | "spaceEvenly";

const getFlexProps = (align?: AlignProps | JustifyProps) => {
  switch (align) {
    case "start":
      return "flex-start";
    case "end":
      return "flex-end";
    case "center":
      return "center";
    case "fill":
      return "stretch";
    case "spaceBetween":
      return "space-between";
    case "spaceAround":
      return "space-around";
    case "spaceEvenly":
      return "space-evenly";
    case "baseline":
      return "baseline";
    default:
      return undefined;
  }
};

const getMarginFromFlexDirection = (flexDirection?: string) => {
  switch (flexDirection) {
    case "column":
      return "bottom";
    case "column-reverse":
      return "top";
    case "row-reverse":
      return "left";
    case "row":
    default:
      return "right";
  }
};

const getFlexDirection = (direction?: DirectionProps) => {
  switch (direction) {
    case "up":
      return "column-reverse";
    case "down":
      return "column";
    case "left":
      return "row-reverse";
    case "right":
    default:
      return "row";
  }
};

interface StackProps {
  align?: AlignProps;
  justify?: JustifyProps;
  direction?: DirectionProps;
  wrap?: boolean;
  fullWidth?: boolean;
  spacing?: keyof typeof spacing;
}

const Stack = styled.div.attrs<StackProps>((props: StackProps) => ({
  align: getFlexProps(props.align),
  justify: getFlexProps(props.justify),
  fullWidth: props.fullWidth,
  spacing: spacing[props.spacing || 0],
  direction: getFlexDirection(props.direction),
  wrap: props.wrap,
}))<StackProps>`
  display: flex;
  ${(props) => props.fullWidth && "width: 100%"};
  ${(props) => props.direction && `flex-direction: ${props.direction}`};
  ${(props) => props.align && `align-items: ${props.align}`};
  ${(props) => props.justify && `justify-content: ${props.justify}`};
  ${(props) => props.wrap && `flex-wrap: wrap`};
  & > *:not(:last-child) {
    ${(props) =>
      props.spacing &&
      (props.direction?.includes("column")
        ? css`
            margin-${getMarginFromFlexDirection(props.direction)}: ${
            props.spacing
          } !important;
          `
        : css`
            margin-${getMarginFromFlexDirection(props.direction)}: ${
            props.spacing
          } !important;
          `)};
  }
`;

export default Stack;

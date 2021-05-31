import React from "react";
import styled, { css, keyframes } from "styled-components";
import theme from "../utils/theme";

const pulseAnimation = (props) => keyframes`
0% {
  box-shadow: 0 0 0 0px ${props.$color};
}
100% {
  box-shadow: 0 0 0 10px rgba(0,0,0,0);
}
`;

const ProgressBackground = styled.div<{ $warning: boolean; $color: string }>`
  border-radius: 7px;
  margin: 4px 8px;
  width: 100%;
  background-color: #848484;
  overflow: hidden;

  ${(props) =>
    props.$warning &&
    css`
      animation: ${(props) => pulseAnimation(props)} 1s infinite;
    `};
`;

const ProgressUsed = styled.div<{ $width: number; $color: string }>`
  width: ${(props) => props.$width}%;
  height: 14px;
  transition: width 10s;
  background-color: ${(props) => props.$color};

  ${(props) =>
    (props.$width > 3 && props.$width < 98) &&
    css`
      border-right: 2px solid ${(props) => props.theme.color.darkOne};
    `}
`;

const ProgressBar = (props: { $progress: number, $pulse?: boolean }) => {
  return (
    <ProgressBackground $warning={props.$pulse} $color={theme.color.purple}>
      <ProgressUsed $width={props.$progress} $color={theme.color.purple} />
    </ProgressBackground>
  );
};

export default ProgressBar;
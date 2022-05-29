import React from "react";
import styled, { css, keyframes } from "styled-components";

const pulseAnimation = (props: { $color: string }) => keyframes`
0% {
  box-shadow: 0 0 0 0px var(${props.$color});
}
100% {
  box-shadow: 0 0 0 10px rgba(0,0,0,0);
}
`;

const ProgressBackground = styled.div<{
  $warning?: boolean;
  $color: string;
  $height?: string;
  $margin?: string;
}>`
  border-radius: 7px;
  width: 100%;
  background-color: #848484;
  overflow: hidden;
  height: ${(props) => props.$height || `14px`};
  margin: ${(props) => props.$margin || `4px 8px`};

  ${(props) =>
    props.$warning &&
    css`
      animation: ${pulseAnimation(props)} 1s infinite;
    `};
`;

const ProgressUsed = styled.div<{ $width: number; $color: string }>`
  width: ${(props) =>
    props.$width > 0 ? `calc(${props.$width}% + 2px)` : `${props.$width}%`};
  height: 100%;
  background-color: var(${(props) => props.$color});
  margin-left: -2px;
  box-sizing: content-box;
  border-right: 2px solid var(--color-darkOne);
  transition: width 10s;
`;

interface ProgressBarProps {
  progress: number;
  color: string;
  pulse?: boolean;
  height?: string;
  margin?: string;
}

const ProgressBar = (props: ProgressBarProps) => {
  return (
    <ProgressBackground
      $warning={props.pulse}
      $color={props.color}
      $height={props.height}
      $margin={props.margin}
    >
      <ProgressUsed $width={props.progress} $color={props.color} />
    </ProgressBackground>
  );
};

export default ProgressBar;

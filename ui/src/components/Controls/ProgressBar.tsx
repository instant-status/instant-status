import React from "react";
import styled, { css, keyframes } from "styled-components";

const pulseAnimation = (props: { $color: string }) => keyframes`
0% {
  box-shadow: 0 0 0 0px ${props.$color};
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
  width: ${(props) => props.$width}%;
  height: 100%;
  transition: width 10s;
  background-color: ${(props) => props.$color};

  ${(props) =>
    props.$width > 3 &&
    css`
      border-right: 2px solid ${props.theme.color.darkOne};
    `}
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
      <ProgressUsed
        $width={props.progress > 98 ? props.progress + 2 : props.progress}
        $color={props.color}
      />
    </ProgressBackground>
  );
};

export default ProgressBar;

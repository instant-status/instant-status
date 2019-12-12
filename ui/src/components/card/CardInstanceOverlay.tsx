import React from "react";
import styled from "styled-components";
import { transparentize } from "polished";

import InstanceProps from "../../utils/InstanceProps";
import { getStateIcon, getStateMessage } from "../../utils/getState";
import { getHealthIcon, getHealthMessage } from "../../utils/getHealth";

const UpdatingInstance = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) =>
    theme.color.darkOne && transparentize(0.1, theme.color.darkOne)};
  font-size: 15px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  flex-direction: column;
  text-align: center;
  padding: 16px;
  cursor: pointer;
  backdrop-filter: blur(2px);

  & > svg {
    flex: none;
  }

  & > i {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }
`;

const CardInstanceOverlay = (props: {
  onClick: () => void;
  type: string;
  stateorHealthCode: number;
  instance: InstanceProps;
}) => {
  if (props.type === "state") {
  return (
    <UpdatingInstance title="Hide Info" onClick={props.onClick}>
      {getStateIcon(props.stateorHealthCode, "40px")}
      {getStateMessage(props.stateorHealthCode, props.instance)}
    </UpdatingInstance>
    );
   };

  if (props.type === "health") {
  return (
    <UpdatingInstance title="Hide Info" onClick={props.onClick}>
      {getHealthIcon(props.stateorHealthCode, "40px")}
      {getHealthMessage(props.instance)}
    </UpdatingInstance>
    );
  };
};

export default CardInstanceOverlay;

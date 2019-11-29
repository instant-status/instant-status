import React from "react";
import styled from "styled-components";
import { transparentize } from "polished";

import InstanceProps from "../../utils/InstanceProps";
import { getStatusIcon, getStatusMessage } from "../../utils/getStatus";

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

const CardInstanceStatusOverlay = (props: {
  onClick: () => void;
  statusCode: number;
  instance: InstanceProps;
}) => {
  return (
    <UpdatingInstance title="Hide Info" onClick={props.onClick}>
      {getStatusIcon(props.statusCode, "40px")}
      {getStatusMessage(props.statusCode, props.instance)}
    </UpdatingInstance>
  );
};

export default CardInstanceStatusOverlay;

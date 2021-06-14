import { transparentize } from "polished";
import React from "react";
import styled from "styled-components";
import getDate from "../../utils/getDate";

import { getHealthIcon } from "../../utils/getHealth";
import { getStateIcon } from "../../utils/getState";
import { InstanceProps } from "../../../../types/globalTypes";
import IconClose from "../icons/IconClose";
import Stack from "../Stack";
import ProgressBar from "../ProgressBar";
import theme from "../../utils/theme";

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) =>
    theme.color.darkOne && transparentize(0.1, theme.color.darkOne)};
  font-size: 15px;
  position: absolute;
  z-index: 100;
  flex-direction: column;
  text-align: center;
  padding: 0 16px 16px;
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

const OverlayCloseButton = styled.button`
  fill: #fff;
  cursor: pointer;
  border-radius: 50%;
  background-color: ${(props) => props.theme.color.darkTwo};
  border: 1px solid #fff;
  width: 24px;
  height: 24px;
  padding: 4px;
`;

const OverlayHeaderText = styled.div`
  font-weight: 700;
  align-self: center;
`;

const RowKey = styled.div`
  width: 110px;
  text-align: right;
  flex: none;
  opacity: 0.7;
`;

const CardInstanceOverlay = (props: {
  onClick: () => void;
  type: string;
  stateorHealthCode: number;
  isStartingUpdate: boolean;
  instance: InstanceProps;
}) => {
  if (props.type === `health`) {
    return (
      <Stack as={Overlay} direction="down" spacing={4}>
        <Stack justify="spaceBetween">
          {getHealthIcon(props.stateorHealthCode, `40px`)}
          <OverlayHeaderText>Server Health</OverlayHeaderText>
          <OverlayCloseButton onClick={props.onClick}>
            <IconClose />
          </OverlayCloseButton>
        </Stack>
        <Stack direction="down" spacing={1}>
          <Stack spacing={2}>
            <RowKey>Last Reported:</RowKey>
            <div>{getDate(props.instance.server_health_updated_at)}</div>
          </Stack>
          <Stack spacing={2}>
            <RowKey>Message:</RowKey>
            <div>{props.instance.server_health_message}</div>
          </Stack>
        </Stack>
      </Stack>
    );
  }

  if (props.type === `state`) {
    const updateProgress = props.isStartingUpdate
      ? 0
      : props.instance.server_update_progress;
    const updateMessage = props.isStartingUpdate
      ? "Update Requested..."
      : props.instance.server_update_message;
    return (
      <Stack as={Overlay} direction="down" spacing={4}>
        <Stack justify="spaceBetween">
          {getStateIcon(props.stateorHealthCode, `40px`)}
          <OverlayHeaderText>Update In Progress</OverlayHeaderText>
          <OverlayCloseButton onClick={props.onClick}>
            <IconClose />
          </OverlayCloseButton>
        </Stack>
        <Stack>
          <ProgressBar
            progress={updateProgress}
            pulse={true}
            color={theme.color.purple}
          />
        </Stack>
        <Stack direction="down" spacing={1}>
          <Stack spacing={2}>
            <RowKey>Message:</RowKey>
            <div>{updateMessage}</div>
          </Stack>
          <Stack spacing={2}>
            <RowKey>From:</RowKey>
            <div>
              {props.instance.server_app_version} (xAPI{" "}
              {props.instance.server_xapi_version})
            </div>
          </Stack>
          <Stack spacing={2}>
            <RowKey>To:</RowKey>
            <div>
              {props.instance.server_updating_app_to} (xAPI{" "}
              {props.instance.server_updating_xapi_to})
            </div>
          </Stack>
        </Stack>
      </Stack>
    );
  }
};

export default CardInstanceOverlay;

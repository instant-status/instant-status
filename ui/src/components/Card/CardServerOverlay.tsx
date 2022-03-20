import { transparentize } from "polished";
import React from "react";
import styled from "styled-components";

import { ServerProps } from "../../globalTypes";
import getDate from "../../utils/getDate";
import { getHealthIcon } from "../../utils/getHealth";
import { getStateIcon } from "../../utils/getState";
import theme from "../../utils/theme";
import ProgressBar from "../Controls/ProgressBar";
import IconClose from "../Icons/IconClose";
import Stack from "../Layout/Stack";

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

  & > div > svg {
    height: 40px;
  }
`;

const OverlayCloseButton = styled.button`
  fill: ${(props) => props.theme.color.lightOne};
  cursor: pointer;
  border-radius: 50%;
  background-color: ${(props) => props.theme.color.darkTwo};
  border: 1px solid ${(props) => props.theme.color.lightOne};
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

const CardServerOverlay = (props: {
  onClick: () => void;
  type: string;
  stateOrHealthCode: number;
  isStartingUpdate: boolean;
  server: ServerProps;
}) => {
  if (props.type === `health`) {
    return (
      <Stack as={Overlay} direction="down" spacing={4}>
        <Stack justify="spaceBetween">
          {getHealthIcon(props.stateOrHealthCode, `40px`)}
          <OverlayHeaderText>Server Health</OverlayHeaderText>
          <OverlayCloseButton onClick={props.onClick}>
            <IconClose />
          </OverlayCloseButton>
        </Stack>
        <Stack direction="down" spacing={1}>
          <Stack spacing={2}>
            <RowKey>Last Reported:</RowKey>
            <div>{getDate(props.server.server_health_updated_at)}</div>
          </Stack>
          <Stack spacing={2}>
            <RowKey>Message:</RowKey>
            <div>{props.server.server_health_message}</div>
          </Stack>
        </Stack>
      </Stack>
    );
  }

  if (props.type === `state`) {
    const updateProgress = props.isStartingUpdate
      ? 0
      : props.server.server_update_progress;
    const updateMessage = props.isStartingUpdate
      ? `Update Requested...`
      : props.server.server_update_message;
    return (
      <Stack as={Overlay} direction="down" spacing={4}>
        <Stack justify="spaceBetween">
          {getStateIcon(props.stateOrHealthCode, `40px`)}
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
          {props.server.server_app_version && (
            <Stack spacing={2}>
              <RowKey>From:</RowKey>
              <div>{props.server.server_app_version}</div>
            </Stack>
          )}
          <Stack spacing={2}>
            <RowKey>To:</RowKey>
            <div>{props.server.server_app_updating_to_version}</div>
          </Stack>
        </Stack>
      </Stack>
    );
  }

  return null;
};

export default CardServerOverlay;

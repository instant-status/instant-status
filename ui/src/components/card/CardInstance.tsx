import { transparentize } from "polished";
import React, { useContext, useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";

import APP_CONFIG from "../../../../config/appConfig";
import { StateContext } from "../../context/StateContext";
import getDate from "../../utils/getDate";
import { getHealthColor, getHealthIcon } from "../../utils/getHealth";
import { getStateIcon } from "../../utils/getState";
import { InstanceProps } from "../../../../types/globalTypes";
import theme from "../../utils/theme";
import IconGithub from "../icons/IconGithub";
import IconUbuntu from "../icons/IconUbuntu";
import CopyText from "../shared/CopyText";
import IconButton from "../shared/IconButton";
import CardInstanceOverlay from "./CardInstanceOverlay";
import Stack from "../Stack";
import ProgressBar from "../ProgressBar";

const ServerWrapper = styled.section`
  position: relative;
  user-select: none;
`;

const Instance = styled.article`
  padding: 0 16px;
  font-size: 16px;
  margin: 20px 0;
`;

const ServerHeader = styled.header`
  margin: 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ServerName = styled.div`
  width: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ServerRole = styled.h4<{ $color: string }>`
  font-size: 17px;
  margin: 0;
  text-transform: capitalize;
  color: ${(props) => props.$color};
`;

const ServerId = styled.span`
  color: ${(props) => transparentize(0.5, props.theme.color.lightOne)};
  font-weight: 400;
  font-size: 16px;
  display: inline-block;
`;

const ServerRow = styled.div`
  margin-bottom: 10px;
  display: flex;
`;

const ServerRowKey = styled.div`
  width: 110px;
  text-align: right;
  flex: none;
  opacity: 0.7;
  padding-right: 4px;
`;

const SmallStateIcon = styled.div`
  cursor: pointer;
  padding-right: 10px;
`;

const SmallHealthIcon = styled.div`
  cursor: pointer;
`;

const CardInstance = (props: {
  instance: InstanceProps;
  isUpdating: boolean;
  isStartingUpdate: boolean;
}) => {
  const { keyLocation, showAdvanced } = useContext(StateContext);

  const instanceIsBooting =
    props.instance.server_app_version === `primal` &&
    !props.instance.server_updating_app_to &&
    !props.instance.server_updating_xapi_to;

  const stateCode = instanceIsBooting
    ? 0
    : props.isStartingUpdate || props.instance.server_update_progress !== 100
    ? 2
    : 3;

  const healthCode = props.instance.server_health_code || 0;
  const diskUsed = Math.floor(
    (props.instance.server_disk_used_gb / props.instance.server_disk_total_gb) *
      100,
  );

  const diskColor =
    diskUsed >= 80
      ? theme.color.red
      : diskUsed >= 50
      ? theme.color.orange
      : theme.color.green;

  const [isStateOverlayVisible, setIsStateOverlayVisible] = useState(false);
  const [isHealthOverlayVisible, setIsHealthOverlayVisible] = useState(false);

  useEffect(() => {
    setIsStateOverlayVisible(stateCode < 3);
  }, [stateCode]);

  useEffect(() => {
    setIsHealthOverlayVisible(healthCode > 1);
  }, [healthCode]);

  const filteredAdvancedCardData = Object.entries(props.instance).filter(
    (row) => {
      if (
        Object.keys(APP_CONFIG.CARD_ADVANCED_MAPPING).includes(row[0] as string)
      ) {
        return row;
      }
    },
  );

  return (
    <ServerWrapper>
      {isStateOverlayVisible && (
        <CardInstanceOverlay
          onClick={() => setIsStateOverlayVisible(false)}
          type="state"
          stateorHealthCode={stateCode}
          isStartingUpdate={props.isStartingUpdate}
          instance={props.instance}
        />
      )}

      {isHealthOverlayVisible && (
        <CardInstanceOverlay
          onClick={() => setIsHealthOverlayVisible(false)}
          type="health"
          stateorHealthCode={healthCode}
          isStartingUpdate={props.isStartingUpdate}
          instance={props.instance}
        />
      )}
      <Instance>
        <ServerHeader>
          <Stack as={ServerName} spacing={2} align="baseline">
            <ServerRole $color={getHealthColor(healthCode)}>
              {props.instance.server_role}
            </ServerRole>
            <ServerId>{props.instance.server_id}</ServerId>
            <span>{props.instance.server_is_chosen_one && `👑`}</span>
          </Stack>

          <SmallStateIcon
            title="Show Update Info"
            onClick={() => setIsStateOverlayVisible(true)}
          >
            {getStateIcon(stateCode)}
          </SmallStateIcon>

          <SmallHealthIcon
            title="Show Health Info"
            onClick={() => setIsHealthOverlayVisible(true)}
          >
            {getHealthIcon(healthCode)}
          </SmallHealthIcon>
        </ServerHeader>
        <div>
          <ServerRow>
            <ServerRowKey>IP:</ServerRowKey>
            <CopyText value={props.instance.server_public_ip}>
              {props.instance.server_public_ip}
            </CopyText>
            <IconButton
              onClick={() =>
                navigator.clipboard.writeText(
                  `ssh ubuntu@${props.instance.server_public_ip} -i '${keyLocation}${props.instance.server_key_file_name}.pem'`,
                )
              }
            >
              <IconUbuntu color={theme.color.lightOne} width="1em" />
            </IconButton>
          </ServerRow>
          <ServerRow>
            <ServerRowKey>Version:</ServerRowKey>
            <CopyText
              value={`${props.instance.server_app_version} (xAPI ${props.instance.server_xapi_version}`}
            >
              {props.instance.server_app_version} (xAPI{" "}
              {props.instance.server_xapi_version})
            </CopyText>
            <IconButton
              href={`${APP_CONFIG.GITHUB_VERSION_URL}${props.instance.server_app_version}`}
            >
              <IconGithub color={theme.color.lightOne} width="1em" />
            </IconButton>
          </ServerRow>
          <ServerRow>
            <ServerRowKey>Last Updated:</ServerRowKey>
            <CopyText value={props.instance.server_updated_at}>
              {getDate(props.instance.server_updated_at)}
            </CopyText>
          </ServerRow>
          <ServerRow>
            {/* invert value and use background filter */}
            <ServerRowKey>Disk:</ServerRowKey>
            <CopyText
              value={`Using ${props.instance.server_disk_used_gb}Gb of ${props.instance.server_disk_total_gb}Gb total | ${props.instance.server_type}`}
              $overflowVisible={true}
            >
              <ProgressBar
                progress={diskUsed}
                pulse={diskUsed >= 70}
                color={diskColor}
                height={"10px"}
                margin={"auto 0 4px"}
              />
            </CopyText>
          </ServerRow>
        </div>
        {showAdvanced &&
          filteredAdvancedCardData.map((row) => {
            const advancedData = Object.entries(
              APP_CONFIG.CARD_ADVANCED_MAPPING,
            ).find((obj) => {
              return obj[0] === row[0];
            });
            return (
              <ServerRow key={row[0]}>
                <ServerRowKey>{advancedData[1]}:</ServerRowKey>
                <CopyText value={row[1]}>{row[1]}</CopyText>
              </ServerRow>
            );
          })}
      </Instance>
    </ServerWrapper>
  );
};

export default CardInstance;

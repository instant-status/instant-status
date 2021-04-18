import { transparentize } from "polished";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import APP_CONFIG from "../../../../config/appConfig";
import { StateContext } from "../../context/StateContext";
import getDate from "../../utils/getDate";
import { getHealthIcon } from "../../utils/getHealth";
import { getStateIcon } from "../../utils/getState";
import InstanceProps from "../../utils/InstanceProps";
import theme from "../../utils/theme";
import IconGithub from "../icons/IconGithub";
import IconUbuntu from "../icons/IconUbuntu";
import CopyText from "../shared/CopyText";
import IconButton from "../shared/IconButton";
import CardInstanceOverlay from "./CardInstanceOverlay";

const InstanceWrapper = styled.article`
  position: relative;
  user-select: none;
`;

const Instance = styled.article`
  padding: 0 16px;
  font-size: 16px;
  margin: 20px 0;
`;

const InstanceHeader = styled.header`
  margin: 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InstanceName = styled.h4`
  font-weight: 400;
  font-size: 20px;
  margin: 0;
  width: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const InstanceNumber = styled.span`
  color: ${(props) => transparentize(0.5, props.theme.color.lightOne)};
  font-size: 16px;
  margin-left: 10px;
`;

const InstanceRow = styled.div`
  margin-bottom: 10px;
  display: flex;
`;

const InstanceRowKey = styled.div`
  width: 125px;
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

const ProgressBackground = styled.div`
  position: relative;
  height: 10px;
  border-radius: 4px;
  margin: auto 4px 3px;
  background: ${(props) =>
    `linear-gradient(to right, ${props.theme.color.green}, ${props.theme.color.orange}, ${props.theme.color.red})`};
  width: 100%;
  opacity: 0.75;
`;

const ProgressFreeSpace = styled.div<{ width: number }>`
  width: ${(props) => props.width}%;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  border-left: 2px solid ${(props) => props.theme.color.darkOne};
  backdrop-filter: grayscale(1);
`;

const ProgressBar = (props: { total: number; used: number }) => {
  const freeSpace = 100 - Math.floor((props.used / props.total) * 100);

  return (
    <ProgressBackground>
      <ProgressFreeSpace width={freeSpace} />
    </ProgressBackground>
  );
};

const CardInstance = (props: {
  instance: InstanceProps;
  instanceNumber: number;
}) => {
  const { keyLocation, showAdvanced } = useContext(StateContext);

  const instanceIsBooting =
    props.instance.server_app_version === `primal` &&
    !props.instance.server_updating_app_to;

  const instanceIsUpdating =
    props.instance.server_app_version !== `primal` &&
    props.instance.server_updating_app_to !== props.instance.server_app_version;

  const stateCode = instanceIsBooting ? 0 : instanceIsUpdating ? 2 : 3;

  const healthCode = props.instance.server_health_code || 0;

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
  console.log(APP_CONFIG.GITHUB_VERSION_URL)

  return (
    <InstanceWrapper>
      {isStateOverlayVisible && (
        <CardInstanceOverlay
          onClick={() => setIsStateOverlayVisible(false)}
          type="state"
          stateorHealthCode={stateCode}
          instance={props.instance}
        />
      )}

      {isHealthOverlayVisible && (
        <CardInstanceOverlay
          onClick={() => setIsHealthOverlayVisible(false)}
          type="health"
          stateorHealthCode={healthCode}
          instance={props.instance}
        />
      )}
      <Instance>
        <InstanceHeader>
          <InstanceName>
            {props.instance.server_is_chosen_one && `👑 `}
            {props.instance.server_id}
            <InstanceNumber>#{props.instanceNumber}</InstanceNumber>
          </InstanceName>

          <SmallStateIcon
            title="Show Info"
            onClick={() => setIsStateOverlayVisible(true)}
          >
            {getStateIcon(stateCode)}
          </SmallStateIcon>

          <SmallHealthIcon
            title="Show Info"
            onClick={() => setIsHealthOverlayVisible(true)}
          >
            {getHealthIcon(healthCode)}
          </SmallHealthIcon>
        </InstanceHeader>
        <div>
          <InstanceRow>
            <InstanceRowKey>IP:</InstanceRowKey>
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
          </InstanceRow>
          <InstanceRow>
            <InstanceRowKey>Version:</InstanceRowKey>
            <CopyText value={`${props.instance.server_app_version}`}>
              {props.instance.server_app_version}
            </CopyText>
            <IconButton
              href={`${APP_CONFIG.GITHUB_VERSION_URL}${props.instance.server_app_version}`}
            >
              <IconGithub color={theme.color.lightOne} width="1em" />
            </IconButton>
          </InstanceRow>
          <InstanceRow>
            <InstanceRowKey>Deployed:</InstanceRowKey>
            <CopyText value={props.instance.server_updated_at}>
              {getDate(props.instance.server_updated_at)}
            </CopyText>
          </InstanceRow>
          <InstanceRow>
            {/* invert value and use background filter */}
            <InstanceRowKey>Disk:</InstanceRowKey>
            <CopyText
              value={`Using ${props.instance.server_disk_used_gb}Gb of ${props.instance.server_disk_total_gb}Gb total | ${props.instance.server_type}`}
            >
              <ProgressBar
                total={props.instance.server_disk_total_gb}
                used={props.instance.server_disk_used_gb}
              />
            </CopyText>
          </InstanceRow>
        </div>
        {showAdvanced && (
          <>
            {filteredAdvancedCardData && <br />}
            {filteredAdvancedCardData.map((row) => {
              const advancedData = Object.entries(
                APP_CONFIG.CARD_ADVANCED_MAPPING,
              ).find((obj) => {
                return obj[0] === row[0];
              });
              return (
                <InstanceRow key={row[0]}>
                  <InstanceRowKey>{advancedData[1]}:</InstanceRowKey>
                  <CopyText value={row[1]}>{row[1]}</CopyText>
                </InstanceRow>
              );
            })}
          </>
        )}
      </Instance>
    </InstanceWrapper>
  );
};

export default CardInstance;

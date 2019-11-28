import React, { useState } from "react";
import styled from "styled-components";

import { APP_CONFIG } from "../../../../config";
import InstanceProps from "../../utils/InstanceProps";
import { getStatusIcon } from "./getStatus";
import CardInstanceStatusOverlay from "./CardInstanceStatusOverlay";

const InstanceWrapper = styled.article`
  position: relative;
`;

const Instance = styled.article`
  padding: 0 16px;
  font-size: 16px;
`;

const InstanceName = styled.h4`
  font-weight: 400;
  font-size: 20px;
  margin: 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InstanceRow = styled.div`
  margin-bottom: 8px;
  display: flex;
`;

const InstanceRowKey = styled.b`
  width: 125px;
  text-align: right;
  flex: none;
`;

const InstanceRowValue = styled.span`
  padding-left: 6px;
`;

const SmallStatusIcon = styled.div`
  cursor: pointer;
`;

const CardInstance = (props: { instance: InstanceProps }) => {
  const instanceIsBooting =
    props.instance.instanceVersion === "primal" &&
    !props.instance.instanceInGhostMode &&
    !props.instance.instanceUpdatingToVersion;

  const instanceIsGhost =
    props.instance.instanceVersion === "primal" &&
    props.instance.instanceInGhostMode &&
    props.instance.instanceUpdatingToVersion;

  const instanceIsUpdating =
    props.instance.instanceVersion !== "primal" &&
    props.instance.instanceUpdatingToVersion;

  const statusCode = instanceIsBooting
    ? 0
    : instanceIsGhost
    ? 1
    : instanceIsUpdating
    ? 2
    : props.instance.instanceHealthCode;

  const [isOverlayVisible, setIsOverlayVisible] = useState(statusCode < 3);

  const filteredCardData = Object.entries(props.instance).filter(row => {
    if (Object.keys(APP_CONFIG.CARD_MAPPING).includes(row[0] as string)) {
      return row;
    }
  });

  const filteredAdvancedCardData = Object.entries(props.instance).filter(
    row => {
      if (
        Object.keys(APP_CONFIG.CARD_ADVANCED_MAPPING).includes(row[0] as string)
      ) {
        return row;
      }
    },
  );

  return (
    <InstanceWrapper>
      {isOverlayVisible && (
        <CardInstanceStatusOverlay
          onClick={() => setIsOverlayVisible(false)}
          statusCode={statusCode}
          instance={props.instance}
        />
      )}
      <Instance>
        <InstanceName>
          {props.instance.instanceIsChosenOne && "👑 "}
          {props.instance.instanceName}
          {!isOverlayVisible && (
            <SmallStatusIcon
              title="Show Info"
              onClick={() => setIsOverlayVisible(true)}
            >
              {getStatusIcon(statusCode)}
            </SmallStatusIcon>
          )}
        </InstanceName>
        {filteredCardData.map(row => {
          const test = Object.entries(APP_CONFIG.CARD_MAPPING).find(obj => {
            return obj[0] === row[0];
          });
          return (
            <InstanceRow key={row[0]}>
              <InstanceRowKey>{test[1]}:</InstanceRowKey>
              <InstanceRowValue>{row[1]}</InstanceRowValue>
            </InstanceRow>
          );
        })}
      </Instance>
    </InstanceWrapper>
  );
};

export default CardInstance;

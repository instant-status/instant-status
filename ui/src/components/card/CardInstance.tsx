import React, { useState } from "react";
import styled from "styled-components";

import { transparentize } from "polished";
import {
  APP_CONFIG_CARD_MAPPING,
  APP_CONFIG_CARD_ADVANCED_MAPPING,
} from "../../config";
import IconUpdating from "../icons/IconUpdating";
import IconAdd from "../icons/IconAdd";

const InstanceWrapper = styled.article`
  position: relative;
`;

const Instance = styled.article<{ blur: boolean }>`
  padding: 0 16px;
  font-size: 16px;
  ${props => props.blur && "filter: blur(2px);"}
`;

const UpdatingInstance = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) =>
    theme.color.darkOne && transparentize(0.2, theme.color.darkOne)};
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

const StatusIcon = styled.div<{ onClick: () => void }>`
  ${props => props.onClick && "cursor: pointer"}
`;

const CardInstance = (props: { instance: any }) => {
  const [isVisible, setIsVisible] = useState(true);

  const filteredCardData = Object.entries(props.instance).filter(row => {
    if (Object.keys(APP_CONFIG_CARD_MAPPING).includes(row[0] as string)) {
      return row;
    }
  });

  const filteredAdvancedCardData = Object.entries(props.instance).filter(
    row => {
      if (
        Object.keys(APP_CONFIG_CARD_ADVANCED_MAPPING).includes(row[0] as string)
      ) {
        return row;
      }
    },
  );

  return (
    <InstanceWrapper>
      {props.instance.instanceUpdatingTo && isVisible && (
        <UpdatingInstance
          title="Hide Update Overlay"
          onClick={() => setIsVisible(false)}
        >
          {props.instance.instanceVersion ? (
            <>
              <IconUpdating color="#00ab4e" width="40px" />
              Updating from:
              <br />
              <i>{props.instance.instanceVersion}</i>
              to:
              <i>{props.instance.instanceUpdatingTo}</i>
            </>
          ) : (
            <>
              <IconAdd color="#FFF1E5" width="40px" />
              Spawning:
              <i>{props.instance.instanceUpdatingTo}</i>
            </>
          )}
        </UpdatingInstance>
      )}
      <Instance blur={props.instance.instanceUpdatingTo && isVisible}>
        <InstanceName>
          {props.instance.instanceIsChosenOne && "👑 "}
          {props.instance.instanceName}
          {props.instance.instanceUpdatingTo && !isVisible && (
            <StatusIcon
              title="Show Updating Status"
              onClick={() => setIsVisible(true)}
            >
              <IconUpdating color="#00ab4e" width="20px" />
            </StatusIcon>
          )}
        </InstanceName>
        {filteredCardData.map(row => {
          const test = Object.entries(APP_CONFIG_CARD_MAPPING).find(obj => {
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

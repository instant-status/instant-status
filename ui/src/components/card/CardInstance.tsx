import React from "react";
import styled from "styled-components";
import { APP_CONFIG_CARD_MAPPING } from "../../config";

const Instance = styled.article`
  padding: 0 16px;
  font-size: 16px;
`;

const InstanceName = styled.h4`
  font-weight: 400;
  font-size: 20px;
  margin: 8px 0;
`;

const InstanceRow = styled.div`
  margin-bottom: 8px;
  display: flex;
`;

const InstanceRowKey = styled.b`
  width: 137px;
  text-align: right;
  flex: none;
`;

const InstanceRowValue = styled.span`
  padding-left: 6px;
`;

const CardInstance = (props: { instance: any }) => {
  return (
    <Instance>
      <InstanceName>{props.instance.ec2TagNameLower}</InstanceName>
      {Object.entries(props.instance)
        .filter(row => {
          if (
            Object.values(APP_CONFIG_CARD_MAPPING).includes(row[0] as string)
          ) {
            return row;
          }
        })
        .map(row => (
          <InstanceRow>
            <InstanceRowKey>{row[0]}:</InstanceRowKey>
            <InstanceRowValue>{row[1]}</InstanceRowValue>
          </InstanceRow>
        ))}
    </Instance>
  );
};

export default CardInstance;

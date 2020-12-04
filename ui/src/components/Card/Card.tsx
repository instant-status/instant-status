import React, { memo, useContext } from "react";
import styled from "styled-components";

import { StateContext } from "../../context/StateContext";
import InstanceProps from "../../utils/InstanceProps";
import CardFooter from "./CardFooter";
import CardHeader from "./CardHeader";
import CardInstance from "./CardInstance";

const CardBackground = styled.div`
  background: ${(props) => props.theme.color.darkOne};
  color: ${(props) => props.theme.color.lightOne};
  border-radius: 2px;
  box-shadow: ${(props) => props.theme.shadow.card};
  width: 360px;
  display: flex;
  flex-direction: column;
`;

const instanceIds = (instances?: InstanceProps[]) => {
  const ids = instances.map((instance) => instance.instanceID);
  return ids[0] ? ids : undefined;
};

const getChosenOne = (instances?: InstanceProps[]) => {
  const chosenOne = instances.filter(
    (instance) => instance.instanceIsChosenOne === true,
  );
  return chosenOne[0] || undefined;
};

const Card = (props: { instances: InstanceProps[]; stackName: string }) => {
  const { instanceDisplayCount } = useContext(StateContext);

  return (
    <CardBackground>
      <CardHeader stackName={props.stackName} />
      {props.instances
        .sort((a: InstanceProps, b: InstanceProps) => {
          if (a.instanceCreatedAt === b.instanceCreatedAt) {
            return a.instancePublicIP < b.instancePublicIP ? -1 : 1;
          }
          return a.instanceCreatedAt < b.instanceCreatedAt ? -1 : 1;
        })
        .slice(0, instanceDisplayCount)
        .map((instance, i) => {
          return (
            <CardInstance
              key={instance.instanceID}
              instanceNumber={i + 1}
              instance={instance}
            />
          );
        })}
      <CardFooter
        chosenOne={getChosenOne(props.instances)}
        instancesToUpdate={instanceIds(props.instances)}
      />
    </CardBackground>
  );
};

export default memo(Card);

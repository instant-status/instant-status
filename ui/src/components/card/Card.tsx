import React from "react";
import styled from "styled-components";
import CardHeader from "./CardHeader";
import CardFooter from "./CardFooter";
import CardInstance from "./CardInstance";
import InstanceProps from "../../utils/InstanceProps";

const CardBackground = styled.div`
  background: ${props => props.theme.color.darkOne};
  color: ${props => props.theme.color.lightOne};
  border-radius: 2px;
  box-shadow: ${props => props.theme.shadow.card};
  width: 360px;
  display: flex;
  flex-direction: column;
`;

const instanceIds = (instances?: InstanceProps[]) => {
  const ids = instances.map(instance => instance.instanceID);
  return ids[0] ? ids : undefined;
};

const getChosenOne = (instances?: InstanceProps[]) => {
  const chosenOne = instances.filter(
    instance => instance.instanceIsChosenOne === true,
  );
  return chosenOne[0] || undefined;
};

const Card = (props: { instances: InstanceProps[]; stackName: string }) => {
  return (
    <CardBackground>
      <CardHeader stackName={props.stackName} />
      {props.instances
        .sort((a: any, b: any) => (a.createdAt < b.createdAt ? -1 : 1))
        .map(instance => {
          return <CardInstance key={instance.instanceID} instance={instance} />;
        })}
      <CardFooter
        instancesToUpdate={instanceIds(props.instances)}
        chosenOne={getChosenOne(props.instances)}
      />
    </CardBackground>
  );
};

export default Card;

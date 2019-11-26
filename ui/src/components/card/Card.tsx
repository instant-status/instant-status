import React from "react";
import styled from "styled-components";
import CardHeader from "./CardHeader";
import CardFooter from "./CardFooter";
import CardInstance from "./CardInstance";

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
  const ids = instances.map(inst => inst.ec2InstanceID);
  return ids[0] ? ids : undefined;
};

const stackUrl = (instances?: InstanceProps[]) => {
  const urls = instances.map(inst => inst.appUrl);
  return urls[0] ? urls[0] : undefined;
};

const stackZone = (instances?: InstanceProps[]) => {
  const zones = instances.map(inst => inst.ec2AZ);
  return zones[0] ? zones[0].slice(0, -1) : undefined;
};

const instanceBranch = (instances?: InstanceProps[]) => {
  const branch = instances.map(inst =>
    inst.branch !== "" ? inst.branch : inst.tag,
  );
  return branch[0] ? branch[0] : undefined;
};

export interface InstanceProps {
  appUrl: string;
  ec2AZ: string;
  tag: string;
  branch: string;
  ec2InstanceID: string;
}

const Card = (props: { instances: InstanceProps[]; stackName: string }) => {
  return (
    <CardBackground>
      <CardHeader stackName={props.stackName} />
      {props.instances
        .sort((a: any, b: any) => (a.createdAt < b.createdAt ? -1 : 1))
        .map(instance => {
          return (
            <CardInstance key={instance.ec2InstanceID} instance={instance} />
          );
        })}
      <CardFooter
        instanceIds={instanceIds(props.instances)}
        stackTitle={props.stackName}
        stackUrl={stackUrl(props.instances)}
        stackZone={stackZone(props.instances)}
        instanceBranch={instanceBranch(props.instances)}
      />
    </CardBackground>
  );
};

export default Card;

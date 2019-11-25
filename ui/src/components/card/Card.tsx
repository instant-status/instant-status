import React from "react";
import styled from "styled-components";
import CardHeader from "./CardHeader";
import CardFooter from "./CardFooter";
import CardInstance from "./CardInstance";

const CardBackground = styled.div`
  background: ${({ theme }) => theme.color.darkOne};
  border-radius: 2px;
  color: ${({ theme }) => theme.color.lightOne};
  box-shadow: ${({ theme }) => theme.shadow.card};
  width: 360px;
  display: flex;
  flex-direction: column;
`;

const instanceIds = (instances?: any) => {
  const ids = instances.map((inst: any) => inst.ec2InstanceID);
  return ids[0] ? ids : undefined;
};

const stackUrl = (instances?: any) => {
  const urls = instances.map((inst: any) => inst.appUrl);
  return urls[0] ? urls[0] : undefined;
};

const stackZone = (instances?: any) => {
  const zones = instances.map((inst: any) => inst.ec2AZ);
  return zones[0] ? zones[0].slice(0, -1) : undefined;
};

const instanceBranch = (instances?: any) => {
  const branch = instances.map((inst: any) =>
    inst.branch !== "" ? inst.branch : inst.tag
  );
  return branch[0] ? branch[0] : undefined;
};

export interface InstanceProps {
  ["key"]: string;
}

const Card = (props: { instances: InstanceProps[]; stackName: string }) => {
  return (
    <CardBackground>
      <CardHeader stackName={props.stackName} />
      {props.instances.map(instance => {
        return <CardInstance instance={instance} />;
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

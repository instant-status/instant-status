import React from "react";

import { theme } from "../App";
import IconAdd from "../components/icons/IconAdd";
import IconUpdating from "../components/icons/IconUpdating";
import InstanceProps from "./InstanceProps";

export const getStateIcon = (stateCode: number, size?: string) => {
  const iconSize = size || `25px`;
  switch (stateCode) {
    case 0:
      return <IconAdd color={theme.color.purple} width={iconSize} />;
    case 1:
      return <IconAdd color={theme.color.lightOne} width={iconSize} />;
    case 2:
      return <IconUpdating color={theme.color.purple} width={iconSize} />;
    default:
  }
};

export const getStateMessage = (stateCode: number, instance: InstanceProps) => {
  switch (stateCode) {
    case 0:
      return <>Booting New Instance!</>;
    case 1:
      return (
        <>
          Spawning to:
          <br />
          {instance.instanceUpdatingToVersion}
        </>
      );
    case 2:
      if (instance.instanceVersion !== instance.instanceUpdatingToVersion) {
        return (
          <>
            Updating from:
            <br />
            <i>{instance.instanceVersion}</i>
            to:
            <i>{instance.instanceUpdatingToVersion}</i>
          </>
        );
      }
      return (
        <>
          Refreshing:
          <br />
          <i>{instance.instanceUpdatingToVersion}</i>
        </>
      );

    case 3:
      return instance.instanceHealthMessage;
    case 4:
      return instance.instanceHealthMessage;
    case 5:
      return instance.instanceHealthMessage;
    case 6:
      return instance.instanceHealthMessage;
    case 7:
      return instance.instanceHealthMessage;
    case 8:
      return instance.instanceHealthMessage;
    default:
  }
};

import React from "react";

import IconAdd from "../components/icons/IconAdd";
import IconUpdating from "../components/icons/IconUpdating";
import InstanceProps from "./InstanceProps";
import theme from "./theme";

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
          {instance.server_updating_app_to}
        </>
      );
    case 2:
      if (instance.server_app_version !== instance.server_updating_app_to) {
        return (
          <>
            Updating from:
            <br />
            <i>{instance.server_app_version}</i>
            to:
            <i>{instance.server_updating_app_to}</i>
          </>
        );
      }
      return (
        <>
          Refreshing:
          <br />
          <i>{instance.server_updating_app_to}</i>
        </>
      );

    case 3:
      return instance.server_health_message;
    case 4:
      return instance.server_health_message;
    case 5:
      return instance.server_health_message;
    case 6:
      return instance.server_health_message;
    case 7:
      return instance.server_health_message;
    case 8:
      return instance.server_health_message;
    default:
  }
};

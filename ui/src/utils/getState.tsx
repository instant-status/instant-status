import React from "react";

import IconAdd from "../components/icons/IconAdd";
import IconUpdating from "../components/icons/IconUpdating";
import { InstanceProps } from "../../../types/globalTypes";
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
      return <>Booting New Server!</>;
    case 1:
      return (
        <>
          Spawning to:
          <br />
          {instance.server_updating_app_to} (xAPI {instance.server_updating_xapi_to})
        </>
      );
    case 2:
      if (instance.server_app_version !== instance.server_updating_app_to || instance.server_xapi_version !== instance.server_updating_xapi_to) {
        return (
          <>
            Updating from:
            <br />
            <i>{instance.server_app_version} (xAPI {instance.server_xapi_version})</i>
            to:
            <i>{instance.server_updating_app_to} (xAPI {instance.server_updating_xapi_to})</i>
          </>
        );
      }
      return (
        <>
          Refreshing:
          <br />
          <i>{instance.server_updating_app_to} (xAPI {instance.server_updating_xapi_to})</i>
        </>
      );
    default:
      return instance.server_health_message;
  }
};

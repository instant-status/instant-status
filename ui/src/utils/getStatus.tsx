import React from "react";

import InstanceProps from "./InstanceProps";

import IconUpdating from "../components/icons/IconUpdating";
import IconAdd from "../components/icons/IconAdd";
import IconInfo from "../components/icons/IconInfo";
import IconWarning from "../components/icons/IconWarning";
import IconError from "../components/icons/IconError";
import IconOkay from "../components/icons/IconOkay";
import { theme } from "../App";

export const getStatusIcon = (statusCode: number, size?: string) => {
  const iconSize = size || "20px";
  switch (statusCode) {
    case 0:
      return <IconAdd color={theme.color.green} width={iconSize} />;
    case 1:
      return <IconAdd color={theme.color.lightOne} width={iconSize} />;
    case 2:
      return <IconUpdating color={theme.color.green} width={iconSize} />;
    case 3:
    case 4:
    case 5:
      return <IconOkay color={theme.color.green} width={iconSize} />;
    case 6:
      return <IconInfo color={theme.color.blue} width={iconSize} />;
    case 7:
      return <IconWarning color={theme.color.orange} width={iconSize} />;
    case 8:
      return <IconError color={theme.color.red} width={iconSize} />;
    default:
  }
};

export const getStatusMessage = (
  statusCode: number,
  instance: InstanceProps,
) => {
  switch (statusCode) {
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

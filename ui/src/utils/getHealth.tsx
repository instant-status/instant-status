import React from "react";

import IconError from "../components/icons/IconError";
import IconInfo from "../components/icons/IconInfo";
import IconOkay from "../components/icons/IconOkay";
import IconWarning from "../components/icons/IconWarning";
import InstanceProps from "./InstanceProps";
import theme from "./theme";

export const getHealthIcon = (healthCode: number, size?: string) => {
  const iconSize = size || `25px`;
  switch (healthCode) {
    case 0:
      return <IconOkay color={theme.color.green} width={iconSize} />;
    case 1:
      return <IconInfo color={theme.color.blue} width={iconSize} />;
    case 2:
      return <IconWarning color={theme.color.orange} width={iconSize} />;
    case 3:
      return <IconError color={theme.color.red} width={iconSize} />;
    default:
  }
};

export const getHealthMessage = (instance: InstanceProps) => {
  return instance.instanceHealthMessage;
};

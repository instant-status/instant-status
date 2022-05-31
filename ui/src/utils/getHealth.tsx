import React from "react";

import IconError from "../components/Icons/IconError";
import IconInfo from "../components/Icons/IconInfo";
import IconOkay from "../components/Icons/IconOkay";
import IconWarning from "../components/Icons/IconWarning";

export const getHealthIcon = (healthCode: number, size?: string) => {
  const iconSize = size || `25px`;
  switch (healthCode) {
    case 0:
      return <IconOkay color={`--color-green`} width={iconSize} />;
    case 1:
      return <IconInfo color={`--color-blue`} width={iconSize} />;
    case 2:
      return <IconWarning color={`--color-orange`} width={iconSize} />;
    case 3:
      return <IconError color={`--color-red`} width={iconSize} />;
    default:
  }
};

export const getHealthColor = (healthCode: number) => {
  switch (healthCode) {
    case 0:
      return `--color-green`;
    case 1:
      return `--color-blue`;
    case 2:
      return `--color-orange`;
    case 3:
      return `--color-red`;
    default:
      return `--color-parchment`;
  }
};

import React from "react";

import IconError from "../components/Icons/IconError";
import IconInfo from "../components/Icons/IconInfo";
import IconOkay from "../components/Icons/IconOkay";
import IconWarning from "../components/Icons/IconWarning";
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

export const getHealthColor = (healthCode: number) => {
  switch (healthCode) {
    case 0:
      return theme.color.green;
    case 1:
      return theme.color.blue;
    case 2:
      return theme.color.orange;
    case 3:
      return theme.color.red;
    default:
      return theme.color.lightOne;
  }
};

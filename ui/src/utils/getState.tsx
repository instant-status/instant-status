import React from "react";

import IconAdd from "../components/Icons/IconAdd";
import IconUpdating from "../components/Icons/IconUpdating";
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

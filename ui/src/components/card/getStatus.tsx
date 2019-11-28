import React from "react";
import IconUpdating from "../icons/IconUpdating";
import IconAdd from "../icons/IconAdd";
import InstanceProps from "../../utils/InstanceProps";
import IconInfo from "../icons/IconInfo";
import IconWarning from "../icons/IconWarning";
import IconError from "../icons/IconError";
import IconOkay from "../icons/IconOkay";

export const getStatusIcon = (statusCode: number, size?: string) => {
  const iconSize = size || "20px";

  switch (statusCode) {
    case 0:
      return <IconAdd color="#00ab4e" width={iconSize} />;
    case 1:
      return <IconAdd color="#FFF1E5" width={iconSize} />;
    case 2:
      return <IconUpdating color="#00ab4e" width={iconSize} />;
    case 3:
    case 4:
    case 5:
      return <IconOkay color="#00ab4e" width={iconSize} />;
    case 6:
      return <IconInfo color="#26a8ff" width={iconSize} />;
    case 7:
      return <IconWarning color="#fcaf17" width={iconSize} />;
    case 8:
      return <IconError color="#EE2F01" width={iconSize} />;
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
      return (
        <>
          Updating from:
          <br />
          <i>{instance.instanceVersion}</i>
          to:
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

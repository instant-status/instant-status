import React from "react";
import IconUpdating from "../icons/IconUpdating";
import IconAdd from "../icons/IconAdd";

const CardInstanceStatus = (props: {
  onClick: () => void;
  title: string;
  statusCode: number;
}) => {
  const getIcon = () => {
    const iconSize = "20px";

    switch (props.statusCode) {
      case 0:
        return <IconAdd color="#FFF1E5" width={iconSize} />;

      case 1:
        return <IconUpdating color="#00ab4e" width={iconSize} />;

      case 2:
      case 3:
      case 4:
      case 5:
        return <IconUpdating color="#00ab4e" width={iconSize} />;

      case 6:
        return <IconUpdating color="#00ab4e" width={iconSize} />;

      case 7:
        return <IconUpdating color="#00ab4e" width={iconSize} />;

      case 8:
        return <IconUpdating color="#00ab4e" width={iconSize} />;

      default:
    }
  };

  return <div onClick={props.onClick}>{getIcon()}</div>;
};

export default CardInstanceStatus;

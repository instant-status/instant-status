import React, { useContext, useEffect, useState } from "react";

import { StateContext } from "../../context/StateContext";
import Checkbox from "./Checkbox";
import UncontrolledCheckbox from "./UncontrolledCheckbox";

const VersionFilters = (props: { versions: string[] }) => {
  const { urlVersionParams, updateUrlParams } = useContext(StateContext);
  const [isCheckedArray, setIsCheckedArray] = useState(
    urlVersionParams.length > 0 ? urlVersionParams : props.versions,
  );

  useEffect(() => {
    if (urlVersionParams.length > 0) {
      setIsCheckedArray(urlVersionParams);
    } else {
      setIsCheckedArray(props.versions);
    }
  }, [props.versions, urlVersionParams.length]);

  const toggleCheckbox = (name: string) => {
    let newArray = [] as string[];
    if (isCheckedArray.includes(name)) {
      newArray = isCheckedArray.filter((version) => version !== name);
    } else {
      newArray = [...isCheckedArray, name] as [];
    }
    setIsCheckedArray(newArray);
    updateUrlParams({ key: `version`, value: newArray });
  };

  return (
    <>
      {props.versions
        .filter((version: string) => version !== undefined)
        .map((version: string, i: number) => {
          // If we have an empty version string, show an icon as the label
          const label = version === `` ? `👻` : version;
          return (
            <UncontrolledCheckbox
              key={i}
              checked={isCheckedArray.includes(version)}
              label={label}
              name={label}
              onClick={() => toggleCheckbox(version)}
            />
          );
        })}
    </>
  );
};

export default VersionFilters;

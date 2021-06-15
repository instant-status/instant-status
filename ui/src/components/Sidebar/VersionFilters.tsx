import React, { useContext, useEffect, useState } from "react";
import { globalStoreContext } from "../../store/globalStore";
import Stack from "../Layout/Stack";
import Checkbox from "../Controls/Checkbox";

const VersionFilters = (props: { versions: string[] }) => {
  const [isCheckedArray, setIsCheckedArray] = useState(props.versions);

  const store = useContext(globalStoreContext);

  useEffect(() => {
    if (props.versions.length) {
      setIsCheckedArray(props.versions);
    }
  }, [props.versions]);

  const toggleCheckbox = (name: string) => {
    let newArray = [] as string[];
    if (isCheckedArray.includes(name)) {
      newArray = isCheckedArray.filter((version) => version !== name);
    } else {
      newArray = [...isCheckedArray, name] as string[];
    }
    setIsCheckedArray(newArray);
    store.setDisplayVersions(newArray);
  };

  return (
    <Stack direction="down" spacing={4}>
      {props.versions
        .filter((version: string) => version !== undefined)
        .map((version: string, i: number) => {
          // If we have an empty version string, show an icon as the label
          const name = version === `` ? `👻` : version;
          return (
            <Checkbox
              key={i}
              name={name}
              label={name}
              onClick={() => toggleCheckbox(version)}
              checked={isCheckedArray.includes(version)}
            />
          );
        })}
    </Stack>
  );
};

export default VersionFilters;

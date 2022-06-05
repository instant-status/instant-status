import React, { useContext, useEffect, useState } from "react";

import Checkbox from "../../components/Controls/Checkbox";
import Stack from "../../components/Layout/Stack";
import { globalStoreContext } from "../../store/globalStore";

const VersionFilters = (props: { versions: string[] }) => {
  const [isCheckedArray, setIsCheckedArray] = useState(props.versions);
  const [knownVersionsCount, setKnownVersionsCount] = useState(
    props.versions.length,
  );

  const store = useContext(globalStoreContext);

  useEffect(() => {
    if (props.versions.length) {
      const storeSelectedItems = store.displayVersions ?? [];
      const hasFilter = storeSelectedItems.length !== knownVersionsCount;

      const activeItems =
        storeSelectedItems.length > 0 && hasFilter
          ? props.versions.filter((version) =>
              store.displayVersions?.includes(version),
            )
          : props.versions;

      setKnownVersionsCount(props.versions.length);
      setIsCheckedArray(activeItems);
      store.setDisplayVersions(activeItems);
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

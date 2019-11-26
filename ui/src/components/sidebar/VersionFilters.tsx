import React, { useState, useContext, useEffect } from "react";
import { StateContext } from "../../context/StateContext";

const VersionFilters = (props: { versions: any }) => {
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
    if (isCheckedArray.includes(name)) {
      const newArray = isCheckedArray.filter(version => version !== name);
      setIsCheckedArray(newArray);
      updateUrlParams({ key: "version", value: newArray });
    } else {
      const newArray = [...isCheckedArray, name];
      setIsCheckedArray(newArray);
      updateUrlParams({ key: "version", value: newArray });
    }
  };

  return props.versions
    .filter((tag: string) => tag !== undefined)
    .map((tag: string, i: number) => {
      const name = tag === "" ? "👻" : tag;
      return (
        <div key={i}>
          <input
            type="checkbox"
            checked={isCheckedArray.includes(tag)}
            id={tag}
            name={tag}
            value={tag}
            onChange={() => toggleCheckbox(tag)}
          />
          <label htmlFor={tag}>{name}</label>
        </div>
      );
    });
};

export default VersionFilters;

import React, { memo } from "react";

const IconLock = (props: { color?: string; width?: string }) => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 490 490"
      enableBackground="new 0 0 490 490"
      xmlSpace="preserve"
      style={{
        fill: props.color ? `var(${props.color})` : `inherit`,
        width: props.width || `100%`,
      }}
    >
      <path
        d="M380,201.1h-14.4v-80.5C365.6,54.1,311.5,0,245,0S124.4,54.1,124.4,120.6v80.5H110c-31.5,0-57.2,25.6-57.2,57.2v174.5
				c0,31.5,25.6,57.2,57.2,57.2h270c31.5,0,57.2-25.6,57.2-57.2V258.3C437.1,226.7,411.5,201.1,380,201.1z M158.7,120.6
				c0-47.6,38.7-86.3,86.3-86.3s86.3,38.7,86.3,86.3v80.5H158.7V120.6z M402.8,432.7c0,12.6-10.3,22.9-22.9,22.9H110
				c-12.6,0-22.9-10.3-22.9-22.9V258.3c0-12.6,10.3-22.9,22.9-22.9h270c12.6,0,22.9,10.3,22.9,22.9v174.4L402.8,432.7L402.8,432.7z"
      />
      <path
        d="M245,307.2c-9.5,0-17.1,7.7-17.1,17.2v44.3c0,9.5,7.7,17.1,17.1,17.1c9.5,0,17.2-7.7,17.2-17.1v-44.3
				C262.1,314.9,254.5,307.2,245,307.2z"
      />
    </svg>
  );
};

export default memo(IconLock);

import React from "react";

const IconInfo = (props: { color?: string; width?: string }) => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 512 512"
      enableBackground="new 0 0 512 512"
      xmlSpace="preserve"
      style={{
        fill: props.color ? `var(${props.color})` : `inherit`,
        width: props.width || `100%`,
      }}
    >
      <g>
        <path
          d="M496.7,447.5v-98.9c0-29.3-23.8-53.2-53.2-53.2H151V156.5c20.7-5.4,36-24.3,36-46.6c0-26.6-21.7-48.3-48.3-48.3
		s-48.3,21.7-48.3,48.3c0,22.4,15.3,41.2,36,46.6v138.9h-58c-29.3,0-53.2,23.8-53.2,53.2v98.9c0,29.3,23.8,53.2,53.2,53.2h375.1
		C472.9,500.6,496.7,476.8,496.7,447.5z M115,109.9c0-13.1,10.7-23.8,23.8-23.8c13.1,0,23.8,10.7,23.8,23.8s-10.7,23.8-23.8,23.8
		C125.6,133.7,115,123,115,109.9z M39.8,447.5v-98.9c0-15.8,12.9-28.7,28.7-28.7h375.1c15.8,0,28.7,12.9,28.7,28.7v98.9
		c0,15.8-12.9,28.7-28.7,28.7H68.5C52.7,476.1,39.8,463.3,39.8,447.5z"
        />
        <path
          d="M390.4,385.8H252.7c-6.8,0-12.3,5.5-12.3,12.3c0,6.8,5.5,12.3,12.3,12.3h137.8c6.8,0,12.3-5.5,12.3-12.3
		C402.7,391.3,397.2,385.8,390.4,385.8z"
        />
        <circle cx="140.2" cy="398" r="15.6" />
        <path
          d="M302.8,206.1c2.2,1.5,4.6,2.3,7.1,2.3c3.8,0,7.6-1.8,10-5.2c19.4-27.3,29.6-59.6,29.6-93.4s-10.2-66.1-29.6-93.4
		c-3.9-5.5-11.6-6.8-17.1-2.9c-5.5,3.9-6.8,11.6-2.9,17.1c16.4,23.1,25.1,50.5,25.1,79.2c0,28.7-8.7,56-25.1,79.2
		C296,194.6,297.3,202.2,302.8,206.1z"
        />
        <path
          d="M233.6,153.7c2.2,1.5,4.6,2.3,7.1,2.3c3.8,0,7.6-1.8,10-5.2c8.5-12,13-26.1,13-40.9s-4.5-28.9-13-40.9
		c-3.9-5.5-11.6-6.8-17.1-2.9c-5.5,3.9-6.8,11.6-2.9,17.1c5.5,7.8,8.5,17,8.5,26.7s-2.9,18.9-8.5,26.7
		C226.8,142.1,228.1,149.8,233.6,153.7z"
        />
      </g>
    </svg>
  );
};

export default IconInfo;

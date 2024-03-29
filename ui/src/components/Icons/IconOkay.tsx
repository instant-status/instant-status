import React from "react";

const IconOkay = (props: { color?: string; width?: string }) => {
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
        <path d="M325.3,103.1H211c-6.8,0-12.3,5.5-12.3,12.3s5.5,12.3,12.3,12.3h114.4c6.8,0,12.3-5.5,12.3-12.3S332.1,103.1,325.3,103.1z" />
        <circle cx="117.5" cy="115.4" r="13" />
        <path
          d="M337.6,228.7c0-6.8-5.5-12.3-12.3-12.3H211c-6.8,0-12.3,5.5-12.3,12.3c0,6.8,5.5,12.3,12.3,12.3h114.4
		C332.1,240.9,337.6,235.4,337.6,228.7z"
        />
        <circle cx="117.5" cy="228.7" r="13" />
        <path
          d="M11.5,342.2c0,37.9,30.8,68.7,68.7,68.7h184.6c6.8,0,12.3-5.5,12.3-12.3c0-6.8-5.5-12.3-12.3-12.3H80.2
		c-24.4,0-44.2-19.8-44.2-44.6c0-24.4,19.8-44.2,44.2-44.2h205.3c6.8,0,12.3-5.5,12.3-12.3s-5.5-12.3-12.3-12.3H80.2
		c-24.4,0-44.2-19.8-44.2-44.6c0-24.4,19.8-44.2,44.2-44.2h269.5c24.4,0,44.2,19.8,44.2,44.6c0,6.8,5.5,12,12.3,12
		s12.3-5.7,12.3-12.5c0-23.3-11.7-43.9-29.5-56.3c17.8-12.4,29.5-32.9,29.5-56.2v-1c0-37.7-30.7-68.4-68.4-68.4h-270
		c-37.7,0-68.4,30.7-68.4,68.4v1c0,23.3,11.7,43.9,29.6,56.2c-17.8,12.5-29.6,33.2-29.6,56.8c0,23.4,11.8,44,29.6,56.4
		C23.3,297.8,11.5,318.5,11.5,342.2z M79.9,159.8c-24.2,0-43.9-19.7-43.9-43.9v-1C36,90.7,55.7,71,79.9,71h270
		c24.2,0,43.9,19.7,43.9,43.9v1c0,24.2-19.7,43.9-43.9,43.9h-0.3H80.2H79.9z"
        />
        <path d="M211,329.7c-6.8,0-12.3,5.5-12.3,12.3s5.5,12.3,12.3,12.3h51.8c6.8,0,12.3-5.5,12.3-12.3s-5.5-12.3-12.3-12.3H211z" />
        <circle cx="117.5" cy="342" r="13" />
        <path
          d="M397.4,465.5c56.8,0,103.1-46.2,103.1-103.1s-46.2-103.1-103.1-103.1c-56.8,0-103.1,46.2-103.1,103.1
		S340.5,465.5,397.4,465.5z M397.4,283.9c43.3,0,78.6,35.3,78.6,78.6S440.7,441,397.4,441c-43.3,0-78.6-35.3-78.6-78.6
		S354.1,283.9,397.4,283.9z"
        />
        <path
          d="M376.2,392.4c2.3,2.3,5.4,3.6,8.7,3.6c0,0,0,0,0,0c3.2,0,6.3-1.3,8.6-3.6l42.9-42.6c4.8-4.8,4.8-12.5,0-17.3
		c-4.8-4.8-12.5-4.8-17.3,0l-34.2,34l-9.3-9.3c-4.8-4.8-12.5-4.8-17.3,0c-4.8,4.8-4.8,12.5,0,17.3L376.2,392.4z"
        />
      </g>
    </svg>
  );
};

export default IconOkay;

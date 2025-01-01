import React from "react";
import { IconProps } from ".";

const TimeIcon: React.FC<IconProps> = ({ size = 24, color, ...rest }) => {
  return (
    <div style={{height: size, width: size}}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={`${color || "none"}`}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
        {...rest}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    </div>
  );
};

export default TimeIcon;

import React from "react";
import { IconProps } from ".";

const CloseIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size, onClick, ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`size-${size} ${onClick && "cursor-pointer"}`}
        ref={ref}
        {...props}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>
    );
  }
);

export default CloseIcon;

import React from "react";

export type ButtonProps = React.HTMLProps<HTMLButtonElement> & {
  type?: "button" | "submit" | "reset";
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <button
        className={`border-none bg-[#C71949] transition duration-200 hover:bg-[#f182a2] text-white px-2 py-3 disabled:bg-[#5f2f3c] disabled:cursor-not-allowed rounded-md ${className}`}
        {...props}
        ref={ref}
      >
        {children}
      </button>
    );
  }
);

export default Button;

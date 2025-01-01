import React from "react";

export type InputProps = React.HtmlHTMLAttributes<HTMLInputElement> & {
  label?: React.ReactNode;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: React.InputHTMLAttributes<HTMLInputElement>["placeholder"];
  error?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col md:justify-center md:items-center md:flex-row  gap-y-2">
        <label className="w-[30%]">{label}</label>
        <div className="w-full flex flex-col">
          <input
            className={`w-full border border-[#dd7e99] disabled:border-gray-600 disabled:bg-gray-200 disabled:cursor-not-allowed focus:outline-none px-2 py-3  rounded-md ${className}`}
            ref={ref}
            {...props}
          />
          {error && <p className="text-red-500 mt-1 block text-xs">{error}</p>}
        </div>
      </div>
    );
  }
);

export default Input;

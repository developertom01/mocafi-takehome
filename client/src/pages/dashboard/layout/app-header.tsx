import React from "react";
import logo from "../../../lib/images/stepful_logo.png";

const AppHeader = () => {
  return (
    <div>
      <header className="w-full h-40 bg-white flex items-center justify-between px-20">
        <div>
          <img src={logo} alt="Logo" className="w-20 h-8" />
        </div>
        <div className="flex items-center gap-x-5">
          <p className="text-sm text-gray-600">
            Fintech for an equitable society
          </p>
        </div>
      </header>
    </div>
  );
};

export default AppHeader;

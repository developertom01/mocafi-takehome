import React from "react";
import LoginForm from "./form";
import logo from "../../lib/images/logo.jpg";

const AccountManagement = () => {
  return (
    <main className="w-screen h-screen flex flex-col justify-center items-center gap-y-5">
      <div className="text-center flex flex-col gap-y-4">
        <div>
          <img src={logo} alt="Logo" className="w-40 mx-auto" />
          <h2 className="text-2xl text-gray-600 font-bold">
            Account information Management
          </h2>
        </div>
        <p className="text-center">
          Enter card number and pin to get account information{" "}
        </p>
      </div>
      <LoginForm />
    </main>
  );
};

export default AccountManagement;

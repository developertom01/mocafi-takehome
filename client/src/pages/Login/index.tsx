import React from "react";
import LoginForm from "./form";
import logo from "../../lib/images/stepful_logo.png";

const Login = () => {
  return (
    <main className="w-screen h-screen flex flex-col justify-center items-center gap-y-5">
      <div className="text-center">
        <img src={logo} alt="Logo" className="w-28 mx-auto" />
        <p className="text-center">Enter card number and pin to get account information</p>
      </div>
      <LoginForm />
    </main>
  );
};

export default Login;

// SignUpLoginFormContainer.jsx
import React, { useState } from "react";
import { Signup } from "../pages/Signup";
import { Login } from "../pages/Login";

export const SignUpLoginFormContainer = ({ setBackgroundColor }) => {
  const [activeTab, setActiveTab] = useState("login");

  const handleTabClick = (tab, color) => {
    setActiveTab(tab);
    setBackgroundColor(color);
  };

  return (
    <div className="formContainer">
      <div className={`login-btn splits ${activeTab === "login" ? "active" : ""}`}>
        <p>Already a user?</p>
        <button onClick={() => handleTabClick("login", "#5B5EA6")}>
          Login
        </button>
      </div>
      <div className={`rgstr-btn splits ${activeTab === "register" ? "active" : ""}`}>
        <p>Don't have an account?</p>
        <button onClick={() => handleTabClick("register", "#9B2335")}>
          Register
        </button>
      </div>
      <div className={`wrapper ${activeTab === "register" ? "move" : ""}`}>
        <Login />
        <Signup />
      </div>
    </div>
  );
};
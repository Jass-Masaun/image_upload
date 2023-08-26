import React from "react";

import { ACCESS_TOKEN_KEY } from "../utils/constants";

const NavBar = ({ buttons }) => {
  const handleLogout = () => {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.location.href = "/login";
  };

  const handleDashboard = async () => {
    window.location.href = "/dashboard";
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <button
          className="text-white text-xl font-bold"
          onClick={handleDashboard}
        >
          Dashboard
        </button>
        <div className="flex items-center space-x-4">
          {buttons.map((button) => (
            <button className="text-white" onClick={button.handleClick}>
              {button.name}
            </button>
          ))}
          <button className="text-white" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

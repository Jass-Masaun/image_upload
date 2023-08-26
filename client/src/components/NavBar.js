import React from "react";

import { Link } from "react-router-dom";

import { ACCESS_TOKEN_KEY } from "../utils/constants";

const NavBar = ({ buttons }) => {
  const handleLogout = () => {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-white text-xl font-bold">
          Dashboard
        </Link>
        <div className="flex items-center space-x-4">
          {buttons.map((button, index) => (
            <Link key={index} to={button.path} className="text-white">
              {button.name}
            </Link>
          ))}
          <Link to="/login" className="text-white" onClick={handleLogout}>
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

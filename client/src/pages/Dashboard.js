import React from "react";
import { ACCESS_TOKEN_KEY } from "../utils/constants";

const Dashboard = () => {
  const handleClick = () => {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.location.href = "/";
  };
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-700">Dashboard Page</h1>
      <button onClick={handleClick}>Logout</button>
    </div>
  );
};

export default Dashboard;

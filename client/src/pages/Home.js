import React, { useEffect } from "react";

import { Link } from "react-router-dom";
import { ACCESS_TOKEN_KEY } from "../utils/constants";

const Home = () => {
  useEffect(() => {
    const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);

    if (token) {
      window.location.href = "/dashboard";
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome to Our Website</h1>
      <p className="text-gray-600 mb-8">Explore and discover amazing things!</p>
      <div className="flex space-x-4">
        <Link
          to="/login"
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
        >
          Signup
        </Link>
      </div>
    </div>
  );
};

export default Home;

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
    <div>
      <h1 className="text-3xl font-bold text-gray-700">Home Page</h1>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
    </div>
  );
};

export default Home;

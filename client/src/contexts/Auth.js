// AuthContext.js
import { createContext, useContext, useState } from "react";
import { ACCESS_TOKEN_KEY } from "../utils/constants";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  const [authenticated, setAuthenticated] = useState(!!token);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

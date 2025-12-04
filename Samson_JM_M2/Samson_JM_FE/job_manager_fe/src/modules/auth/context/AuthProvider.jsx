import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { saveToStorage, loadFromStorage } from "../../../infrastructure/storage/localStorageUtil";

export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadFromStorage("auth") || null);

  const login = (user) => {
    setAuth(user);
    saveToStorage("auth", user);
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

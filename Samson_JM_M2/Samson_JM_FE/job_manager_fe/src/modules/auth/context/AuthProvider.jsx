import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { authService } from "../service/authService";
import { localStorageUtil } from "../../../infrastructure/storage/localStorageUtil";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorageUtil.getToken();
    const role = localStorageUtil.getRole();
    const companyName = localStorageUtil.getCompanyName();
    return token ? { accessToken: token, role, companyName } : null;
  });

  const login = async (loginRequest) => {
    const authUser = await authService.login(loginRequest);

    localStorageUtil.setToken(authUser.accessToken);
    localStorageUtil.setRole(authUser.role);
    localStorageUtil.setCompanyName(authUser.companyName);

    setUser(authUser);
    return authUser;
  };

  const signup = async (formData) => {
    const signupRequest = {
      companyName: formData.companyName,
      email: formData.email,
      password: formData.password,
      phoneNumber: `${formData.phoneCode}${formData.phoneNumber}`,
      country: formData.country,
    };

    await authService.signup(signupRequest);
  };

  const logout = () => {
    localStorageUtil.removeToken();
    localStorageUtil.removeRole();
    localStorageUtil.removeCompanyName();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

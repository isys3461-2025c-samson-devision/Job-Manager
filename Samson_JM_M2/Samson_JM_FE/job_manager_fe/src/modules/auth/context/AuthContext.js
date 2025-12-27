import { createContext } from "react";

export const AuthContext = createContext({
  user: null, 
  /*
    user = {
      id: string,
      role: string,
      companyName: string,
      token: string
    }
  */
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

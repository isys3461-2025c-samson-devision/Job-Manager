// import { httpClient } from "../../../infrastructure/http/httpClient";
// import { API } from "../../../infrastructure/http/endpoints";
import mockUsers from "../data/mockUsers.json";
import AuthUser from "../models/AuthUser";

export const authService = {
  async login({ email, password }) {
    // FIND USER IN JSON FILE
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    // If no match → return error
    if (!user) {
      throw new Error("Invalid email or password.");
    }

    // Return AuthUser formatted model
    return new AuthUser({
      ...user,
      token: "mock-token"
    });
  }
};

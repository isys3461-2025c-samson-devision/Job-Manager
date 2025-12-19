import { httpClient } from "../../../infrastructure/http/httpClient";
import { AUTH_ENDPOINTS } from "../../../infrastructure/http/endpoints";
import AuthUser from "../models/AuthUser";

export const authService = {
  async login(loginRequest) {
    const res = await httpClient.post(
      AUTH_ENDPOINTS.AUTH.LOGIN,
      loginRequest
    );
    return new AuthUser(res.accessToken, res.role);
  },

  async signup(signupRequest) {
    return httpClient.post(
      AUTH_ENDPOINTS.AUTH.REGISTER,
      signupRequest
    );
  }
};

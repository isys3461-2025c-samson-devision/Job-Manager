import { httpClient } from "../../../infrastructure/http/httpClient";
import axios from "axios";
import { AUTH_ENDPOINTS } from "../../../infrastructure/http/endpoints";
import AuthUser from "../models/AuthUser";

const BASE_URL = "http://localhost:8080/api/auth";

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
  },

  // ✅ NEW: Complete OAuth registration (NO JWT required)
  async completeOAuthProfile(completeRequest) {
    const res = await axios.post(
      `${BASE_URL}/oauth/complete-profile`,
      completeRequest,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data; // { token }
  }
};

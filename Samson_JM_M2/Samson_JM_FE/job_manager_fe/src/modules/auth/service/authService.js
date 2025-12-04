import { httpClient } from "../../../infrastructure/http/httpClient";
import { API } from "../../../infrastructure/http/endpoints";
import AuthUser from "../models/AuthUser";

export const authService = {
  async login(payload) {
    const res = await httpClient.post(API.AUTH.LOGIN, payload);
    return new AuthUser(res);
  }
};

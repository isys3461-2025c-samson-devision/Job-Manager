import { httpClient } from "../../../infrastructure/http/httpClient";

export const getMyCompany = () => {
  return httpClient.get("/api/company/me");
};

export const updateMyCompany = (payload) => {
  return httpClient.patch("/api/company/me", payload);
};

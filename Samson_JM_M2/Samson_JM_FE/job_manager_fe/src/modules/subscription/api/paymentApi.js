import { httpClient } from "../../../infrastructure/http/httpClient.js";

export const getMyPayments = async () => {
  return httpClient.get("/api/payments/my");
};

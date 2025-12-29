import { httpClient } from "../../../infrastructure/http/httpClient.js";

export const getMySubscription = async () => {
  return httpClient.get("/api/subscriptions/me");
};

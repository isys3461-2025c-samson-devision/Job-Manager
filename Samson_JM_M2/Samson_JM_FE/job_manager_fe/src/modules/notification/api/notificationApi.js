import { httpClient } from "../../../infrastructure/http/httpClient";

export const getMyNotifications = () =>
  httpClient.get("/api/notifications/company/my");

export const getUnreadCount = () =>
  httpClient.get("/api/notifications/company/my/unread-count");

export const markNotificationRead = (id) =>
  httpClient.patch(`/api/notifications/company/${id}/read`);

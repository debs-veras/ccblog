import type { SearchNotificationItemResponse } from "../types/notification";
import {
  getRequest,
  patchRequest,
  deleteRequest,
  type ApiResponse,
} from "../utils/axiosRequest";

export async function getNotifications(): Promise< ApiResponse<SearchNotificationItemResponse>> {
  return getRequest("/notifications");
}

export async function markNotificationAsRead(id: string) {
  return patchRequest(`/notifications/${id}/read`);
}

export async function markAllNotificationsAsRead() {
  return patchRequest(`/notifications/read-all`);
}

export async function deleteNotification(id: string) {
  return deleteRequest(`/notifications/${id}`);
}

import type { LoginPayload, LoginData, ChangePasswordPayload } from "../types/auth";
import { getRequest, patchRequest, postRequest, type ApiResponse } from "../utils/axiosRequest";

export async function login(payload: LoginPayload): Promise<ApiResponse<LoginData>> {
  return postRequest<LoginData>("/auth/login", payload);
}

export async function validateToken(): Promise<ApiResponse<{ valid: boolean }>> {
  return getRequest("/auth/validate");
}

export async function changePassword( payload: ChangePasswordPayload): Promise<ApiResponse<null>> {
  return patchRequest("/auth/change-password", payload);
}
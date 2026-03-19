import { deleteRequest, getRequest, postRequest, putRequest, type ApiResponse } from "../utils/axiosRequest";
import type { CreateUserInput, SearchUserParams, SearchUserResponse, UpdateUserInput, User } from "../types/user";

export async function createUser(data: CreateUserInput): Promise<ApiResponse<User>> {
  return postRequest("/user", data);
}

export async function getAllUsers( params: SearchUserParams = {} ): Promise<ApiResponse<SearchUserResponse>> {
  const searchParams = new URLSearchParams();
  if (params.name) searchParams.set("name", params.name);
  if (params.email) searchParams.set("email", params.email);
  if (params.role) searchParams.set("role", params.role);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));

  const queryString = searchParams.toString();
  const url = queryString ? `/user?${queryString}` : "/user";
  return getRequest<SearchUserResponse>(url);
}

export async function getUserById(id: string): Promise<ApiResponse<User>> {
  return getRequest(`/user/${id}`);
}

export async function updateUser(
  id: string,
  data: UpdateUserInput,
): Promise<ApiResponse<User>> {
  return putRequest(`/user/${id}`, data);
}


export async function deleteUser(id: string): Promise<ApiResponse<void>> {
  return deleteRequest<void>(`/user/${id}`);
}


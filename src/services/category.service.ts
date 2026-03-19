import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "../types/category";
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  type ApiResponse,
} from "../utils/axiosRequest";

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  return getRequest<Category[]>("/category");
}

export async function getCategory(id: string): Promise<ApiResponse<Category>> {
  return getRequest<Category>(`/category/${id}`);
}

export async function createCategory(  data: CreateCategoryPayload): Promise<ApiResponse<Category>> {
  return postRequest<Category>("/category", data);
}

export async function updateCategory(
  id: string,
  data: UpdateCategoryPayload,
): Promise<ApiResponse<Category>> {
  return putRequest<Category>(`/category/${id}`, data);
}

export async function deleteCategory(id: string): Promise<ApiResponse<void>> {
  return deleteRequest<void>(`/category/${id}`);
}

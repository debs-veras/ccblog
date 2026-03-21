import type {
  CreateDisciplineInput,
  Discipline,
  SearchDisciplineParams,
  SearchDisciplineResponse,
  UpdateDisciplineInput,
} from "../types/discipline";

import {
  getRequest,
  postRequest,
  deleteRequest,
  putRequest,
  type ApiResponse,
} from "../utils/axiosRequest";

export async function createDiscipline(
  data: CreateDisciplineInput,
): Promise<ApiResponse<Discipline>> {
  return postRequest("/discipline", data);
}

export async function updateDiscipline(
  id: string,
  data: UpdateDisciplineInput,
): Promise<ApiResponse<Discipline>> {
  return putRequest(`/discipline/${id}`, data);
}

export async function getDisciplineById(
  id: string,
): Promise<ApiResponse<Discipline>> {
  return getRequest(`/discipline/${id}`);
}

export async function listDisciplines(
  params?: SearchDisciplineParams,
): Promise<ApiResponse<SearchDisciplineResponse>> {
  const searchParams = new URLSearchParams();
  if (params?.name) searchParams.set("name", params.name);
  if (params?.code) searchParams.set("code", params.code);
  if (params?.period) searchParams.set("period", String(params.period));
  if (params?.page !== undefined) searchParams.set("page", String(params.page));
  if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));

  // const queryString = searchParams.toString();
  // const url = queryString ? `/discipline?${queryString}` : `/discipline`;
  return getRequest("/discipline");
}

export async function deleteDiscipline(id: string): Promise<ApiResponse<null>> {
  return deleteRequest(`/discipline/${id}`);
}

import type { DisciplinePayload, DisciplineData } from "../types/discipline";

import {
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
  type ApiResponse,
} from "../utils/axiosRequest";

export async function createDiscipline(payload: DisciplinePayload): Promise<ApiResponse<DisciplineData>> {
  return postRequest<DisciplineData>("/discipline", payload);
}

export async function updateDiscipline(
  id: string,
  payload: DisciplinePayload,
): Promise<ApiResponse<DisciplineData>> {
  return patchRequest<DisciplineData>(`/discipline/${id}`, payload);
}

export async function getDisciplineById(id: string): Promise<ApiResponse<DisciplineData>> {
  return getRequest(`/discipline/${id}`);
}

export async function listDisciplines(): Promise<ApiResponse<DisciplineData[]>> {
  return getRequest("/discipline");
}

export async function deleteDiscipline(id: string): Promise<ApiResponse<null>> {
  return deleteRequest(`/discipline/${id}`);
}

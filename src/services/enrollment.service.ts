import { getRequest, postRequest, deleteRequest, type ApiResponse, patchRequest } from "../utils/axiosRequest";
import type { Enrollment, CreateEnrollmentInput, EnrollmentStatus } from "../types/enrollment";

export async function enrollStudent(data: CreateEnrollmentInput): Promise<ApiResponse<Enrollment>> {
  return postRequest("/enrollment", data);
}

export async function listStudentEnrollments(studentId: string): Promise<ApiResponse<Enrollment[]>> {
  return getRequest(`/enrollment/student/${studentId}`);
}

export async function updateEnrollmentStatus(id: string, status: EnrollmentStatus): Promise<ApiResponse<Enrollment>> {
  return patchRequest(`/enrollment/${id}/status`, { status });
}

export async function dropEnrollment(id: string): Promise<ApiResponse<null>> {
  return deleteRequest(`/enrollment/${id}`);
}

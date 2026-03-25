import { getRequest, type ApiResponse } from "../utils/axiosRequest";
import type { StudentDashboard, TeacherDashboard } from "../types/dashboard";

export async function getDashboardTeacher(): Promise<ApiResponse<TeacherDashboard>> {
  return getRequest("/dashboard/teacher");
}

export async function getDashboardStudent(): Promise<ApiResponse<StudentDashboard>> {
  return getRequest(`/dashboard/student`);
}


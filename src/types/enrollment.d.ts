import type { Discipline } from "./discipline";
import type { User } from "./user";

export type EnrollmentStatus = "ENROLLED" | "PASSED";

export type Enrollment = {
  id: string;
  studentId: string;
  student: User;
  disciplineId: string;
  discipline: Discipline;
  period: number;
  status: EnrollmentStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateEnrollmentInput = {
  studentId: string;
  disciplineId: string;
  period: number;
};

export type UpdateEnrollmentStatusInput = {
  status: EnrollmentStatus;
};

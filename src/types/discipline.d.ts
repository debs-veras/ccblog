import type { User } from "./user";

export type Discipline = {
  id: string;
  name: string;
  code: string;
  description?: string;
  materialUrl?: string;
  period: number;
  workload: number;
  teacherId: string;
  teacher: User;
  schedules: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
  prerequisites?: DisciplinePrerequisite[];
  createdAt: string;
  updatedAt: string;
};

export type DisciplinePrerequisite = {
  id: string;
  disciplineId: string;
  prerequisiteId: string;
  prerequisite: {
    id: string;
    name: string;
    code: string;
  };
};

export type CreateDisciplineInput = Omit<
  Discipline,
  "id" | "createdAt" | "updatedAt" | "prerequisites" | "teacher"
> & {
  prerequisites?: { prerequisiteId: string }[];
};
export type UpdateDisciplineInput = Partial<CreateDisciplineInput>;

export type SearchDisciplineParams = {
  name?: string;
  code?: string;
  teacherId?: string;
  period?: number;
  page?: number;
  limit?: number;
};

export type SearchDisciplineResponse = {
  data: Discipline[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

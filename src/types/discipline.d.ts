export type DisciplinePayload = {
  name: string;
  code: string;
  description?: string;
  materialUrl?: string;
  period: number;
  workload: number; 
  teacherId: string;
  schedules: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
  prerequisiteIds?: string[];
};

export type DisciplineData = {
  id: string;
  name: string;
  code: string;
  description?: string;
  materialUrl?: string;
  period: number; 
  workload: string; 
  teacherId: string;
  schedules: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
  prerequisites?: { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
};

export type DisciplineFilter = {
  name?: string;
  code?: string;
  teacherId?: string;
  period?: number; 
  page?: number;
  limit?: number;
};

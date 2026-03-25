import type { Discipline } from "./discipline";
import type { Post } from "./post";

export type StudentDashboard = {
  enrolledDisciplines: Discipline[];
  completedDisciplines: Discipline[];
  upcomingClasses: UpcomingClass[];
  progress: number;
  totalCourseDisciplines: number;
  totalCompleted: number;
  totalRemaining: number;
};

export type UpcomingClass = {
  discipline: string;
  teacher: string;
  startTime: string;
  endTime: string;
};

export type TeacherDashboard = {
  totalDisciplines: number;
  totalStudents: number;
  totalPosts: number;
  totalViews: number;
  topPosts: Post[];
};

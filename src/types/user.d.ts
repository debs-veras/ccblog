export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  createdAt: string;
  updatedAt: string;
}

export type CreateUserInput = Omit<User, "id" | "createdAt" | "updatedAt"> & {
  password?: string;
};

export type UpdateUserInput = Partial<CreateUserInput>;

export type SearchUserParams = {
  name?: string;
  email?: string;
  role?: "ADMIN" | "TEACHER" | "STUDENT";
  page?: number;
  limit?: number;
};

export type SearchUserResponse = {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

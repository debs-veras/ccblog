export interface Category {
  createdAt: string;
  description?: string;
  id: string;
  name: string;
  slug: string;
  updatedAt: string;
  _count?: {
    posts: number;
  };
}

export type CreateCategoryPayload = Omit<Category, "id" | "_count" | "createdAt" | "updatedAt">;
export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

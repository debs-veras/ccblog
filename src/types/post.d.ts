import type { Category } from "./category";
import type { User } from "./user";

export interface Post {
  author?: Omit<User, Exclude<keyof User, "id" | "name" | "email">>;
  authorId: string;
  category?: Category;
  categoryId?: string;
  description?: string;
  content: string;
  id: string;
  published: boolean;
  slug: string;
  title: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export type CreatePostInput = Omit<
  Post,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "author"
  | "category"
  | "views"
  | "published"
> & {
  published?: boolean;
};

export type UpdatePostInput = Partial<CreatePostInput>;

export type SearchPostParams = {
  title?: string;
  categoryId?: string;
  author?: string;
  startDate?: string;
  endDate?: string;
  published?: boolean;
  page?: number;
  limit?: number;
};

export type SearchPostsResponse = {
  data: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type Activity = {
  id: string;
  description: string;
  createdAt: string;
  user: { name: string };
};

export type DashboardResponse = {
  stats: {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalViews: number;
  };
  recentPosts: Post[];
  popularPosts: Post[];
};

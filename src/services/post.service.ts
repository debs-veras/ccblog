import {
  postRequest,
  putRequest,
  getRequest,
  deleteRequest,
  patchRequest,
  type ApiResponse,
} from "../utils/axiosRequest";
import type {
  Post,
  CreatePostInput,
  UpdatePostInput,
  SearchPostParams,
  SearchPostsResponse,
  DashboardResponse,
} from "../types/post";

export type { SearchPostParams, SearchPostsResponse };

export async function createPost( data: CreatePostInput ): Promise<ApiResponse<Post>> {
  return postRequest("/post", data);
}

export async function getPostById(id: string): Promise<ApiResponse<Post>> {
  return getRequest(`/post/by-id/${id}`);
}

export async function getPostBySlug(slug: string): Promise<ApiResponse<Post>> {
  return getRequest(`/post/slug/${slug}`);
}

export async function updatePost(
  id: string,
  data: UpdatePostInput,
): Promise<ApiResponse<Post>> {
  return putRequest(`/post/${id}`, data);
}

export async function getPostsByAuthor(
  authorId: string,
  params: SearchPostParams = {},
): Promise<ApiResponse<SearchPostsResponse>> {
  const searchParams = new URLSearchParams();

  if (params.title) searchParams.set("title", params.title);
  if (params.categoryId) searchParams.set("categoryId", params.categoryId);
  if (params.author) searchParams.set("author", params.author);
  if (params.startDate) searchParams.set("startDate", params.startDate);
  if (params.endDate) searchParams.set("endDate", params.endDate);
  if (params.published !== undefined)
    searchParams.set("published", String(params.published));
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined)
    searchParams.set("limit", String(params.limit));

  const queryString = searchParams.toString();
  const url = queryString
    ? `/post/author/${authorId}?${queryString}`
    : `/post/author/${authorId}`;

  return getRequest<SearchPostsResponse>(url);
}

export async function deletePost(id: string): Promise<ApiResponse<void>> {
  return deleteRequest<void>(`/post/${id}`);
}

export async function dashboardPosts(): Promise<ApiResponse<DashboardResponse>> {
  return getRequest<DashboardResponse>(`/post/dashboard`);
}

export async function dashboardPostsAuthor(): Promise<ApiResponse<DashboardResponse>> {
  return getRequest<DashboardResponse>(`/post/author-dashboard`);
}

export async function activitiesPosts(): Promise<ApiResponse<void>> {
  return getRequest<void>(`/post/activities`);
}

export async function publishPost(id: string): Promise<ApiResponse<Post>> {
  return patchRequest<Post>(`/post/${id}/publish`);
}

export async function getAllPosts( params: SearchPostParams = {} ): Promise<ApiResponse<SearchPostsResponse>> {
  const searchParams = new URLSearchParams();

  if (params.title) searchParams.set("title", params.title);
  if (params.categoryId) searchParams.set("categoryId", params.categoryId);
  if (params.author) searchParams.set("author", params.author);
  if (params.startDate) searchParams.set("startDate", params.startDate);
  if (params.endDate) searchParams.set("endDate", params.endDate);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined)
    searchParams.set("limit", String(params.limit));
  if (params.published !== undefined)
    searchParams.set("published", String(params.published));

  const queryString = searchParams.toString();
  const url = queryString ? `/post?${queryString}` : "/post";
  return getRequest<SearchPostsResponse>(url);
}

export async function searchPosts( params: SearchPostParams = {} ): Promise<ApiResponse<SearchPostsResponse>> {
  const searchParams = new URLSearchParams();
  if (params.title) searchParams.set("title", params.title);
  if (params.categoryId) searchParams.set("categoryId", params.categoryId);
  if (params.author) searchParams.set("author", params.author);
  if (params.startDate) searchParams.set("startDate", params.startDate);
  if (params.endDate) searchParams.set("endDate", params.endDate);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined)
    searchParams.set("limit", String(params.limit));
  if (params.published !== undefined)
    searchParams.set("published", String(params.published));
  const queryString = searchParams.toString();
  const url = queryString
    ? `/post/published?${queryString}`
    : "/post/published";
  return getRequest<SearchPostsResponse>(url);
}

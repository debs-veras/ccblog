import { postRequest, type ApiResponse } from "../utils/axiosRequest";

export interface AcademicChatResponse {
  answer: string;
}

export interface ChatHistoryItem {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface MetadataResponse {
  description: string;
  tags: string[];
}

export async function askAcademicQuestion(
  question: string,
  history: ChatHistoryItem[] = [],
): Promise<ApiResponse<AcademicChatResponse>> {
  return postRequest<AcademicChatResponse>("/ai/academic-chat", {
    question,
    history,
  });
}

export async function suggestMetadata(title: string, content: string): Promise<ApiResponse<MetadataResponse>> {
  return postRequest<MetadataResponse>("/ai/suggest-metadata", { title, content });
}

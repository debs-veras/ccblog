import getAxios from "../configAxios";
import type { ApiResponse } from "../utils/axiosRequest";

type UploadResponse = {
  url: string;
};

export async function uploadImage(file: File): Promise<ApiResponse<UploadResponse>> {
  const axios = getAxios();
  const formData = new FormData();
  formData.append("image", file);

  try {
    const { data } = await axios.post<ApiResponse<UploadResponse>>(
      "/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return { ...data, success: true, message: data.message, type: "success" };
  } catch (err: unknown) {
    let message = "Erro ao enviar imagem";
    let error: unknown = err;

    if (typeof err === "object" && err !== null) {
      const maybeAxios = err as {
        response?: { data?: { message?: string; error?: unknown } };
      };
      message = maybeAxios?.response?.data?.message ?? message;
      error = maybeAxios?.response?.data?.error ?? err;
    }

    return { success: false, message, error, type: "error" };
  }
}

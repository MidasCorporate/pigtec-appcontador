import { api } from "@/services/api";

interface FormData {
  id: string;
  name: string;
  description: string;
  identification: string;
}

export async function listPermission() {
  try {
    const response = await api.get<FormData[]>('/permissions');
    return response.data;
  } catch (error) {
    console.error("Error list listPermission:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}
import { api } from "@/services/api";

interface FormData {
  id: string;
  name: string;
  description: string;
  identification: string;
}

export async function listRole() {
  try {
    const response = await api.get<FormData[]>('/roles');
    return response.data;
  } catch (error) {
    console.error("Error list role:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}
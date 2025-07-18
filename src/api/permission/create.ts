import { api } from "@/services/api";

interface FormData {
  name: string;
  description: string;
  identification: string;
}

export async function createPermission(data: FormData) {
  try {
    await api.post('/permissions', data);
  } catch (error) {
    console.error("Error creating role:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}
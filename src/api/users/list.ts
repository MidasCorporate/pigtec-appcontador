import { api } from "@/services/api";

interface Users {
  id: string;
  name: string;
  cpf: string | null;
  email: string;
  internal_code: string;
  config_id: string | null;
  created_at: string;
  updated_at: string;
}


export async function listUsers() {
  try {
    const response = await api.get<Users[]>('/users');

    return response.data
  } catch (error) {
    console.error("Error creating config:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}
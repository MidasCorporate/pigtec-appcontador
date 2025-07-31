import { api } from "@/services/api";

interface Users {
  name: string;
  cpf?: string;
  email: string;
  internal_code: string;
  config_id: string;
}


export async function createUsers(data: Users) {
  try {
    const response = await api.post<Users>('/users', data);

    return response.data
  } catch (error) {
    console.error("Error creating user:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}
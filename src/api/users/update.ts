import { api } from "@/services/api";

interface Users {
  id: string;
  name: string;
  cpf?: string;
  email: string;
  internal_code: string;
  config_id: string;
}


export async function updateUsers(data: Users) {
  try {
    const response = await api.put<Users>(`/users?id=${data.id}`, data);

    return response.data
  } catch (error) {
    console.error("Error updating user:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}
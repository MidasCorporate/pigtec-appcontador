import { api } from "@/services/api";

interface FormData {
  role_id: string;
  users_ids: string[];
}

export async function createLinkRoleInUsers(data: FormData) {
  try {
    await api.post('/users-of-roles/create-all-users', data);
  } catch (error) {
    console.error("Error creating link role in user", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}
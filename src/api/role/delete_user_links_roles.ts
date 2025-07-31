import { api } from "@/services/api";


export async function deleteLinkInUser(user_id: string, role_id: string) {
  try {
    await api.post(`/users-of-roles?user_id=${user_id}&role_id=${role_id}`);
  } catch (error) {
    console.error("Error deleting link in user:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}
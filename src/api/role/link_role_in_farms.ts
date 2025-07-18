import { api } from "@/services/api";

interface FormData {
  role_id: string;
  farms_ids: string[];
}

export async function createLinkRoleInFarms(data: FormData) {
  try {
    await api.post('/farms-of-roles/create-all-farms', data);
  } catch (error) {
    console.error("Error creating link role in farm", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}
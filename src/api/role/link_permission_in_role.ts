import { api } from "@/services/api";

interface FormData {
  role_id: string;
  permissions_ids: string[];
}

export async function createLinkPermissionInRole(data: FormData) {
  try {
    await api.post('/roles-of-permissions/create-all-permissions', data);
  } catch (error) {
    console.error("Error creating link permission in role:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}
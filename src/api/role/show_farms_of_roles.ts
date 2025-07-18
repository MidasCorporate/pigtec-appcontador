  import { api } from "@/services/api";
import { UserFarmRole } from "@/types/user-farm-links";

  interface Props {
    role_id: string
  }


  export async function showFarmsOfRoles({ role_id }: Props):  Promise<UserFarmRole[]> {
    try {
      const response = await api.get(`/farms-of-roles/show?role_id=${role_id}`);
      return response.data
    } catch (error) {
      console.error("Error show farms of role:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(String(error));
      }
    }
  }
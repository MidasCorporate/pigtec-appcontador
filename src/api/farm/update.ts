import { api } from "@/services/api";

interface UpdateFarmData {
  name: string
  nickname: string
  config_id: string
  producer_id: string
}
export async function updateFarm(id: string, data: UpdateFarmData) {
  try {
    await api.put(`/farms?id=${id}`, data);
  } catch (error) {
    console.error("Error creating farm:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}
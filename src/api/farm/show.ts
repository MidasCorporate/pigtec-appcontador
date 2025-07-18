import { api } from "@/services/api";

interface Farms {
  id: string;
  name: string;
  nickname: string;
  config_id: string;
  producer_id: string;
}


export async function showFarms() {
  try {
    const response = await api.get<Farms[]>('/farms/show');
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
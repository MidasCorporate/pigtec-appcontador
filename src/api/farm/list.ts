import { api } from "@/services/api";

interface Farms {
  id: string;
  name: string;
  nickname: string;
  status: 'active' | 'maintenance';
  config_id: string;
  producer_id: string;
  producer?: {
    id: string;
    email: string;
    name: string;
  }
  config?: {
    id: string;
    name: string;
    description: string;
  }
}


export async function listFarms() {
  try {
    const response = await api.get<Farms[]>('/farms');
    
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
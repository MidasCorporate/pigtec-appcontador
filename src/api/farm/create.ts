import { api } from "@/services/api";

interface FormData {
  name: string;
  nickname: string;
  config_id: string;
  producer_id: string;
}

export async function createFarm(data: FormData) {
  try {
    await api.post('farms', data);
  } catch (error) {
    console.error("Error creating farm:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}
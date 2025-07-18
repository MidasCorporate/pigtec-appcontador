import { api } from "@/services/api";

interface Producers {
  id: string;
  name: string;
  email: string;
  interl_code: string;
}


export async function listProducers() {
  try {
    const response = await api.get<Producers[]>('producers');
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
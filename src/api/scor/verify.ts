import { api } from "@/services/api";

export async function handleVerify() {
  try {
    await api.get('/scores/verifyRecord');
  } catch (error) {
    console.error("Error list role:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}
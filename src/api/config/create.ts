import { api } from "@/services/api";

export interface FormDataEquipment {
  rout: string;
  cfg: string;
  name: string;
  names: string;
  weights: string;
  rout_view_video: string;
  mount_video: string;
  range_for_marking: string;
  marking_automatic: string;
  is_selected_view_video: string;
  name_network_contactor: string;
  pass_word_contactor_network: string;
  description: string;
  threshold: string;
  access_remote_id: string;
  access_remote_password: string;
  stream: boolean;
}

export async function createConfig(data: FormDataEquipment) {
  try {
    await api.post('configs', data);
  } catch (error) {
    console.error("Error creating configs:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}
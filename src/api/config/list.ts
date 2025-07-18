import { api } from "@/services/api";

export interface ConfigForm {
  id: string;
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
  ssid_network: string;
  password_network: string;
  description: string;
  threshold: string;
  access_remote_id: string;
  access_remote_password: string;
  stream: boolean;
  view_camera: boolean;
  is_selected_auto_cnt: boolean;
}


export async function listConfig() {
  try {
    const response = await api.get<ConfigForm[]>('configs');
    const configs = response.data.map(config => ({
      ...config,
      type: "Contador Inteligente",
      status: "online" as const,
      connectedFarms: 1,
      lastSync: "5 minutos atrás",
    }));

    return configs

  } catch (error) {
    console.error("Error creating config:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}
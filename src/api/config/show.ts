import { api } from "@/services/api";

interface Config {
  id: string;

  type?: string;
  status?: 'online' | 'offline';
  connectedFarms?: number;
  lastSync?: string;

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


  created_at: string
  updated_at: string
}

interface FormData {
  config_id: string;
}

export async function showConfig({ config_id }: FormData) {
  try {
    const result = await api.get<Config>(`/configs/show?id=${config_id}`,
    );
    console.log("Fetched config data:", result.data);
    return result.data
  } catch (error) {
    console.error("Error creating farm:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}
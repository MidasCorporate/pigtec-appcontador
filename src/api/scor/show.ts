import { api } from "@/services/api";

interface ScorFile {
  id: string;
  score_id: string;
  file_url: string;
  record_id: string;
  type: string;
  created_at: string;
  updated_at: string;
}

interface Farm {
  id: string;
  name: string;
  nickname: string;
  status: string;
  producer_id: string;
  config_id: string;
  created_at: string;
  updated_at: string;
}

interface Producer {
  id: string;
  name: string;
  cpf: string;
  email: string;
  internal_code: string;
  created_at: string;
  updated_at: string;
}

export interface Scor {
  id: string;
  quantity: string;
  weight: string;
  start_date: string;
  end_date: string;
  status: boolean;
  type: string;
  nfe: string | null;
  name: string;
  lote: string;
  markings: any[];
  joins: any[];
  files: ScorFile[];
  farm_id_sender: string;
  farmSender: Farm;
  farm_id_received: string | null;
  farmReceived: Farm | null;
  farm_id_internal: string;
  farmInternal: Farm;
  producer_id_sender: string;
  producerSender: Producer;
  producer_id_received: string | null;
  producerReceived: Producer | null;
  producer_id_internal: string;
  producerInternal: Producer;
  file: any | null;
  file_url: string;
  progress: string;
  female: string | null;
  male: string | null;
  gta: string | null;
  joined: boolean;
  config_id: string | null;
  config: any | null;
  created_at: string;
  updated_at: string;
}


export async function showScors(configId?: string) {
  try {
    const params = configId ? { config_id: configId } : undefined;
    const response = await api.get<Scor[]>(`/scores/show?config_id=${configId}`);
    return response.data;
  } catch (error) {
    console.error("Error showing scores:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}